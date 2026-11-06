# Atchiverse

Personalized learning app for Atchi (6th grade, CA curriculum, ADHD). Separate from Cloak.

## Workflow
- Commit straight to `main` and push when changes are done. No feature branches, no PRs.
- Pushing to `main` auto-deploys to GitHub Pages (`.github/workflows/pages.yml`).

## Stack
- Static site, no build. `index.html` + `src/` (vanilla JS modules).
- Content (questions, lessons) lives in `src/content.js`.
- TTS available via Cloak API: `POST https://api.usecloak.org/v1/speech {text}` → audio/wav.
