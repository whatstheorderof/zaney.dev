import Image from "next/image";
import type { Game } from "@/lib/games";

export function GameCard({ game }: { game: Game }) {
  return (
    <a href={game.url} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-white/70">
          {game.name}
        </h3>
        <div className="flex shrink-0 gap-2 text-[10px] font-medium uppercase tracking-widest text-white/50">
          <span className="rounded-full border border-white/20 px-2 py-1">{game.category}</span>
          <span className="rounded-full border border-white/20 px-2 py-1">Live</span>
        </div>
      </div>
      <div className="overflow-hidden border border-white/10 bg-white/5">
        <Image
          src={`/screenshots/${game.slug}.png`}
          alt={`${game.name} screenshot`}
          width={1280}
          height={800}
          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <p className="mt-2 text-sm text-white/50">{game.tagline}</p>
    </a>
  );
}
