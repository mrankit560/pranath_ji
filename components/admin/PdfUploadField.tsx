"use client";

import React, { useState, useRef } from "react";
import { FileText, Upload, Check, Loader2, Link as LinkIcon, ExternalLink, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface PdfUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  maxSizeMB?: number;
}

export const PdfUploadField: React.FC<PdfUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  maxSizeMB = 50,
}) => {
  const { language } = useI18n();
  const isEn = language === "en";

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setError(
        isEn
          ? "Please select a valid PDF document (.pdf)."
          : "कृपया एक मान्य PDF (.pdf) दस्तावेज़ चुनें।"
      );
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(
        isEn
          ? `PDF file size must be less than ${maxSizeMB}MB.`
          : `PDF फ़ाइल का आकार ${maxSizeMB}MB से कम होना चाहिए।`
      );
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(
      isEn
        ? `Uploading "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`
        : `"${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) अपलोड हो रहा है...`
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.url) {
        onChange(data.url);
        setIsUploading(false);
        setUploadProgress(null);
        return;
      }

      setError(
        data.error ||
          (isEn
            ? "Upload failed. Please check network or paste an external PDF link."
            : "अपलोड विफल रहा। कृपया नेटवर्क जांचें या सीधा वेब लिंक पेस्ट करें।")
      );
      setIsUploading(false);
      setUploadProgress(null);
    } catch (err: any) {
      console.error("PDF upload error:", err);
      setError(
        isEn
          ? `Upload error: ${err?.message || "Connection failed. Please retry."}`
          : `अपलोड त्रुटि: ${err?.message || "कनेक्शन में समस्या हुई। कृपया पुनः प्रयास करें।"}`
      );
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const getCleanDisplayName = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const parts = url.split("/");
        return parts[parts.length - 1] || url;
      } catch {
        return url;
      }
    }
    return url;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gold-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setUseUrlInput(!useUrlInput);
          }}
          className="text-[11px] text-gold-400/80 hover:text-gold-200 underline inline-flex items-center gap-1 transition-colors"
        >
          {useUrlInput ? (
            <>
              <Upload className="w-3 h-3" />
              <span>{isEn ? "Upload PDF from Device" : "डिवाइस से PDF फ़ाइल अपलोड करें"}</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" />
              <span>{isEn ? "Paste External PDF URL" : "वेब PDF लिंक डालें"}</span>
            </>
          )}
        </button>
      </div>

      {useUrlInput ? (
        <div className="space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setError(null);
              onChange(e.target.value);
            }}
            placeholder="https://example.com/books/sample.pdf या /assets/..."
            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory placeholder-spiritual-ivory/40 focus:border-gold-400 focus:outline-none"
          />
          <p className="text-[10px] text-spiritual-ivory/50">
            {isEn
              ? "Paste any direct link to a PDF document or hosted storage asset."
              : "किसी भी ऑनलाइन PDF ग्रन्थ का सीधा लिंक अथवा होस्टेड फ़ाइल का URL डालें।"}
          </p>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {value ? (
            <div className="rounded-2xl border border-gold-500/40 bg-black/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-spiritual-ivory flex items-center gap-1.5 truncate">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{isEn ? "PDF Attached & Ready" : "PDF फ़ाइल संलग्न है"}</span>
                  </div>
                  <p
                    className="text-[11px] text-spiritual-ivory/60 truncate font-mono mt-0.5"
                    title={value}
                  >
                    {getCleanDisplayName(value)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                {value.startsWith("http") && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[11px] font-semibold text-spiritual-ivory hover:bg-white/20 flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{isEn ? "View" : "देखें"}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1 rounded-lg bg-gold-500/20 border border-gold-400/30 text-[11px] font-semibold text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors disabled:opacity-50"
                >
                  {isEn ? "Replace PDF" : "PDF बदलें"}
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-[11px] font-semibold text-red-300 hover:bg-red-600 hover:text-white transition-colors"
                >
                  {isEn ? "Remove" : "हटाएं"}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                if (!isUploading) fileInputRef.current?.click();
              }}
              className="rounded-2xl border-2 border-dashed border-gold-500/30 hover:border-gold-400/70 p-5 text-center cursor-pointer bg-black/40 hover:bg-gold-500/5 transition-all shadow-sm group"
            >
              {isUploading ? (
                <div className="py-2 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-7 h-7 text-gold-400 animate-spin" />
                  <span className="text-xs font-semibold text-gold-300 animate-pulse">
                    {uploadProgress || (isEn ? "Uploading PDF document to cloud..." : "PDF दस्तावेज़ क्लाउड पर अपलोड हो रहा है...")}
                  </span>
                  <span className="text-[10px] text-spiritual-ivory/50">
                    {isEn ? "Please wait a moment..." : "कृपया प्रतीक्षा करें..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-400/30 flex items-center justify-center text-gold-300 group-hover:scale-105 transition-transform shadow-inner">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-gold-300 group-hover:underline">
                      {isEn ? "Upload PDF file from device" : "डिवाइस से PDF फ़ाइल चुनें"}
                    </div>
                    <div className="text-[10px] text-spiritual-ivory/50">
                      {isEn
                        ? `Max ${maxSizeMB}MB • Formatted .pdf document`
                        : `अधिकतम ${maxSizeMB}MB • .pdf दस्तावेज़`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
