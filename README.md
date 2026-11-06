# Atchiverse 🪐

Personalized learning for Atchi — built to work *with* ADHD, not against it. Targets CA 6th grade with backfill from grade 1–2 gaps.

## Run
Live: https://usecloakai.github.io/Atchiverse/ — auto-deploys on push to `main` via `.github/workflows/pages.yml`.

Local: Static site, no build. `python3 -m http.server` → open `localhost:8000`.

## What's in
- **Adaptive level check** — 6 math + 6 reading Qs, walks grade 1–6 up/down to find his level.
- **Missions** — 3‑min lessons (hook → example → 3 practice), picked from missed skills + next grade up.
- **ADHD-friendly** — XP, streaks, stars, instant feedback, brain break every 8 min, short chunks.
- Progress saved in localStorage.

Content lives in `src/content.js`.
