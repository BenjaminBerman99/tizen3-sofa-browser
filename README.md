# Sofa Browser 0.5.0 for Tizen 3

A remote-friendly TizenBrew browser for the Samsung UN55MU630D, with an arrow cursor, large event cards, bookmarks, best-effort ad filtering and an in-app video overlay.

## Install or update

In TizenBrew, open **Module Manager → Add GitHub Module** and enter:

```text
BenjaminBerman99/tizen3-sofa-browser@v0.5.0
```

Leave the field to save. Remove the older Sofa entry, fully close and reopen TizenBrew, then launch Sofa. Confirm **Sofa 0.5.0** on the home screen. No npm account or always-on computer is needed.

## Cinejoy TV catalog

Select **Cinejoy** from Sofa’s home screen. Browse collections and large title cards with the arrows and OK; Back returns to the previous catalog view. Each page holds up to 40 titles. Search and Movies/Series filters apply to the loaded page only. The collection catalog is a subset of Cinejoy’s website, not its full search service.

The overlay loads directly from Sofa using Cinejoy’s credential-free public collection service at `https://lists.shegu.st/joy` and posters from `image.tmdb.org`. It does not need Cinejoy’s original page to start. A Cinejoy shortcut is added once if there is room in saved sites; existing entries keep their order. You can also enter `https://cinejoy.to/` in Open website.

**Cinejoy playback does not work on Tizen 3 through this overlay.** The observed website player requires modern browser features including WebAssembly, which [Samsung supports from Tizen 5.5](https://developer.samsung.com/smarttv/develop/extension-libraries/webassembly/overview.html). Title details state this limitation. The original website link is optional; no full movie is inferred from its background trailer. An interface change cannot upgrade the TV’s engine. Catalog and poster connections also still need a physical-TV check.

## Play in Sofa

Open a StreamEast event, press **Back → Play in Sofa**, and choose a detected HLS, DASH or video source. The original page and player frames remain loaded beneath the overlay. If no source is shown but **Start website player, then find stream** appears, select it to ask the existing player to start. Try another server if no usable source appears.

The chooser reads actual loaded video sources, current JW Player / Video.js source lists, and media requests exposed by the browser, including manifests associated with some in-memory videos. It does not decode obfuscated scripts, fetch hidden endpoints, invent URLs or handle DRM licenses. Cross-origin discovery requires TizenBrew injection in each player frame. Source URLs remain in memory; their signed details are not shown in labels or added to browsing history/storage by this flow.

In the overlay, **Left/Right** choose a control and **OK** selects Play/Pause, seek, Retry stream or Close player. **Back** returns to the original event. Failures keep recovery controls available. PLAY-01 means native playback failed, PLAY-02 means HTML video failed, and PLAY-03 means loading/buffering timed out. Playing is reported only after a playback event.

Keeping the page loaded does not automatically pass its cookies or referrer headers to Samsung AVPlay. A detected source may still require the original website player or unsupported DRM/codecs. No live TV playback guarantee is implied.

## Browsing controls

Arrows move the cursor; OK selects; pushing at the screen edge scrolls. Hold OK or press Back for the menu. Servers lists the event's original choices, preserving Premium labels and access requirements. OK enters an embedded player frame; another OK clicks. Page size adjusts zoom. Ad-filter settings apply to injected nested players; reload after switching filtering off to restore previously blocked resources.

Menu → Page and player diagnostics shows local errors and video/frame state. Earlier lines/More lines scroll the report. Query strings, credentials, fragments and arbitrary exception values are omitted. Reports are not uploaded.

## Aether status

**Aether remains unable to open on this TV.** OPEN-01 means the website did not replace Sofa's current page, so the compatibility loader never started. The module cannot identify the underlying connection error from the launcher. Test https://aether.ist/ in the TV's Internet app to obtain any more specific error. Recovery now ends a stalled request and focuses Back to Sofa. OPEN-02 identifies an immediately rejected navigation.

The experimental loader is retained for Aether HTML that successfully loads. AETHER-01 means no supported app entry; AETHER-02 a helper download failure; AETHER-03 app startup failure; AETHER-04 startup timeout. It downloads pinned core-js-bundle 3.46.0, SystemJS 6.15.1, Babel standalone 7.28.4 and css-vars-ponyfill 2.4.9 from jsDelivr as needed, adapting same-origin modules in memory. It can be slow or blocked by page policies. Website source is not distributed here or sent to another server.

## Compatibility

Tizen 3 uses Chromium 47. This module does not upgrade the browser engine, certificates or codecs. All 104 controlled checks passed, using ES5 parsing, desktop fixtures and mocked AVPlay; they cannot establish physical-TV streaming compatibility. Earlier home, match navigation and player layout improvements were confirmed on the target TV. Ad filtering is best effort.

Default shortcuts: https://aether.ist/, https://v2.streameast.ga/ and https://cinejoy.to/.
