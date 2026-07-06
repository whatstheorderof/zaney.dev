export type Game = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  url: string;
  status: "live" | "wip";
};

export const zaneyGames: Game[] = [
  {
    slug: "zaney-games",
    name: "Zaney Games",
    tagline: "The zaney.games hub — every daily puzzle in one place.",
    category: "Hub",
    url: "https://zaneygames.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-sudoku",
    name: "Zaney Sudoku",
    tagline: "Daily sudoku with a Zaney twist.",
    category: "Puzzle",
    url: "https://www.zaneysudoku.com/",
    status: "live",
  },
  {
    slug: "zaney-tarot",
    name: "Zaney Tarot",
    tagline: "Draw your daily cards.",
    category: "Divination",
    url: "https://www.zaneytarot.com/",
    status: "live",
  },
  {
    slug: "zaney-links",
    name: "Zaney Links",
    tagline: "Connect the chain, word by word.",
    category: "Word",
    url: "https://zaneylinks.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-cube",
    name: "Zaney Cube",
    tagline: "A daily cube puzzle to twist your brain.",
    category: "Puzzle",
    url: "https://zaneycube.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-word",
    name: "Zaney Word",
    tagline: "Guess the word of the day.",
    category: "Word",
    url: "https://zaneyword.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-search",
    name: "Zaney Search",
    tagline: "Daily themed word searches with a twist.",
    category: "Word",
    url: "https://zaneysearch.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-strands",
    name: "Zaney Strands",
    tagline: "Trace connected letters to find the hidden story.",
    category: "Word",
    url: "https://zaneystrands.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-logic",
    name: "Zaney Logic",
    tagline: "Daily logic mysteries — deduce who, where, and when.",
    category: "Puzzle",
    url: "https://zaneylogic.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-kakuro",
    name: "Zaney Kakuro",
    tagline: "Crossword meets arithmetic — daily number puzzles.",
    category: "Puzzle",
    url: "https://zaneykakuro.vercel.app/",
    status: "live",
  },
];

export const otherGames: Game[] = [
  {
    slug: "say-more",
    name: "Say More",
    tagline: "A game about saying more than you should.",
    category: "Party",
    url: "https://saymoregame.com/",
    status: "live",
  },
  {
    slug: "zaney-tales",
    name: "Zaney Tales",
    tagline: "Whimsical children's books, comics & colouring books.",
    category: "Books",
    url: "https://zaneytales.com/",
    status: "live",
  },
  {
    slug: "saz-skyroads",
    name: "SAZ: Skyroads",
    tagline: "Ride the sky roads — watch your fuel and oxygen.",
    category: "Arcade",
    url: "https://sazskyroads.vercel.app/",
    status: "live",
  },
  {
    slug: "grive-image-host",
    name: "Drive Image Host",
    tagline: "Paste a Google Drive link, get a clean embeddable img tag.",
    category: "Tool",
    url: "https://griveimagehost.vercel.app/",
    status: "live",
  },
  {
    slug: "zaney-aquarium",
    name: "Zaney Aquarium",
    tagline: "Guide the fish home — rotate, slide, flow.",
    category: "Puzzle",
    url: "https://zaneyaquarium.vercel.app/",
    status: "live",
  },
];

export const allGames: Game[] = [...zaneyGames, ...otherGames];
