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
];

export const allGames: Game[] = [...zaneyGames, ...otherGames];
