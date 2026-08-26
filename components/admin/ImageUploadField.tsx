"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Check, Loader2, Info, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  recommendedSize?: string; // e.g. "600 × 900 px"
  aspectRatio?: string; // e.g. "2:3 (पोर्ट्रेट बुक कवर)" or "16:9 (लैंडस्केप बैनर)"
  maxSizeMB?: number;
  helperText?: string;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  recommendedSize = "1200 × 630 px",
  aspectRatio = "16:9 (Landscape)",
  maxSizeMB = 10,
  helperText,
  required = false,
}) => {
  const { language } = useI18n();
  const isEn = language === "en";

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError(
        isEn
          ? "Please select a valid image file (JPG, PNG, WebP, GIF)."
          : "कृपया एक मान्य छवि फ़ाइल (JPG, PNG, WebP, GIF) चुनें।"
      );
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(
        isEn
          ? `File size must be less than ${maxSizeMB}MB.`
          : `फ़ाइल का आकार ${maxSizeMB}MB से कम होना चाहिए।`
      );
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

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.url) {
        onChange(data.url);
        setIsUploading(false);
        return;
      }

      setError(
        data.error ||
          (isEn
            ? "Upload failed. Please check network or paste an image URL."
            : "फोटो अपलोड विफल रहा। कृपया पुनः प्रयास करें अथवा वेब लिंक डालें।")
      );
      setIsUploading(false);
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(
        isEn
          ? `Upload error: ${err?.message || "Connection failed"}`
          : `फोटो अपलोड में त्रुटि: ${err?.message || "कनेक्शन में समस्या हुई"}`
      );
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
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
              <span>{isEn ? "Upload from Device" : "डिवाइस से फोटो अपलोड करें"}</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" />
              <span>{isEn ? "Paste Image URL" : "वेब लिंक (URL) डालें"}</span>
            </>
          )}
        </button>
      </div>

      {/* Recommended Size Badge */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] bg-black/40 border border-gold-500/20 px-3 py-1.5 rounded-xl text-spiritual-ivory/70">
        <Info className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
        <span>
          <strong className="text-gold-300">{isEn ? "Recommended Size:" : "अनुशंसित आकार:"}</strong>{" "}
          {recommendedSize} ({aspectRatio}) • {isEn ? `Max ${maxSizeMB}MB` : `अधिकतम ${maxSizeMB}MB`}
        </span>
      </div>

      {/* Main Upload Box or URL Input */}
      {useUrlInput ? (
        <div className="space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setError(null);
              onChange(e.target.value);
            }}
            placeholder="https://example.com/photo.jpg या /assets/..."
            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory placeholder-spiritual-ivory/40 focus:border-gold-400 focus:outline-none"
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {value ? (
            /* Image Preview Card */
            <div className="relative rounded-2xl overflow-hidden border border-gold-500/40 bg-black/70 p-3 flex items-center gap-4 shadow-inner">
              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-black/90 border border-gold-500/30 flex-shrink-0">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-spiritual-ivory truncate flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{isEn ? "Photo Selected & Ready" : "फोटो सफलतापूर्वक चुनी गई"}</span>
                </div>
                <p className="text-[11px] text-spiritual-ivory/60 truncate mt-0.5" title={value}>
                  {value}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1 rounded-lg bg-gold-500/20 border border-gold-400/30 text-[11px] font-semibold text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors disabled:opacity-50"
                  >
                    {isEn ? "Change Photo" : "फोटो बदलें"}
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
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => {
                if (!isUploading) fileInputRef.current?.click();
              }}
              className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-gold-400 bg-gold-500/15 scale-[0.99]"
                  : "border-gold-500/30 hover:border-gold-400/70 bg-black/40 hover:bg-gold-500/5"
              }`}
            >
              {isUploading ? (
                <div className="py-4 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                  <span className="text-xs font-semibold text-gold-300 animate-pulse">
                    {isEn ? "Uploading image to cloud..." : "फोटो अपलोड हो रही है..."}
                  </span>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gold-500/15 border border-gold-400/30 flex items-center justify-center text-gold-300 shadow-inner">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gold-300 hover:underline">
                      {isEn ? "Click to upload from device" : "डिवाइस (मोबाइल/कंप्यूटर) से फोटो चुनें"}
                    </span>
                    <span className="text-xs text-spiritual-ivory/60"> {isEn ? "or drag and drop" : "या यहाँ खींचकर लाएं"}</span>
                  </div>
                  <p className="text-[11px] text-spiritual-ivory/50">
                    PNG, JPG, WebP, GIF, SVG (Max {maxSizeMB}MB)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-[11px] text-spiritual-ivory/50">{helperText}</p>
      )}
    </div>
  );
};
