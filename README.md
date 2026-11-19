# Michael McStraw — After Hours

A personalised portfolio that begins as a calm, credible career website and gradually becomes a fictional horror story as you scroll.

## Publish as a normal website

The tested, self-contained website is committed at `docs/index.html` with `docs/.nojekyll`. GitHub can serve it directly without installing dependencies.

1. Open [this repository’s Pages settings](https://github.com/strawzy96/playground/settings/pages).
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main**, folder **/docs**, then **Save**.

GitHub will display the live URL after its first deployment. The expected project URL is `https://strawzy96.github.io/playground/`; it has not yet been verified live. Publishing the Git branch alone does not enable Pages. Alternatively, select GitHub Actions as the Pages source and manually run the prepared “Publish portfolio to GitHub Pages” workflow.

The cloud environment currently blocks the GitHub configuration API, so the one-time Pages setting could not be applied automatically. The uploaded page was fetched back through the authenticated Git connection and verified byte-for-byte against the tested build.

## Open the experience

The downloadable ZIP contains **Michael-McStraw.html**. Extract it and open that file in a modern desktop browser. All art, styles, icons and code are embedded: no account, installation or internet connection is needed.

Start at the top and scroll. Headphones are optional. Sound starts **off**, and the sound button is the only way to start it. “Return to daylight” restores the opening and stops audio. Escape exits dialogs. Scrolling back reverses the visual progression. On a phone, the header menu exposes the same sections.

Some managed browsers block local HTML. The source also runs as a normal website using the commands below.

## Content and creative direction

The opening uses non-sensitive career and interest details supplied in this conversation: infrastructure operations, certificate planning, mentoring, service improvement, first-class Digital & Computer Forensics study, music, gaming and darts. It avoids private addresses, contact details, health/financial details, internal client or laboratory information, unverified qualifications and invented technical achievements.

The impossible incident log, recovered note, identity check and figure are **fictional horror**, not claims about Michael or real events. There is no camera, microphone, geolocation, account access, tracking, messaging or connection to real infrastructure. The contact link is intentionally part of the narrative and does not send a message.

The original SVG corridor has a clean and haunted version. Scroll progress reveals four phases; the final identity check has an additional close encounter. There are no external image/font/CDN requests. No strobing, autoplay sound, browser traps or fake system dialogs are used. Reduced-motion preferences preserve the narrative with static imagery and copy.

## Develop

Requirements: Node.js 22.12+ or 24 LTS, npm. Validated with Node 24.19.0.

```sh
cd /workspace/playground
npm ci
npm run dev
```

Vite uses port **5173**. For a local computer, open `http://localhost:5173`. In a cloud environment, use the environment's available preview or port access. This checkout is already isolated; do not create an additional Git worktree unless explicitly requested.

```sh
npm run build      # TypeScript + production files + single-file HTML
npm run preview    # Serve production build on port 4173
npm test           # Chromium browser checks; starts/reuses the dev server
```

Tests use `/usr/bin/chromium`; set `CHROMIUM_PATH` to use another installed Chromium executable. Browser/server commands may need standard runtime approval in restricted cloud sandboxes.

The normal production site is `dist/index.html` plus `dist/assets/`. The self-contained edition is `dist/Michael-McStraw.html`. Build/package output and browser captures are ignored by Git. The source is uploaded to the requested GitHub repository. Pages activation still requires the one-time setting described above.

## Verification

Browser checks cover the credible opening, absence of automatic audio/external requests, every scroll phase, reverse scrolling, the identity dialog and escape, explicit audio activation/muting, case-note dialogs, mobile navigation/overflow at 375 and 390 pixels, and reduced-motion access. The production single-file edition is additionally checked without network access after opening.
