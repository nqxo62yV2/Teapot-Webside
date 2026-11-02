import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { History, KeyRound, LogOut, RotateCcw } from "lucide-react";
import { Wordmark } from "../components/Wordmark";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Teapot" },
      {
        name: "description",
        content: "Manage your key, reset your HWID and read the latest changelogs.",
      },
      { property: "og:title", content: "Dashboard — Teapot" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Dashboard,
});

/* ------- Config ------- */

const AUTH_KEY = "teapot.authed";
const KEY_EXPIRY_KEY = "teapot.keyExpiry";
const HWID_RESET_KEY = "teapot.hwidResetAt";
const HWID_VALUE_KEY = "teapot.hwid";

const HWID_COOLDOWN_MS = 72 * 60 * 60 * 1000; // 72 hours
// Demo key duration — swap for your real API data later.
const KEY_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/* ------- Mock changelog data — replace with your API feed ------- */

const CHANGELOG = [
  {
    version: "v1.4.0",
    date: "2026-10-28",
    entry: "Added auto key-scan ESP, fixed a crash on load and updated the UI theme.",
  },
  {
    version: "v1.3.2",
    date: "2026-10-19",
    entry: "Fixed detector bypass after the latest game update.",
  },
  {
    version: "v1.3.0",
    date: "2026-10-05",
    entry: "New teleport menu, faster script injection and HWID reset is now available every 72h.",
  },
];

/* ------- Helpers ------- */

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function formatTimestamp(ms: number) {
  return new Date(ms).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------- Small UI atoms ------- */

const card =
  "rounded-xl border border-border bg-card p-6 shadow-sm";
const cardTitle =
  "flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground";
const btn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:border-ring hover:bg-accent disabled:pointer-events-none disabled:opacity-50";

/* ------- Dashboard ------- */

function Dashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [keyExpiry, setKeyExpiry] = useState<number | null>(null);
  const [hwidResetAt, setHwidResetAt] = useState<number | null>(null);
  const [hwid, setHwid] = useState<string | null>(null);

  // Load persisted session data (client-side only; no real backend yet).
  useEffect(() => {
    try {
      const isAuthed = localStorage.getItem(AUTH_KEY) === "1";
      if (!isAuthed) {
        void navigate({ to: "/login", replace: true });
        return;
      }
      const storedExpiry = localStorage.getItem(KEY_EXPIRY_KEY);
      const storedResetAt = localStorage.getItem(HWID_RESET_KEY);
      setKeyExpiry(storedExpiry ? Number(storedExpiry) : null);
      setHwidResetAt(storedResetAt ? Number(storedResetAt) : null);
      setHwid(localStorage.getItem(HWID_VALUE_KEY));
    } catch {
      // localStorage unavailable — show dashboard with empty state
    }
    setReady(true);
  }, [navigate]);

  // Live tick every second for the countdowns.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      // ignore
    }
    void navigate({ to: "/login" });
  }, [navigate]);

  const resetHwid = useCallback(() => {
    const newHwid = `HWID-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const at = Date.now();
    setHwid(newHwid);
    setHwidResetAt(at);
    try {
      localStorage.setItem(HWID_VALUE_KEY, newHwid);
      localStorage.setItem(HWID_RESET_KEY, String(at));
    } catch {
      // ignore
    }
  }, []);

  if (!ready) {
    // Blank shell during the auth check; the effect redirects when not logged in.
    return <main className="min-h-screen bg-background" />;
  }

  // Key time remaining (0 when no key was found → demo state handled in UI).
  const keyRemaining = keyExpiry != null ? keyExpiry - now : null;
  const cooldownRemaining = hwidResetAt != null ? hwidResetAt + HWID_COOLDOWN_MS - now : null;
  const canReset = cooldownRemaining == null || cooldownRemaining <= 0;

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <Wordmark className="text-2xl sm:text-3xl" />
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-sm text-secondary-foreground transition-colors hover:border-ring hover:bg-accent"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </button>
        </header>

        {/* Key status */}
        <section className={`${card} rise-in`} style={{ animationDelay: "150ms" }}>
          <h2 className={cardTitle}>
            <KeyRound className="size-4" aria-hidden="true" />
            Your key
          </h2>

          <div className="mt-4 flex items-baseline justify-between gap-4">
            <span className="text-sm text-muted-foreground">Time remaining</span>
            <span className="font-display text-2xl font-semibold text-foreground tabular-nums">
              {keyRemaining == null
                ? "No key"
                : keyRemaining <= 0
                  ? "Expired"
                  : formatRemaining(keyRemaining)}
            </span>
          </div>

          {keyRemaining != null && keyRemaining > 0 && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground/80 transition-[width] duration-1000 ease-linear"
                style={{
                  width: `${Math.max(0, Math.min(100, (keyRemaining / KEY_DURATION_MS) * 100))}%`,
                }}
              />
            </div>
          )}

          {keyExpiry != null && keyRemaining != null && keyRemaining > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Expires on {formatTimestamp(keyExpiry)}
            </p>
          )}
        </section>

        {/* HWID reset */}
        <section className={`${card} rise-in`} style={{ animationDelay: "300ms" }}>
          <h2 className={cardTitle}>
            <RotateCcw className="size-4" aria-hidden="true" />
            HWID reset
          </h2>

          <p className="mt-4 text-sm text-muted-foreground">
            You can reset your hardware ID once every 72 hours.
          </p>

          {hwid && (
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              Current HWID: <span className="text-foreground">{hwid}</span>
            </p>
          )}

          <div className="mt-4 flex items-center gap-4">
            <button type="button" onClick={resetHwid} disabled={!canReset} className={btn}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset HWID
            </button>
            {!canReset && cooldownRemaining != null && (
              <span className="text-sm text-muted-foreground tabular-nums">
                Available again in {formatRemaining(cooldownRemaining)}
              </span>
            )}
            {canReset && (
              <span className="text-sm text-muted-foreground">
                {hwidResetAt == null ? "Ready" : "Ready to reset"}
              </span>
            )}
          </div>

          {hwidResetAt != null && (
            <p className="mt-3 text-xs text-muted-foreground">
              Last reset: {formatTimestamp(hwidResetAt)}
            </p>
          )}
        </section>

        {/* Changelog */}
        <section className={`${card} rise-in`} style={{ animationDelay: "450ms" }}>
          <h2 className={cardTitle}>
            <History className="size-4" aria-hidden="true" />
            Changelog
          </h2>

          <ol className="mt-5 flex flex-col gap-5">
            {CHANGELOG.map((item) => (
              <li key={item.version} className="relative border-l border-border pl-4">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-[3.5px] size-[7px] rounded-full bg-foreground/70"
                />
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-sm font-semibold text-foreground">
                    {item.version}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.entry}</p>
              </li>
            ))}
          </ol>
        </section>

        <footer className="pb-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Back to home
          </Link>
        </footer>
      </div>
    </main>
  );
}
