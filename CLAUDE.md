# Jio (repo: Atchiverse)

Brand is **Jio**; mascot is an orb (`src/mascot.js`). Keep localStorage keys (`atchiverse:*`) so saves survive.

Personalized learning app for Atchi (6th grade, CA curriculum, ADHD). Separate from Cloak.

## Workflow
- Commit straight to `main` and push when changes are done. No feature branches, no PRs.
- Pushing to `main` auto-deploys to GitHub Pages (`.github/workflows/pages.yml`).

## Stack
- Static site, no build. `index.html` + `src/` (vanilla JS modules).
- Content (questions, lessons) lives in `src/content.js`.
- Supabase project `flsjetuwysxzrlscigww` (Atchiverse). Tables RLS-locked; browser uses RPCs only (`src/cloud.js`). Schema in `supabase/`. Never commit PINs.
- TTS: `src/speech.js` → Cloak API, browser voice fallback.
- TTS available via Cloak API: `POST https://api.usecloak.org/v1/speech {text}` → audio/wav.
- Cache-busting: bump `?v=N` in `index.html` and the imports in `src/app.js` on every deploy, or browsers keep old JS.
- Audio: `src/audio.js` owns one AudioContext (voice gain up to 3x + compressor, synthesized SFX). Design rules: one accent (coral), cards 28px / choices 20px / buttons pill, no emoji in UI (Phosphor icons).
- Phone: installable PWA (`manifest.webmanifest`, `sw.js`, `icons/`). Phone layout lives in the `max-width: 600px` block of `style.css`. Pages workflow must copy any new top-level file.
- History videos: scripts/FAQ/quiz in `src/history.js` (CA HSS 6th grade, Ancient Civilizations), SVG scenes + characters in `src/scene.js`, player/feed in `src/feed.js`. Each beat = one short voiceover line (Cloak TTS) + one scene; captions timed to audio duration; 1.5s gap between beats. Keep scripts simple (about 3rd grade reading level, one idea per line). Each video's `recap` (3 points) becomes closing beats with a recap card.
- Path: `src/path.js` is the progression model for math / reading / history. Unit = lessons (or videos) in order → review (70%) → unit test (80%, no hints); test pass unlocks the next unit. Gates stored as `state.mastery['review:<subject>:<i>']` / `['test:...']`. Games live in the Arcade screen, off the path.
