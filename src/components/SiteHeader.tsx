export function SiteHeader() {
  return (
    <header id="top" className="border-b border-white/15">
      <div className="px-4 pt-10 pb-6 sm:px-8">
        <h1 className="text-[clamp(2.5rem,13vw,11rem)] font-black uppercase leading-none tracking-tighter">
          Zaney.Games
        </h1>
      </div>
      <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 sm:px-8">
        <a href="#top" className="hover:text-white">
          Index
        </a>
        <a href="#info" className="hover:text-white">
          Info
        </a>
        <a href="#works" className="hover:text-white">
          Works
        </a>
        <a href="#contact" className="hover:text-white">
          Contact
        </a>
      </nav>
    </header>
  );
}
