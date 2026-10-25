import { NextRequest, NextResponse } from "next/server";
import { getCloudflareR2 } from "@/lib/cloudflare/bindings";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  if (!filename || filename.includes("..")) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  // 1. Try Cloudflare R2 bucket first
  const r2 = getCloudflareR2();
  if (r2) {
    try {
      const object = await r2.get(filename);
      if (object) {
        const headers = new Headers();
        headers.set(
          "Content-Type",
          object.httpMetadata?.contentType ||
            (filename.endsWith(".pdf")
              ? "application/pdf"
              : filename.endsWith(".png")
              ? "image/png"
              : filename.endsWith(".webp")
              ? "image/webp"
              : "image/jpeg")
        );
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        return new NextResponse(object.body, { headers });
      }
    } catch (err) {
      console.warn("[Uploads R2 Stream Error]:", err);
    }
  }

  // 2. Fallback to local filesystem when running in Node.js runtime (localhost)
  if (typeof window === "undefined") {
    try {
      const nodeRequire = eval("require");
      const fs = nodeRequire("fs");
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const contentType = filename.endsWith(".pdf")
          ? "application/pdf"
          : filename.endsWith(".png")
          ? "image/png"
          : filename.endsWith(".webp")
          ? "image/webp"
          : "image/jpeg";

        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {}
  }

  return new NextResponse("File Not Found", { status: 404 });
}
