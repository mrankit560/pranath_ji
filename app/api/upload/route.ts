import { NextRequest, NextResponse } from "next/server";
import { getCloudflareR2 } from "@/lib/cloudflare/bindings";
import path from "path";
import { SUPABASE_URL } from "@/lib/supabase/client";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Max 50MB check
    if (file.size > 52428800) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    // Clean file name
    const timestamp = Date.now();
    const originalName = file.name || "file";
    const extension = path.extname(originalName) || (file.type.includes("pdf") ? ".pdf" : "");
    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    const filename = `${timestamp}-${baseName}${extension}`;

    let uploadedUrl = "";
    let r2ErrorDetails = "";

    // 1. Primary for Cloudflare: Cloudflare R2 Bucket
    const r2 = getCloudflareR2();
    if (r2) {
      try {
        await r2.put(filename, bytes, {
          httpMetadata: {
            contentType: file.type || (filename.endsWith(".pdf") ? "application/pdf" : "application/octet-stream"),
          },
        });
        uploadedUrl = `/api/uploads/${filename}`;
        console.log(`[Upload API] Successfully saved ${filename} to Cloudflare R2: ${uploadedUrl}`);
      } catch (r2Err: any) {
        r2ErrorDetails = r2Err?.message || String(r2Err);
        console.warn("[Upload API] Cloudflare R2 upload error:", r2Err);
      }
    }

    // 2. Primary: Upload directly to Supabase Storage 'uploads' bucket
    if (!uploadedUrl && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const uploadEndpoint = `${SUPABASE_URL}/storage/v1/object/uploads/${filename}`;
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": file.type || "application/octet-stream",
            "x-upsert": "true",
          },
          body: buffer,
        });

        if (res.ok) {
          uploadedUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${filename}`;
          console.log(`[Upload API] Successfully uploaded ${filename} to Supabase Storage: ${uploadedUrl}`);
        } else {
          const errText = await res.text();
          console.warn(`[Upload API] Supabase storage upload returned ${res.status}:`, errText);
        }
      } catch (storageErr) {
        console.warn("[Upload API] Supabase storage fetch failed:", storageErr);
      }
    }

    // 3. Local disk fallback / local copy (when filesystem is writable in Node environment)
    if (!uploadedUrl && typeof window === "undefined") {
      try {
        const nodeRequire = eval("require");
        const fs = nodeRequire("fs");
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        uploadedUrl = `/uploads/${filename}`;
        console.log(`[Upload API] Successfully saved ${filename} to local disk: ${uploadedUrl}`);
      } catch (fsErr) {
        console.warn("[Upload API] Local disk write skipped or failed:", fsErr);
      }
    }

    if (!uploadedUrl) {
      return NextResponse.json(
        {
          success: false,
          error: r2ErrorDetails
            ? `R2 upload failed: ${r2ErrorDetails}`
            : "Failed to persist file to cloud storage. Please verify PARAMDHAM_R2 binding in Cloudflare.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
      filename: filename,
      originalName: originalName,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("[Upload API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
