"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Code,
  Maximize2,
  Minimize2,
  Eraser,
  Upload,
  ExternalLink,
  X,
  Palette,
  Highlighter,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your spiritual article here...",
  minHeight = "360px",
}) => {
  const { language } = useI18n();
  const isEn = language === "en";

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Link dialog state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);

  // Image dialog state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Saved range for modal insertions
  const savedSelection = useRef<Range | null>(null);

  // Sync external value with editor content
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    setSourceCode(value || "");
  }, [value, isSourceMode]);

  // Execute standard formatting commands
  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleContentChange();
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection.current);
      }
    }
  };

  // Open Link Dialog
  const openLinkDialog = () => {
    saveSelection();
    const sel = window.getSelection();
    const selected = sel ? sel.toString() : "";
    setLinkText(selected);
    setLinkUrl("");
    setShowLinkModal(true);
  };

  // Insert Link
  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;

    restoreSelection();
    editorRef.current?.focus();

    const url = linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
      ? linkUrl
      : `https://${linkUrl}`;

    const anchorHtml = `<a href="${url}" ${
      linkOpenNewTab ? 'target="_blank" rel="noopener noreferrer"' : ""
    } class="text-gold-700 underline font-semibold hover:text-gold-900">${
      linkText || url
    }</a>`;

    document.execCommand("insertHTML", false, anchorHtml);
    handleContentChange();
    setShowLinkModal(false);
  };

  // Open Image Dialog
  const openImageDialog = () => {
    saveSelection();
    setImageUrl("");
    setImageCaption("");
    setUploadError(null);
    setShowImageModal(true);
  };

  // Upload image to Cloudflare R2 through /api/upload
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError(isEn ? "Please select a valid image file." : "कृपया एक मान्य फोटो चुनें।");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(isEn ? "File size must be under 10MB." : "फ़ाइल का आकार 10MB से कम होना चाहिए।");
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        setUploadError(data.error || (isEn ? "Upload failed. Please try again." : "अपलोड विफल रहा। पुनः प्रयास करें।"));
      }
    } catch (err: any) {
      setUploadError(isEn ? "Network error while uploading." : "फोटो अपलोड में नेटवर्क त्रुटि।");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Insert Image into Editor Content
  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    restoreSelection();
    editorRef.current?.focus();

    const figureHtml = `
      <figure class="my-6 text-center">
        <img src="${imageUrl}" alt="${imageCaption || "Article image"}" class="rounded-2xl max-w-full mx-auto shadow-lg border border-gold-400/30 object-cover max-h-[480px]" />
        ${imageCaption ? `<figcaption class="text-xs text-ink/60 mt-2 italic font-spiritual-heading">${imageCaption}</figcaption>` : ""}
      </figure>
      <p><br></p>
    `;

    document.execCommand("insertHTML", false, figureHtml);
    handleContentChange();
    setShowImageModal(false);
  };

  // Handle Source Code Change
  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSourceCode(val);
    onChange(val);
  };

  const toggleSourceMode = () => {
    if (isSourceMode) {
      // Switching from code to visual editor
      setIsSourceMode(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = sourceCode;
          editorRef.current.focus();
        }
      }, 50);
    } else {
      // Switching from visual to code editor
      setIsSourceMode(true);
    }
  };

  // Colors Palette
  const textColors = [
    { label: "Default", color: "inherit" },
    { label: "Gold", color: "#A8801A" },
    { label: "Deep Maroon", color: "#6A141A" },
    { label: "Amber", color: "#D97706" },
    { label: "Emerald", color: "#059669" },
    { label: "Charcoal", color: "#2B2824" },
  ];

  const highlightColors = [
    { label: "None", color: "transparent" },
    { label: "Soft Gold", color: "#FEF3C7" },
    { label: "Soft Rose", color: "#FFE4E6" },
    { label: "Soft Mint", color: "#D1FAE5" },
    { label: "Soft Cream", color: "#FDF8ED" },
  ];

  return (
    <div
      className={`rounded-2xl border border-gold-400/40 bg-surface shadow-md overflow-hidden transition-all ${
        isFullscreen ? "fixed inset-4 z-50 flex flex-col shadow-2xl bg-surface" : "relative"
      }`}
    >
      {/* Google Docs / Wordpad Style Command Toolbar */}
      <div className="bg-surface-2/95 border-b border-line p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sm:gap-1.5 backdrop-blur-md">
        {/* Undo / Redo */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand("undo")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("redo")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Headings Selector */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === "p") {
                executeCommand("formatBlock", "<p>");
              } else {
                executeCommand("formatBlock", `<${val}>`);
              }
            }}
            defaultValue="p"
            className="h-8 px-2 rounded-lg bg-field border border-line text-xs font-semibold text-ink focus:outline-none focus:border-gold-400"
            title="Paragraph / Headings"
          >
            <option value="p">{isEn ? "Paragraph" : "सामान्य पाठ्य"}</option>
            <option value="h1">{isEn ? "Heading 1 (Main)" : "शीर्षक १ (बड़ा)"}</option>
            <option value="h2">{isEn ? "Heading 2 (Section)" : "शीर्षक २ (मध्यम)"}</option>
            <option value="h3">{isEn ? "Heading 3 (Sub)" : "शीर्षक ३ (छोटा)"}</option>
          </select>
        </div>

        {/* Font Formatting */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors italic"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors underline"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Text Color Dropdown */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5 relative group">
          <button
            type="button"
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors flex items-center gap-1"
            title="Text Color"
          >
            <Palette className="w-4 h-4 text-gold-700" />
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex flex-col bg-surface border border-line rounded-xl shadow-xl p-1.5 z-30 min-w-[130px]">
            <span className="text-[10px] font-bold text-ink/60 px-2 py-0.5 uppercase">Text Color</span>
            {textColors.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => executeCommand("foreColor", c.color)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs hover:bg-gold-500/15 text-left"
              >
                <span className="w-3.5 h-3.5 rounded-full border border-line" style={{ backgroundColor: c.color }} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Highlight Dropdown */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5 relative group">
          <button
            type="button"
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors flex items-center gap-1"
            title="Highlight Background Color"
          >
            <Highlighter className="w-4 h-4 text-amber-600" />
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex flex-col bg-surface border border-line rounded-xl shadow-xl p-1.5 z-30 min-w-[130px]">
            <span className="text-[10px] font-bold text-ink/60 px-2 py-0.5 uppercase">Highlight</span>
            {highlightColors.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => executeCommand("hiliteColor", c.color)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs hover:bg-gold-500/15 text-left"
              >
                <span className="w-3.5 h-3.5 rounded border border-line" style={{ backgroundColor: c.color }} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyFull")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quote */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              executeCommand("formatBlock", "<blockquote>");
            }}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Spiritual Quote / Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertHorizontalRule")}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Insert Link & Insert Image */}
        <div className="flex items-center border-r border-line pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={openLinkDialog}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors flex items-center gap-1"
            title="Insert Hyperlink"
          >
            <LinkIcon className="w-4 h-4 text-gold-700" />
            <span className="text-[11px] font-semibold hidden sm:inline">{isEn ? "Link" : "लिंक"}</span>
          </button>
          <button
            type="button"
            onClick={openImageDialog}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors flex items-center gap-1"
            title="Insert Image (Upload or URL)"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-semibold hidden sm:inline">{isEn ? "Photo" : "फोटो"}</span>
          </button>
        </div>

        {/* Clear Format */}
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
          title="Clear Formatting"
        >
          <Eraser className="w-4 h-4" />
        </button>

        {/* Mode & View Toggles (Right Aligned) */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={toggleSourceMode}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isSourceMode
                ? "bg-gold-gradient text-on-gold shadow-sm"
                : "text-ink/75 hover:bg-gold-500/15 hover:text-gold-800"
            }`}
            title="Toggle HTML Source Code View"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{isSourceMode ? "Visual" : "HTML"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 hover:text-gold-800 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Writing Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isSourceMode ? (
        <textarea
          value={sourceCode}
          onChange={handleSourceChange}
          placeholder="Enter raw HTML code here..."
          className="w-full p-4 font-mono text-xs bg-surface-sunk text-ink focus:outline-none resize-y border-none"
          style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : minHeight }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onBlur={handleContentChange}
          className="p-5 sm:p-6 text-sm sm:text-base text-ink focus:outline-none overflow-y-auto font-devanagari prose prose-headings:font-spiritual-heading prose-headings:text-kumkum-dk prose-p:leading-relaxed prose-a:text-gold-700 prose-blockquote:border-l-4 prose-blockquote:border-gold-400 prose-blockquote:bg-gold-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl max-w-none"
          style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : minHeight }}
          data-placeholder={placeholder}
        />
      )}

      {/* Hyperlink Dialog Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleInsertLink}
            className="w-full max-w-md bg-surface border-2 border-gold-400/50 rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <h4 className="text-sm font-bold text-gold-700 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4" />
                <span>{isEn ? "Insert / Edit Hyperlink" : "हाइपरलिंक जोड़ें"}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 rounded-lg hover:bg-gold-500/15 text-ink/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">
                  {isEn ? "Link URL (Web Address) *" : "वेबसाइट लिंक (URL) *"}
                </label>
                <input
                  type="text"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">
                  {isEn ? "Display Text" : "दिखाने योग्य टेक्स्ट"}
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder={isEn ? "Click here to read more" : "अधिक जानकारी के लिए यहाँ क्लिक करें"}
                  className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-ink/80 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkOpenNewTab}
                  onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                  className="rounded text-gold-600 focus:ring-gold-500"
                />
                <span>{isEn ? "Open link in a new browser tab" : "लिंक को नए टैब में खोलें"}</span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl bg-card border border-line text-xs text-ink/70"
              >
                {isEn ? "Cancel" : "रद्द करें"}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm"
              >
                {isEn ? "Insert Link" : "लिंक जोड़ें"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Dialog Modal (Cloudflare R2 Upload or URL) */}
      {showImageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleInsertImage}
            className="w-full max-w-lg bg-surface border-2 border-gold-400/50 rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <h4 className="text-sm font-bold text-gold-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? "Insert Article Image" : "ब्लॉग में फोटो जोड़ें"}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded-lg hover:bg-gold-500/15 text-ink/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-400 text-xs text-red-700">
                {uploadError}
              </div>
            )}

            <div className="space-y-3">
              {/* Upload to Cloudflare R2 Button */}
              <div className="p-4 rounded-xl border border-dashed border-gold-400/60 bg-surface-2 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform flex items-center gap-1.5 mx-auto disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {isUploadingImage
                      ? isEn
                        ? "Uploading to Cloud..."
                        : "क्लाउड पर अपलोड हो रहा है..."
                      : isEn
                      ? "Choose Photo from Computer"
                      : "कंप्यूटर से फोटो चुनें"}
                  </span>
                </button>
                <p className="text-[11px] text-ink/60 mt-2">
                  {isEn
                    ? "Uploads directly to Cloudflare R2 storage (JPG, PNG, WebP)"
                    : "फोटो सीधे क्लाउड स्टोरेज (Cloudflare R2) में सुरक्षित होगी"}
                </p>
              </div>

              {/* Or Paste URL */}
              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">
                  {isEn ? "Or Paste Image URL" : "अथवा फोटो का सीधा वेब लिंक डालें"}
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none"
                />
              </div>

              {/* Preview if image URL exists */}
              {imageUrl && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-line bg-surface-sunk">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">
                  {isEn ? "Photo Caption (Optional)" : "फोटो विवरण / कैप्शन (वैकल्पिक)"}
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder={isEn ? "e.g. Mahamati Shri Prannath Ji temple darshan" : "उदा. साढौली धाम साधन कुटीर दर्शन"}
                  className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl bg-card border border-line text-xs text-ink/70"
              >
                {isEn ? "Cancel" : "रद्द करें"}
              </button>
              <button
                type="submit"
                disabled={!imageUrl || isUploadingImage}
                className="px-5 py-2 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm disabled:opacity-50"
              >
                {isEn ? "Insert Photo" : "फोटो जोड़ें"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
