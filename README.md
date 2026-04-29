# CS2 HUD

HUD externo para CS2 estilo broadcast. CS2 envia Game State Integration al server Express, el server normaliza el estado y lo emite por Socket.io al HUD Next.js para usarlo en OBS como Browser Source.

## Requisitos

- Node.js 20+
- npm
- CS2 instalado

## Comandos utiles

Instalar dependencias:

```bash
npm install
```

Levantar server y HUD:

```bash
npm run dev
```

URLs:

```text
Server: http://localhost:3000
HUD:    http://localhost:3001
Admin:  http://localhost:3001/admin
```

Simular payloads GSI sin abrir CS2:

```bash
npm run simulate
```

Validar TypeScript:

```bash
npm run typecheck
```

Lint basico del monorepo:

```bash
npm run lint
```

Build del HUD:

```bash
npm run build -w apps/hud
```

Build/typecheck del server:

```bash
npm run build -w apps/server
```

Healthcheck del server:

```bash
curl http://localhost:3000/health
```

Ultimo estado recibido desde CS2 o el simulador:

```bash
curl http://localhost:3000/gsi/latest
```

## Conectar con CS2

Crear el archivo:

```text
...\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\gamestate_integration_cs2_hud.cfg
```

Contenido recomendado:

```cfg
"CS2 HUD GSI"
{
  "uri" "http://localhost:3000/gsi"
  "timeout" "5.0"
  "buffer" "0.1"
  "throttle" "0.1"
  "heartbeat" "30.0"
  "auth"
  {
    "token" "cs2-hud-dev"
  }
  "data"
  {
    "provider" "1"
    "map" "1"
    "round" "1"
    "player_id" "1"
    "player_state" "1"
    "player_weapons" "1"
    "player_match_stats" "1"
    "allplayers_id" "1"
    "allplayers_state" "1"
    "allplayers_weapons" "1"
    "allplayers_match_stats" "1"
    "allplayers_position" "1"
    "bomb" "1"
    "grenades" "1"
    "phase_countdowns" "1"
  }
}
```

Despues de crear el archivo, reiniciar CS2 y levantar el proyecto:

```bash
npm run dev
```

Para comprobar que CS2 esta enviando datos:

```bash
curl http://localhost:3000/gsi/latest
```

Nota: segun el modo de juego y permisos de espectador, CS2 puede enviar menos datos. Para un HUD broadcast completo con todos los jugadores, suele ser necesario usar modo espectador/GOTV u observer.

## OBS

Agregar una Browser Source con:

```text
URL: http://localhost:3001
Width: 1920
Height: 1080
```

El HUD usa fondo transparente para poder superponerse arriba de la captura del juego.

## Upload de assets

Panel visual:

```text
http://localhost:3001/admin
```

Endpoints:

```text
POST /assets/teams/:id
POST /assets/players/:id
GET  /assets/:type/:id
```

El campo del archivo debe llamarse `file`.

Ejemplo:

```bash
curl -X POST http://localhost:3000/assets/teams/navi -F "file=@./logo.png"
```

El server guarda las imagenes como:

```text
uploads/teams/:id.png
uploads/players/:id.png
```

## Estructura principal

```text
apps/server
  src/gsi      Endpoint y parser del Game State Integration
  src/socket   Socket.io
  src/assets   Upload y servicio de imagenes
  src/simulator Mock GSI payload

apps/hud
  src/app        Next.js App Router
  src/components Componentes del HUD
  src/hooks      useGameState
  public/weapons Iconos de armas

packages/types
  src/gamestate.ts Tipos compartidos server <-> HUD
```
