"use client";

import { useState, useCallback } from "react";
import type { Tribute } from "@/types/tribute";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function downloadFile(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadAll(tributes: Tribute[]) {
  const withDocs = tributes.filter((t) => t.document);
  withDocs.forEach((t, i) => {
    const ext = t.document!.type === "application/pdf" ? "pdf" : "jpg";
    const name = `tribute-${i + 1}-${t.name.replace(/\s+/g, "_")}.${ext}`;
    setTimeout(() => downloadFile(t.document!.data, name), i * 300);
  });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const login = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/tributes", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setAuthError("Incorrect password.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const data: Tribute[] = await res.json();
      setTributes(data);
      setAuthed(true);
    } catch {
      setFetchError("Failed to load tributes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [password]);

  const clearAll = useCallback(async () => {
    if (!window.confirm("Delete ALL tributes permanently? This cannot be undone.")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/admin/tributes", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) setTributes([]);
    } finally {
      setClearing(false);
    }
  }, [password]);

  const withDocs = tributes.filter((t) => t.document);

  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
          <h1 className="text-white font-bold text-2xl mb-1">Admin Access</h1>
          <p className="text-neutral-500 text-sm mb-7">Enter your admin password to view and download submitted attachments.</p>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all"
              autoFocus
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            {fetchError && <p className="text-red-400 text-sm">{fetchError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Checking…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={() => setPreview(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-800 text-white text-xl flex items-center justify-center">×</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-white font-bold text-2xl">Admin — Tribute Downloads</h1>
            <p className="text-neutral-500 text-sm mt-1">
              {tributes.length} total tributes · {withDocs.length} with attachments
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {withDocs.length > 0 && (
              <button
                onClick={() => downloadAll(tributes)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                Download All ({withDocs.length})
              </button>
            )}
            {tributes.length > 0 && (
              <button
                onClick={clearAll}
                disabled={clearing}
                className="bg-red-900/60 hover:bg-red-800 border border-red-700/50 text-red-300 font-medium px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {clearing ? "Clearing…" : "Clear All Tributes"}
              </button>
            )}
            <button
              onClick={() => { setAuthed(false); setPassword(""); setTributes([]); }}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-4">
          {tributes.map((t, i) => (
            <div key={t.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-start gap-5">
              {/* Number */}
              <div className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-semibold">{t.name}</span>
                  <span className="text-yellow-500 text-xs bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">{t.role}</span>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed mb-2 line-clamp-3">{t.message}</p>
                <p className="text-neutral-600 text-xs">{formatDate(t.createdAt)}</p>
              </div>

              {/* Attachment */}
              {t.document ? (
                <div className="flex-shrink-0 flex flex-col items-center gap-2 w-full md:w-40">
                  {t.document.type.startsWith("image/") ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.document.data}
                        alt="Attachment preview"
                        className="w-full md:w-40 h-28 object-cover rounded-xl border border-neutral-700 cursor-pointer hover:border-yellow-500/50 transition-colors"
                        onClick={() => setPreview(t.document!.data)}
                      />
                      <button
                        onClick={() => {
                          const ext = "jpg";
                          downloadFile(t.document!.data, `tribute-${t.name.replace(/\s+/g, "_")}.${ext}`);
                        }}
                        className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold text-xs px-3 py-2 rounded-lg transition-all"
                      >
                        Download Image
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-full md:w-40 h-28 bg-neutral-800 rounded-xl border border-neutral-700 flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-neutral-500 text-xs text-center px-2 truncate w-full text-center">{t.document.name}</span>
                      </div>
                      <button
                        onClick={() => downloadFile(t.document!.data, t.document!.name)}
                        className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold text-xs px-3 py-2 rounded-lg transition-all"
                      >
                        Download PDF
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex-shrink-0 w-full md:w-40 h-28 bg-neutral-800/50 rounded-xl border border-neutral-800 flex items-center justify-center">
                  <span className="text-neutral-700 text-xs">No attachment</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {tributes.length === 0 && (
          <div className="text-center py-20 text-neutral-600">No tributes yet.</div>
        )}
      </div>
    </div>
  );
}
