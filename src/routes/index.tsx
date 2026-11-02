import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wordmark } from "../components/Wordmark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teapot" },
      {
        name: "description",
        content: "Teapot — copy the script, get a free key, join the Discord.",
      },
      { property: "og:title", content: "Teapot" },
      {
        property: "og:description",
        content: "Teapot — copy the script, get a free key, join the Discord.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Replace with your real script once rewritten
const SCRIPT = `loadstring(game:HttpGet("https://example.com/script.lua"))()`;

const DISCORD = "https://discord.gg/m6ev7Ch4SQ";

const btn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground select-none transition-all duration-100 ease-out translate-y-0 shadow-[0_4px_0_0_oklch(0.18_0_0)] hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_oklch(0.18_0_0)] hover:border-ring hover:bg-accent active:translate-y-[3px] active:shadow-[0_1px_0_0_oklch(0.18_0_0)]";

function DiscordIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`size-5 ${className}`} aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

function WarningModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-title"
    >
      <div className="flex w-full max-w-sm flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="flex flex-col gap-1">
          <h2 id="warning-title" className="text-base font-semibold text-foreground">
            ⚠️ Script being rewritten
          </h2>
          <p className="text-sm text-muted-foreground">
            The main script is currently being rewritten. Join our Discord for updates, announcements, and to know when the new version drops.
          </p>
        </div>

        <a
          href={DISCORD}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#5865F2] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <DiscordIcon />
          Join the Discord
        </a>

        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function Index() {
  const [copied, setCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(SCRIPT);
    setCopied(true);
    setShowWarning(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      {showWarning && <WarningModal onClose={() => setShowWarning(false)} />}

      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4">
            <Wordmark className="text-4xl font-semibold sm:text-5xl" />

            <span
              aria-hidden="true"
              className="rule-in h-px w-24 bg-border"
              style={{ animationDelay: "760ms" }}
            />
          </div>

          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={copy}
              className={`${btn} rise-in`}
              style={{ animationDelay: "880ms" }}
            >
              {copied ? "Copied ✓" : "Copy Script"}
            </button>

            <div className="grid grid-cols-3 gap-3">
              <Link
                to="/login"
                className={`${btn} rise-in`}
                style={{ animationDelay: "980ms" }}
              >
                Login
              </Link>
              <a
                href={DISCORD}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} rise-in`}
                style={{ animationDelay: "1060ms" }}
              >
                Free key
              </a>
              <a
                href={DISCORD}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} rise-in`}
                style={{ animationDelay: "1140ms" }}
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
