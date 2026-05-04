"use client";

import { FormEvent, useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

function UploadForm({ type, label }: { type: "teams" | "players"; label: string }) {
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(`${serverUrl}/assets/${type}/${encodeURIComponent(id)}`, {
        method: "POST",
        body: data
      });

      if (response.ok) {
        setStatus("Uploaded");
        return;
      }

      const body = await response.json().catch(() => undefined) as { error?: string } | undefined;
      setStatus(body?.error ?? "Upload failed");
    } catch {
      setStatus("Upload failed: server unreachable");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-[520px] flex-col gap-4 rounded bg-zinc-900 p-6">
      <h2 className="text-2xl font-black">{label}</h2>
      <input
        className="rounded bg-zinc-800 px-4 py-3 outline-none ring-1 ring-white/10"
        value={id}
        onChange={(event) => setId(event.target.value)}
        placeholder={`${type === "teams" ? "team" : "steam"} id`}
        pattern="[A-Za-z0-9_-]+"
        title="Use only letters, numbers, underscores, and hyphens"
        required
      />
      <input className="rounded bg-zinc-800 px-4 py-3 ring-1 ring-white/10" type="file" name="file" accept="image/*" required />
      <button className="rounded bg-white px-4 py-3 font-black uppercase text-zinc-950 disabled:opacity-60" type="submit" disabled={submitting}>
        {submitting ? "Uploading" : "Upload"}
      </button>
      <div className="h-5 text-sm font-bold text-zinc-400">{status}</div>
    </form>
  );
}

export default function AdminPage() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-8 bg-zinc-950 p-10 text-white">
      <UploadForm type="teams" label="Team Logos" />
      <UploadForm type="players" label="Player Photos" />
    </main>
  );
}
