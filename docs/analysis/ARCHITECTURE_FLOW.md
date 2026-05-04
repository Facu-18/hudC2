# Flujos De Arquitectura
> Generado: 2026-05-04 | Agente: analisting

## Arquitectura General
```mermaid
graph TB
  subgraph Input[Fuentes de datos]
    CS2[CS2 Game State Integration]
    Sim[apps/server/src/simulator/mock-gsi.ts]
  end

  subgraph Server[apps/server Express 5]
    Index[index.ts]
    Gsi[receiver.ts POST /gsi]
    Merge[mergePayload partial updates]
    Parser[parser.ts parseGameState]
    Socket[socket.ts Socket.io]
    Upload[upload.ts /assets]
    Memory[(latestRawPayload latestGameState)]
    Files[(uploads/teams uploads/players)]
  end

  subgraph Shared[packages/types]
    Types[GameState and related types]
  end

  subgraph HUD[apps/hud Next.js]
    Hook[useGameState]
    Page[app/page.tsx 1920x1080 canvas]
    Top[TopBar]
    Bomb[BombTimer]
    Bottom[BottomBar]
    Admin[app/admin/page.tsx]
    Public[public/equipment public/players]
  end

  CS2 --> Gsi
  Sim --> Gsi
  Index --> Gsi
  Index --> Socket
  Index --> Upload
  Gsi --> Merge --> Parser --> Types
  Parser --> Memory
  Parser --> Socket
  Socket --> Hook --> Page
  Page --> Top
  Page --> Bomb
  Page --> Bottom
  Bottom --> Public
  Bottom --> Files
  Admin --> Upload --> Files
```

## Secuencia GSI En Vivo
```mermaid
sequenceDiagram
  participant CS2 as CS2 o simulador
  participant API as Express POST /gsi
  participant Merge as mergePayload
  participant Parser as parseGameState
  participant IO as Socket.io
  participant HUD as useGameState/HUD

  CS2->>API: POST payload GSI parcial o completo
  API->>Merge: merge latestRawPayload + incoming
  Merge-->>API: raw payload acumulado sin previously
  API->>Parser: parseGameState(raw)
  Parser-->>API: GameState normalizado
  API->>IO: emitGameState(gameState)
  IO->>HUD: evento gamestate
  HUD->>HUD: render TopBar, BombTimer, BottomBar
  API-->>CS2: 204 No Content
```

## Flujo De Conexion HUD
```mermaid
flowchart TD
  Load[Browser/OBS abre http://localhost:3001] --> Page[HudPage client component]
  Page --> Scale[useHudScale calcula escala 1920x1080]
  Page --> Hook[useGameState conecta a NEXT_PUBLIC_SOCKET_URL]
  Hook --> Connected{Socket conectado?}
  Connected -->|No| Disconnected[Mostrar Socket disconnected]
  Connected -->|Si sin GameState| Waiting[Mostrar Waiting for GSI]
  Hook -->|gamestate| HasState[GameState en React state]
  HasState --> Render[Render HUD]
  Render --> Top[TopBar score/fase/mapa]
  Render --> Bomb{bomb.state planted?}
  Bomb -->|Si| BombTimer[Mostrar countdown bomb]
  Bomb -->|No| NoBomb[No render bomb timer]
  Render --> Bottom[BottomBar jugadores vivos y observado]
```

## Flujo De Uploads
```mermaid
sequenceDiagram
  actor AdminUser as Usuario admin
  participant Admin as HUD /admin
  participant Assets as Express /assets/:type/:id
  participant Multer as Multer diskStorage
  participant FS as uploads filesystem
  participant HUD as HUD player cards

  AdminUser->>Admin: selecciona type, id y archivo file
  Admin->>Assets: POST multipart /assets/{type}/{id}
  Assets->>Multer: upload.single("file")
  Multer->>FS: escribe uploads/{teams|players}/{id}.png
  Assets-->>Admin: 201 url o 400 error
  HUD->>Assets: GET /assets/players/{steamId}
  Assets->>FS: busca PNG
  FS-->>Assets: archivo o missing
  Assets-->>HUD: imagen o 404 fallback en img
```

## Mapa De Modulos
```mermaid
graph LR
  Root[package.json turbo.json] --> ServerPkg[apps/server]
  Root --> HudPkg[apps/hud]
  Root --> TypesPkg[packages/types]

  ServerPkg --> ServerIndex[index.ts]
  ServerIndex --> GSI[gsi/receiver.ts]
  ServerIndex --> IO[socket/socket.ts]
  ServerIndex --> Assets[assets/upload.ts]
  GSI --> Parser[gsi/parser.ts]
  Parser --> TypesPkg
  IO --> TypesPkg

  HudPkg --> App[app/page.tsx]
  HudPkg --> Admin[app/admin/page.tsx]
  App --> Hook[hooks/useGameState.ts]
  App --> Components[components]
  Hook --> TypesPkg
  Components --> TypesPkg
  Components --> PublicAssets[public/equipment public/players]
```

## Estado Normalizado
```mermaid
classDiagram
  class GameState {
    GameMapState map
    GameRoundState round
    Record allplayers
    string observedPlayerSteamId
    Bomb bomb
    Record grenades
    string updatedAt
  }
  class Player {
    string steamId
    string name
    TeamSide team
    PlayerState state
    PlayerMatchStats match_stats
    Record weapons
    string position
    string forward
  }
  class Bomb {
    BombState state
    string countdown
    string player
  }
  class PlayerWeapon {
    string name
    string type
    WeaponState state
    number ammo_clip
    number ammo_clip_max
    number ammo_reserve
  }
  GameState --> Player
  GameState --> Bomb
  Player --> PlayerWeapon
```

## Flujo De Desarrollo Local
```mermaid
flowchart LR
  Install[npm install] --> Dev[npm run dev]
  Dev --> Server[Server localhost:3000]
  Dev --> HUD[HUD localhost:3001]
  Server --> Health[curl /health]
  Server --> Latest[curl /gsi/latest]
  Sim[npm run simulate] --> Server
  Verify[npm run typecheck] --> Done[handoff]
  HudChange[npm run build -w apps/hud] --> Done
```
