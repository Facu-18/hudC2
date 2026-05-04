# Registro De Deuda Tecnica
> Generado: 2026-05-04 | Agente: analisting

| ID | Prioridad | Esfuerzo | Area | Descripcion | Evidencia | Recomendacion |
|---|---|---:|---|---|---|---|
| TD-001 | Resuelto | M | Server uploads | Multer escribia antes de validar `:type`; ahora valida parametros antes de `upload.single("file")` | `apps/server/src/assets/upload.ts` | Mantener validacion antes de cualquier middleware que escriba archivos |
| TD-002 | Resuelto | M | Server uploads | `:id` se usaba raw; ahora se restringe a `[A-Za-z0-9_-]+` y se valida path final | `apps/server/src/assets/upload.ts` | Si se aceptan IDs mas amplios, encodear y validar path igual |
| TD-003 | Resuelto | S | Server security | El cfg declaraba token pero `/gsi` no lo validaba; ahora usa `GSI_AUTH_TOKEN` con default `cs2-hud-dev` | `apps/server/src/gsi/receiver.ts`, `apps/server/src/simulator/mock-gsi.ts` | Cambiar token por env si el server sale de localhost |
| TD-004 | Alta | M | Testing | No hay tests ni script `test`; calidad depende de TypeScript | `package.json:10-15`, `apps/server/package.json:6-12`, `apps/hud/package.json:6-12` | Agregar runner y tests para parser, merge y uploads |
| TD-005 | Media | M | GSI merge | Deep merge puede conservar granadas, armas o jugadores obsoletos | `apps/server/src/gsi/receiver.ts:21-30` | Definir estrategia para reemplazar mapas volatiles o procesar `previously` |
| TD-006 | Resuelto | M | GSI parser | Parser accedia a nested players sin guards runtime robustos; ahora normaliza records invalidos a defaults | `apps/server/src/gsi/parser.ts` | Agregar tests de payload malformado |
| TD-007 | Parcial | S | Upload validation | Ahora hay limite de 2 MB y allowlist de mimetypes; falta validacion de firma real | `apps/server/src/assets/upload.ts` | Validar magic bytes o normalizar con libreria de imagen |
| TD-008 | Resuelto | M | HUD data model | `phase_countdowns` ahora entra al `GameState` y `RoundTimer` muestra countdown cuando existe | `packages/types/src/gamestate.ts`, `apps/server/src/gsi/parser.ts`, `apps/hud/src/components/TopBar/RoundTimer.tsx` | Agregar tests/fixture con countdown real de CS2 |
| TD-009 | Media | M | HUD scoreboard | Round history se deriva de scores acumulados y no del orden real de ganadores | `apps/hud/src/components/TopBar/RoundHistory.tsx:6-24` | Agregar historial real de rondas al estado normalizado |
| TD-010 | Media | S | HUD players | El bottom bar filtra muertos y `PlayerCard` tambien retorna null | `apps/hud/src/components/BottomBar/index.tsx:31-36`, `apps/hud/src/components/BottomBar/PlayerCard.tsx:99-100` | Mostrar 5 jugadores por equipo con estado muerto atenuado |
| TD-011 | Resuelto | S | HUD assets | `weapon_m4a4` apuntaba a `m4a4.svg`, que no existe; ahora cae en `m4a1.svg` en vez de AK-47 | `apps/hud/src/components/BottomBar/WeaponIcon.tsx` | Agregar SVG especifico de M4A4 si se necesita precision visual |
| TD-012 | Baja | S | HUD admin | Team logo upload existe pero `TopBar` no consume logos ni nombres dinamicos | `apps/hud/src/app/admin/page.tsx:45`, `apps/hud/src/components/TopBar/index.tsx:19-38` | Renderizar logos/nombres configurables o simplificar admin |
| TD-013 | Resuelto | S | HUD URLs | Player/admin asset URLs interpolaban IDs sin `encodeURIComponent`; ahora encodean segmentos dinamicos | `apps/hud/src/components/BottomBar/PlayerCard.tsx`, `apps/hud/src/components/BottomBar/PlayerSpectingCard.tsx`, `apps/hud/src/app/admin/page.tsx` | Mantener encoding en cualquier nueva URL dinamica |
| TD-014 | Baja | S | Tooling | `lint` es alias de `tsc --noEmit` y no hay ESLint/formatter | `apps/server/package.json:8-10`, `apps/hud/package.json:8-11` | Agregar lint real o renombrar scripts para evitar confusion |
| TD-015 | Baja | S | OBS reliability | Fonts dependen de Google Fonts externo | `apps/hud/src/app/globals.css:1` | Self-host fonts o usar stack local estable |

## Orden Sugerido De Ejecucion
1. Completar TD-007 con validacion real de contenido de imagen.
2. Agregar tests base para TD-004 cubriendo parser, merge y uploads.
3. Resolver TD-009 para round history real y TD-010 para muertos visibles.
4. Resolver TD-012 si se quiere usar logos/nombres de equipos en HUD.
5. Agregar CI/lint real despues de tener comandos confiables.
