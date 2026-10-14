"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "new" | "read" | "replied" | "archived";
    created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
    new: "bg-orange-500/20 text-orange-300",
    read: "bg-blue-500/20 text-blue-300",
    replied: "bg-green-500/20 text-green-300",
    archived: "bg-gray-500/20 text-gray-400",
};

export default function AdminContactPage() {
    const { authFetch } = useAuth();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<ContactMessage | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams();
            if (filter !== "all") q.set("status", filter);
            if (search) q.set("search", search);

            const res = await authFetch(`/api/admin/contact?${q.toString()}`);
            const data = await res.json();
            setMessages(data.messages || []);
            setUnread(data.unread || 0);
        } catch {
            /* silent */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const updateStatus = async (id: number, status: string) => {
        const res = await authFetch(`/api/admin/contact/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
        if (res.ok) load();
    };

    const deleteMessage = async (id: number) => {
        if (!confirm("Delete this message?")) return;
        const res = await authFetch(`/api/admin/contact/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            if (selected?.id === id) setSelected(null);
            load();
        }
    };

    return (
        <div className="p-6 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black sm:text-4xl">Contact Messages</h1>
                    <p className="mt-2 text-gray-400">
                        {messages.length} messages ·{" "}
                        {unread > 0 && (
                            <span className="text-orange-400 font-bold">{unread} unread</span>
                        )}
                    </p>
                </div>
                <button
                    onClick={load}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:flex-row lg:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2.5">
                    <span>🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && load()}
                        placeholder="Search messages…"
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {["all", "new", "read", "replied", "archived"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${filter === f
                                    ? "bg-gradient-to-r from-orange-500 to-red-500"
                                    : "border border-white/10 hover:bg-white/10"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
                </div>
            ) : messages.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
                    <div className="text-5xl">📭</div>
                    <h3 className="mt-4 text-xl font-bold">No messages</h3>
                    <p className="mt-2 text-sm text-gray-400">
                        {search || filter !== "all"
                            ? "Try clearing your filters."
                            : "Messages from the contact form will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            onClick={() => {
                                setSelected(m);
                                if (m.status === "new") updateStatus(m.id, "read");
                            }}
                            className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-orange-500/40"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold">{m.name}</span>
                                        <span className="text-xs text-gray-500">
                                            &lt;{m.email}&gt;
                                        </span>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[m.status]
                                                }`}
                                        >
                                            {m.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 font-semibold">{m.subject}</div>
                                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                                        {m.message}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right text-xs text-gray-500">
                                    {new Date(m.created_at).toLocaleDateString("en-PK", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail modal */}
            {selected && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl"
                    >
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-red-500"
                        >
                            ✕
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[selected.status]
                                    }`}
                            >
                                {selected.status}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(selected.created_at).toLocaleString("en-PK")}
                            </span>
                        </div>

                        <h2 className="mt-3 text-2xl font-black">{selected.subject}</h2>

                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 font-bold">
                                {selected.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="font-bold">{selected.name}</div>
                                <a
                                    href={`mailto:${selected.email}`}
                                    className="text-xs text-orange-400 hover:underline"
                                >
                                    {selected.email}
                                </a>
                            </div>
                        </div>

                        <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
                            {selected.message}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <a
                                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(
                                    selected.subject
                                )}`}
                                onClick={() => updateStatus(selected.id, "replied")}
                                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-center text-sm font-bold"
                            >
                                📧 Reply via Email
                            </a>
                            <select
                                value={selected.status}
                                onChange={(e) => {
                                    updateStatus(selected.id, e.target.value);
                                    setSelected({ ...selected, status: e.target.value as any });
                                }}
                                className="rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm font-semibold outline-none"
                            >
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="archived">Archived</option>
                            </select>
                            <button
                                onClick={() => deleteMessage(selected.id)}
                                className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20"
                            >
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}