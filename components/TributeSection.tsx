"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Tribute } from "@/types/tribute";


const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

interface DocState {
  data: string;   // base64 data URL to send / display
  type: string;
  name: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Resize image to max 1200px on longest side, return JPEG data URL */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => resolve(ev.target!.result as string);
    reader.readAsDataURL(file);
  });
}

async function processFile(file: File): Promise<{ doc: DocState; error?: string }> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { doc: { data: "", type: "", name: "" }, error: "Only JPG, PNG, WebP, or PDF files are accepted." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { doc: { data: "", type: "", name: "" }, error: "File is too large. Maximum size is 2 MB." };
  }
  try {
    const data = file.type.startsWith("image/")
      ? await resizeImage(file)
      : await readAsDataURL(file);
    return { doc: { data, type: file.type.startsWith("image/") ? "image/jpeg" : file.type, name: file.name } };
  } catch {
    return { doc: { data: "", type: "", name: "" }, error: "Failed to process file. Please try again." };
  }
}

function PDFIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
  );
}

function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xl transition-colors z-10"
        aria-label="Close"
      >
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Attached document"
        className="max-w-full max-h-[90vh] object-contain rounded-xl select-none"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "none" }}
      />
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-500 text-xs select-none">
        Press Esc or click outside to close
      </p>
    </div>
  );
}

