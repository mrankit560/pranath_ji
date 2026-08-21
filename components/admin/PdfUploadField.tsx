"use client";

import React, { useState, useRef } from "react";
import { FileText, Upload, Check, Loader2, Link as LinkIcon, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface PdfUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export const PdfUploadField: React.FC<PdfUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
}) => {
  const { language } = useI18n();
  const isEn = language === "en";

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setError(isEn ? "Please select a valid PDF document." : "कृपया एक मान्य PDF दस्तावेज़ चुनें।");
      return;
    }

    // Max 100MB for PDFs
    if (file.size > 100 * 1024 * 1024) {
      setError(isEn ? "PDF file size must be less than 100MB." : "PDF फ़ाइल का आकार 100MB से कम होना चाहिए।");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          onChange(data.url);
          setIsUploading(false);
          return;
        }
      }

      // Fallback Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError(isEn ? "Failed to read PDF file." : "PDF फ़ाइल पढ़ने में त्रुटि हुई।");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error("PDF upload error:", err);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gold-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setUseUrlInput(!useUrlInput)}
          className="text-[11px] text-gold-400/80 hover:text-gold-200 underline inline-flex items-center gap-1"
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
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/books/sample.pdf"
          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory placeholder-spiritual-ivory/40 focus:border-gold-400 focus:outline-none"
        />
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {value ? (
            <div className="rounded-2xl border border-gold-500/40 bg-black/70 p-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-spiritual-ivory flex items-center gap-1.5 truncate">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{isEn ? "PDF Attached" : "PDF फ़ाइल संलग्न है"}</span>
                  </div>
                  <p className="text-[11px] text-spiritual-ivory/60 truncate font-mono mt-0.5" title={value}>
                    {value.startsWith("data:") ? (isEn ? "Uploaded from your device" : "डिवाइस से अपलोड की गई") : value}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1 rounded-lg bg-gold-500/20 border border-gold-400/30 text-[11px] font-semibold text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark"
                >
                  {isEn ? "Replace PDF" : "PDF बदलें"}
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-[11px] font-semibold text-red-300 hover:bg-red-600 hover:text-white"
                >
                  {isEn ? "Remove" : "हटाएं"}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-gold-500/30 hover:border-gold-400/70 p-5 text-center cursor-pointer bg-black/40 hover:bg-gold-500/5 transition-all"
            >
              {isUploading ? (
                <div className="py-2 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
                  <span className="text-xs font-semibold text-gold-300">
                    {isEn ? "Uploading PDF document..." : "PDF दस्तावेज़ अपलोड हो रहा है..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-400/30 flex items-center justify-center text-gold-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-gold-300 hover:underline">
                      {isEn ? "Upload PDF file from device" : "डिवाइस से PDF फ़ाइल चुनें"}
                    </div>
                    <div className="text-[10px] text-spiritual-ivory/50">
                      {isEn ? "Max 100MB • Formatted .pdf document" : "अधिकतम 100MB • .pdf दस्तावेज़"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
    </div>
  );
};
