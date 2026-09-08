# Sofa Browser 0.6.0 for Tizen 3

A remote-friendly TizenBrew browser for the Samsung UN55MU630D, with an arrow cursor, large event cards, bookmarks, best-effort ad filtering and a video overlay. **Movy movies now have a dedicated home card and a separate Mac companion.**

A complete six-minute MPEG-TS/HLS sample played on this TV with an advancing clock, video and sound. The integrated Movy companion is undergoing its final Mac and TV checks; the sample does not establish that the complete interface or every movie works on the TV.

## Install or update

In TizenBrew, open **Module Manager → Add GitHub Module** and enter:

```text
BenjaminBerman99/tizen3-sofa-browser@v0.6.0
```

Leave the field to save. Remove the older Sofa entry, fully close and reopen TizenBrew, then launch Sofa. Confirm **Sofa 0.6.0** on the home screen. No npm account is needed. Movy requires the companion to remain open on the Mac while watching; ordinary browsing and the Cinejoy catalog work independently of it.

## Movy from your Mac

1. Extract the separate **sofa-movy-helper** package on an **Apple Silicon Mac** with **Node.js 20 or newer**.
2. Open **Start Movy.command**. First-time setup installs the pinned Chromium browser and FFmpeg tool inside the helper folder. Leave the window open.
3. On the TV, select **Movy** in Sofa. Enter the Mac address displayed by the helper and choose **Save and open Movy**. Both devices must be on the same home network; the companion's `settings.json` must contain the TV's current address.
4. Browse or search for a movie, open its details and select **Play movie**. Arrows move between controls, OK selects, and Back returns to the movie. Playback controls offer pause/resume and ten-second seeks.

Use **Movy settings** in Sofa if the Mac address changes. The address is saved on the local launcher. The helper uses HTTP port **8790** and accepts only the configured TV and Mac. Its dedicated card does not consume a bookmark slot or alter existing saved sites.

The Mac opens Movy's ordinary website, obtains a current 720p H.264/AAC source and converts requested fragments to MPEG-TS without reencoding. It keeps source addresses and up to **192 MiB of media caches** in memory; it does not predownload full movies or save movie files to disk. The first release supports movies, not TV episodes. Keep the helper running while watching and press **Control+C** in its window to stop it.

All 61 fragments in the six-minute sample retained their original audio/video timestamps when independently converted offline. Separately, the prepared MPEG-TS sample completed on the physical TV with video and sound. The independently converted fragments and integrated companion still need their final on-device check.

## Existing sites and video overlay

**StreamEast:** large match cards and the arrow cursor remain available. Open an event and use **Back → Play in Sofa** to choose a detected source. **Start website player, then find stream**, when offered, asks an existing player controller to start. Servers lists the site's original choices, retaining Premium labels and access requirements. Cross-origin player controls require TizenBrew injection in those frames. StreamEast playback on this TV remains unconfirmed.

The generic overlay attempts Samsung AVPlay when available, otherwise HTML video. **Native AVPlay was unavailable in the hosted page context tested on this TV.** A detected source may still need unsupported browser features, special headers or the original website session. This overlay does not provide DRM licenses or guarantee HLS support through plain HTML video. Movy uses the companion's separate HLS.js player.

**Cinejoy:** the remote-friendly catalog loads directly from Sofa using `https://lists.shegu.st/joy`, with posters from `image.tmdb.org`. Browse collections and title details with arrows, OK and Back. Each page holds up to 40 titles; search and Movies/Series filters apply to that loaded page only. The shortcut is added once when space is available, preserving existing bookmarks. Entering `https://cinejoy.to/` also opens the catalog.

**Cinejoy playback is unsupported on Tizen 3.** Its observed player needs modern browser features including WebAssembly, which [Samsung supports from Tizen 5.5](https://developer.samsung.com/smarttv/develop/extension-libraries/webassembly/overview.html). Background trailers are not treated as full movies.

**Aether still does not open on this TV**, including in its built-in browser. OPEN-01 means navigation never replaced Sofa's current page; it does not identify a certificate or connection diagnosis. The retained experimental loader cannot help until the site's HTML opens. This release does not fix Aether.

## Browsing controls and limits

Arrows move the cursor; OK selects; pushing at the screen edge scrolls. Hold OK or press Back for the menu. Page size adjusts zoom. OK enters an injected embedded frame; another OK clicks. In the generic video overlay, Left/Right choose controls and Back closes playback. Its recovery codes are PLAY-01 for native preparation failure, PLAY-02 for playback/HTML video failure and PLAY-03 for a loading or buffering timeout.

Ad filtering is best effort. Switch it off and reload if it breaks a page; injected nested players inherit the main page's setting. **Page and player diagnostics** shows bounded local errors with remote scrolling, omitting query strings, credentials and arbitrary exception values. Reports are not uploaded.

Sofa uses the TV's Chromium 47 engine and does not upgrade its certificates, codecs or browser APIs. **115 controlled Sofa checks passed: 62 unit and 53 desktop browser checks.** These use fixtures, ES5 parsing and mocked platform APIs; they are not a Samsung emulator or proof of every streaming site's compatibility.

Default saved sites remain https://aether.ist/, https://v2.streameast.ga/ and https://cinejoy.to/.
