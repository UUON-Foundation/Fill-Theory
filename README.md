# Fill Theory

Interactive 3D visualization of the Fractional Fill Theory framework, built with React, Three.js, and a Node/Express backend on Neon Postgres.

## Stack

- **Client:** React 18 + TypeScript, Vite, Three.js / @react-three/fiber, Tailwind CSS
- **Server:** Express, Drizzle ORM
- **Database:** Neon (serverless Postgres)
- **Deployment:** Railway (Railpack builder)

## Folder Structure

```
.
├── client/                  # Frontend application
│   ├── index.html           # Vite entry HTML
│   ├── public/               # Static assets
│   │   ├── fonts/
│   │   ├── geometries/
│   │   ├── sounds/
│   │   └── textures/
│   └── src/
│       ├── App.tsx           # Root component
│       ├── main.tsx          # React entry point
│       ├── index.css         # Tailwind directives + global/canvas styles
│       ├── components/       # Visualization & UI components
│       ├── hooks/            # Custom React hooks
│       ├── lib/               # Client-side utilities
│       ├── pages/            # Route-level views
│       └── shaders/          # GLSL shader files
├── server/                   # Backend application
│   ├── index.ts              # Server entry point, listens on process.env.PORT
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Data access layer
│   └── vite.ts                # Vite middleware (dev) / static serving (prod)
├── shared/
│   └── schema.ts              # Shared types/schema between client and server
├── dist/                      # Build output (gitignored)
├── drizzle.config.ts           # Drizzle ORM configuration
├── railway.json                # Railway deploy configuration
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js 22.x
- A Neon Postgres database (or compatible Postgres connection string)

### Setup

```bash
npm install
```

Create a `.env` file at the project root (never commit this):

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

> **Note:** the server reads `DATABASE_URL` — make sure your environment variable name matches exactly. Variable naming mismatches (e.g. `BASE_URL` vs `DATABASE_URL`) are a common source of silent connection failures.

### Development

```bash
npm run dev
```

Runs the Express server with `tsx`, serving the Vite dev middleware for the client.

### Production Build

```bash
npm run build
```

Runs `vite build` (outputs to `dist/public`) followed by `esbuild` bundling of the server (outputs to `dist/index.js`).

### Production Start

```bash
npm start
```

Runs `node dist/index.js`. The server reads the port from `process.env.PORT` (falling back to `5000` for local use) and binds to `0.0.0.0` — required for the app to be reachable when deployed behind Railway's proxy.

## Deployment (Railway)

- Builder: Railpack (auto-detected Node project)
- Build command: `npm run build` (auto-detected from `package.json`)
- Start command: `npm start` (auto-detected from `package.json`)
- Config-as-code: see `railway.json` for restart policy and replica settings
- **Healthcheck Path:** not currently configured — consider adding one (e.g. a simple `/health` route) so failed deployments are caught before serving traffic, rather than relying on the container simply not crashing.

### Environment Variables (Railway → Variables)
| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres pooled connection string, with `?sslmode=require` |
| `PORT` | Set automatically by Railway — do not hardcode this in code |

## What You Need to Know

- The client (`client/`) and server (`server/`) are built and deployed as a single service — the Express server serves the built static client in production (see `server/vite.ts`).
- Path aliases: `@` → `client/src`, `@shared` → `shared/` (see `vite.config.ts`).
- Visualization components under `client/src/components/` implement the Fractional Fill Theory geometry and rendering logic and may contain proprietary algorithmic implementations — see `.gitignore` and internal documentation before sharing or open-sourcing specific files.
- `neon-railway-example/` is a standalone reference example and is not part of the deployed application.

## License

MIT — see [LICENSE](./LICENSE).
