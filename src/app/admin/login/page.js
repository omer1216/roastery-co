"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.replace("/admin/orders");
      router.refresh();
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-roastery-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-roastery-panel p-8"
      >
        <p className="font-body text-xs uppercase tracking-[0.2em] text-roastery-muted">
          The Roastery Co.
        </p>
        <h1 className="mt-2 font-heading text-2xl text-roastery-text">
          Staff dashboard
        </h1>

        <label
          htmlFor="password"
          className="mt-8 block font-body text-sm text-roastery-muted"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          className="mt-2 w-full rounded-lg border border-white/10 bg-roastery-bg px-4 py-3 font-body text-roastery-text outline-none focus:border-roastery-accent"
        />

        {error ? (
          <p className="mt-3 font-body text-sm text-red-400">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="mt-6 w-full rounded-lg bg-roastery-accent px-4 py-3 font-body text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}