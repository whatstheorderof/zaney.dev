export function SiteFooter() {
  return (
    <footer className="border-t border-white/15 px-4 pb-10 pt-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
        <a href="#top" className="hover:text-white">
          Back to top
        </a>
        <span>&copy; {new Date().getFullYear()} Zaney Games</span>
      </div>
      <p className="text-[clamp(2.5rem,13vw,11rem)] font-black uppercase leading-none tracking-tighter">
        Zaney.Games
      </p>
    </footer>
  );
}
