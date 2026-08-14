# Studio Atlas

Studio Atlas is an interactive Hollywood collaboration map built with Next.js. People appear as nodes, and the thickness of each connection represents how many projects they have worked on together.

## Features

- Interactive person and project network
- Pan by dragging the map background
- Zoom with the mouse wheel, trackpad, pinch gesture, or on-screen controls
- Person portraits and biographies on hover
- Shared project posters when hovering collaboration lines
- Project-title fallback when artwork is unavailable
- Search and keyboard-accessible graph nodes
- Responsive mobile layout

## Technology

- Next.js App Router
- React
- TypeScript
- SVG visualization
- Tailwind CSS

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

The project can be deployed to Vercel or any platform that supports standard Next.js applications.

## Main files

- `app/page.tsx` — graph data and interactions
- `app/globals.css` — visual design and responsive styles
- `app/api/media/route.ts` — same-origin portrait and poster proxy
- `app/layout.tsx` — metadata and application shell
