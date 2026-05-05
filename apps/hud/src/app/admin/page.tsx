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
        setStatus("Uploaded. HUD refreshes within 15s");
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

function PlayerNameForm() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(`${serverUrl}/players/${encodeURIComponent(id)}/name`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        setStatus("Name saved");
        return;
      }

      const body = await response.json().catch(() => undefined) as { error?: string } | undefined;
      setStatus(body?.error ?? "Rename failed");
    } catch {
      setStatus("Rename failed: server unreachable");
    } finally {
      setSubmitting(false);
    }
  }

  async function clearName() {
    if (!id) {
      setStatus("Missing steam id");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(`${serverUrl}/players/${encodeURIComponent(id)}/name`, {
        method: "DELETE"
      });

      if (response.ok) {
        setName("");
        setStatus("Name cleared");
        return;
      }

      const body = await response.json().catch(() => undefined) as { error?: string } | undefined;
      setStatus(body?.error ?? "Clear failed");
    } catch {
      setStatus("Clear failed: server unreachable");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-[520px] flex-col gap-4 rounded bg-zinc-900 p-6">
      <h2 className="text-2xl font-black">Player Names</h2>
      <p className="text-sm font-semibold text-zinc-500">Use the steamId from /gsi/debug, for example 254.</p>
      <input
        className="rounded bg-zinc-800 px-4 py-3 outline-none ring-1 ring-white/10"
        value={id}
        onChange={(event) => setId(event.target.value)}
        placeholder="steam id"
        pattern="[A-Za-z0-9_-]+"
        title="Use only letters, numbers, underscores, and hyphens"
        required
      />
      <input
        className="rounded bg-zinc-800 px-4 py-3 outline-none ring-1 ring-white/10"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="display name"
        maxLength={24}
        required
      />
      <div className="flex gap-3">
        <button className="flex-1 rounded bg-white px-4 py-3 font-black uppercase text-zinc-950 disabled:opacity-60" type="submit" disabled={submitting}>
          {submitting ? "Saving" : "Save"}
        </button>
        <button className="rounded bg-zinc-800 px-4 py-3 font-black uppercase text-white ring-1 ring-white/10 disabled:opacity-60" type="button" disabled={submitting} onClick={clearName}>
          Clear
        </button>
      </div>
      <div className="h-5 text-sm font-bold text-zinc-400">{status}</div>
    </form>
  );
}

export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-wrap items-center justify-center gap-8 bg-zinc-950 p-10 text-white">
      <UploadForm type="teams" label="Team Logos" />
      <UploadForm type="players" label="Player Photos" />
      <PlayerNameForm />
    </main>
  );
}
