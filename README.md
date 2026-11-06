# Jio

_(repo: Atchiverse)_

Personalized learning for Atchi — built to work *with* ADHD, not against it. Targets CA 6th grade with backfill from grade 1–2 gaps.

## Run
Live: https://usecloakai.github.io/jio/ (after repo rename; old URL until then) — auto-deploys on push to `main` via `.github/workflows/pages.yml`.

Local: Static site, no build. `python3 -m http.server` → open `localhost:8000`.

## What's in
- **Adaptive level check** — 6 math + 6 reading Qs, walks grade 1–6 up/down to find his level.
- **Missions** — 3‑min lessons (hook → example → 3 practice), picked from missed skills + next grade up.
- **ADHD-friendly** — XP, streaks, stars, instant feedback, brain break every 8 min, short chunks.
- **PIN login** → progress + every answer synced to Supabase (`answers` table).
- **Jio the orb** — mascot that reacts (happy, cheer, sad, thinking, talking) and follows the cursor.
- **Read-aloud** — speaker on every card + auto-read toggle (Cloak TTS, browser voice fallback). Voice boost up to 300%.
- **Phone app** — installable (Add to Home Screen), offline shell via service worker, thumb-first layout, haptics on Android.
- **Sound** — synthesized SFX + settings sheet for voice / SFX volume.
- 27 lessons covering every skill the level check tests.

Content lives in `src/content.js`.
