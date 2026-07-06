# zaney.dev

Portfolio site for zaney.dev — the homepage is a faux desktop: each game is a
draggable icon (double-click to open), with the same apps in a macOS-style dock.
Game data lives in `src/lib/games.ts`, desktop layout in `src/lib/desktop.ts`,
and the desktop UI in `src/components/desktop/`.

## Features

- Draggable desktop icons; double-click (desktop) or tap (mobile) to open
- Click any icon for a glass info card describing the project
- macOS dock with magnification and hover tooltips
- Right-click / View menu: Clean Up, Sort by Name/Type, Group into
  Folders (iPhone-style), icon sizes, and 10 wallpapers (persisted)
- iPhone-style swipeable home-screen pages on phones
- `npm run screenshot:games` refreshes the icon art from the live sites

Built with Next.js + Tailwind. Deployed on Vercel with Web Analytics.
