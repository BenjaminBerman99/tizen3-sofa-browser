# Sofa Browser 0.3.0 for Tizen 3

A remote-friendly TizenBrew browser for the Samsung UN55MU630D, with a visible cursor, large event cards, a remote keyboard, bookmarks, best-effort ad filtering and AVPlay support.

## Install or update

In TizenBrew, open **Module Manager → Add GitHub Module** and enter:

```text
BenjaminBerman99/tizen3-sofa-browser@v0.3.0
```

Leave the field to save. Remove the older Sofa entry, fully close and reopen TizenBrew, then open **Sofa Browser · Tizen 3**. Confirm **Sofa 0.3.0** on the home screen. No npm account or always-on computer is needed.

## What changed

- **StreamEast player layout:** explicit player dimensions and older-browser layout rules prevent the original embedded video area from collapsing. Player pages start at 100% zoom, with their own saved size setting. The match list stays large.
- **Visible server choices:** select **Servers** for the event's actual source links, or **Go to player** to scroll to its video area. Premium labels and access requirements are preserved. Try another free server if one does not load.
- **Nested player controls:** OK enters an embedded player; the next OK clicks at the cursor. A second embedded layer may require another entry. Child cursors stay hidden before entry. Back returns to the browser menu. Video discovery and media controls now traverse injected nested frames.
- **Player ad settings:** switching ad filtering off in the page menu also changes its injected players. Reload afterward to restore blocked resources. Filtering hides the site's confirmed popup interception layer while enabled. Allow next pop-up still applies only to the top page.
- **Useful error reports:** Menu → Page and player diagnostics shows bounded local errors and video/frame state, with Earlier lines/More lines buttons for the remote. Queries, credentials, fragments and arbitrary exception values are omitted. Nothing is uploaded.

Arrows move the cursor; OK selects; pushing at the top or bottom edge scrolls. Hold OK or press Back for the menu. Page size adjusts zoom. The existing StreamEast match list has sport filters, Live only and search; scores are a snapshot of the loaded page.

## Aether status

**Aether startup remains unresolved on this TV.** This version retains the experimental compatibility loader and adds specific failure codes:

- **OPEN-01:** the website did not replace the current page; the module cannot identify a connection/certificate error from the launcher.
- **AETHER-01:** the page opened but no supported app entry was found.
- **AETHER-02:** a compatibility helper could not be downloaded.
- **AETHER-03:** the app could not start on this engine.
- **AETHER-04:** startup took longer than two minutes.

Use **Error details** and report the code or first error line. The loader starts only after Aether's HTML loads. It downloads pinned core-js-bundle 3.46.0, SystemJS 6.15.1, Babel standalone 7.28.4 and, if needed, css-vars-ponyfill 2.4.9 from jsDelivr, then adapts same-origin modules in memory. Site source is not distributed here or sent to another server. This can be slow and can be blocked by page policies.

## Verification and limits

38 core and desktop fixture checks passed, including ES5 syntax, player dimensions, original server URLs, preserved access gates, nested-frame controls, inherited ad settings, module loading and sanitized diagnostics. These tests do not establish actual live-stream playback on a Tizen 3 TV. The earlier home screen and improved match navigation were confirmed on the target TV.

Tizen 3 uses Chromium 47. An injected npm module does not upgrade its browser engine, TLS/certificates, DRM or codecs. Some websites and video providers may remain unusable. Ad filtering is best-effort in-page filtering. Direct playback does not forward website cookies or handle DRM licenses.

Default shortcuts: https://aether.ist/ and https://v2.streameast.ga/.
