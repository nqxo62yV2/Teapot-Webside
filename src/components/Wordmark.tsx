import { Coffee } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NAME = "Teapot";
// Index of the "o" in "Teapot" — rendered as a teacup icon instead of the letter.
const CUP_INDEX = NAME.indexOf("o");

/**
 * Animated brand wordmark: "Teap☕t" with a teacup in place of the "o".
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label={NAME}
      className={`wordmark font-display text-3xl font-semibold text-foreground sm:text-4xl ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-0.5 leading-none"
      >
        {NAME.split("").map((ch, i) =>
          i === CUP_INDEX ? (
            <Coffee
              key={`cup-${i}`}
              className="wordmark-letter inline-block size-[0.85em] translate-y-[-0.02em]"
              strokeWidth={2.2}
              style={{ animationDelay: `${200 + i * 55}ms` }}
            />
          ) : (
            <span
              key={`${ch}-${i}`}
              className="wordmark-letter"
              style={{ animationDelay: `${200 + i * 55}ms` }}
            >
              {ch}
            </span>
          ),
        )}
      </span>
    </Link>
  );
}
