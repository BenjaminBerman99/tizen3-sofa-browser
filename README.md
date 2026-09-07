# Sofa Browser 0.2.0 for Tizen 3

A remote-friendly TizenBrew browser for the Samsung UN55MU630D, with a visible cursor, large event cards, an on-screen keyboard, bookmarks, best-effort ad filtering and AVPlay support.

## Install or update

In TizenBrew, open **Module Manager → Add GitHub Module** and enter:

```text
BenjaminBerman99/tizen3-sofa-browser@v0.2.0
```

Leave the field to save. Remove the old `@main` entry if present, fully close and reopen TizenBrew, then open **Sofa Browser · Tizen 3**. Confirm **Sofa 0.2.0** appears on the home screen. The version tag avoids cached older files. No npm account or always-on computer is needed.

## New in this version

- **Cursor on by default:** arrows move it, OK clicks, and pushing at the top or bottom edge scrolls. Hold OK or press Back for the browser menu.
- **StreamEast TV match list:** large cards use the event links found on the loaded page, with team names, scores, sport filters, Live only and search. Choose a card to open the original event page. Refresh matches reloads the page; displayed scores are a snapshot. Original page restores the website view. Access requirements and Premium labels remain applicable.
- **Larger websites:** StreamEast starts at 150%, other pages at 125%. Menu → Page size cycles 100–200% and saves the setting for that website.
- **Launch feedback:** opening a website shows its destination immediately. If the current page remains after 15 seconds, Sofa offers retry and return controls. Back cancels the launch. The TV's own network error page can replace Sofa's feedback.
- **Experimental Aether compatibility:** when Aether's HTML loads on a browser without native JavaScript modules, Sofa attempts to adapt its app code for the older engine. Back returns to Sofa during startup.

The Aether loader downloads pinned public libraries from jsDelivr: core-js-bundle 3.46.0, SystemJS 6.15.1, Babel standalone 7.28.4 and, if needed, css-vars-ponyfill 2.4.9. It compiles Aether's same-origin modules on the TV; website source is not included here or sent to another server. Initial loading can be slow. Startup times out after two minutes, and the site's content policies may block the attempt.

## Verification and limits

The original launcher was confirmed working on the target TV. Version 0.2.0 passed ES5 syntax checks and desktop fixture tests covering remote navigation, match links, filtering, scrolling, zoom, launch feedback, player lifecycle and the module compatibility loader. **The update's live-site startup and playback still need a physical TV check.**

Tizen 3 uses Chromium 47. The Aether loader cannot fix connection or certificate failures that leave the TV on Sofa's home screen, and does not supply every modern browser feature. DRM, codecs, logins and embedded players remain site-dependent. Ad filtering is best-effort in-page filtering; it cannot block every advertisement. Direct playback does not forward website cookies or handle DRM licenses.

Default shortcuts: https://aether.ist/ and https://v2.streameast.ga/.
