# Carlos Cubillos — Desert world

An interactive 3D portfolio landing page. You drive a small car through a low-poly Atacama / Vallenar landscape and park on stands to read projects, an about note, and contact links.

Inspired by [bruno-simon.com](https://bruno-simon.com/). Built with Vite, React, TypeScript, React Three Fiber, drei, and Rapier physics. Every mesh is procedural low-poly — no paid or copyrighted models.

Live path after GitHub Pages deploy: `https://<user>.github.io/world/`

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43173/world/](http://127.0.0.1:43173/world/). The Vite `base` is `/world/`, so the app is not served at `/`.

```bash
npm run build
npm run preview
```

`npm run preview` also serves at `/world/` on port `43173`.

### Controls

| Input | Action |
| --- | --- |
| WASD or arrow keys | Drive |
| Space | Brake |
| R | Respawn at the compass |
| Touch joystick | Drive on phones |
| Sound on / off | Optional engine hum + zone chime |

There is a **Skip to simple version** button on the intro (and in the HUD) for an accessible HTML page of the same content. Append `?simple=1` to force it. If WebGL is missing, the simple view opens on its own.

## Deploy

The workflow in `.github/workflows/deploy.yml` builds the site and uploads `dist` to GitHub Pages.

1. Enable **GitHub Pages** for the repository, source **GitHub Actions**.
2. Push `main`.
3. The site is expected under the `/world/` base. If this repository is named `world` on a user account, the URL is `https://<user>.github.io/world/`.

## Placeholders

- **CV link** on the Contact stand / simple page points to `#cv-placeholder`. Swap it for a real file when you have one.
- Reflex Chile and the Valorant companion have no public repo links yet.

## Stack

- Vite 8 + React 19 + TypeScript
- `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`
- Web Audio for optional SFX (no audio files)
