import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 px-5 md:px-10 bg-zen-cream border-t-2 border-zen-ink/10">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display text-3xl font-black italic uppercase tracking-tighter text-zen-gold">
            HomNayAnGi
          </span>
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-on-surface-variant">
            © {new Date().getFullYear()} HomNayAnGi. Mission Complete!
          </span>
        </div>

        {/* Credit */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-label text-xs uppercase tracking-[0.15em] text-on-surface-variant">
            design by{" "}
            <Link
              href="https://www.facebook.com/VuDamNhu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zen-gold hover:underline transition-colors"
            >
              VuDamNhu
            </Link>
          </span>
        </div>

        {/* Facebook link */}
        <div className="flex gap-3">
          <Link
            href="https://www.facebook.com/VuDamNhu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 manga-border flex items-center justify-center text-on-surface-variant hover:text-zen-gold hover:border-zen-gold transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
