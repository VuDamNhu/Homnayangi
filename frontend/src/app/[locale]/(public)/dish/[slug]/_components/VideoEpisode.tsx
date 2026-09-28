import Image from "next/image";

interface VideoEpisodeProps {
  recipeName: string;
  episodeLabel?: string;
  coverImage: string;
}

export function VideoEpisode({ recipeName, episodeLabel, coverImage }: VideoEpisodeProps) {
  return (
    <section className="mb-20">
      <div className="relative overflow-hidden group h-[320px] md:h-[500px] bg-zen-ink manga-border-gold manga-shadow">
        <Image
          src={coverImage}
          alt={recipeName}
          fill
          className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zen-ink/70 via-transparent to-transparent" />

        {/* Centered content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <button
            aria-label="Phát video"
            className="mb-8 bg-white/20 backdrop-blur-md p-7 md:p-8 rounded-full border border-zen-gold/50 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-12 h-12 md:w-14 md:h-14 text-white fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {episodeLabel && (
            <p className="font-label text-[10px] text-white/60 uppercase tracking-[0.4em] mb-3">
              {episodeLabel}
            </p>
          )}

          <h3 className="font-display text-2xl md:text-4xl text-white uppercase italic tracking-tighter max-w-2xl">
            {recipeName}
          </h3>
        </div>

        {/* Mascot speech bubble — bottom right */}
        <div className="absolute bottom-5 right-5 md:bottom-6 md:right-6 flex items-end gap-3">
          <div className="bg-white/95 px-4 py-2 rounded-xl text-xs font-bold uppercase border border-zen-gold/30 shadow-sm text-on-surface font-label tracking-wide hidden md:block">
            &ldquo;Trông ngon đấy, bạn ơi!&rdquo;
          </div>
          <div
            className="w-12 h-12 bg-zen-gold rounded-full flex items-center justify-center text-xl"
            style={{ border: "2px solid white", boxShadow: "2px 2px 0px 0px #1b1b1e" }}
          >
            🍳
          </div>
        </div>
      </div>
    </section>
  );
}