function TributeCard({ tribute, index }: { tribute: Tribute; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const initial = tribute.name.charAt(0).toUpperCase();
  const isLong = tribute.message.length > 220;
  const delay = `${(index % 6) * 80}ms`;

  return (
    <>
      {lightboxOpen && tribute.document?.type.startsWith("image/") && (
        <ImageLightbox src={tribute.document.data} onClose={() => setLightboxOpen(false)} />
      )}
      <div
        className="bg-neutral-900 rounded-2xl overflow-hidden border-t-2 border-gold flex flex-col hover:border-gold-bright transition-colors duration-300"
        style={{ animationDelay: delay }}
      >
        <div className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-base">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white truncate">{tribute.name}</p>
              <span className="inline-block bg-neutral-800 text-gold border border-gold/25 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-0.5">
                {tribute.role}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-gold/25 text-3xl font-serif leading-none mb-1 select-none">&ldquo;</p>
            <p
              className={`text-neutral-300 leading-relaxed text-sm ${
                !expanded && isLong ? "line-clamp-4" : ""
              }`}
            >
              {tribute.message}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-2 text-gold hover:text-gold-bright text-sm font-medium transition-colors"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Attached document */}
          {tribute.document && (
            <div className="mt-4 pt-4 border-t border-neutral-800">
              {tribute.document.type.startsWith("image/") ? (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="block w-full group text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tribute.document.data}
                    alt="Attached scanned document"
                    className="w-full max-h-52 object-contain rounded-lg bg-neutral-950 border border-neutral-800 select-none pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <p className="text-gold text-xs mt-1.5 font-medium group-hover:text-gold-bright transition-colors">
                    Click to view full size
                  </p>
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-3">
                  <PDFIcon className="w-6 h-6 text-gold flex-shrink-0" />
                  <span className="text-neutral-300 text-sm truncate flex-1">
                    {tribute.document.name}
                  </span>
                  <span className="text-neutral-500 text-xs flex-shrink-0">PDF attached</span>
                </div>
              )}
            </div>
          )}

          {/* Date */}
          <div className="mt-5 pt-4 border-t border-neutral-800 text-xs text-neutral-600">
            {formatDate(tribute.createdAt)}
          </div>
        </div>
      </div>
    </>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function TributeSection() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [docFile, setDocFile] = useState<DocState | null>(null);
  const [docError, setDocError] = useState<string>("");
  const [docProcessing, setDocProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTributes = useCallback(async () => {
    try {
      const res = await fetch("/api/tributes");
      if (res.ok) setTributes(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTributes();
  }, [fetchTributes]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters.";
    return errs;
  };

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: undefined }));
    };

  const handleFileSelect = async (file: File | null | undefined) => {
    if (!file) return;
    setDocError("");
    setDocProcessing(true);
    const { doc, error } = await processFile(file);
    setDocProcessing(false);
    if (error) {
      setDocError(error);
      setDocFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setDocFile(doc);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const clearDoc = () => {
    setDocFile(null);
    setDocError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        ...(docFile && { document: docFile }),
      };
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", role: "", message: "" });
        setErrors({});
        clearDoc();
        await fetchTributes();
        setTimeout(() => setSubmitted(false), 6000);
      }
    } catch {
      /* silent */
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all";

  return (
    <section id="tributes" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">
            Testimonies &amp; Tributes
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Wall of Tributes
          </h2>
          <div className="w-24 h-0.5 bg-gold mx-auto mt-5 rounded-full" />
          <p className="text-neutral-400 mt-5 max-w-xl mx-auto text-sm leading-relaxed">
            Share your tribute, testimony, and words of remembrance for
            Pastor Mrs Blessing .V. Olori. Your words are a gift that will endure.
          </p>
        </div>

        {/* Form card */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="bg-neutral-900 rounded-3xl p-8 md:p-10 border border-neutral-800">
            <h3 className="font-display text-2xl font-bold text-white mb-7">
              Share Your Tribute
            </h3>

            {submitted && (
              <div className="mb-6 bg-gold/10 border border-gold/30 rounded-xl p-4 flex items-start gap-3 text-gold">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Thank you! Your tribute has been submitted and now appears on
                  the wall below.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-1.5">
                  Your Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Enter your full name"
                  maxLength={120}
                  className={`${inputCls} ${
                    errors.name ? "border-red-500" : "border-neutral-700"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-1.5">
                  Your Role / Relationship
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={handleChange("role")}
                  placeholder="e.g. Pastor, Church Member, Elder, Friend..."
                  maxLength={60}
                  className={`${inputCls} border-neutral-700`}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-1.5">
                  Your Tribute / Message <span className="text-gold">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="Share your tribute, a memory, or words of remembrance for Pastor Mrs Blessing .V. Olori..."
                  rows={5}
                  maxLength={1000}
                  className={`${inputCls} resize-none ${
                    errors.message ? "border-red-500" : "border-neutral-700"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message ? (
                    <p className="text-sm text-red-400">{errors.message}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-neutral-600 ml-auto">
                    {form.message.length}/1000
                  </span>
                </div>
              </div>

              {/* Document upload */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-1.5">
                  Attach Scanned Document{" "}
                  <span className="text-neutral-500 font-normal text-xs">
                    (optional — JPG, PNG, PDF, max 2 MB)
                  </span>
                </label>

                {!docFile ? (
                  <label
                    className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-neutral-700 rounded-xl cursor-pointer hover:border-gold/40 hover:bg-neutral-800/40 transition-all group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {docProcessing ? (
                      <SpinnerIcon className="animate-spin h-6 w-6 text-gold" />
                    ) : (
                      <>
                        <UploadIcon className="w-8 h-8 text-neutral-600 group-hover:text-gold/50 mb-2 transition-colors" />
                        <p className="text-neutral-500 text-sm group-hover:text-neutral-400 transition-colors">
                          Click to upload or drag &amp; drop
                        </p>
                        <p className="text-neutral-600 text-xs mt-0.5">
                          JPG, PNG, WebP, PDF
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </label>
                ) : docFile.type.startsWith("image/") ? (
                  <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={docFile.data}
                      alt="Document preview"
                      className="w-full max-h-52 object-contain"
                    />
                    <button
                      type="button"
                      onClick={clearDoc}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-red-900/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg leading-none transition-colors"
                      aria-label="Remove document"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3">
                    <PDFIcon className="w-8 h-8 text-gold flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{docFile.name}</p>
                      <p className="text-neutral-500 text-xs">PDF document</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearDoc}
                      className="text-neutral-500 hover:text-red-400 text-sm transition-colors flex-shrink-0 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {docError && (
                  <p className="mt-1.5 text-sm text-red-400">{docError}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || docProcessing}
                className="w-full bg-gold hover:bg-gold-bright text-black font-bold py-4 rounded-xl transition-all text-base hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon className="animate-spin h-5 w-5 text-black" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Tribute"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Tributes grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3 text-gold">
              <SpinnerIcon className="animate-spin h-6 w-6" />
              <span className="font-medium">Loading tributes...</span>
            </div>
          </div>
        ) : tributes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-500 mb-2">
              No tributes yet
            </h3>
            <p className="text-neutral-600 text-sm">
              Be the first to share a tribute above!
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-gold text-sm font-semibold mb-10 tracking-wide">
              {tributes.length}{" "}
              {tributes.length === 1 ? "Tribute" : "Tributes"} Shared
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tributes.map((tribute, i) => (
                <TributeCard key={tribute.id} tribute={tribute} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
