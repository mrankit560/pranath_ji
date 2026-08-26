import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

    // 1. Primary: Upload directly to Supabase Storage 'uploads' bucket
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
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

    // 2. Local disk fallback / local copy (when filesystem is writable in Node environment)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      if (!uploadedUrl) {
        uploadedUrl = `/uploads/${filename}`;
        console.log(`[Upload API] Successfully saved ${filename} to local disk: ${uploadedUrl}`);
      }
    } catch (fsErr) {
      console.warn("[Upload API] Local disk write skipped or failed:", fsErr);
    }

    if (!uploadedUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to persist file to cloud storage or local disk.",
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
