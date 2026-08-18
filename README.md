# FORTREX FX

A premium dark-obsidian and gold pre-launch experience for Fortrex.

## GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`. Every push to `main` builds the Vite frontend with the repository base path `/fortrexfxmanusgold/` and deploys the generated `dist/public` artifact to GitHub Pages.

After the workflow completes, the static site is available at:

<https://somilsharma2000.github.io/fortrexfxmanusgold/>

The workflow also creates `404.html` from the app entry so direct navigation and refreshes on client routes can recover into the React shell.

## Local development

```bash
pnpm install
pnpm dev
```

To build the GitHub Pages variant locally:

```bash
VITE_BASE_PATH=/fortrexfxmanusgold/ pnpm exec vite build
```

## Important deployment limitation

GitHub Pages serves static files only. It cannot run the Express server, database, authentication, WebSocket counter, registration mutation, admin workspace, or server-backed analytics. The Fortrex UI can be hosted there as a static preview, but production registration and admin functionality should remain on the Manus deployment or another hosted backend. Do not commit `.env` files or production credentials.
