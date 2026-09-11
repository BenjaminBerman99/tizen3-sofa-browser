# Sofa Browser for Samsung UN55MU630D

**Sofa 0.7.0** is a remote-friendly TizenBrew module for Tizen 3, with bookmarks, an on-screen keyboard, best-effort ad filtering and video controls. Movy movies and TV shows use a separate Mac companion.

## New in 0.7: Movy Player 2

Sofa's Movy card now opens a separate player provided by **Mac helper 0.3.0**. It includes:

- **Seek to time:** a dedicated timeline. Left/right moves ten seconds; holding moves in one-minute steps. OK applies the time; Back cancels.
- **Resume / Start over:** reopening a partly watched movie or episode offers its saved position. Every episode is tracked separately.
- **Quality:** when multiple supported options are listed, choose a resolution and continue at the same position. Paused playback stays paused. Changing quality prepares a fresh stream and may take a moment.
- Movies and TV shows in Home, Browse and Search; season and episode lists; **Next episode**, including season transitions.

The new controls have their own dialogs and two rows of player buttons. The helper retains the original Player 1 page for Sofa 0.6. Update both Sofa and the companion to use Player 2.

## Install on the TV

In **TizenBrew → Module Manager → Add GitHub Module**, enter:

```text
BenjaminBerman99/tizen3-sofa-browser@v0.7.0
```

Leave the entry field to save. Remove the older Sofa module entry, fully close and reopen TizenBrew, and launch Sofa. Its home screen should show **Sofa 0.7.0**. No npm account is needed. A versioned tag avoids cached older module files.

### Mac companion

1. Open the companion's **Start Movy.command** on an Apple Silicon Mac with Node.js 20 or newer. First-time setup installs the pinned browser and media tools in its folder.
2. Keep the helper running and the Mac awake on the same home network as the TV.
3. In Sofa, choose **Movy** and save the Mac address printed by the helper if prompted. **Movy settings** changes it later.
4. Choose a movie or show. For a show, choose a season and episode. OK reveals playback controls; Back returns to the title or episode list.

Player 2 uses `http://MAC_IP:8790/sofa-movy/v2/`. Sofa accepts a private IPv4 address over HTTP on port 8790. The companion must be configured with the TV's current local address. Stop playback before stopping the helper with Control+C.

The Mac opens Movy's ordinary website and serves compatible H.264/AAC video as MPEG-TS fragments. It converts fragmented MP4 only as requested, without reencoding; native MPEG-TS is relayed after codec checks. It does not predownload full movies or save them to disk. Its two media caches total at most 192 MiB, excluding browser/process memory. Only the configured TV and Mac can use it.

### Playback controls and saved positions

Arrows move focus and OK selects. Pause/Play and ten-second seek buttons remain available alongside **Seek to time** and **Quality**. Back closes dialogs before leaving playback. **Next episode** selects the next listed episode and is disabled at the final episode; there is no automatic next-episode playback.

Positions are saved locally in the TV browser about every five seconds and on pause/exit, with a maximum of 200 movies/episodes. Completed titles are cleared near the end. Clearing browser data, changing the helper address or unavailable storage can remove/prevent saved positions. No watch-history sync is included.

Quality choices vary by title. Only supported H.264/AAC sources up to **720p** are offered; 1080p/4K are not enabled. A listed quality is checked when selected. If unavailable, the error screen offers **Use best available quality**, preserving the position. Sites may change or remove sources.

## Ordinary websites

The launchpad keeps the supplied Aether and StreamEast addresses and the Cinejoy catalog. Add other sites with **Add a website**. Saved bookmarks remain separate from the Movy card.

- **Aether** still does not open on this TV, including in Samsung Internet. Its experimental JavaScript compatibility loader cannot fix a connection/certificate failure before the page loads.
- **StreamEast** has a larger match list, server controls, pointer navigation and accessible-video discovery. Playback remains dependent on its players and the TV's capabilities.
- **Cinejoy** has a custom catalog, but its playback did not work on Tizen 3.

On websites, arrows move the pointer. Push against the screen's top/bottom edge to scroll. OK activates an element; holding OK opens Sofa's menu. Back opens the menu. The menu offers page history, zoom, focus/pointer navigation and video discovery. Select a text box to use the remote keyboard.

Optional remote buttons: Red opens the menu, Green changes navigation mode, Yellow finds accessible videos, Blue returns home. Play/Pause controls an accessible video; Rewind/Fast-forward seeks ten seconds when supported. Small Samsung remotes can use arrows, OK and Back without colored buttons.

**Play in Sofa** and **Play a stream** are separate generic controls for accessible direct media URLs. They attempt Samsung AVPlay when available, then HTML video. AVPlay was unavailable in the hosted page context tested on this TV. The generic path does not add HLS support to plain HTML video; Movy's companion supplies its own HLS player. Cross-origin frames need TizenBrew injection to expose their controls. This module does not copy website credentials, bypass access restrictions, convert blob URLs into downloadable streams or implement DRM licenses.

## Ad filtering and compatibility

Filtering is best-effort injected JavaScript, not a network firewall. It checks selected fetch/XHR/beacon calls and dynamically inserted resources, hides known ad containers, and blocks popups. Parser-loaded resources, service workers, nested contexts and server-side ads can escape it. If a site breaks, disable filtering for that site and reload. **Allow next pop-up** provides a one-use, 15-second exception in the current document; known blocked ad destinations remain blocked while filtering is enabled.

The shipped bundle parses as ES5 and targets Tizen 3's Chromium 47 engine. It does not upgrade the engine or supply missing codecs, TLS support, Web APIs or DRM. The optional Aether loader uses pinned core-js, SystemJS, Babel and CSS-variable compatibility libraries from jsDelivr and can be slow; it has not resolved Aether's launch failure on this TV.

Bookmarks and the Mac address use localStorage on TizenBrew's launcher origin; site filtering preferences use the site's origin. There is no analytics or central browsing-history service. The launcher uses TizenBrew's existing loopback page at `http://127.0.0.1:8081/#sofa-home`.

## Verification and development

Sofa 0.7 passed **62 unit checks and 53 controlled desktop browser checks**, including helper setup, handoff, remote navigation and 720p/1080p layouts. Helper 0.3 has separate source, streaming and Player 2 control checks. The owner previously confirmed movies and Friends S3 E3 playing on the physical UN55MU630D, plus a complete 366.378-second MPEG-TS/HLS sample. **The new Player 2 controls still require a physical-TV check.** These tests do not establish that every title plays or that a full movie has been watched reliably.

For the full source package:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
npm run preview
```

The local preview demonstrates fixtures; it cannot inject into arbitrary websites. `npm pack` creates a computer-installable npm archive, not a direct TV installer. This public repository contains the four flat release files, with `main` set to `browser.js`; the development source package uses `dist/browser.js`.

The module's own code is MIT licensed. No TizenBrew or TizenTube source was copied. Initial integration was checked against TizenBrew commit `14760a371fa5132e6f93200f3045c5bbc5a9d1ca`.

- [TizenBrew module metadata](https://github.com/reisxd/TizenBrew/blob/main/docs/MODULES.md)
- [TizenBrew setup guide](https://github.com/reisxd/TizenBrew/blob/main/docs/README.md)
- [Samsung web engine versions](https://developer.samsung.com/smarttv/develop/specifications/web-engine-specifications.html)
- [Samsung AVPlay API](https://developer.samsung.com/smarttv/develop/api-references/samsung-product-api-references/avplay-api.html)
