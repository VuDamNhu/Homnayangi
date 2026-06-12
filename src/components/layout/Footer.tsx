import Link from "next/link";

const footerLinks = [
  { label: "Về Chúng Tôi", href: "/about" },
  { label: "Liên Hệ", href: "/contact" },
  { label: "Bảo Mật", href: "/privacy" },
] as const;

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

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-8">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-label text-xs uppercase tracking-[0.15em] text-on-surface-variant hover:text-zen-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Social icon buttons */}
        <div className="flex gap-3">
          {(["share", "rss"] as const).map((icon) => (
            <button
              key={icon}
              aria-label={icon}
              className="w-10 h-10 manga-border flex items-center justify-center text-on-surface-variant hover:text-zen-gold hover:border-zen-gold transition-colors"
            >
              {icon === "share" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 11a9 9 0 0 1 9 9" />
                  <path d="M4 4a16 16 0 0 1 16 16" />
                  <circle cx="5" cy="19" r="1" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
