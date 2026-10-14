"use client";

import { useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  kind: "products" | "categories";
  label?: string;
  accept?: string;
  hint?: string;
  maxSizeMB?: number;
  square?: boolean; // for category icons
};

export function ImageUploader({
  value,
  onChange,
  kind,
  label = "Image",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  hint = "JPG, PNG, WEBP, GIF · max 5MB",
  maxSizeMB = 5,
  square = false,
}: Props) {
  const { authFetch } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setError("");

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB}MB`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    const res = await authFetch(`/api/admin/upload?kind=${kind}`, {
      method: "POST",
      body: fd,
      // Don't set Content-Type — browser sets multipart boundary automatically
      headers: {},
    });

    const data = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(data.message || "Upload failed");
      return;
    }

    onChange(data.url);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    onChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>

      <div className="mt-2">
        {value ? (
          /* ── Preview state ── */
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-3">
            <div
              className={`overflow-hidden rounded-xl bg-white/5 ${
                square ? "h-16 w-16" : "h-16 w-24"
              }`}
            >
              <img
                src={value}
                alt="Uploaded"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  setError("Preview failed — URL may be invalid");
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-green-400">
                ✅ Image uploaded
              </div>
              <div className="truncate text-xs text-gray-500">{value}</div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20"
              title="Remove"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20 disabled:opacity-50"
            >
              Change
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              onChange={onPick}
              className="hidden"
            />
          </div>
        ) : (
          /* ── Empty / dropzone state ── */
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${
              dragOver
                ? "border-orange-500 bg-orange-500/10"
                : "border-white/15 bg-black/40 hover:border-orange-500/50 hover:bg-orange-500/5"
            } ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            {uploading ? (
              <>
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
                <span className="text-sm font-bold">Uploading…</span>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl transition group-hover:scale-110">
                  📤
                </div>
                <div className="text-sm font-bold">Click to upload</div>
                <div className="text-xs text-gray-500">or drag & drop</div>
                <div className="mt-1 text-xs text-gray-600">{hint}</div>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              onChange={onPick}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}

        {error && (
          <div className="mt-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}