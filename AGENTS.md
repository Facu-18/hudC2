# AGENTS.md

## Commands
- Use npm workspaces; the repo declares `packageManager: npm@10.8.2` and has a `package-lock.json`.
- Install with `npm install` from the repo root.
- Run the server and HUD together with `npm run dev` (`turbo dev`). Server defaults to `http://localhost:3000`; HUD defaults to `http://localhost:3001`.
- Run focused workspace commands with npm `-w`, for example `npm run build -w apps/hud`, `npm run typecheck -w apps/server`, or `npm run simulate -w apps/server`.
- There is no separate test runner configured; `lint`, `typecheck`, and server `build` all currently run `tsc --noEmit`.
- Before handing off code changes, run at least `npm run typecheck`; run `npm run build -w apps/hud` for HUD/UI changes because it exercises Next.js build behavior.

## Workspace Shape
- `apps/server` is an Express 5 + Socket.io ESM app; entrypoint is `apps/server/src/index.ts`.
- `apps/hud` is a Next.js App Router app on port 3001; main HUD page is `apps/hud/src/app/page.tsx` and admin upload UI is `apps/hud/src/app/admin/page.tsx`.
- `packages/types` exports TypeScript source directly from `src/gamestate.ts`; the HUD relies on `next.config.ts` `transpilePackages: ["@cs2-hud/types"]` and Turbopack root set to the repo root.

## Runtime Wiring
- CS2 or the simulator posts Game State Integration payloads to `POST /gsi` on the server; the server normalizes them and emits Socket.io `gamestate` events consumed by `useGameState`.
- The server stores the latest merged raw GSI payload in memory and deep-merges incoming partial payloads while skipping the `previously` key; parser changes should preserve this partial-update behavior.
- Useful server checks while running: `GET /health`, `GET /gsi/latest`, and `GET /gsi/debug`.
- Env defaults are hardcoded: server `PORT=3000`, GSI token `GSI_AUTH_TOKEN=cs2-hud-dev`, server/HUD CORS `HUD_ORIGIN=http://localhost:3001`, HUD socket `NEXT_PUBLIC_SOCKET_URL=http://localhost:3000`, admin upload server `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`, simulator `GSI_URL=http://localhost:3000/gsi`.
- Uploaded assets are runtime files under root `uploads/{teams,players}/:id.png`; `uploads` is gitignored, IDs must match `[A-Za-z0-9_-]+`, and the upload form field must be named `file`.

## CS2 / OBS Gotchas
- The checked-in `gamestate_integration_cs2_hud.cfg` is the source to copy into CS2's `game/csgo/cfg` directory; restart CS2 after adding or changing it.
- Full broadcast data depends on CS2 spectator/GOTV/observer permissions; normal play can omit all-player data even if the server and HUD are working.
- The HUD is designed as a transparent 1920x1080 OBS Browser Source and scales the fixed canvas to the browser window; preserve transparent backgrounds unless intentionally changing OBS compositing.

## UI Conventions
- Tailwind CSS v4 is imported from `apps/hud/src/app/globals.css`; design tokens and broadcast styling live there, not in a separate Tailwind config.
- Weapon icons are served from `apps/hud/public/equipment`; `WeaponIcon` maps CS2 `weapon_*` names to SVG filenames and falls back to `/equipment/ak47.svg` on load errors.
