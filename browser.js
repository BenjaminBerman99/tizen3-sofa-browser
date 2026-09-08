(function () {
if (window.__sofaBrowserInstalled) return;
window.__sofaBrowserInstalled = true;
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.SofaCore = factory();
}(this, function () {
    'use strict';
    var domains = [
        'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
        'adservice.google.com', 'ads.google.com', 'adnxs.com', 'adsrvr.org',
        'amazon-adsystem.com', 'advertising.com', 'criteo.com', 'criteo.net',
        'pubmatic.com', 'rubiconproject.com', 'openx.net', 'casalemedia.com',
        'moatads.com', 'scorecardresearch.com', 'quantserve.com', 'taboola.com',
        'outbrain.com', 'popads.net', 'popcash.net', 'propellerads.com',
        'adsterra.com', 'exoclick.com', 'trafficjunky.net', 'juicyads.com'
    ];
    function host(url) {
        var match = String(url || '').match(/^(?:https?:)?\/\/(?:[^\/@]*@)?(\[[^\]]+\]|[^\/:?#]+)/i);
        return match ? match[1].toLowerCase().replace(/\.$/, '') : '';
    }
    function blocked(url) {
        var h = host(url);
        for (var i = 0; i < domains.length; i++) {
            if (h === domains[i] || h.slice(-(domains[i].length + 1)) === '.' + domains[i]) return true;
        }
        return false;
    }
    function normalize(value) {
        var text = String(value || '').replace(/^\s+|\s+$/g, '');
        if (!text || text.length > 8192 || /[\x00-\x20\x7f\\]/.test(text)) return null;
        if (/^\/\//.test(text)) text = 'https:' + text;
        if (!/^https?:\/\//i.test(text)) {
            if (/^[a-z][a-z0-9+.-]*:/i.test(text) && !/^[^/:]+:\d+(?:\/|$)/.test(text)) return null;
            text = 'https://' + text;
        }
        if (!host(text) || /^https?:\/\/[^/?#]*@/i.test(text)) return null;
        return text;
    }
    function isMedia(url) { return /\.(mp4|m4v|webm|m3u8|mpd)(?:[?#]|$)/i.test(url || ''); }
    function nearest(rect, candidates, key) {
        var best = null, score = Infinity, x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
        for (var i = 0; i < candidates.length; i++) {
            var r = candidates[i].rect, dx = r.left + r.width / 2 - x, dy = r.top + r.height / 2 - y;
            var primary = key === 37 ? -dx : key === 39 ? dx : key === 38 ? -dy : dy;
            var secondary = key === 37 || key === 39 ? Math.abs(dy) : Math.abs(dx);
            if (primary <= 2) continue;
            var next = primary + secondary * 2.5;
            if (next < score) { score = next; best = candidates[i].el; }
        }
        return best;
    }
    function time(seconds) {
        if (!isFinite(seconds) || seconds < 0) return 'LIVE';
        var s = Math.floor(seconds), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
        return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s % 60 < 10 ? '0' : '') + s % 60;
    }
    return {domains: domains, host: host, blocked: blocked, normalize: normalize, isMedia: isMedia, nearest: nearest, time: time};
}));

var SOFA_CSS = ".sofa-root { all: initial; position: fixed; z-index: 2147483646; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; font-family: Arial, Helvetica, sans-serif; color: #eef2f5; font-size: 22px; line-height: 1.5; text-align: left; }\n.sofa-root * { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }\n.sofa-root h1,.sofa-root h2,.sofa-root p { padding: 0; margin: 0; color: inherit; }\n.sofa-root h1 { font-size: 42px; font-weight: 500; line-height: 1.15; letter-spacing: -1px; }\n.sofa-root h2 { font-size: 24px; font-weight: 500; }\n.sofa-panel { pointer-events: auto; position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: 55px 6%; background: #0c1119; overflow-y: auto; }\n.sofa-dialog-head { margin-bottom: 28px; }\n.sofa-dialog-head h1 { margin: 12px 0 16px; }\n.sofa-eyebrow { color: #99a4b2; font-size: 13px; letter-spacing: 2px; font-weight: bold; }\n.sofa-muted { color: #96a1b0 !important; font-size: 17px; line-height: 1.6; }\n.sofa-button { all: initial; display: inline-block; box-sizing: border-box; cursor: pointer; pointer-events: auto; font: 20px/1.35 Arial, Helvetica, sans-serif; text-align: center; border: 2px solid #293341; border-radius: 10px; padding: 16px 23px; margin: 0 12px 12px 0; color: #edf2f6; background: #18212d; min-height: 60px; vertical-align: middle; transition: background-color .12s, border-color .12s; }\n.sofa-button:focus,.sofa-input:focus,.sofa-keyboard-display:focus { outline: 3px solid #a9f3d0 !important; outline-offset: 4px; border-color: #a9f3d0; background-color: #243c3a; }\n.sofa-button:hover { border-color: #a9f3d0; }\n.sofa-primary { background: #b3f1d3; color: #10221e; border-color: #b3f1d3; font-weight: bold; }\n.sofa-primary:focus { color: #0c211a; background: #ccffe7; }\n.sofa-secondary { color: #aeb9c6; }\n.sofa-row { display: flex; flex-wrap: wrap; align-items: center; margin-top: 22px; }\n.sofa-input { display: block; width: 100%; padding: 20px 25px; font-size: 26px; color: #edf2f6; background: #141e2a; border: 2px solid #3c4858; border-radius: 10px; margin-bottom: 24px; }\n.sofa-list { max-width: 1100px; }\n.sofa-list .sofa-button { display: block; width: 100%; text-align: left; overflow-wrap: break-word; word-wrap: break-word; }\n.sofa-menu-grid { display: flex; flex-wrap: wrap; margin-bottom: 22px; }\n.sofa-menu-grid .sofa-button { width: 31%; margin-bottom: 18px; text-align: left; font-size: 19px; }\n.sofa-home { padding: 0; display: flex !important; }\n.sofa-sidebar { flex: 0 0 235px; width: 235px; border-right: 1px solid #242b35; padding: 45px 26px; position: relative; }\n.sofa-brand-mark { display: inline-block; width: 45px; height: 45px; text-align: center; border: 2px solid #b3f1d3; border-radius: 15px; color: #b3f1d3; font-size: 33px; line-height: 35px; margin-right: 10px; vertical-align: middle; }\n.sofa-brand { display: inline-block; font-size: 39px; font-weight: bold; letter-spacing: -2px; vertical-align: middle; }\n.sofa-brand-sub { font-size: 9px; letter-spacing: 1.7px; color: #788492; margin: 16px 0 60px; }\n.sofa-nav { width: 100%; text-align: left; font-size: 17px; border: 1px solid transparent; background: transparent; padding: 16px 12px; margin: 0 0 10px; min-height: 54px; color: #96a1ae; }\n.sofa-selected { color: #b3f1d3; background: #172e2a; border-color: #29433b; }\n.sofa-device { white-space: pre-line; font-size: 12px; line-height: 1.9; position: absolute; bottom: 35px; left: 38px; color: #748292; }\n.sofa-main { flex: 1; min-width: 0; padding: 42px 48px 28px; }\n.sofa-home-top { display: flex; justify-content: space-between; align-items: center; }\n.sofa-pill { font-size: 12px; color: #b3f1d3; border: 1px solid #35443e; border-radius: 30px; padding: 8px 14px; background: #16261f; }\n.sofa-hero { display: flex; position: relative; height: 275px; margin: 32px 0 12px; align-items: center; }\n.sofa-hero-copy { width: 65%; z-index: 1; }\n.sofa-hero h1 { font-size: 62px; line-height: 1.02; font-weight: 500; letter-spacing: -2.6px; }\n.sofa-accent { color: #b3f1d3 !important; }\n.sofa-intro { color: #96a1af !important; font-size: 17px; line-height: 1.7; margin-top: 22px !important; white-space: pre-line; }\n.sofa-remote-art { position: relative; flex: 1; height: 260px; }\n.sofa-orbit { width: 260px; height: 260px; position: absolute; top: -5px; left: -14px; border-radius: 50%; border: 1px solid #2a403c; background: radial-gradient(ellipse at center, #224237 0%, #16251f 38%, #0c1119 70%); }\n.sofa-orbit:after { content: ''; position: absolute; top: 35px; left: 35px; right: 35px; bottom: 35px; border: 1px solid #294039; border-radius: 50%; }\n.sofa-remote { position: absolute; left: 68px; top: -10px; width: 92px; height: 236px; border-radius: 38px; transform: rotate(19deg); background: linear-gradient(110deg, #44514f, #222d2d 40%, #151e20 100%); box-shadow: -8px 12px 35px rgba(0,0,0,.4); border: 2px solid #50605a; }\n.sofa-remote i { position: absolute; top: 20px; left: 38px; width: 11px; height: 11px; border-radius: 100%; border: 2px solid #b3f1d3; }\n.sofa-dpad { position: absolute; top: 55px; left: 12px; width: 64px; height: 64px; border-radius: 100%; border: 1px solid #668075; background: #263d34; text-align: center; font-size: 11px; line-height: 16px; }\n.sofa-dpad b { display: block; font-size: 12px; line-height: 29px; color: #b3f1d3; }\n.sofa-remote-keys { position: absolute; top: 135px; left: 18px; color: #a8b9b2; font-size: 19px; }\n.sofa-remote-line { position: absolute; top: 183px; left: 31px; width: 24px; height: 3px; border-radius: 5px; background: #52655d; }\n.sofa-art-label { position: absolute; bottom: 0; width: 250px; text-align: center; font-size: 8px; letter-spacing: 1.4px; color: #73877d; }\n.sofa-address-launch { width: 100%; display: flex; align-items: center; text-align: left; background: #151e28; padding: 20px 25px; margin: 0; font-size: 20px; border-color: #45584f; border-radius: 12px; }\n.sofa-address-icon { color: #b3f1d3; font-size: 25px; margin-right: 18px; }\n.sofa-address-hint { font-size: 12px; color: #93a097; margin-left: auto; padding-left: 15px; }\n.sofa-section-label { display: flex; align-items: center; justify-content: space-between; margin: 30px 0 20px; }\n.sofa-section-label .sofa-muted { font-size: 9px; letter-spacing: 1.4px; }\n.sofa-cards { display: flex; }\n.sofa-card, .sofa-movy-card { flex: 1; display: block; min-width: 0; height: 147px; text-align: left; padding: 19px; background: #192026; border-color: #2f3c43; margin-right: 15px; }\n.sofa-card:last-child { margin-right: 0; }\n.sofa-card-symbol { display: block; color: #b3f1d3; font-size: 26px; margin-bottom: 15px; line-height: 1; }\n.sofa-card strong, .sofa-movy-card strong { display: block; font-size: 18px; margin-bottom: 6px; }\n.sofa-card small, .sofa-movy-card small { display: block; font-size: 11px; color: #84919e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.sofa-card-0 { background: linear-gradient(130deg, #253433, #172127); }\n.sofa-card-1 { background: linear-gradient(130deg, #282d40, #181e2c); }\n.sofa-card-1 .sofa-card-symbol { color: #bcbdf5; }\n.sofa-movy-card { background: linear-gradient(130deg, #223a4b, #162331); }\n.sofa-movy-card .sofa-card-symbol { color: #a6dcff; }\n.sofa-card-2 { background: linear-gradient(130deg, #39342b, #211f20); }\n.sofa-add-card { background: transparent; border-style: dashed; }\n.sofa-add-card .sofa-card-symbol { color: #93a09c; }\n.sofa-home-footer { display: flex; justify-content: space-between; margin-top: 29px; padding-top: 20px; border-top: 1px solid #242c37; font-size: 11px; color: #acb7c0; }\n.sofa-home-footer .sofa-muted { font-size: 11px; }\n.sofa-keyboard { pointer-events: auto; position: absolute; z-index: 8; bottom: 3%; left: 10%; width: 80%; background: #121c29; border: 2px solid #43574f; border-radius: 20px; padding: 24px 30px; box-shadow: 0 0 0 2000px rgba(0,0,0,.65); }\n.sofa-keyboard-display { display: block; background: #0a1018; color: #eef2f5; border: 1px solid #50615b; border-radius: 8px; width: 100%; padding: 12px 18px; font-size: 26px; margin: 10px 0 20px; }\n.sofa-key-row { display: flex; margin-bottom: 9px; }\n.sofa-key { flex: 1; padding: 8px 0; margin: 0 8px 0 0; min-height: 40px; font-size: 21px; border-radius: 7px; }\n.sofa-key:last-child { margin-right: 0; }\n.sofa-keyboard .sofa-row { margin-top: 16px; }\n.sofa-keyboard .sofa-row .sofa-button { flex: 1; padding: 10px 8px; font-size: 17px; min-height: 42px; margin-bottom: 0; }\n.sofa-toast { pointer-events: none; display: none; position: absolute; bottom: 6%; left: 15%; width: 70%; padding: 18px 26px; border: 1px solid #587666; color: #ebfff4; background: #1b3029; border-radius: 12px; text-align: center; z-index: 10; font-size: 21px; }\n.sofa-cursor { pointer-events: none; position: absolute; display: none; z-index: 20; width: 36px; height: 46px; margin: 0; filter: drop-shadow(0 2px 3px #000); }\n.sofa-cursor svg,.sofa-cursor path { pointer-events: none; }\n.sofa-cursor-link svg path { fill: #ffffff; }\n.sofa-pointer-target { outline: 3px solid #b3ffd7 !important; outline-offset: 3px !important; }\n.sofa-hud { pointer-events: auto; position: absolute; display: none; z-index: 4; right: 30px; bottom: 18px; padding: 8px 12px 8px 18px; background: rgba(10,24,20,.95); border: 1px solid #5e8975; border-radius: 10px; color: #e1f9eb; }\n.sofa-hud-label { font-size: 17px; margin-right: 16px; }\n.sofa-hud .sofa-button { min-height: 34px; font-size: 16px; padding: 8px 12px; margin: 0; }\n.sofa-loading-message { padding: 28px 0; font-size: 26px; max-width: 1000px; line-height: 1.5; }\n.sofa-error-report { white-space: pre-wrap; word-wrap: break-word; font: 20px/1.6 Arial,sans-serif; color: #eef2f5; background: #17222e; padding: 20px; margin: 20px 0; border: 1px solid #3e6169; }\n.sofa-details { padding: 28px 4%; }\n.sofa-details .sofa-dialog-head { margin-bottom: 12px; }\n.sofa-details .sofa-dialog-head h1 { font-size: 34px; margin: 8px 0; }\n.sofa-details .sofa-row { margin-top: 12px; }\n.sofa-details .sofa-error-report { height: calc(100vh - 330px); min-height: 150px; overflow-y: auto; margin-top: 4px; }\n.sofa-streams { padding: 32px 4% 80px; overflow: hidden; }\n.sofa-streams .sofa-dialog-head { margin-bottom: 10px; }\n.sofa-streams .sofa-dialog-head h1 { margin: 6px 0; }\n.sofa-streams .sofa-dialog-head .sofa-muted { font-size: 20px; }\n.sofa-streams .sofa-row { margin-top: 10px; }\n.sofa-streams .sofa-row .sofa-button,.sofa-stream-tabs .sofa-button { min-height: 44px; padding: 10px 15px; font-size: 18px; }\n.sofa-stream-tabs { white-space: nowrap; overflow-x: auto; padding: 6px; margin: 0 -6px 12px; }\n.sofa-stream-list { display: flex; flex-wrap: wrap; align-content: flex-start; overflow-y: auto; height: calc(100vh - 360px); padding: 8px; margin: -8px; }\n.sofa-match { display: block; width: calc(50% - 16px); min-height: 160px; text-align: left; padding: 22px 25px; margin: 8px; background: #1b303c; border-color: #3e6169; }\n.sofa-match-meta { display: block; font-size: 16px; color: #b3f1d3; margin-bottom: 12px; }\n.sofa-match-title { display: block; font-size: 27px; line-height: 1.3; white-space: normal; }\n.sofa-match-footer { display: block; font-size: 19px; color: #bccbd5; margin-top: 14px; }\n@media (min-width: 1600px) { .sofa-streams { padding: 45px 5% 80px; } .sofa-stream-list { height: calc(100vh - 390px); } .sofa-match { min-height: 205px; padding: 30px; } .sofa-match-title { font-size: 35px; } .sofa-match-meta { font-size: 20px; } .sofa-match-footer { font-size: 24px; } }\n.sofa-page-focus { outline: 4px solid #73f3b7 !important; outline-offset: 4px !important; box-shadow: 0 0 0 7px rgba(12,30,21,.7) !important; }\n/* The event page's grid, var() minimum height and inset collapse on Chromium 47.\n   Keep the original player, source links and access notices in their document. */\nhtml.sofa-player-page,html.sofa-player-page body { height: auto !important; min-height: 100% !important; overflow-y: auto !important; background: #0c1119 !important; color: #eef2f5 !important; }\n.sofa-player-page .streameast-video-page,.sofa-player-page .se-video { display: block !important; height: auto !important; max-height: none !important; overflow: visible !important; }\n.sofa-player-page .se-video { padding: 12px 24px 100px !important; }\n.sofa-player-page .se-layout,.sofa-player-page .se-main { display: block !important; width: 100% !important; height: auto !important; max-height: none !important; min-width: 0 !important; overflow: visible !important; }\n.sofa-player-page #se-streams-list { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; list-style: none !important; padding: 8px !important; margin: 0 0 12px !important; }\n.sofa-player-page #se-streams-list .se-stream { display: block !important; flex: 0 0 auto !important; margin: 0 12px 8px 0 !important; border: 2px solid #3e6169 !important; border-radius: 8px !important; background: #1b303c !important; }\n.sofa-player-page #se-streams-list .se-stream__link { display: block !important; font: 24px/1.35 Arial,sans-serif !important; padding: 16px 22px !important; color: #eef2f5 !important; }\n.sofa-player-page #se-streams-list .se-stream.is-active { border-color: #b3f1d3 !important; }\n.sofa-player-page #se-streams-list .se-stream.is-pro .se-stream__link:after { content: ' · Premium'; color: #f6d684; font-size: 18px; }\n.sofa-player-page .se-board { display: block !important; height: auto !important; min-height: 0 !important; padding: 12px !important; background: #18212d !important; color: #eef2f5 !important; }\n.sofa-player-page .se-board__row { display: flex !important; align-items: center !important; justify-content: space-between !important; }\n.sofa-player-page .se-board__side { display: flex !important; align-items: center !important; width: 38% !important; }\n.sofa-player-page .se-board__crest { width: 48px !important; height: 48px !important; margin-right: 14px !important; }\n.sofa-player-page .se-board__crest img { max-width: 48px !important; max-height: 48px !important; }\n.sofa-player-page .se-board__name { color: #eef2f5 !important; font: bold 24px/1.3 Arial,sans-serif !important; }\n.sofa-player-page .se-board__name-mob { display: none !important; }\n.sofa-player-page #se-player-root { position: relative !important; display: block !important; width: 100% !important; height: 65vh !important; min-height: 360px !important; max-height: none !important; background: #000 !important; border-radius: 0 !important; overflow: hidden !important; }\n.sofa-player-page #se-player-root[data-state=\"live\"] > iframe,.sofa-player-page #se-player-root[data-state=\"live\"] > video,.sofa-player-page #se-player-root[data-state=\"live\"] #VideoFrame { position: absolute !important; top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; display: block !important; width: 100% !important; height: 100% !important; min-height: 0 !important; border: 0 !important; }\n.sofa-player-page #chat-container { display: block !important; width: 100% !important; height: 320px !important; margin-top: 18px !important; }\n.sofa-player-page #live-chat-iframe { width: 100% !important; height: 260px !important; }\n.sofa-player-page #se-player-root:-webkit-full-screen { height: 100vh !important; }\n.sofa-player-page #se-player-root:fullscreen { height: 100vh !important; }\n.sofa-player-page #se-player-root:not([data-state=\"live\"]) { height: auto !important; overflow: visible !important; }\n.sofa-guide p { font-size: 20px; margin: 0 0 16px; color: #abb8c4; }\n.sofa-guide b { color: #b3f1d3; }\n.sofa-diagnostics { font-size: 13px; color: #929fab !important; white-space: pre-line; padding: 18px; border: 1px solid #303c49; border-radius: 8px; margin: 20px 0 !important; word-break: break-word; }\n.sofa-guide + .sofa-muted { margin: 20px 0; }\n.sofa-player { pointer-events: auto; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; }\n.sofa-player-surface,.sofa-av-object,.sofa-html-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }\n.sofa-root .sofa-player-surface,.sofa-root .sofa-av-object,.sofa-root .sofa-html-video { display: block; z-index: 1; visibility: visible; opacity: 1; }\n.sofa-root .sofa-av-object { background: transparent; }\n.sofa-player-controls { position: absolute; z-index: 2; bottom: 0; left: 0; width: 100%; padding: 20px 5% 22px; background: linear-gradient(transparent, rgba(0,0,0,.88)); }\n.sofa-player-status { font-size: 22px; }\n.sofa-player-controls p { color: #b4c0cb; font-size: 15px; }\n@media (max-height: 760px) { .sofa-main { padding-top: 30px; } .sofa-hero { height: 210px; margin-top: 18px; } .sofa-remote-art { transform: scale(.8); transform-origin: center; } .sofa-section-label { margin-top: 22px; margin-bottom: 16px; } .sofa-card, .sofa-movy-card { height: 128px; padding: 15px 19px; } .sofa-card-symbol { margin-bottom: 10px; } .sofa-home-footer { margin-top: 17px; padding-top: 15px; } .sofa-keyboard { padding: 18px 25px; } .sofa-keyboard-display { font-size: 23px; margin-bottom: 16px; } }\n@media (min-width: 1600px) { .sofa-sidebar { flex-basis: 300px; width: 300px; padding: 65px 40px; } .sofa-main { padding: 65px 70px 35px; } .sofa-hero { height: 390px; margin: 45px 0 24px; } .sofa-hero h1 { font-size: 88px; } .sofa-intro { font-size: 23px; } .sofa-remote-art { transform: scale(1.3); transform-origin: center; margin-left: 70px; } .sofa-address-launch { padding: 29px 32px; font-size: 28px; } .sofa-address-hint { font-size: 18px; } .sofa-section-label { margin-top: 45px; } .sofa-card, .sofa-movy-card { height: 195px; padding: 28px; } .sofa-card strong, .sofa-movy-card strong { font-size: 24px; } .sofa-card small, .sofa-movy-card small { font-size: 16px; } .sofa-card-symbol { font-size: 34px; margin-bottom: 24px; } .sofa-nav { font-size: 22px; margin-bottom: 20px; } .sofa-device { font-size: 16px; } .sofa-home-footer { font-size: 16px; margin-top: 40px; } .sofa-home-footer .sofa-muted { font-size: 15px; } .sofa-keyboard { width: 70%; left: 15%; padding: 35px; } .sofa-key { min-height: 65px; font-size: 28px; } }\n@media (max-width: 1050px) { .sofa-sidebar { flex-basis: 180px; width: 180px; padding: 25px 15px; } .sofa-main { padding: 28px; } .sofa-brand-sub { margin-bottom: 28px; } .sofa-hero h1 { font-size: 46px; } .sofa-hero { height: 220px; } .sofa-remote-art { transform: scale(.75); transform-origin: left center; } .sofa-intro { font-size: 13px; } .sofa-device { left: 22px; font-size: 10px; } .sofa-address-hint { display: none; } .sofa-card, .sofa-movy-card { height: 125px; padding: 14px; } .sofa-home-footer { margin-top: 20px; } .sofa-pill { font-size: 10px; } .sofa-home-top .sofa-eyebrow { font-size: 10px; } }\n\n.sofa-panel.sofa-cinejoy { display: flex; flex-direction: column; padding: 30px 4%; overflow: hidden; }\n.sofa-cinejoy .sofa-dialog-head { flex: 0 0 auto; margin-bottom: 8px; }\n.sofa-cinejoy .sofa-dialog-head h1 { font-size: 36px; margin: 5px 0 8px; line-height: 1.15; }\n.sofa-cinejoy .sofa-dialog-head p { font-size: 18px; margin: 0; line-height: 1.35; }\n.sofa-cinejoy .sofa-row { flex: 0 0 auto; margin-top: 8px; }\n.sofa-cinejoy .sofa-row .sofa-button { min-height: 48px; font-size: 18px; padding: 10px 16px; margin-bottom: 10px; }\n.sofa-cinejoy .sofa-button:disabled { opacity: .4; cursor: default; }\n.sofa-cinejoy-scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 10px 10px 20px; margin: 2px -10px 0; }\n.sofa-cinejoy-collections,.sofa-cinejoy-items { display: flex; flex-wrap: wrap; align-content: flex-start; align-items: flex-start; }\n.sofa-cinejoy .sofa-cinejoy-collection { flex: 0 0 calc(33.333% - 16px); display: block; text-align: left; margin: 0 16px 18px 0; padding: 22px; height: 190px; overflow: hidden; }\n.sofa-cinejoy-collection strong { display: block; font-size: 26px; line-height: 1.15; margin-bottom: 14px; }\n.sofa-cinejoy-collection span { display: block; font-size: 17px; color: #b5c1cd; max-height: 45px; overflow: hidden; }\n.sofa-cinejoy-collection small { display: block; margin-top: 14px; font-size: 16px; color: #b3f1d3; }\n.sofa-cinejoy .sofa-cinejoy-title { flex: 0 0 calc(50% - 16px); display: flex; align-items: center; text-align: left; margin: 0 16px 18px 0; padding: 14px; height: 168px; overflow: hidden; }\n.sofa-cinejoy-poster { position: relative; flex: 0 0 88px; width: 88px; height: 132px; display: block; overflow: hidden; background: #263342; border-radius: 6px; }\n.sofa-cinejoy-placeholder { position: absolute; width: 100%; height: 100%; text-align: center; top: 0; left: 0; padding-top: 45%; color: #91a8b8; font-size: 28px; }\n.sofa-cinejoy-poster img,.sofa-cinejoy-detail-poster img { position: absolute; display: block; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }\n.sofa-cinejoy-title-copy { display: block; flex: 1 1 auto; min-width: 0; margin-left: 20px; }\n.sofa-cinejoy-title-copy strong { display: block; font-size: 25px; line-height: 1.2; max-height: 61px; overflow: hidden; word-wrap: break-word; }\n.sofa-cinejoy-meta { display: block; margin-top: 10px; font-size: 18px; color: #b5c1cd; }\n.sofa-cinejoy-title-copy small { display: block; margin-top: 10px; font-size: 16px; color: #b3f1d3; }\n.sofa-cinejoy-detail { display: flex; align-items: flex-start; }\n.sofa-cinejoy-detail-poster { position: relative; display: block; flex: 0 0 230px; width: 230px; height: 345px; overflow: hidden; border-radius: 9px; background: #263342; }\n.sofa-cinejoy-detail-copy { min-width: 0; flex: 1 1 auto; margin-left: 35px; }\n.sofa-cinejoy .sofa-cinejoy-limitation { color: #f3d6a7; border-left: 4px solid #d8ae6c; padding: 5px 0 5px 20px; margin: 0 0 26px; font-size: 24px; line-height: 1.45; }\n.sofa-cinejoy .sofa-cinejoy-synopsis { font-size: 22px; line-height: 1.55; white-space: normal; }\n.sofa-cinejoy-note { font-size: 24px; line-height: 1.5; max-width: 900px; }\n@media (min-width: 1600px) { .sofa-panel.sofa-cinejoy { padding: 45px 5%; } .sofa-cinejoy .sofa-dialog-head h1 { font-size: 48px; } .sofa-cinejoy .sofa-dialog-head p { font-size: 23px; } .sofa-cinejoy .sofa-row .sofa-button { font-size: 23px; min-height: 62px; } .sofa-cinejoy .sofa-cinejoy-title { height: 215px; padding: 20px; } .sofa-cinejoy-poster { flex-basis: 110px; width: 110px; height: 165px; } .sofa-cinejoy-title-copy strong { font-size: 31px; max-height: 76px; } .sofa-cinejoy-meta { font-size: 23px; } .sofa-cinejoy-title-copy small { font-size: 20px; } .sofa-cinejoy .sofa-cinejoy-collection { height: 230px; } .sofa-cinejoy-collection strong { font-size: 32px; } .sofa-cinejoy-collection span { font-size: 21px; max-height: 55px; } .sofa-cinejoy-collection small { font-size: 21px; } }\n";
/* The Mac helper owns its page, player and remote controls. */
function SofaHelper() {
    'use strict';
    var pagePath = '/sofa-movy/';
    function normalizeOrigin(value) {
        if (typeof value !== 'string') return null;
        var text = value.replace(/^\s+|\s+$/g, ''), match, parts, i;
        if (!text || text.length > 128 || /[\x00-\x20\x7f\\]/.test(text)) return null;
        match = /^(?:http:\/\/)?((?:0|[1-9][0-9]{0,2})\.(?:0|[1-9][0-9]{0,2})\.(?:0|[1-9][0-9]{0,2})\.(?:0|[1-9][0-9]{0,2}))(?::8790)?\/?$/i.exec(text);
        if (!match) return null;
        parts = match[1].split('.');
        for (i = 0; i < parts.length; i++) { parts[i] = Number(parts[i]); if (parts[i] > 255) return null; }
        if (!(parts[0] === 10 || parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31 || parts[0] === 192 && parts[1] === 168)) return null;
        return 'http://' + parts.join('.') + ':8790';
    }
    function launchURL(value) {
        var origin = normalizeOrigin(value);
        return origin ? origin + pagePath : null;
    }
    function isPage(value) {
        if (typeof value !== 'string' || /[\x00-\x20\x7f\\]/.test(value)) return false;
        var match = /^(http:\/\/[^/?#]+)(\/[^?#]*)(?:[?#].*)?$/i.exec(value);
        return !!(match && match[2] === pagePath && normalizeOrigin(match[1]) === match[1].toLowerCase());
    }
    return {normalizeOrigin: normalizeOrigin, launchURL: launchURL, isPage: isPage};
}
if (typeof module === 'object' && module.exports) module.exports = SofaHelper;

/* Deliberately small first-party rule set. No remote filter downloads. */
function SofaBlocker(core, enabled, notify) {
    'use strict';
    var state = {enabled: enabled, count: 0, popups: 0, allowNextPopup: false};
    var cosmetic = null;
    function reject(url) {
        if (!state.enabled || !core.blocked(url)) return false;
        state.count++;
        return true;
    }
    var originalOpen = window.open;
    window.open = function (url) {
        if (state.allowNextPopup) {
            state.allowNextPopup = false;
            var safe = absolute(url);
            if (safe && !reject(safe)) window.location.href = safe;
            return null;
        }
        if (state.enabled) { state.popups++; if (notify) notify('Pop-up stopped. Use “Allow next pop-up” if the player needs it.'); return null; }
        return originalOpen.apply(window, arguments);
    };
    function absolute(value) {
        var a = document.createElement('a');
        a.href = String(value || '');
        return core.normalize(a.href);
    }
    if (window.fetch) {
        var originalFetch = window.fetch;
        window.fetch = function (input) {
            if (reject(typeof input === 'string' ? absolute(input) : input && input.url)) return Promise.reject(new TypeError('Blocked by Sofa Browser'));
            return originalFetch.apply(this, arguments);
        };
    }
    if (window.XMLHttpRequest) {
        var originalXHROpen = XMLHttpRequest.prototype.open, originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url) {
            this.__sofaURL = absolute(url);
            return originalXHROpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function () {
            if (reject(this.__sofaURL)) {
                var xhr = this;
                xhr.abort();
                setTimeout(function () {
                    try { xhr.dispatchEvent(new Event('error')); xhr.dispatchEvent(new Event('loadend')); } catch (ignore) {}
                }, 0);
                return;
            }
            return originalSend.apply(this, arguments);
        };
    }
    if (navigator.sendBeacon) {
        var originalBeacon = navigator.sendBeacon;
        try { navigator.sendBeacon = function (url) { return reject(absolute(url)) ? false : originalBeacon.apply(navigator, arguments); }; } catch (ignore) {}
    }
    function resource(el, name, value) {
        if (!el || !el.tagName) return false;
        return ((name === 'src' && /^(SCRIPT|IFRAME|IMG|SOURCE|VIDEO|AUDIO)$/.test(el.tagName)) ||
            (name === 'href' && el.tagName === 'LINK')) && reject(absolute(value));
    }
    var originalAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (resource(this, String(name).toLowerCase(), value)) return;
        return originalAttribute.apply(this, arguments);
    };
    function wrapSetter(constructor, prop) {
        if (!constructor) return;
        var proto = constructor.prototype, descriptor = Object.getOwnPropertyDescriptor(proto, prop);
        if (!descriptor || !descriptor.set || !descriptor.configurable) return;
        try {
            Object.defineProperty(proto, prop, {
                configurable: true, enumerable: descriptor.enumerable, get: descriptor.get,
                set: function (value) { if (!resource(this, prop, value)) descriptor.set.call(this, value); }
            });
        } catch (ignore) {}
    }
    wrapSetter(window.HTMLScriptElement, 'src');
    wrapSetter(window.HTMLIFrameElement, 'src');
    wrapSetter(window.HTMLImageElement, 'src');
    wrapSetter(window.HTMLLinkElement, 'href');
    function clean(node) {
        if (!node || !node.querySelectorAll) return;
        var list = [node], children = node.querySelectorAll('script[src],iframe[src],img[src],link[href]');
        for (var i = 0; i < children.length; i++) list.push(children[i]);
        for (var j = 0; j < list.length; j++) {
            var el = list[j];
            if (!el.getAttribute) continue;
            var attr = el.tagName === 'LINK' ? 'href' : 'src';
            if (resource(el, attr, el.getAttribute(attr))) {
                el.removeAttribute(attr);
                if (el.tagName === 'SCRIPT') originalAttribute.call(el, 'type', 'text/sofa-blocked');
                if (el.tagName === 'IFRAME' || el.tagName === 'IMG') el.style.setProperty('display', 'none', 'important');
            }
        }
    }
    var append = Node.prototype.appendChild, insert = Node.prototype.insertBefore, replace = Node.prototype.replaceChild;
    Node.prototype.appendChild = function (node) { if (state.enabled) clean(node); return append.apply(this, arguments); };
    Node.prototype.insertBefore = function (node) { if (state.enabled) clean(node); return insert.apply(this, arguments); };
    Node.prototype.replaceChild = function (node) { if (state.enabled) clean(node); return replace.apply(this, arguments); };
    function style() {
        if (!document.documentElement) return;
        if (!cosmetic) {
            cosmetic = document.createElement('style');
            cosmetic.textContent = 'ins.adsbygoogle,[id^="google_ads_iframe"],[id^="div-gpt-ad"],.taboola,.' + 'OUTBRAIN,[data-ad-slot],[data-ad-client],#se-pv-catch{display:none!important}';
            document.documentElement.appendChild(cosmetic);
        }
        cosmetic.disabled = !state.enabled;
    }
    var pending = [], timer = null;
    function observe() {
        style();
        if (!window.MutationObserver || !document.documentElement) return;
        new MutationObserver(function (records) {
            if (!state.enabled) return;
            for (var i = 0; i < records.length; i++) {
                if (records[i].type === 'attributes') pending.push(records[i].target);
                else for (var j = 0; j < records[i].addedNodes.length; j++) pending.push(records[i].addedNodes[j]);
            }
            if (!timer && pending.length) timer = setTimeout(function () {
                var batch = pending; pending = []; timer = null;
                for (var k = 0; k < batch.length; k++) clean(batch[k]);
            }, 80);
        }).observe(document.documentElement, {childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'href']});
    }
    if (document.documentElement) observe();
    else document.addEventListener('DOMContentLoaded', observe);
    document.addEventListener('click', function (event) {
        var el = event.target;
        while (el && el.tagName !== 'A') el = el.parentElement;
        if (!el || !el.href) return;
        if (reject(el.href)) { event.preventDefault(); event.stopImmediatePropagation(); return; }
        // Keep user-selected links in this debugged tab so controls survive navigation.
        if (el.target && el.target !== '_self' && el.target !== '_parent' && el.target !== '_top') el.target = '_self';
    }, true);
    state.setEnabled = function (value) { state.enabled = value; style(); };
    return state;
}

function SofaPlayer(core, status) {
    'use strict';
    var av = null, video = null, layer = null, active = false, generation = 0, timer = null, playRequest = 0;
    var phase = 'idle', engine = '', errorCode = '';
    function current(id) { return active && id === generation; }
    function update(next, message) { phase = next; status(message); }
    function reason(error) {
        // Only emit fixed descriptions. AVPlay errors can include signed URLs or headers.
        var text = String(error && (error.name || '') || '') + ' ' + String(error && error.message || error || '');
        if (/unsupported.*codec|codec.*(?:not.supported|unsupported)|NOT_SUPPORTED_(?:VIDEO|AUDIO)_CODEC/i.test(text)) return 'Unsupported codec';
        if (/codec|decode/i.test(text)) return 'The TV could not decode this stream';
        if (/NOT_SUPPORTED|NotSupported|unsupported.*format/i.test(text)) return 'Unsupported media format';
        if (/CONNECTION|NETWORK|NetworkError/i.test(text)) return 'The stream connection failed';
        if (/SecurityError|PERMISSION|AUTHENTICATION/i.test(text)) return 'This player was not allowed to access the stream';
        if (/NotAllowedError/i.test(text)) return 'Playback needs a Play button press';
        return 'The stream could not play';
    }
    function close() {
        generation++; playRequest++;
        active = false;
        clearTimeout(timer); timer = null;
        if (av) {
            try { var s = av.getState(); if (s === 'PLAYING' || s === 'PAUSED' || s === 'READY') av.stop(); } catch (ignore) {}
            try { av.close(); } catch (ignore2) {}
        }
        if (video) {
            video.onplaying = video.onwaiting = video.onended = video.onerror = video.onpause = null;
            try { video.pause(); video.removeAttribute('src'); video.load(); } catch (ignore3) {}
        }
        if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
        av = null; video = null; layer = null; phase = 'idle'; engine = ''; errorCode = '';
    }
    function fail(id, code, message) {
        if (!current(id)) return;
        var previousEngine = engine;
        close(); engine = previousEngine; errorCode = code;
        update('error', code + ': ' + message + '. Try another stream or return to the website player.');
    }
    function ended(id) {
        if (!current(id)) return;
        var previousEngine = engine;
        close(); engine = previousEngine;
        update('ended', 'Stream ended. Press Back to return to the website.');
    }
    function waitForPlayback(id) {
        clearTimeout(timer);
        timer = setTimeout(function () { fail(id, 'PLAY-03', 'The stream did not start or resume within 30 seconds'); }, 30000);
    }
    function playing(id) {
        if (!current(id)) return;
        clearTimeout(timer); timer = null;
        if (phase !== 'playing') update('playing', 'Playing · ' + engine);
    }
    function loadAPI(done) {
        if (window.webapis && window.webapis.avplay) { done(window.webapis.avplay); return; }
        if (!window.tizen) { done(null); return; }
        var script = document.createElement('script'), finished = false, timeout;
        function finish() {
            if (finished) return; finished = true; clearTimeout(timeout);
            script.onload = script.onerror = null;
            done(window.webapis && window.webapis.avplay ? window.webapis.avplay : null);
        }
        script.onload = finish; script.onerror = finish;
        script.src = '$WEBAPIS/webapis/webapis.js';
        timeout = setTimeout(finish, 2500);
        (document.head || document.documentElement).appendChild(script);
    }
    function startHTML(id) {
        if (!current(id) || !video) return;
        var request = ++playRequest;
        update('loading', 'Starting playback…'); waitForPlayback(id);
        try {
            var promise = video.play();
            if (promise && promise.catch) promise.catch(function (error) {
                if (!current(id) || request !== playRequest || phase === 'playing') return;
                if (error && error.name === 'NotAllowedError') {
                    clearTimeout(timer); timer = null;
                    update('paused', 'Press Play to start this stream.');
                } else fail(id, 'PLAY-02', reason(error));
            });
        } catch (error) { fail(id, 'PLAY-02', reason(error)); }
    }
    function startAV(id) {
        if (!current(id) || !av) return;
        update('loading', 'Starting playback · Samsung AVPlay…'); waitForPlayback(id);
        try { av.play(); } catch (error) { fail(id, 'PLAY-02', reason(error)); }
    }
    function open(url, parent, options) {
        // Request headers/cookies are deliberately not copied from the page.
        // AVPlay has no documented general-purpose Referer setting for Tizen 3.
        url = core.normalize(url);
        if (!url) { status('Enter a valid HTTP or HTTPS stream URL.'); return false; }
        close(); active = true;
        var id = generation;
        layer = document.createElement('div'); layer.className = 'sofa-player-surface';
        parent.appendChild(layer);
        update('loading', 'Opening stream…');
        loadAPI(function (api) {
            if (!current(id)) return;
            if (api) {
                av = api; engine = 'Samsung AVPlay';
                var object = document.createElement('object');
                object.type = 'application/avplayer'; object.className = 'sofa-av-object'; layer.appendChild(object);
                try {
                    av.open(url);
                    av.setDisplayRect(0, 0, 1920, 1080);
                    av.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
                    av.setListener({
                        onbufferingstart: function () {
                            if (!current(id) || phase === 'paused') return;
                            update('buffering', 'Buffering…'); waitForPlayback(id);
                        },
                        onbufferingcomplete: function () {
                            if (!current(id) || phase === 'paused') return;
                            update('loading', 'Buffer ready. Waiting for playback…');
                        },
                        oncurrentplaytime: function () {
                            if (!current(id) || !av) return;
                            try { if (av.getState() === 'PLAYING') playing(id); } catch (ignore) {}
                        },
                        onstreamcompleted: function () { ended(id); },
                        onerror: function (error) { fail(id, 'PLAY-01', reason(error)); }
                    });
                    waitForPlayback(id);
                    av.prepareAsync(function () {
                        if (!current(id)) return;
                        startAV(id);
                    }, function (error) { fail(id, 'PLAY-01', reason(error)); });
                } catch (error) { fail(id, 'PLAY-01', reason(error)); }
            } else {
                engine = 'HTML5';
                video = document.createElement('video'); video.controls = false; video.autoplay = false; video.className = 'sofa-html-video';
                video.onplaying = function () { playing(id); };
                video.onwaiting = function () {
                    if (!current(id) || phase === 'paused') return;
                    update('buffering', 'Buffering…'); waitForPlayback(id);
                };
                video.onpause = function () {
                    if (!current(id)) return;
                    clearTimeout(timer); timer = null; update('paused', 'Paused');
                };
                video.onended = function () { ended(id); };
                video.onerror = function () {
                    if (!current(id)) return;
                    var code = video && video.error && video.error.code;
                    var message = code === 2 ? 'The stream connection failed' : code === 3 ? 'The TV could not decode this stream' : 'This browser could not play the stream format';
                    fail(id, 'PLAY-02', message);
                };
                layer.appendChild(video); video.src = url;
                startHTML(id);
            }
        });
        return true;
    }
    function command(action) {
        if (!active) return;
        var id = generation;
        try {
            var s = av ? av.getState() : video && (video.paused ? 'PAUSED' : 'PLAYING');
            if (action === 'toggle') action = s === 'PLAYING' ? 'pause' : 'play';
            if (action === 'pause' && s === 'PLAYING') {
                playRequest++; clearTimeout(timer); timer = null;
                if (av) av.pause(); else video.pause(); update('paused', 'Paused');
            }
            if (action === 'play' && (s === 'PAUSED' || s === 'READY')) {
                if (av) startAV(id); else startHTML(id);
            }
            if ((action === 'forward' || action === 'rewind') && (s === 'PLAYING' || s === 'PAUSED')) {
                var delta = action === 'forward' ? 10 : -10;
                if (av) {
                    var duration = av.getDuration(), target = Math.max(0, av.getCurrentTime() + delta * 1000);
                    if (duration > 0) target = Math.min(target, Math.max(0, duration - 1000));
                    av.seekTo(target, function () {}, function () { if (current(id)) status('Seeking is unavailable for this stream.'); });
                } else if (video) video.currentTime = Math.max(0, Math.min(video.currentTime + delta, isFinite(video.duration) ? Math.max(0, video.duration - 1) : Infinity));
            }
        } catch (error) { if (current(id)) status('This player control is unavailable.'); }
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) command('pause'); });
    window.addEventListener('pagehide', close);
    return {open: open, close: close, command: command, active: function () { return active; }, state: function () { return {phase: phase, engine: engine, errorCode: errorCode}; }};
}

function SofaSites(core) {
    'use strict';
    function words(node) { return node ? String(node.textContent || '').replace(/\s+/g, ' ').replace(/^ | $/g, '') : ''; }
    function parentCard(node) {
        while (node && node !== document.body) {
            if (/(^|\s)m-card(?:\s|$)/.test(node.className || '')) return node;
            node = node.parentElement;
        }
        return null;
    }
    function matches() {
        var list = [], seen = {}, anchors = document.querySelectorAll('#ort-matches-wrap a.m-card__link, #ort-matches-wrap a.m-card[href]');
        for (var i = 0; i < anchors.length && list.length < 240; i++) {
            var a = anchors[i], card = parentCard(a), url = core.normalize(a.href);
            if (!url || !card || seen[url]) continue;
            seen[url] = true;
            var title = a.getAttribute('aria-label') || card.getAttribute('data-team-names');
            if (title) title = title.replace(/\|/g, ' vs ');
            if (!title) title = words(card.querySelector('.m-card__title')) || words(card.querySelector('.m-card__body')) || words(a);
            var section = card.parentElement, sport = '';
            while (section && section.id !== 'ort-matches-wrap') {
                var heading = section.querySelector('h3');
                if (heading) { sport = words(heading); break; }
                section = section.parentElement;
            }
            var scores = card.querySelectorAll('.m-card__score'), score = '';
            if (scores.length === 2 && words(scores[0]) && words(scores[1])) score = words(scores[0]) + ' – ' + words(scores[1]);
            list.push({url: url, title: (title || 'Open stream').slice(0, 180), sport: sport || 'Events', score: score,
                status: words(card.querySelector('.m-card__pill')) || words(card.querySelector('time')) || 'Open event',
                live: /m-card--live/.test(card.className) || /\bLIVE\b/.test(words(card)),
                premium: /Premium/i.test(words(card)) || !!card.querySelector('[aria-label="Premium"]')});
        }
        return list;
    }
    function cardLink(node) {
        var card = parentCard(node);
        if (!card) return null;
        return card.tagName === 'A' ? card : card.querySelector('a.m-card__link[href]');
    }
    var isStreamEast = /(^|\.)streameast\.ga$/.test(core.host(location.href));
    function playerElement() { return isStreamEast ? document.getElementById('se-player-root') : null; }
    function servers() {
        if (!playerElement()) return [];
        var links = document.querySelectorAll('#se-streams-list a.se-stream__link[href], #se-player-root a.stream-alt-item[href]');
        var found = [], seen = {};
        for (var i = 0; i < links.length && found.length < 50; i++) {
            var a = links[i], url = core.normalize(a.href), owner = a.parentElement;
            if (!url || core.host(url) !== core.host(location.href) || seen[url]) continue;
            seen[url] = true;
            found.push({url: url, title: words(a.querySelector('.se-stream__name, .stream-alt-name')) || words(a) || 'Server',
                premium: /(?:^|\s)(?:is-pro|stream-alt-item-pro)(?:\s|$)/.test((a.className || '') + ' ' + (owner && owner.className || '')),
                active: /(?:^|\s)(?:active|is-active)(?:\s|$)/.test((a.className || '') + ' ' + (owner && owner.className || ''))});
        }
        return found;
    }
    function repairPlayer() {
        var player = playerElement();
        if (!player) return false;
        document.documentElement.classList.add('sofa-player-page');
        return true;
    }
    return {matches: matches, cardLink: cardLink, playerElement: playerElement, servers: servers, repairPlayer: repairPlayer,
        isStreamEast: isStreamEast, isAether: core.host(location.href) === 'aether.ist'};
}

/* Site code stays on its original origin. Only this loader and public library URLs ship. */
function SofaCompatibility(progress, safeError) {
    'use strict';
    var running = false, completed = false, failure = '', cancelled = false, startupTimer, phase = 'waiting';
    var CDN = 'https://cdn.jsdelivr.net/npm/';
    var ownErrors = [];
    function problem(message) { var error = new Error(message); ownErrors.push(error); if (ownErrors.length > 12) ownErrors.shift(); return error; }
    var libraries = [
        'core-js-bundle@3.46.0/minified.js',
        'systemjs@6.15.1/dist/system.min.js',
        'systemjs@6.15.1/dist/extras/transform.min.js',
        '@babel/standalone@7.28.4/babel.min.js'
    ];
    function script(path, done) {
        var node = document.createElement('script'), ended = false;
        var name = path.indexOf('babel') !== -1 ? 'JavaScript converter' : path.indexOf('core-js') !== -1 ? 'browser helpers' : path.indexOf('css-vars') !== -1 ? 'style helpers' : 'module loader';
        var timer = setTimeout(function () { finish(problem('AETHER-02: Download timed out for ' + name + '.')); }, 30000);
        function finish(error) { if (ended) return; ended = true; clearTimeout(timer); node.onload = null; node.onerror = null; done(error); }
        node.onload = function () { finish(); };
        node.onerror = function () { finish(problem('AETHER-02: The TV could not download ' + name + '. Open Error details for captured connection or content-policy errors.')); };
        node.src = CDN + path; (document.head || document.documentElement).appendChild(node);
    }
    function fail(error) {
        if (cancelled) return;
        clearTimeout(startupTimer); cancelled = true;
        running = false;
        failure = ownErrors.indexOf(error) !== -1 ? error.message : (safeError ? safeError(error && error.message, error && error.name) : 'Website code could not run on this TV.');
        progress('failed', failure.indexOf('AETHER-') === 0 ? failure : 'AETHER-03: App startup failed during ' + phase + '. ' + failure);
    }
    function begin(force) {
        if (running || completed) return;
        var scripts = document.querySelectorAll('script[type="module"][src]'), entries = [];
        if (!force && 'noModule' in document.createElement('script')) return;
        for (var i = 0; i < scripts.length; i++) {
            var link = document.createElement('a'); link.href = scripts[i].src;
            if (link.protocol === location.protocol && link.host === location.host && /^\/assets\//.test(link.pathname)) entries.push(link.href);
        }
        if (!entries.length) { fail(problem('AETHER-01: The page opened, but no supported app entry was found.')); return; }
        running = true; cancelled = false; failure = '';
        phase = 'downloading helpers';
        startupTimer = setTimeout(function () { fail(problem('AETHER-04: Startup took longer than two minutes during ' + phase + '.')); }, 120000);
        progress('loading', 'Preparing Aether for this TV. The first load can take a while.');
        var index = 0;
        function next(error) {
            if (error) { fail(error); return; }
            if (cancelled) { running = false; return; }
            if (index < libraries.length) { script(libraries[index++], next); return; }
            try {
                if (!window.System || !window.Babel || !window.fetch) throw problem('AETHER-03: Required compatibility tools or browser APIs are unavailable.');
                var loader = new window.System.constructor();
                // Keep the global register callback in sync with the loader evaluating modules.
                window.System = loader;
                loader.transform = function (url, source) {
                    if (cancelled) return Promise.reject(new Error('Loading cancelled.'));
                    if (running) { phase = 'adapting app code'; progress('compiling', 'Adapting website code for the TV…'); }
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            try {
                                var result = window.Babel.transform(source, {
                                    filename: url, sourceType: 'module', compact: true, comments: false,
                                    presets: [['env', {targets: {ie: '11'}, modules: 'systemjs', bugfixes: true}]],
                                    plugins: ['transform-dynamic-import']
                                });
                                resolve(result.code);
                            } catch (error) { reject(error); }
                        }, 20);
                    });
                };
                var sequence = Promise.resolve();
                entries.forEach(function (url) { sequence = sequence.then(function () { return loader.import(url); }); });
                sequence.then(function () {
                    if (cancelled) return;
                    clearTimeout(startupTimer);
                    running = false; completed = true; phase = 'started';
                    progress('ready', 'Aether compatibility loader started.');
                    // CSS custom properties are also missing on Chromium 47.
                    if (!window.CSS || !CSS.supports || !CSS.supports('color', 'var(--sofa-test)')) {
                        script('css-vars-ponyfill@2.4.9/dist/css-vars-ponyfill.min.js', function (error) {
                            if (!error && window.cssVars) window.cssVars({onlyLegacy: true, watch: true, silent: true, exclude: '[data-sofa-style]'});
                        });
                    }
                }, fail);
            } catch (problem) { fail(problem); }
        }
        next();
    }
    return {begin: begin, cancel: function () { cancelled = true; running = false; clearTimeout(startupTimer); }, status: function () { return {running: running, completed: completed, error: failure, phase: phase}; }};
}

function SofaDiagnostics(core) {
    'use strict';
    var first = [], recent = [], counts = {script: 0, resource: 0, rejection: 0, policy: 0};
    var started = new Date().getTime(), stopped = false, firstLimit = 3, recentLimit = 5, detailLimit = 8;

    function text(value, limit) {
        return String(value || '').replace(/[\r\n\t\x00-\x1f\x7f]+/g, ' ').slice(0, limit || 120);
    }
    function number(value) {
        value = Number(value);
        return isFinite(value) && value >= 0 ? Math.round(value) : 0;
    }
    function safeLocation(value, hostOnly) {
        if (!value) return '';
        value = String(value);
        if (/^data:/i.test(value)) return '[inline data]';
        if (/^file:/i.test(value)) return '[local file]';
        if (/^blob:/i.test(value)) return 'blob:' + safeLocation(value.slice(5), true);
        try {
            var link = document.createElement('a');
            link.href = value;
            if (!/^(https?|wss?):$/.test(link.protocol)) return '[inline]';
            var host = text(link.host, 100), path = String(link.pathname || '/').split(/[?#]/)[0];
            /* Decode only to find encoded delimiters before removing query/fragment text. */
            try { path = decodeURIComponent(path); } catch (ignore) {}
            path = path.split(/[?#]/)[0];
            return host + (hostOnly ? '' : text(path, 120));
        } catch (ignoreLocation) { return '[unknown source]'; }
    }
    function errorSummary(message, errorName) {
        /* Never retain stacks, arbitrary rejection objects, or free-form exception text. */
        var raw = typeof message === 'string' ? message.slice(0, 1000).replace(/(?:https?|wss?|blob|data):\S+/gi, '[URL]') : '';
        var type = /\b(SyntaxError|ReferenceError|TypeError|RangeError|SecurityError|NotSupportedError|NetworkError|AbortError|Error)\b/.exec(String(errorName || '') + ' ' + raw);
        type = type ? type[1] : 'Script error';
        var missing = /(?:^|[ :])([A-Za-z_$][A-Za-z0-9_$.]{0,70}) is not (defined|a function)\b/.exec(raw);
        if (missing) return text(type + ': ' + missing[1] + ' is not ' + missing[2]);
        if (/unexpected (?:token|identifier|end|syntax)|invalid or unexpected token|invalid left-hand side/i.test(raw)) return 'SyntaxError: unsupported or unexpected syntax';
        if (/cannot (?:read|set) propert(?:y|ies)|undefined is not an object|null is not an object|property unavailable on null or undefined/i.test(raw)) return type + ': property unavailable on null or undefined';
        if (/failed to fetch|network (?:request|error)|load failed/i.test(raw)) return type + ': network request failed';
        if (/maximum call stack|too much recursion|call stack limit reached/i.test(raw)) return 'RangeError: call stack limit reached';
        if (/not supported|unsupported/i.test(raw)) return type + ': unsupported operation';
        if (/script error\.?$/i.test(raw)) return 'Script error: details unavailable';
        return type + ': details omitted';
    }
    function reportLocation(value, hostOnly) {
        if (typeof value !== 'string' || !value) return '';
        if (/^blob:/i.test(value)) return 'blob:' + reportLocation(value.slice(5, 1200), true);
        if (/^\[(?:inline data|local file|inline|unknown source|no source|inline|eval|self|none)\]$/.test(value)) return value;
        if (/^(?:https?|wss?|data|file):/i.test(value)) return safeLocation(value.slice(0, 1200), hostOnly);
        /* Snapshots already use host/path. Do not resolve arbitrary child strings on this page's origin. */
        if (/^(?:localhost|[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+|\[[0-9a-f:]+\])(?::[0-9]{1,5})?(?:\/|$)/i.test(value)) return safeLocation('https://' + value.slice(0, 1200), hostOnly);
        return '[unknown source]';
    }
    function bounded(value, limit) {
        return typeof value === 'number' && isFinite(value) && value >= 0 ? Math.min(Math.round(value), limit) : 0;
    }
    function policySummary(value) {
        var match = /^(.*?) blocked(?:: (.*))?$/.exec(typeof value === 'string' ? value.slice(0, 1200) : '');
        var directive = match && match[1];
        if (!/^(?:base-uri|child-src|connect-src|default-src|font-src|form-action|frame-ancestors|frame-src|img-src|manifest-src|media-src|navigate-to|object-src|prefetch-src|report-to|report-uri|require-trusted-types-for|sandbox|script-src(?:-elem|-attr)?|style-src(?:-elem|-attr)?|trusted-types|worker-src|content policy)$/.test(directive || '')) directive = 'content policy';
        var blocked = match && match[2] ? reportLocation(match[2], false) : '';
        return text(directive + ' blocked' + (blocked ? ': ' + blocked : ''));
    }
    function sanitizeSnapshot(input) {
        input = input && typeof input === 'object' ? input : {};
        var f = input.features && typeof input.features === 'object' ? input.features : {};
        var c = input.counts && typeof input.counts === 'object' ? input.counts : {};
        var result = {location: reportLocation(input.location, false), features: {nativeModules: f.nativeModules === true, cssVariables: f.cssVariables === true, mediaSource: f.mediaSource === true, webKitMediaSource: f.webKitMediaSource === true, avPlay: f.avPlay === true}, counts: {}, errors: [], videoCount: bounded(input.videoCount, 10000), videos: [], frameCount: bounded(input.frameCount, 10000), frames: [], detailLimit: detailLimit};
        var kinds = ['script', 'resource', 'rejection', 'policy'];
        for (var n = 0; n < kinds.length; n++) result.counts[kinds[n]] = bounded(c[kinds[n]], 1000000);
        var errors = Array.isArray(input.errors) ? input.errors : [];
        for (var i = 0; i < errors.length && i < firstLimit + recentLimit; i++) {
            var e = errors[i];
            if (!e || typeof e !== 'object' || kinds.indexOf(e.kind) === -1) continue;
            var message = errorSummary(e.message);
            if (e.kind === 'policy') message = policySummary(e.message);
            if (e.kind === 'resource') message = typeof e.message === 'string' && /^(?:script|link|img|iframe|video|audio|source|object) failed to load$/.test(e.message) ? e.message : 'Resource failed to load';
            result.errors.push({kind: e.kind, message: message, source: reportLocation(e.source, false), line: bounded(e.line, 10000000), seconds: bounded(e.seconds, 31536000)});
        }
        var videos = Array.isArray(input.videos) ? input.videos : [];
        for (var j = 0; j < videos.length && j < detailLimit; j++) {
            var v = videos[j];
            if (!v || typeof v !== 'object') continue;
            result.videos.push({width: bounded(v.width, 100000), height: bounded(v.height, 100000), videoWidth: bounded(v.videoWidth, 100000), videoHeight: bounded(v.videoHeight, 100000), readyState: bounded(v.readyState, 4), networkState: bounded(v.networkState, 3), errorCode: bounded(v.errorCode, 4), paused: v.paused === true});
        }
        var frames = Array.isArray(input.frames) ? input.frames : [];
        for (var k = 0; k < frames.length && k < detailLimit; k++) {
            var frame = frames[k];
            if (!frame || typeof frame !== 'object') continue;
            result.frames.push({host: reportLocation(frame.host, true) || '[no source]', width: bounded(frame.width, 100000), height: bounded(frame.height, 100000)});
        }
        return result;
    }
    function remember(kind, message, source, line) {
        if (stopped) return;
        counts[kind]++;
        var entry = {kind: kind, message: text(message), source: safeLocation(source), line: number(line), seconds: number((new Date().getTime() - started) / 1000)};
        if (first.length < firstLimit) first.push(entry);
        else {
            recent.push(entry);
            if (recent.length > recentLimit) recent.shift();
        }
    }
    function onError(event) {
        try {
            var target = event.target, tag = target && String(target.tagName || '').toUpperCase();
            if (tag && /^(SCRIPT|LINK|IMG|IFRAME|VIDEO|AUDIO|SOURCE|OBJECT)$/.test(tag)) {
                remember('resource', tag.toLowerCase() + ' failed to load', target.currentSrc || target.src || target.href || target.data, 0);
            } else {
                remember('script', errorSummary(event.message, event.error && event.error.name), event.filename, event.lineno);
            }
        } catch (ignore) {}
    }
    function onRejection(event) {
        try {
            var reason = event.reason;
            remember('rejection', errorSummary(typeof reason === 'string' ? reason : reason && typeof reason.message === 'string' ? reason.message : '', reason && reason.name), '', 0);
        } catch (ignore) { remember('rejection', 'Error: rejection details unavailable', '', 0); }
    }
    function onPolicy(event) {
        try {
            var directive = String(event.effectiveDirective || event.violatedDirective || '').split(/\s/)[0];
            if (!/^[a-z][a-z0-9-]{0,45}$/.test(directive)) directive = 'content policy';
            var blocked = /^(inline|eval|self|none)$/.test(event.blockedURI || '') ? '[' + event.blockedURI + ']' : safeLocation(event.blockedURI);
            remember('policy', directive + ' blocked' + (blocked ? ': ' + blocked : ''), event.sourceFile, event.lineNumber);
        } catch (ignore) {}
    }
    function dimensions(element) {
        try {
            var rect = element.getBoundingClientRect();
            return {width: number(rect.width === undefined ? rect.right - rect.left : rect.width), height: number(rect.height === undefined ? rect.bottom - rect.top : rect.height)};
        } catch (ignore) { return {width: 0, height: 0}; }
    }
    function copy(entry) {
        return {kind: entry.kind, message: entry.message, source: entry.source, line: entry.line, seconds: entry.seconds};
    }
    function snapshot() {
        var videos = [], frames = [], features = {nativeModules: false, cssVariables: false, mediaSource: false, webKitMediaSource: false, avPlay: false};
        var videoNodes = document.querySelectorAll('video'), frameNodes = document.querySelectorAll('iframe');
        try { features.nativeModules = 'noModule' in document.createElement('script'); } catch (ignoreModule) {}
        try { features.cssVariables = !!(window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--sofa-check)')); } catch (ignoreCSS) {}
        features.mediaSource = typeof window.MediaSource === 'function';
        features.webKitMediaSource = typeof window.WebKitMediaSource === 'function';
        try { features.avPlay = !!(window.webapis && window.webapis.avplay); } catch (ignoreAV) {}
        for (var i = 0; i < videoNodes.length && i < detailLimit; i++) {
            var video = videoNodes[i], size = dimensions(video);
            videos.push({width: size.width, height: size.height, videoWidth: number(video.videoWidth), videoHeight: number(video.videoHeight), readyState: number(video.readyState), networkState: number(video.networkState), errorCode: video.error ? number(video.error.code) : 0, paused: !!video.paused});
        }
        for (var j = 0; j < frameNodes.length && j < detailLimit; j++) {
            var frame = frameNodes[j], frameSize = dimensions(frame);
            frames.push({host: safeLocation(frame.src, true) || '[no source]', width: frameSize.width, height: frameSize.height});
        }
        var errors = [], entries = first.concat(recent);
        for (var k = 0; k < entries.length; k++) errors.push(copy(entries[k]));
        return {location: safeLocation(location.href), features: features, counts: {script: counts.script, resource: counts.resource, rejection: counts.rejection, policy: counts.policy}, errors: errors, videoCount: videoNodes.length, videos: videos, frameCount: frameNodes.length, frames: frames, detailLimit: detailLimit};
    }
    function format(input) {
        var data = sanitizeSnapshot(input), f = data.features, lines = ['Page: ' + (data.location || '[no location]')];
        function yes(value) { return value ? 'yes' : 'no'; }
        lines.push('Support: modules ' + yes(f.nativeModules) + ', CSS variables ' + yes(f.cssVariables) + ', MSE ' + yes(f.mediaSource || f.webKitMediaSource) + ', AVPlay ' + yes(f.avPlay));
        lines.push('Videos: ' + data.videoCount + '; frames: ' + data.frameCount + ' (current page only)');
        for (var i = 0; i < data.videos.length; i++) {
            var v = data.videos[i];
            lines.push('Video ' + (i + 1) + ': box ' + v.width + 'x' + v.height + ', picture ' + v.videoWidth + 'x' + v.videoHeight + ', ready ' + v.readyState + ', network ' + v.networkState + ', error ' + v.errorCode);
        }
        for (var j = 0; j < data.frames.length; j++) {
            var frame = data.frames[j];
            lines.push('Frame ' + (j + 1) + ': ' + frame.host + ', ' + frame.width + 'x' + frame.height);
        }
        lines.push('Errors since Sofa started: script ' + data.counts.script + ', resource ' + data.counts.resource + ', promise ' + data.counts.rejection + ', policy ' + data.counts.policy);
        for (var k = 0; k < data.errors.length; k++) {
            var item = data.errors[k];
            lines.push(item.kind + ': ' + item.message + (item.source ? ' — ' + item.source + (item.line ? ':' + item.line : '') : ''));
        }
        if (!data.errors.length) lines.push('No errors captured. Earlier errors and errors inside other-site frames may be unavailable.');
        return lines.join('\n');
    }
    function report() { return format(snapshot()); }
    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onRejection, false);
    window.addEventListener('securitypolicyviolation', onPolicy, false);
    return {snapshot: snapshot, sanitizeSnapshot: sanitizeSnapshot, format: format, safeError: errorSummary, report: report, dispose: function () {
        stopped = true;
        window.removeEventListener('error', onError, true);
        window.removeEventListener('unhandledrejection', onRejection, false);
        window.removeEventListener('securitypolicyviolation', onPolicy, false);
    }};
}

function SofaMedia(core) {
    'use strict';
    var limit = 24, ranks = {current: 3, declared: 2, observed: 1};
    var sourceNames = {video: 'Website video', jwplayer: 'JW Player', videojs: 'Video.js', resource: 'Loaded media request'};
    function absolute(value) {
        if (typeof value !== 'string' || !value || value.length > 8192 || /[\x00-\x20\x7f\\]/.test(value)) return null;
        try {
            var link = document.createElement('a'); link.href = value;
            if (!/^https?:$/.test(link.protocol)) return null;
            return core.normalize(link.href);
        } catch (ignore) { return null; }
    }
    function kind(url, type) {
        url = url.split(/[?#]/)[0];
        type = typeof type === 'string' ? type.toLowerCase().split(';')[0] : '';
        if (/\.(m3u8)(?:[?#]|$)/i.test(url) || /^(?:application\/(?:x-mpegurl|vnd\.apple\.mpegurl)|hls)$/.test(type)) return 'hls';
        if (/\.mpd(?:[?#]|$)/i.test(url) || /^(?:application\/dash\+xml|dash)$/.test(type)) return 'dash';
        return 'video';
    }
    function protectedSource(value) {
        return !!(value && typeof value === 'object' && (value.drm || value.keySystems || value.keySystemOptions || value.encrypted === true));
    }
    function owned(element) {
        for (var i = 0; element && i < 100; i++, element = element.parentNode) if (element.id === 'sofa-browser') return true;
        return false;
    }
    function label(candidate) {
        return sourceNames[candidate.source] + ' · ' + (candidate.kind === 'video' ? 'Video' : candidate.kind.toUpperCase()) + ' · ' + core.host(candidate.url).slice(0, 100);
    }
    function add(list, value, type, source, confidence) {
        var url = absolute(value);
        if (!url) return;
        var candidate = {url: url, kind: kind(url, type), source: source, confidence: confidence};
        candidate.label = label(candidate);
        for (var i = 0; i < list.length; i++) {
            if (list[i].url !== url) continue;
            if (ranks[confidence] > ranks[list[i].confidence]) list[i] = candidate;
            return;
        }
        if (list.length < limit) list.push(candidate);
    }
    function sanitizeCandidates(input) {
        var result = [];
        if (!Array.isArray(input)) return result;
        for (var i = 0; i < input.length && i < limit; i++) {
            var entry = input[i];
            if (!entry || typeof entry !== 'object' || typeof entry.url !== 'string' || core.normalize(entry.url) !== entry.url ||
                    !Object.prototype.hasOwnProperty.call(sourceNames, entry.source) || !Object.prototype.hasOwnProperty.call(ranks, entry.confidence) ||
                    !/^(hls|dash|video)$/.test(entry.kind)) continue;
            /* Recreate labels instead of accepting untrusted frame labels or signed URL fragments. */
            add(result, entry.url, entry.kind, entry.source, entry.confidence);
        }
        return result;
    }
    function scan() {
        var result = {candidates: [], videos: [], players: [], hasController: false, hasBlob: false, protectedMedia: false};
        var nodes = document.querySelectorAll('video'), i, j;
        function declared(value, source) {
            if (!value || typeof value !== 'object') return;
            if (protectedSource(value)) { result.protectedMedia = true; return; }
            add(result.candidates, value.file || value.src, value.type, source, 'declared');
        }
        for (i = 0; i < nodes.length && i < 12; i++) {
            try {
                var video = nodes[i]; if (owned(video)) continue;
                result.videos.push(video);
                if (/^blob:/i.test(video.currentSrc || video.src || '')) result.hasBlob = true;
                if (video.mediaKeys || video.webkitKeys) { result.protectedMedia = true; continue; }
                add(result.candidates, video.currentSrc, video.type, 'video', 'current');
                add(result.candidates, video.src, video.type, 'video', 'declared');
                var sources = video.querySelectorAll('source[src]');
                for (j = 0; j < sources.length && j < 8; j++) declared(sources[j], 'video');
            } catch (ignoreVideo) {}
        }
        function readJW(api) {
            if (!api || typeof api.getPlaylistItem !== 'function' && typeof api.getPlaylist !== 'function') return;
            for (var a = 0; a < result.players.length; a++) if (result.players[a].api === api) return;
            result.players.push({source: 'jwplayer', api: api});
            var item = null;
            if (typeof api.getPlaylistItem === 'function') item = api.getPlaylistItem();
            else if (typeof api.getPlaylistIndex === 'function') {
                var playlist = api.getPlaylist(), index = api.getPlaylistIndex();
                if (Array.isArray(playlist) && typeof index === 'number' && index >= 0 && index === Math.floor(index)) item = playlist[index];
            }
            if (!item || typeof item !== 'object') return;
            if (protectedSource(item)) { result.protectedMedia = true; return; }
            declared(item, 'jwplayer');
            var sources = Array.isArray(item.sources) ? item.sources : [];
            for (var b = 0; b < sources.length && b < 8; b++) declared(sources[b], 'jwplayer');
        }
        /* Read existing player getter APIs only. Never invoke setup/load or fetch a playlist URL. */
        try {
            if (typeof window.jwplayer === 'function') {
                try { readJW(window.jwplayer()); } catch (ignoreDefaultJW) {}
                var jwNodes = document.querySelectorAll('.jwplayer[id]');
                for (i = 0; i < jwNodes.length && i < 8; i++) {
                    if (owned(jwNodes[i])) continue;
                    try { readJW(window.jwplayer(jwNodes[i].id)); } catch (ignoreJW) {}
                }
            }
        } catch (ignoreJWAccess) {}
        try {
            var vjs = window.videojs;
            var players = vjs && (typeof vjs.getPlayers === 'function' ? vjs.getPlayers() : vjs.players);
            if (players && typeof players === 'object') {
                var ids = Object.keys(players);
                for (i = 0; i < ids.length && i < 8; i++) {
                    try {
                        var api = players[ids[i]];
                        if (!api || typeof api.currentSource !== 'function' && typeof api.currentSrc !== 'function') continue;
                        if (typeof api.el === 'function' && owned(api.el())) continue;
                        result.players.push({source: 'videojs', api: api});
                        var current = typeof api.currentSource === 'function' ? api.currentSource() : {src: api.currentSrc(), type: typeof api.currentType === 'function' ? api.currentType() : ''};
                        if (protectedSource(current)) { result.protectedMedia = true; continue; }
                        if (current) add(result.candidates, current.src, current.type, 'videojs', 'current');
                        var choices = typeof api.currentSources === 'function' ? api.currentSources() : [];
                        for (j = 0; Array.isArray(choices) && j < choices.length && j < 8; j++) declared(choices[j], 'videojs');
                    } catch (ignoreVJS) {}
                }
            }
        } catch (ignoreVJSAccess) {}
        /* Resource entries are observations, not proof that a URL still plays or belongs to the main video.
           Keep them below active player sources; never mistake MSE segments for a complete movie. */
        if (!result.protectedMedia) {
            try {
                var entries = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType('resource');
                for (i = entries ? entries.length - 1 : -1; i >= 0 && i >= entries.length - 150; i--) {
                    var entry = entries[i], url = absolute(entry.name), initiator = String(entry.initiatorType || '').toLowerCase();
                    if (!url || entry.responseStatus >= 400 || !/^(?:video|xmlhttprequest|fetch|other|)$/.test(initiator)) continue;
                    var path = url.split(/[?#]/)[0];
                    if (/\.(m3u8|mpd)$/i.test(path)) add(result.candidates, url, '', 'resource', 'observed');
                    else if (initiator === 'video' && /\.(mp4|m4v|webm)$/i.test(path) && !/(?:^|[\/_.-])(?:init|segment|chunk|fragment)(?:[\/_.-]|\d)/i.test(path)) add(result.candidates, url, '', 'resource', 'observed');
                }
            } catch (ignoreResources) {}
        }
        /* ES5 does not guarantee a stable Array.sort. Preserve source order within confidence levels. */
        for (i = 1; i < result.candidates.length; i++) {
            var candidate = result.candidates[i]; j = i - 1;
            while (j >= 0 && ranks[result.candidates[j].confidence] < ranks[candidate.confidence]) {
                result.candidates[j + 1] = result.candidates[j]; j--;
            }
            result.candidates[j + 1] = candidate;
        }
        for (i = 0; i < result.players.length; i++) if (typeof result.players[i].api.play === 'function') result.hasController = true;
        return result;
    }
    function command(action) {
        if (!/^(play|pause|toggle)$/.test(action)) return false;
        var players = scan().players;
        for (var i = 0; i < players.length; i++) {
            try {
                var entry = players[i], api = entry.api, next = action, response;
                if (next === 'toggle') {
                    var playing = entry.source === 'jwplayer' ? typeof api.getState === 'function' && /^(playing|buffering)$/i.test(api.getState()) : typeof api.paused === 'function' && api.paused() === false;
                    next = playing ? 'pause' : 'play';
                }
                if (typeof api[next] !== 'function') continue;
                response = entry.source === 'jwplayer' ? api[next](true) : api[next]();
                if (response && typeof response.catch === 'function') response.catch(function () {});
                return true;
            } catch (ignoreCommand) {}
        }
        return false;
    }
    /* URLs exist only in this returned scan. No persistence, logging, hooks, requests or URL reconstruction. */
    return {scan: scan, sanitizeCandidates: sanitizeCandidates, command: command};
}

/* Top-level navigation recovery. TizenBrew uses the same location API. */
function SofaNavigation(core, onState, environment) {
    'use strict';
    var env = environment || window, pending = null, disposed = false;
    var last = {state: 'idle', host: '', code: '', errorName: ''};

    function announce(state, request, code, errorName) {
        last = {state: state, host: request ? core.host(request.url) : '', code: code || '', errorName: errorName || ''};
        if (onState) onState({state: last.state, host: last.host, code: last.code, errorName: last.errorName});
    }
    function clear(request) {
        if (!request) return;
        env.clearTimeout(request.defer);
        env.clearTimeout(request.deadline);
    }
    function stop() {
        try { env.stop(); } catch (ignoreStop) {}
    }
    function safeName(error) {
        var name = error && error.name;
        return /^(SecurityError|SyntaxError|TypeError|NotSupportedError|InvalidStateError|NetworkError|AbortError)$/.test(name || '') ? name : 'NavigationError';
    }
    function fail(request, code, errorName) {
        if (pending !== request || disposed) return;
        pending = null;
        clear(request);
        stop();
        announce('failed', request, code, errorName);
    }
    function cancel() {
        if (!pending) return false;
        var request = pending;
        pending = null;
        clear(request);
        stop();
        announce('cancelled', request);
        return true;
    }
    function start(value) {
        var url = core.normalize(value);
        if (!url || disposed) return false;
        cancel();
        var request = {url: url, defer: null, deadline: null};
        pending = request;
        announce('opening', request);
        /* A UI callback may cancel or replace a request before it is scheduled. */
        if (pending !== request) return true;
        request.deadline = env.setTimeout(function () { fail(request, 'OPEN-01'); }, 15000);
        request.defer = env.setTimeout(function () {
            if (pending !== request || disposed) return;
            try { env.location.assign(url); }
            catch (error) { fail(request, 'OPEN-02', safeName(error)); }
        }, 50);
        return true;
    }
    function departed() {
        if (!pending) return;
        var request = pending;
        pending = null;
        clear(request);
        /* pagehide means the old page left, not that the destination finished. */
        announce('departed', request);
    }
    function dispose() {
        disposed = true;
        cancel();
        if (env.removeEventListener) env.removeEventListener('pagehide', departed, false);
    }
    if (env.addEventListener) env.addEventListener('pagehide', departed, false);
    return {start: start, cancel: cancel, dispose: dispose, snapshot: function () {
        return {state: last.state, host: last.host, code: last.code, errorName: last.errorName};
    }};
}
if (typeof module === 'object' && module.exports) module.exports = SofaNavigation;

function SofaBookmarks(core) {
    'use strict';
    var marker = 'cinejoyShortcutAdded', maximum = 32;

    function clean(value) {
        var result = [], i, item;
        if (!Array.isArray(value)) return result;
        /* JSON storage is untrusted; keep the work bounded even for an oversized array. */
        for (i = 0; i < Math.min(value.length, 128) && result.length < maximum; i++) {
            item = value[i];
            if (!item || typeof item.name !== 'string' || typeof item.url !== 'string' || !core.normalize(item.url)) continue;
            result.push({name: item.name, url: item.url});
        }
        return result;
    }
    function isCinejoyHome(value) {
        var url = core.normalize(value), match;
        if (!url) return false;
        match = /^(https?):\/\/((?:www\.)?cinejoy\.to\.?)(?::([0-9]+))?(\/[^?#]*)?(?:[?#].*)?$/i.exec(url);
        if (!match || (match[4] && !/^\/*$/.test(match[4]))) return false;
        return !match[3] || (match[1].toLowerCase() === 'https' ? match[3] === '443' : match[3] === '80');
    }
    function persist(write, key, value) {
        try { return typeof write === 'function' && write(key, value) === true; }
        catch (ignoreStorage) { return false; }
    }
    function migrate(value, completed, write) {
        var saved = clean(value), proposed, found = false, added = false, reason, i;
        if (completed === true) return {saved: saved, completed: true, added: false, reason: 'completed'};
        for (i = 0; i < saved.length; i++) if (isCinejoyHome(saved[i].url)) found = true;
        reason = found ? 'already-present' : saved.length >= maximum ? 'full' : 'added';
        if (reason === 'added') {
            proposed = saved.concat([{name: 'Cinejoy', url: 'https://cinejoy.to/'}]);
            /* Save the bookmark first. A failed marker write can safely retry without duplication. */
            if (!persist(write, 'saved', proposed)) return {saved: saved, completed: false, added: false, reason: 'saved-write-failed'};
            saved = proposed;
            added = true;
        }
        /* Mark full lists too: freeing a slot later must not silently insert a removed/default shortcut. */
        if (!persist(write, marker, true)) return {saved: saved, completed: false, added: added, reason: 'marker-write-failed'};
        return {saved: saved, completed: true, added: added, reason: reason};
    }
    return {migrate: migrate, marker: marker};
}

/* Read-only public Cinejoy collections; no account keys or playback resolver. */
function SofaCinejoyCatalog() {
    'use strict';
    var origin = 'https://lists.shegu.st', pageSize = 40, maxBytes = 524288;
    var active = null, timer = null, generation = 0;
    function clean(value, limit) {
        return typeof value === 'string' ? value.replace(/[\x00-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').slice(0, limit) : '';
    }
    function integer(value, maximum) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value && value >= 0 && value <= maximum; }
    function validId(value) { return typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,99}$/.test(value); }
    function error(code) { return {code: code, message: code === 'CINE-01' ? 'CINE-01: Cinejoy collections could not be reached. Try again.' : 'CINE-02: Cinejoy returned collection data Sofa could not read.'}; }
    function cancel() {
        generation++;
        if (timer !== null) { clearTimeout(timer); timer = null; }
        var previous = active; active = null;
        if (previous) { previous.onreadystatechange = previous.onerror = previous.ontimeout = previous.onprogress = previous.onabort = null; try { previous.abort(); } catch (ignore) {} }
    }
    function byteLength(text) {
        var bytes = 0, code, i;
        for (i = 0; i < text.length; i++) {
            code = text.charCodeAt(i);
            if (code < 128) bytes++;
            else if (code < 2048) bytes += 2;
            else if (code >= 55296 && code <= 56319 && i + 1 < text.length && text.charCodeAt(i + 1) >= 56320 && text.charCodeAt(i + 1) <= 57343) { bytes += 4; i++; }
            else bytes += 3;
            if (bytes > maxBytes) return bytes;
        }
        return bytes;
    }
    function request(path, normalize, callback) {
        cancel();
        var token = generation, xhr, ended = false;
        function finish(problem, data) {
            if (ended || token !== generation) return;
            ended = true;
            if (timer !== null) { clearTimeout(timer); timer = null; }
            active = null;
            if (xhr) { xhr.onreadystatechange = xhr.onerror = xhr.ontimeout = xhr.onprogress = xhr.onabort = null; if (problem) { try { xhr.abort(); } catch (ignore) {} } }
            callback(problem, data);
        }
        try {
            xhr = new XMLHttpRequest(); active = xhr;
            xhr.open('GET', origin + path, true);
            xhr.timeout = 15000;
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4 || ended || token !== generation) return;
                if (xhr.status < 200 || xhr.status >= 300) { finish(error('CINE-01')); return; }
                var text, data;
                try {
                    text = xhr.responseText;
                    if (typeof text !== 'string' || text.length > maxBytes || byteLength(text) > maxBytes) throw new Error('size');
                    data = normalize(JSON.parse(text));
                } catch (ignore) { finish(error('CINE-02')); return; }
                finish(null, data);
            };
            xhr.onerror = xhr.ontimeout = xhr.onabort = function () { finish(error('CINE-01')); };
            xhr.onprogress = function (event) { if (event && event.loaded > maxBytes) finish(error('CINE-02')); };
            timer = setTimeout(function () { finish(error('CINE-01')); }, 15000);
            xhr.send();
        } catch (ignore) { finish(error('CINE-01')); }
    }
    function collections(callback) {
        request('/joy', function (data) {
            if (!data || !Array.isArray(data.collections) || data.collections.length > 100) throw new Error('shape');
            var result = [], seen = {}, i, item, title;
            for (i = 0; i < data.collections.length; i++) {
                item = data.collections[i];
                if (!item || !validId(item.id) || item.path !== '/joy/' + item.id || seen['$' + item.id]) continue;
                title = clean(item.title, 160); if (!title) continue;
                seen['$' + item.id] = true;
                result.push({id: item.id, title: title, description: clean(item.description, 800)});
            }
            if (data.collections.length && !result.length) throw new Error('items');
            return {collections: result, count: result.length};
        }, callback);
    }
    function image(value) {
        return typeof value === 'string' && value.length <= 400 && /^https:\/\/image\.tmdb\.org\/t\/p\/(?:w[0-9]{2,4}|original)\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/.test(value) ? value : '';
    }
    function items(collection, page, callback) {
        var id = typeof collection === 'string' ? collection : collection && collection.id;
        if (!validId(id) || !integer(page, 25000) || page < 1) { cancel(); callback(error('CINE-02')); return; }
        var offset = (page - 1) * pageSize;
        request('/joy/' + id + '?limit=40&offset=' + offset, function (data) {
            var pagination = data && data.pagination;
            if (!data || !Array.isArray(data.items) || data.items.length > pageSize || !pagination || pagination.offset !== offset || pagination.limit !== pageSize || pagination.returned !== data.items.length || !integer(pagination.total, 1000000) || (data.items.length && pagination.total < offset + data.items.length)) throw new Error('shape');
            var result = [], seen = {}, i, item, tmdb, title, kind, year;
            for (i = 0; i < data.items.length; i++) {
                item = data.items[i]; if (!item) continue;
                tmdb = item.ids && item.ids.tmdb; title = clean(item.title, 160); kind = item.type;
                if (!title || !integer(tmdb, 2147483647) || !tmdb || (kind !== 'movie' && kind !== 'tv') || seen[kind + tmdb]) continue;
                seen[kind + tmdb] = true;
                year = integer(item.year, 2200) && item.year >= 1880 ? item.year : '';
                result.push({title: title, year: year, kind: kind, url: 'https://cinejoy.to/' + (kind === 'movie' ? 'movie/' : 'series/') + tmdb, image: image(item.poster), description: clean(item.description, 1200)});
            }
            if (data.items.length && !result.length) throw new Error('items');
            return {items: result, page: page, pageSize: pageSize, total: pagination.total, hasNext: data.items.length > 0 && offset + data.items.length < pagination.total};
        }, callback);
    }
    return {collections: collections, items: items, cancel: cancel};
}

function SofaCinejoyView(ui, catalog) {
    'use strict';
    var opened = false, generation = 0, screen = 'collections', collections = [], selected = null;
    var pageData = null, filter = 'All', query = '', selectedItem = null, returnScreen = 'collections';
    var limitation = 'Cinejoy playback needs browser features missing from Tizen 3. No working playback path is available in Sofa yet.';
    function stopRequest() { generation++; catalog.cancel(); return generation; }
    function cancel() { opened = false; stopRequest(); }
    function base(title, subtitle, kind) {
        var panel = ui.base(title, subtitle);
        panel.className += ' sofa-cinejoy';
        panel.style.display = 'flex';
        panel.setAttribute('data-cinejoy-screen', kind);
        return panel;
    }
    function home() { cancel(); ui.home(); }
    function button(text, action, cls) { return ui.button(text, action, cls || ''); }
    function clean(value, length) { return String(value || '').replace(/\s+/g, ' ').replace(/^ | $/g, '').slice(0, length || 180); }
    function kind(item) { return item.kind === 'movie' ? 'Movie' : item.kind === 'tv' ? 'Series' : ''; }
    function metadata(item) { return (kind(item) + (item.year ? ' · ' + clean(item.year, 4) : '')).replace(/^ · /, ''); }
    function image(item, cls) {
        var box = ui.el('span', cls || 'sofa-cinejoy-poster');
        box.appendChild(ui.el('span', 'sofa-cinejoy-placeholder', 'C'));
        if (item.image) {
            var img = ui.el('img'); img.alt = ''; img.src = item.image;
            img.onerror = function () { if (img.parentNode) img.parentNode.removeChild(img); };
            box.appendChild(img);
        }
        return box;
    }
    function loading(title, target) {
        screen = 'loading'; returnScreen = target;
        var panel = base(title, 'Connecting to Cinejoy’s catalog…', 'loading');
        panel.appendChild(ui.el('p', 'sofa-cinejoy-note', 'Catalog browsing does not enable video playback on this TV.'));
        var controls = ui.row(panel), backButton = button('Back', back);
        controls.appendChild(backButton); controls.appendChild(button('Sofa home', home));
        ui.choose(backButton);
    }
    function errorView(error, retry, target) {
        screen = 'error'; returnScreen = target;
        var panel = base('Cinejoy could not load', 'The catalog request did not finish.', 'error');
        var code = error && /^CINE-0[12]$/.test(error.code) ? error.code : 'CINE-01';
        panel.appendChild(ui.el('p', 'sofa-cinejoy-note', code + ' · Try again, or return to Sofa.'));
        var controls = ui.row(panel), retryButton = button('Retry', retry, 'sofa-primary');
        controls.appendChild(retryButton); controls.appendChild(button('Back', back)); controls.appendChild(button('Sofa home', home));
        ui.choose(retryButton);
    }
    function renderCollections() {
        if (!opened) return;
        screen = 'collections';
        var panel = base('Cinejoy', 'Browse collections with your remote. Video playback is unavailable on this TV.', 'collections');
        var controls = ui.row(panel);
        controls.appendChild(button('Sofa home', home));
        controls.appendChild(button('Refresh collections', loadCollections));
        var list = ui.el('div', 'sofa-cinejoy-scroll sofa-cinejoy-collections'); panel.appendChild(list);
        collections.forEach(function (collection) {
            var card = button('', function () { selected = collection; filter = 'All'; query = ''; pageData = null; loadItems(1); }, 'sofa-cinejoy-collection');
            card.setAttribute('data-cinejoy-collection', String(collection.id));
            card.appendChild(ui.el('strong', '', clean(collection.title) || 'Collection'));
            if (collection.description) card.appendChild(ui.el('span', '', clean(collection.description, 140)));
            card.appendChild(ui.el('small', '', 'Browse titles →')); list.appendChild(card);
        });
        if (!collections.length) list.appendChild(ui.el('p', 'sofa-muted', 'No collections are available right now. Try Refresh collections.'));
        ui.choose(list.querySelector('button') || controls.querySelector('button'));
    }
    function loadCollections() {
        if (!opened) return;
        var token = stopRequest(); loading('Cinejoy', 'home');
        catalog.collections(function (error, data) {
            if (!opened || token !== generation) return;
            if (error || !data || !Array.isArray(data.collections)) { errorView(error, loadCollections, 'home'); return; }
            collections = data.collections.slice(0, 80); renderCollections();
        });
    }
    function search() {
        var input = ui.el('input'); input.value = query;
        var token = generation;
        ui.keyboard(input, 'Search titles on this loaded page', function () {
            if (!opened || token !== generation || screen !== 'items') return;
            query = clean(input.value, 100); renderItems();
        });
    }
    function renderItems(focusURL) {
        if (!opened || !pageData || !selected) return;
        screen = 'items';
        var subtitle = 'Cinejoy · Page ' + pageData.page + ' · ' + pageData.items.length + ' loaded titles · Playback unavailable on Tizen 3';
        var panel = base(clean(selected.title) || 'Cinejoy titles', subtitle, 'items');
        var controls = ui.row(panel); controls.className += ' sofa-cinejoy-controls';
        controls.appendChild(button('Collections', back));
        controls.appendChild(button(query ? 'Search this page: ' + clean(query, 24) : 'Search this page', search, 'sofa-cinejoy-search'));
        if (query) controls.appendChild(button('Clear search', function () { query = ''; renderItems(); }));
        controls.appendChild(button('Sofa home', home));
        var tabs = ui.row(panel); tabs.className += ' sofa-cinejoy-controls';
        ['All', 'Movies', 'Series'].forEach(function (value) {
            var tab = button(value, function () { filter = value; renderItems(); }, value === filter ? 'sofa-primary' : '');
            tab.setAttribute('aria-pressed', value === filter ? 'true' : 'false'); tabs.appendChild(tab);
        });
        var previous = button('← Previous page', function () { if (pageData.page > 1) loadItems(pageData.page - 1); }, 'sofa-cinejoy-prev');
        previous.disabled = pageData.page <= 1; tabs.appendChild(previous);
        var next = button('Next page →', function () { if (pageData.hasNext) loadItems(pageData.page + 1); }, 'sofa-cinejoy-next');
        next.disabled = !pageData.hasNext; tabs.appendChild(next);
        var list = ui.el('div', 'sofa-cinejoy-scroll sofa-cinejoy-items'); panel.appendChild(list);
        var matches = 0, restored = null;
        pageData.items.forEach(function (item) {
            if ((filter === 'Movies' && item.kind !== 'movie') || (filter === 'Series' && item.kind !== 'tv') ||
                    (query && String(item.title || '').toLowerCase().indexOf(query.toLowerCase()) === -1)) return;
            var card = button('', function () { selectedItem = item; renderDetail(); }, 'sofa-cinejoy-title');
            card.setAttribute('data-cinejoy-url', item.url); card.appendChild(image(item));
            var copy = ui.el('span', 'sofa-cinejoy-title-copy');
            copy.appendChild(ui.el('strong', '', clean(item.title) || 'Untitled'));
            copy.appendChild(ui.el('span', 'sofa-cinejoy-meta', metadata(item)));
            copy.appendChild(ui.el('small', '', 'View details →')); card.appendChild(copy); list.appendChild(card); matches++;
            if (focusURL && item.url === focusURL) restored = card;
        });
        if (!matches) list.appendChild(ui.el('p', 'sofa-muted', 'No titles on this loaded page match your filters. Clear the search, choose All, or try another page.'));
        ui.choose(restored || list.querySelector('button') || controls.querySelector('button'));
    }
    function loadItems(page) {
        if (!opened || !selected) return;
        var token = stopRequest(); loading(clean(selected.title) || 'Cinejoy titles', pageData ? 'items' : 'collections');
        catalog.items(selected, page, function (error, data) {
            if (!opened || token !== generation) return;
            if (error || !data || !Array.isArray(data.items)) { errorView(error, function () { loadItems(page); }, pageData ? 'items' : 'collections'); return; }
            pageData = data; renderItems();
        });
    }
    function renderDetail() {
        if (!opened || !selectedItem) return;
        screen = 'detail';
        var item = selectedItem, panel = base(clean(item.title) || 'Cinejoy title', metadata(item), 'detail');
        var body = ui.el('div', 'sofa-cinejoy-scroll sofa-cinejoy-detail');
        var controls = ui.row(panel);
        var backButton = button('Back to titles', back, 'sofa-primary'); controls.appendChild(backButton);
        controls.appendChild(button('Earlier text ↑', function () { body.scrollTop -= 220; }));
        controls.appendChild(button('More text ↓', function () { body.scrollTop += 220; }));
        controls.appendChild(button('Open website details', function () { cancel(); ui.go(item.url); }));
        panel.appendChild(body);
        body.appendChild(image(item, 'sofa-cinejoy-detail-poster'));
        var text = ui.el('div', 'sofa-cinejoy-detail-copy'); body.appendChild(text);
        text.appendChild(ui.el('p', 'sofa-cinejoy-limitation', limitation));
        if (item.description) text.appendChild(ui.el('p', 'sofa-cinejoy-synopsis', clean(item.description, 1200)));
        text.appendChild(ui.el('p', 'sofa-muted', 'Opening website details may also fail on this TV.'));
        ui.choose(backButton);
    }
    function back() {
        if (!opened) return false;
        stopRequest();
        if (screen === 'detail') renderItems(selectedItem && selectedItem.url);
        else if (screen === 'items') renderCollections();
        else if (screen === 'loading' || screen === 'error') {
            if (returnScreen === 'items' && pageData) renderItems();
            else if (returnScreen === 'collections') renderCollections();
            else home();
        } else home();
        return true;
    }
    function open() { cancel(); opened = true; selected = null; pageData = null; selectedItem = null; filter = 'All'; query = ''; loadCollections(); }
    return {open: open, back: back, cancel: cancel, active: function () { return opened; }};
}

(function () {
    'use strict';
    var helper = SofaHelper();
    // TizenBrew injects this module into the helper too. Leave its controls intact.
    if (helper.isPage(location.href)) return;
    var C = window.SofaCore;
    var diagnostics = SofaDiagnostics(C);
    var HOME = window.__SOFA_PREVIEW_HOME__ || 'http://127.0.0.1:8081/';
    var atHome = location.href.split('#')[0] === HOME;
    var topFrame = window === window.top;
    var root, panel, toastBox, cursor, outline, focused, keyboard, focusBeforeKeyboard, hud, hoverTarget;
    var mode = 'pointer', panelOpen = false, enterTimer = null, enterHeld = false, enterDown = false;
    var px = window.innerWidth / 2, py = window.innerHeight / 2;
    var currentView = 'home', toastTimer, playerStatus, playerPanel, lastVideoRoute = null, playingURL = null;
    var mediaFinder = SofaMedia(C), playerControlIndex = 1;
    var cinejoyView = null, bookmarks = SofaBookmarks(C);
    var frameActive = topFrame, activeChildWindow = null, frameEntryTimer = null, pagePolicyKnown = topFrame;
    var storageWarning = false;
    var sites = SofaSites(C), matchCategory = 'All', matchLiveOnly = false, matchQuery = '', matchViewDismissed = false;
    var openingURL = '', compatibilityText = null, compatibilityState = '';
    var navigation = SofaNavigation(C, function (state) {
        if (state.state !== 'failed' || !root) return;
        var p = base('Could not open ' + state.host, state.code), url = openingURL;
        currentView = 'open-failed';
        p.appendChild(el('p', 'sofa-loading-message', state.code === 'OPEN-02' ?
            'The TV rejected this page change (' + state.errorName + ').' :
            'The website did not replace the current page. Sofa cannot see the reason from here.'));
        if (helper.isPage(url)) p.appendChild(el('p', 'sofa-muted', 'Start the Movy helper on your Mac and check the Mac address in Movy settings.'));
        if (state.host === 'aether.ist') p.appendChild(el('p', 'sofa-muted', 'Aether’s compatibility loader has not started. Try https://aether.ist in the TV’s Internet app and check whether it gives a specific error.'));
        var actions = row(p);
        actions.appendChild(button('Back to Sofa', function () { home(); }, 'sofa-primary'));
        actions.appendChild(button('Retry', function () { go(url); }));
        if (helper.isPage(url)) actions.appendChild(button('Change Mac address', movySettings));
        actions.appendChild(button('Error details', function () { showDiagnostics(state.code + ' · ' + state.host, diagnostics.report()); }));
        choose(actions.querySelector('button'));
    });
    function get(key, fallback) {
        try { var raw = localStorage.getItem('sofa.' + key); return raw === null ? fallback : JSON.parse(raw); }
        catch (ignore) { storageWarning = true; return fallback; }
    }
    function put(key, value) {
        try { localStorage.setItem('sofa.' + key, JSON.stringify(value)); return true; }
        catch (ignore) { storageWarning = true; toast('Storage unavailable. Changes last for this session only.'); return false; }
    }
    var movyOrigin = topFrame && atHome ? helper.normalizeOrigin(get('movyHelper', '')) : null;
    mode = get('navigation', 'pointer') === 'focus' ? 'focus' : 'pointer';
    var pageZoom = Number(get('pageZoom', sites.isStreamEast ? 1.5 : 1.25));
    if ([1, 1.25, 1.5, 1.75, 2].indexOf(pageZoom) === -1) pageZoom = 1.25;
    var compatibility = SofaCompatibility(function (state, message) {
        compatibilityState = state;
        if (state === 'ready') { if (currentView === 'compatibility') closePanel(); toast('Aether loader started. Some features still depend on the TV.'); return; }
        if (!compatibilityText || !document.documentElement.contains(compatibilityText)) {
            var box = base('Opening Aether', 'Compatibility mode for Tizen 3'); currentView = 'compatibility';
            compatibilityText = el('p', 'sofa-loading-message'); box.appendChild(compatibilityText);
            var buttons = row(box);
            buttons.appendChild(button('Back to Sofa', function () { compatibility.cancel(); home(); }, 'sofa-primary'));
            buttons.appendChild(button('Retry website', function () { location.reload(); }));
            choose(buttons.querySelector('button'));
        }
        compatibilityText.textContent = state === 'failed' ? 'Aether could not start: ' + message + ' The TV may also be missing browser features this loader cannot supply.' : message;
        if (state === 'failed' && !panel.querySelector('.sofa-error-details')) panel.appendChild(button('Error details', function () { showDiagnostics('Aether startup', diagnostics.report()); }, 'sofa-error-details'));
    }, diagnostics.safeError);
    var blocker = SofaBlocker(C, topFrame ? get('blocking', true) !== false : true, function (message) { if (topFrame) toast(message); });
    var player = SofaPlayer(C, function (message) { if (playerStatus) playerStatus.textContent = message; });
    var saved = get('saved', [{name: 'Aether', url: 'https://aether.ist/'}, {name: 'StreamEast', url: 'https://v2.streameast.ga/'}]);
    if (!Array.isArray(saved)) saved = [];
    saved = saved.filter(function (item) { return item && typeof item.name === 'string' && C.normalize(item.url); }).slice(0, 32);
    if (topFrame && atHome) saved = bookmarks.migrate(saved, get(bookmarks.marker, false), put).saved;
    function isCinejoyHome(url) { return /^(?:https:\/\/(?:www\.)?cinejoy\.to\.?(?::443)?|http:\/\/(?:www\.)?cinejoy\.to\.?(?::80)?)\/*(?:[?#].*)?$/i.test(url); }
    function openCinejoy() {
        if (!topFrame || !cinejoyView) return;
        navigation.cancel(); compatibility.cancel(); restoreFrameControl(); cinejoyView.open();
    }
    function openMovy() {
        if (!atHome) { home('movy', 'open'); return; }
        if (!movyOrigin) { movySettings(); return; }
        go(helper.launchURL(movyOrigin));
    }
    function movySettings() {
        if (!atHome) { home('movy', 'settings'); return; }
        var p = base('Movy from your Mac', 'Keep the Movy helper running on your Mac while you watch.');
        currentView = 'movy-settings';
        p.appendChild(el('p', 'sofa-muted', 'Enter the Mac IP address shown by the helper. Your TV and Mac must be on the same network.'));
        var input = el('input', 'sofa-input'); input.type = 'text'; input.value = movyOrigin || '';
        input.placeholder = 'Mac IP address'; input.setAttribute('aria-label', 'Mac address'); p.appendChild(input);
        var controls = row(p);
        var save = button('Save and open Movy', function () {
            var origin = helper.normalizeOrigin(input.value);
            if (!origin) { toast('Enter the private Mac IP address shown by the helper. Use HTTP and port 8790 if you include them.'); choose(input); return; }
            movyOrigin = origin; input.value = origin; open.disabled = false;
            if (!put('movyHelper', origin)) { choose(open); return; }
            openMovy();
        }, 'sofa-primary'); controls.appendChild(save);
        var open = button('Open Movy', openMovy); open.disabled = !movyOrigin; controls.appendChild(open);
        controls.appendChild(button('Back to Sofa', renderHome));
        input.onclick = function () { showKeyboard(input, 'Mac address', function () { choose(save); }); };
        choose(input);
        if (!movyOrigin) showKeyboard(input, 'Mac address', function () { choose(save); });
    }
    function el(tag, cls, text) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (typeof text !== 'undefined') node.textContent = text;
        return node;
    }
    function button(text, action, cls) {
        var b = el('button', 'sofa-button ' + (cls || ''), text);
        b.type = 'button'; b.onclick = action;
        return b;
    }
    function toast(message) {
        if (!toastBox) return;
        toastBox.textContent = message; toastBox.style.display = 'block';
        clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastBox.style.display = 'none'; }, 4200);
    }
    function pointerActive() { return frameActive && mode === 'pointer' && !keyboard && !playerPanel && (!panelOpen || currentView === 'streams'); }
    function updateCursor() {
        if (!cursor) return;
        cursor.style.display = !atHome && pointerActive() ? 'block' : 'none';
        cursor.style.left = px + 'px'; cursor.style.top = py + 'px';
        if (hud) hud.style.display = frameActive && !atHome && !keyboard && !playerPanel && (!panelOpen || currentView === 'streams') ? 'block' : 'none';
    }
    function clickable(node) {
        var current = node;
        while (current && current !== document.body && current !== document.documentElement) {
            if (/^(A|BUTTON|INPUT|TEXTAREA|SELECT|VIDEO|IFRAME)$/.test(current.tagName) || current.getAttribute('role') === 'button' || current.isContentEditable || current.hasAttribute('onclick')) return current;
            current = current.parentElement;
        }
        return node;
    }
    function pointAtTarget() {
        var hit = document.elementFromPoint(px, py), target = hit && (sites.cardLink(hit) || clickable(hit));
        if (hoverTarget && hoverTarget !== target && hoverTarget.classList) hoverTarget.classList.remove('sofa-pointer-target');
        hoverTarget = target;
        if (target && target.classList) target.classList.add('sofa-pointer-target');
        cursor.className = 'sofa-cursor' + (target && target !== document.body && (target.tagName === 'A' || target.tagName === 'BUTTON' || root.contains(target)) ? ' sofa-cursor-link' : '');
        if (hit) hit.dispatchEvent(new MouseEvent('mousemove', {bubbles: true, clientX: px, clientY: py}));
    }
    function applyZoom() {
        if (!atHome && topFrame) document.body.style.zoom = String(pageZoom);
        if (hud) hud.querySelector('.sofa-hud-label').textContent = (mode === 'pointer' ? 'Arrows move cursor · OK opens' : 'Arrows select · OK opens') + ' · ' + Math.round(pageZoom * 100) + '%';
    }
    function choose(node) {
        if (!node) return;
        if (focused && focused.classList) focused.classList.remove('sofa-page-focus');
        focused = node;
        try { node.focus(); } catch (ignore) {}
        if (!root.contains(node)) {
            node.classList.add('sofa-page-focus');
            var r = node.getBoundingClientRect();
            if (r.top < 40 || r.bottom > innerHeight - 40) node.scrollIntoView(r.top < 40);
        } else {
            var rect = node.getBoundingClientRect();
            if (rect.bottom > innerHeight - 40 || rect.top < 20) node.scrollIntoView(rect.top < 20);
        }
    }
    function candidates(container) {
        var nodes = container.querySelectorAll('button,a[href],input,textarea,select,[tabindex],[role="button"],video,iframe,[contenteditable="true"]');
        var result = [];
        for (var i = 0; i < nodes.length && i < 1600; i++) {
            var n = nodes[i];
            if (n.disabled || n.hidden || (container === document && root.contains(n))) continue;
            if (n.getAttribute('tabindex') === '-1' && n.tagName !== 'VIDEO' && n.tagName !== 'IFRAME') continue;
            var r = n.getBoundingClientRect(), style = window.getComputedStyle(n);
            if (!r.width || !r.height || style.visibility === 'hidden' || style.display === 'none') continue;
            if (container === document && (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth)) continue;
            result.push({el: n, rect: r});
        }
        return result;
    }
    function move(key) {
        if (pointerActive()) {
            if (key === 37) px -= 24; if (key === 39) px += 24;
            if (key === 38) py -= 24; if (key === 40) py += 24;
            if ((key === 38 && py < 55) || (key === 40 && py > innerHeight - 75)) scrollAtPoint(key === 38 ? -170 : 170);
            if ((key === 37 && px < 24) || (key === 39 && px > innerWidth - 32)) window.scrollBy(key === 37 ? -150 : 150, 0);
            px = Math.max(12, Math.min(innerWidth - 32, px)); py = Math.max(55, Math.min(innerHeight - 75, py));
            updateCursor(); pointAtTarget();
            return;
        }
        var scope = keyboard || (panelOpen ? panel : document), list = candidates(scope);
        if (!list.length) { if (!panelOpen) window.scrollBy(0, key === 38 ? -250 : key === 40 ? 250 : 0); return; }
        var anchor = focused && document.documentElement.contains(focused) && (scope === document || scope.contains(focused)) ? focused : null;
        if (anchor && cinejoyView && cinejoyView.active()) {
            // Keep horizontal moves within a card row; toolbar buttons must not
            // win merely because their centers are nearer than the next card.
            var from = anchor.getBoundingClientRect();
            list = list.filter(function (item) {
                var r = item.rect;
                return key === 37 || key === 39 ? r.top < from.bottom && r.bottom > from.top : r.left < from.right && r.right > from.left;
            });
        }
        var next = anchor ? C.nearest(anchor.getBoundingClientRect(), list, key) : list[0].el;
        if (next) choose(next);
        else if (!panelOpen) window.scrollBy(key === 37 ? -250 : key === 39 ? 250 : 0, key === 38 ? -250 : key === 40 ? 250 : 0);
    }
    function scrollAtPoint(amount) {
        if (panelOpen && currentView === 'streams') { var scroller = panel.querySelector('.sofa-stream-list'); if (scroller) { scroller.scrollTop += amount; return; } }
        var n = document.elementFromPoint(Math.max(1, Math.min(innerWidth - 1, px)), Math.max(1, Math.min(innerHeight - 1, py)));
        while (n && n !== document.body) {
            if (n.scrollHeight > n.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(n).overflowY)) { n.scrollTop += amount; return; }
            n = n.parentElement;
        }
        window.scrollBy(0, amount);
    }
    function editField(node) {
        return node && (/^(INPUT|TEXTAREA)$/.test(node.tagName) && !/^(button|submit|checkbox|radio|range|file|hidden)$/.test(node.type) || node.isContentEditable);
    }
    function directFrames() { return document.querySelectorAll('iframe'); }
    function isChildWindow(source) {
        var frames = directFrames();
        for (var i = 0; i < frames.length; i++) if (frames[i].contentWindow === source) return true;
        return false;
    }
    function sharePagePolicy() {
        if (!pagePolicyKnown) return;
        var frames = directFrames();
        for (var i = 0; i < frames.length; i++) frames[i].contentWindow.postMessage({sofa: 1, action: 'page-policy', blocking: blocker.enabled}, '*');
    }
    function deactivateFrames() {
        clearTimeout(frameEntryTimer); frameEntryTimer = null; activeChildWindow = null;
        var frames = directFrames();
        for (var i = 0; i < frames.length; i++) frames[i].contentWindow.postMessage({sofa: 1, action: 'deactivate'}, '*');
    }
    function makeFramePassive() {
        frameActive = false; cancelEnter(); deactivateFrames();
        if (keyboard) dismissKeyboard();
        if (panel) { panel.style.display = 'none'; panelOpen = false; }
        if (toastBox) toastBox.style.display = 'none';
        updateCursor();
    }
    function restoreFrameControl() {
        deactivateFrames(); frameActive = true; window.focus(); updateCursor();
    }
    function requestParent(action) {
        makeFramePassive(); window.parent.postMessage({sofa: 1, action: action}, '*');
    }
    function enterFrame(target) {
        var r = target.getBoundingClientRect(), sx = r.width / (target.offsetWidth || r.width), sy = r.height / (target.offsetHeight || r.height);
        var x = (px - r.left - target.clientLeft * sx) / (target.clientWidth * sx || r.width);
        var y = (py - r.top - target.clientTop * sy) / (target.clientHeight * sy || r.height);
        deactivateFrames(); choose(target); frameActive = false; activeChildWindow = target.contentWindow; updateCursor();
        activeChildWindow.postMessage({sofa: 1, action: 'activate', x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y))}, '*');
        toast('Entering player frame · OK clicks · Back returns to the browser');
        frameEntryTimer = setTimeout(function () {
            if (!activeChildWindow) return;
            restoreFrameControl(); toast('This frame did not accept the cursor. Use Find video or the website player controls.');
        }, 1500);
    }
    function activate() {
        var target = pointerActive() ? document.elementFromPoint(px, py) : focused || document.activeElement;
        if (!target) return;
        var streamLink = !root.contains(target) && sites.cardLink(target);
        if (streamLink) { go(streamLink.href); return; }
        var parent = target;
        while (parent && parent !== document.body && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT|VIDEO|IFRAME)$/.test(parent.tagName) && parent.getAttribute('role') !== 'button' && !parent.isContentEditable) parent = parent.parentElement;
        if (parent && parent !== document.body) target = parent;
        if (target.tagName === 'IFRAME') {
            enterFrame(target); return;
        }
        if (editField(target) && !root.contains(target)) { showKeyboard(target, 'Type into this page', function () {}); return; }
        if (target.tagName === 'VIDEO') { controlVideo(target, 'toggle'); return; }
        if (target.tagName === 'SELECT') {
            var select = target; var choices = [];
            for (var i = 0; i < select.options.length; i++) (function (index) {
                if (!select.options[index].disabled) choices.push({text: select.options[index].text, action: function () { select.selectedIndex = index; select.dispatchEvent(new Event('change', {bubbles: true})); closePanel(); choose(select); }});
            }(i));
            showList('Choose an option', choices); return;
        }
        if (!root.contains(target)) {
            target.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, clientX: px, clientY: py}));
            target.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, clientX: px, clientY: py}));
        }
        if (target.tagName === 'A' && !root.contains(target) && !String(target.getAttribute('href') || '').match(/^#/)) {
            if (!C.normalize(target.href)) { toast('This link type is not supported.'); return; }
        }
        target.click();
    }
    function go(value, forceMedia) {
        var url = C.normalize(value);
        if (!url) { toast('Enter a website address, such as https://example.com'); return; }
        if (blocker.enabled && C.blocked(url)) { toast('That address matches the ad blocklist.'); return; }
        if (forceMedia || C.isMedia(url)) { startStream(url); return; }
        if (isCinejoyHome(url) && topFrame) { openCinejoy(); return; }
        navigation.cancel(); openingURL = url;
        var p = base('Opening ' + C.host(url), 'Connecting to the website…'); currentView = 'opening';
        var message = el('p', 'sofa-loading-message', sites.isAether || C.host(url) === 'aether.ist' ? 'Aether may need extra time to start on this TV.' : 'Please wait while the website opens.'); p.appendChild(message);
        var cancel = button('Cancel', cancelNavigation); p.appendChild(cancel); choose(cancel);
        navigation.start(url);
    }
    function cancelNavigation() {
        navigation.cancel();
        atHome ? renderHome() : closePanel();
    }
    function home(action, value) {
        if (cinejoyView) cinejoyView.cancel();
        if (!topFrame) { requestParent('home'); return; }
        if (atHome && !action) { renderHome(); return; }
        var hash = '#sofa-home';
        if (action) hash += '&' + action + '=' + encodeURIComponent(value);
        location.href = HOME + hash;
    }
    function closePanel() {
        if (keyboard) { dismissKeyboard(); return; }
        if (cinejoyView) cinejoyView.cancel();
        if (atHome) return;
        panelOpen = false; panel.style.display = 'none';
        updateCursor();
        if (focused && root.contains(focused)) focused = null;
    }
    function base(title, subtitle, keepCinejoy) {
        if (cinejoyView && !keepCinejoy) cinejoyView.cancel();
        if (keyboard) dismissKeyboard();
        if (toastBox) { clearTimeout(toastTimer); toastBox.style.display = 'none'; }
        panelOpen = true; panel.style.display = 'block'; panel.className = 'sofa-panel'; panel.textContent = '';
        panel.removeAttribute('data-cinejoy-screen');
        cursor.style.display = 'none'; currentView = title;
        if (hud) hud.style.display = 'none';
        var head = el('div', 'sofa-dialog-head');
        head.appendChild(el('div', 'sofa-eyebrow', 'SOFA / BROWSER'));
        head.appendChild(el('h1', '', title));
        if (subtitle) head.appendChild(el('p', 'sofa-muted', subtitle));
        panel.appendChild(head);
        return panel;
    }
    function showMatches() {
        var matches = sites.matches();
        if (!matches.length) { toast('No match links are available yet. Use the page cursor or try Refresh.'); return; }
        var p = base('StreamEast', 'Choose an event to open its stream page.'); currentView = 'streams'; p.className = 'sofa-panel sofa-streams';
        var top = row(p);
        top.appendChild(button(matchLiveOnly ? 'Live only: On' : 'Live only: Off', function () { matchLiveOnly = !matchLiveOnly; showMatches(); }));
        top.appendChild(button(matchQuery ? 'Search: ' + matchQuery : 'Search teams / events', function () {
            var search = el('input'); search.value = matchQuery;
            showKeyboard(search, 'Search teams or events', function () { matchQuery = search.value; showMatches(); });
        }));
        top.appendChild(button('Refresh matches', function () { location.reload(); }));
        top.appendChild(button('Original page', function () { matchViewDismissed = true; closePanel(); }));
        top.appendChild(button('Browser menu', showMenu));
        var categories = ['All']; matches.forEach(function (m) { if (categories.indexOf(m.sport) === -1) categories.push(m.sport); });
        var tabs = el('div', 'sofa-stream-tabs'); p.appendChild(tabs);
        categories.forEach(function (category) { tabs.appendChild(button(category, function () { matchCategory = category; showMatches(); }, category === matchCategory ? 'sofa-primary' : '')); });
        var list = el('div', 'sofa-stream-list'); p.appendChild(list); var count = 0;
        matches.forEach(function (match) {
            if ((matchCategory !== 'All' && match.sport !== matchCategory) || (matchLiveOnly && !match.live) || (matchQuery && match.title.toLowerCase().indexOf(matchQuery.toLowerCase()) === -1)) return;
            var b = button('', function () { go(match.url); }, 'sofa-match'); b.setAttribute('data-stream-url', match.url);
            b.appendChild(el('span', 'sofa-match-meta', match.sport + '  /  ' + match.status + (match.premium ? '  /  Premium' : '')));
            b.appendChild(el('strong', 'sofa-match-title', match.title));
            b.appendChild(el('span', 'sofa-match-footer', (match.score ? match.score + '    ' : '') + 'Open stream →'));
            list.appendChild(b); count++;
        });
        if (!count) list.appendChild(el('p', 'sofa-muted', 'No events match these filters. Choose All or clear the search.'));
        if (!matchViewDismissed && !focused) {
            var first = list.querySelector('button');
            if (first) { var r = first.getBoundingClientRect(); px = r.left + 40; py = r.top + 55; }
        }
        choose(list.querySelector('button') || top.querySelector('button')); updateCursor(); pointAtTarget();
    }
    function row(parent) { var r = el('div', 'sofa-row'); parent.appendChild(r); return r; }
    function showServers() {
        var sources = sites.servers(), items = [];
        sources.forEach(function (source) { items.push({text: source.title + (source.premium ? ' · Premium' : '') + (source.active ? ' · Selected' : ''), action: function () { go(source.url); }}); });
        showList('Choose a stream server', items, items.length ? 'These are the source links on this event page. Try another free server if one does not load.' : 'No server links were found on this page.');
    }
    function showDiagnostics(title, report) {
        var p = base('Error details', title + ' · Sofa 0.6.0'); currentView = 'diagnostics'; p.className = 'sofa-panel sofa-details';
        p.appendChild(el('p', 'sofa-muted', 'Report the OPEN/AETHER code or the first error line. These details stay on the TV.'));
        var content = el('pre', 'sofa-error-report', String(report || 'No details available.').slice(0, 5000));
        var controls = row(p);
        controls.appendChild(button('Earlier lines ↑', function () { content.scrollTop -= 200; }));
        var more = button('More lines ↓', function () { content.scrollTop += 200; }); controls.appendChild(more);
        controls.appendChild(button('Back', function () { atHome ? renderHome() : showMenu(); }));
        p.appendChild(content); choose(more);
    }
    function showList(title, items, subtitle) {
        var p = base(title, subtitle), list = el('div', 'sofa-list'); p.appendChild(list);
        for (var i = 0; i < items.length; i++) list.appendChild(button(items[i].text, items[i].action));
        list.appendChild(button('Back', function () { atHome ? renderHome() : showMenu(); }, 'sofa-secondary'));
        choose(list.querySelector('button'));
    }
    function renderHome() {
        navigation.cancel();
        player.close();
        var p = base('home'); p.className = 'sofa-panel sofa-home'; p.textContent = '';
        var side = el('aside', 'sofa-sidebar');
        side.appendChild(el('div', 'sofa-brand-mark', 's.'));
        side.appendChild(el('div', 'sofa-brand', 'sofa'));
        side.appendChild(el('div', 'sofa-brand-sub', 'THE WEB, LEANED BACK.'));
        side.appendChild(button('⌂  Home', renderHome, 'sofa-nav sofa-selected'));
        side.appendChild(button('↗  Open website', function () { address(false); }, 'sofa-nav'));
        side.appendChild(button('▷  Play a stream', function () { address(true); }, 'sofa-nav'));
        side.appendChild(button('☆  Saved sites', savedSites, 'sofa-nav'));
        side.appendChild(button('Movy settings', movySettings, 'sofa-nav'));
        side.appendChild(button('?  Remote guide', help, 'sofa-nav'));
        side.appendChild(el('div', 'sofa-device', 'MADE FOR YOUR TV\nSamsung UN55MU630D\nTizen 3 · Sofa 0.6.0'));
        p.appendChild(side);
        var main = el('main', 'sofa-main'); p.appendChild(main);
        var top = el('div', 'sofa-home-top');
        top.appendChild(el('span', 'sofa-eyebrow', 'YOUR PERSONAL TV BROWSER'));
        top.appendChild(el('span', 'sofa-pill', '●  Ad filtering ready'));
        main.appendChild(top);
        var hero = el('div', 'sofa-hero');
        var copy = el('div', 'sofa-hero-copy');
        copy.appendChild(el('h1', '', 'Your web.'));
        copy.appendChild(el('h1', 'sofa-accent', 'From the sofa.'));
        copy.appendChild(el('p', 'sofa-intro', 'A little less clicking. A lot more watching.\nOpen your favorite sites with just your remote.'));
        hero.appendChild(copy);
        var art = el('div', 'sofa-remote-art');
        art.innerHTML = '<div class="sofa-orbit"></div><div class="sofa-remote"><i></i><div class="sofa-dpad"><span>↑</span><b>OK</b><span>↓</span></div><div class="sofa-remote-keys">↶ &nbsp; ▷</div><div class="sofa-remote-line"></div></div><span class="sofa-art-label">ONE REMOTE. THE WHOLE WEB.</span>';
        hero.appendChild(art); main.appendChild(hero);
        var open = button('', function () { address(false); }, 'sofa-address-launch');
        open.appendChild(el('span', 'sofa-address-icon', '↗'));
        open.appendChild(el('span', '', 'Where do you want to go?'));
        open.appendChild(el('span', 'sofa-address-hint', 'Enter a web address  →'));
        main.appendChild(open);
        var label = el('div', 'sofa-section-label'); label.appendChild(el('h2', '', 'Your launchpad'));
        label.appendChild(el('span', 'sofa-muted', 'FAVORITES, ONE CLICK AWAY')); main.appendChild(label);
        var cards = el('div', 'sofa-cards'); main.appendChild(cards);
        for (var i = 0; i < Math.min(saved.length, 3); i++) (function (item, index) {
            var card = button('', function () { go(item.url); }, 'sofa-card sofa-card-' + index);
            card.appendChild(el('span', 'sofa-card-symbol', item.name.charAt(0).toUpperCase()));
            card.appendChild(el('strong', '', item.name)); card.appendChild(el('small', '', C.host(item.url)));
            cards.appendChild(card);
        }(saved[i], i));
        var movy = button('', openMovy, 'sofa-movy-card');
        movy.appendChild(el('span', 'sofa-card-symbol', 'M'));
        movy.appendChild(el('strong', '', 'Movy'));
        movy.appendChild(el('small', '', movyOrigin ? 'From your Mac' : 'Connect your Mac')); cards.appendChild(movy);
        var add = button('', addSite, 'sofa-card sofa-add-card');
        add.appendChild(el('span', 'sofa-card-symbol', '+')); add.appendChild(el('strong', '', 'Add a website'));
        add.appendChild(el('small', '', 'Make yourself at home')); cards.appendChild(add);
        var footer = el('div', 'sofa-home-footer');
        footer.appendChild(el('span', '', '↑ ↓ ← →  Move    ·    OK  Select    ·    Hold OK  Menu'));
        footer.appendChild(el('span', 'sofa-muted', 'Built for the big screen.')); main.appendChild(footer);
        choose(open);
        if (storageWarning) toast('Storage is unavailable; bookmarks may not persist.');
    }
    function address(stream) {
        base(stream ? 'Play a direct stream' : 'Open a website', stream ? 'Paste an MP4, HLS (.m3u8), or DASH (.mpd) URL. Website pages go in Open website.' : 'Enter a full website address. HTTPS is added automatically.');
        var input = el('input', 'sofa-input'); input.type = 'text'; input.placeholder = stream ? 'https://…/video.m3u8' : 'https://aether.ist';
        input.setAttribute('aria-label', stream ? 'Stream URL' : 'Website address');
        panel.appendChild(input);
        input.onclick = function () { showKeyboard(input, stream ? 'Stream address' : 'Website address', function () { go(input.value, stream); }); };
        var r = row(panel);
        r.appendChild(button(stream ? 'Play stream' : 'Open website', function () { go(input.value, stream); }, 'sofa-primary'));
        r.appendChild(button('Back', function () { atHome ? renderHome() : showMenu(); }));
        showKeyboard(input, stream ? 'Stream address' : 'Website address', function () { go(input.value, stream); });
    }
    function savedSites() {
        var items = [];
        for (var i = 0; i < saved.length; i++) (function (index) {
            items.push({text: saved[index].name + '  ·  ' + C.host(saved[index].url), action: function () {
                showList(saved[index].name, [
                    {text: 'Open website', action: function () { go(saved[index].url); }},
                    {text: 'Remove bookmark', action: function () { saved.splice(index, 1); put('saved', saved); savedSites(); }}
                ]);
            }});
        }(i));
        items.push({text: '+ Add a website', action: addSite});
        showList('Saved sites', items, 'Bookmarks stay on this TV.');
    }
    function addSite(url, name) {
        if (typeof url !== 'string') url = '';
        base('Add a website', 'Give it a name you can spot from the sofa.');
        var title = el('input', 'sofa-input'); title.value = name || ''; title.placeholder = 'Website name'; title.setAttribute('aria-label', 'Website name');
        var input = el('input', 'sofa-input'); input.value = url; input.placeholder = 'https://…'; input.setAttribute('aria-label', 'Bookmark URL');
        panel.appendChild(title); panel.appendChild(input);
        title.onclick = function () { showKeyboard(title, 'Website name', function () { choose(input); }); };
        input.onclick = function () { showKeyboard(input, 'Website address', function () { choose(save); }); };
        var save = button('Save website', function () {
            var normalized = C.normalize(input.value);
            if (!normalized) { toast('Enter a valid website URL.'); return; }
            var entry = {name: title.value.replace(/^\s+|\s+$/g, '').slice(0, 60) || C.host(normalized), url: normalized};
            saved = saved.filter(function (item) { return item.url !== normalized; }); saved.unshift(entry); saved = saved.slice(0, 32);
            put('saved', saved); renderHome();
        }, 'sofa-primary');
        var r = row(panel); r.appendChild(save); r.appendChild(button('Cancel', renderHome)); choose(title);
    }
    function showKeyboard(input, title, done) {
        if (keyboard) dismissKeyboard();
        focusBeforeKeyboard = focused;
        keyboard = el('section', 'sofa-keyboard'); keyboard.setAttribute('aria-label', 'On-screen keyboard');
        keyboard.appendChild(el('div', 'sofa-eyebrow', title));
        var display = el('input', 'sofa-keyboard-display'); display.type = input.type === 'password' ? 'password' : 'text';
        display.value = input.isContentEditable ? input.textContent : input.value;
        display.setAttribute('aria-label', 'Keyboard text'); keyboard.appendChild(display);
        var shift = false;
        function apply() {
            if (input.isContentEditable) input.textContent = display.value;
            else {
                var proto = input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
                var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
                setter.call(input, display.value);
            }
            input.dispatchEvent(new Event('input', {bubbles: true})); input.dispatchEvent(new Event('change', {bubbles: true}));
        }
        function insert(text) { var start = display.selectionStart === null ? display.value.length : display.selectionStart, end = display.selectionEnd === null ? start : display.selectionEnd;
            display.value = display.value.slice(0, start) + text + display.value.slice(end); display.setSelectionRange(start + text.length, start + text.length); }
        var layout = ['1234567890', 'qwertyuiop', 'asdfghjkl-', 'zxcvbnm./:'];
        var chars = [];
        for (var i = 0; i < layout.length; i++) {
            var keys = el('div', 'sofa-key-row'); keyboard.appendChild(keys);
            for (var j = 0; j < layout[i].length; j++) (function (ch) {
                var b = button(ch, function () { insert(shift ? ch.toUpperCase() : ch); }, 'sofa-key'); chars.push({el: b, value: ch}); keys.appendChild(b);
            }(layout[i].charAt(j)));
        }
        var symbols = el('div', 'sofa-key-row'); keyboard.appendChild(symbols);
        ['?', '&', '=', '_', '%', '#', '@', '+', '!', '*'].forEach(function (ch) { symbols.appendChild(button(ch, function () { insert(ch); }, 'sofa-key')); });
        var actions = row(keyboard);
        actions.appendChild(button('Shift', function () { shift = !shift; chars.forEach(function (ch) { ch.el.textContent = shift ? ch.value.toUpperCase() : ch.value; }); }));
        actions.appendChild(button('Space', function () { insert(' '); }));
        actions.appendChild(button('⌫ Delete', function () {
            var start = display.selectionStart, end = display.selectionEnd;
            if (start === end) start = Math.max(0, start - 1);
            display.value = display.value.slice(0, start) + display.value.slice(end); display.setSelectionRange(start, start);
        }));
        actions.appendChild(button('Clear', function () { display.value = ''; }));
        actions.appendChild(button('Done', function () { apply(); dismissKeyboard(); done(); }, 'sofa-primary'));
        actions.appendChild(button('Cancel', dismissKeyboard));
        root.appendChild(keyboard); choose(keyboard.querySelector('button')); updateCursor();
        display.setSelectionRange(display.value.length, display.value.length);
    }
    function dismissKeyboard() {
        if (!keyboard) return;
        keyboard.parentNode.removeChild(keyboard); keyboard = null;
        if (focusBeforeKeyboard && document.documentElement.contains(focusBeforeKeyboard)) choose(focusBeforeKeyboard);
        updateCursor();
    }
    function showMenu() {
        if (!topFrame) { requestParent('menu'); return; }
        restoreFrameControl();
        if (playerPanel) return;
        if (atHome) { renderHome(); return; }
        var p = base('Make yourself comfortable.', C.host(location.href));
        var actions = el('div', 'sofa-menu-grid'); p.appendChild(actions);
        actions.appendChild(button('Resume browsing', closePanel, 'sofa-primary'));
        if (sites.isStreamEast) actions.appendChild(button('StreamEast TV match list', showMatches));
        actions.appendChild(button('Cinejoy TV catalog', openCinejoy));
        actions.appendChild(button('Movy from your Mac', openMovy));
        if (sites.playerElement()) actions.appendChild(button('Choose stream server', showServers));
        actions.appendChild(button('Open another website', function () { address(false); }));
        actions.appendChild(button('← Page back', function () { closePanel(); if (history.length > 1) history.back(); else home(); }));
        actions.appendChild(button('⌂ Home & saved sites', function () { home(); }));
        actions.appendChild(button('Play in Sofa', findVideos, 'sofa-primary'));
        actions.appendChild(button('Find video on this page', findVideos));
        actions.appendChild(button('Page and player diagnostics', function () { findVideos(true); }));
        actions.appendChild(button('Play a direct stream', function () { address(true); }));
        actions.appendChild(button('Navigation: ' + (mode === 'focus' ? 'Focus → Pointer' : 'Pointer → Focus'), toggleMode));
        actions.appendChild(button('Page size: ' + Math.round(pageZoom * 100) + '%', function () {
            var levels = [1, 1.25, 1.5, 1.75, 2]; pageZoom = levels[(levels.indexOf(pageZoom) + 1) % levels.length]; put(sites.playerElement() ? 'playerPageZoom' : 'pageZoom', pageZoom); applyZoom(); showMenu();
        }));
        actions.appendChild(button('Ad blocking: ' + (blocker.enabled ? 'On' : 'Off') + ' for this page and players', function () { blocker.setEnabled(!blocker.enabled); put('blocking', blocker.enabled); sharePagePolicy(); showMenu(); toast('Setting saved for this page and its players. Reload to restore previously blocked resources.'); }));
        actions.appendChild(button('Allow next pop-up', function () { blocker.allowNextPopup = true; setTimeout(function () { blocker.allowNextPopup = false; }, 15000); closePanel(); toast('Next pop-up allowed in this tab for 15 seconds.'); }));
        actions.appendChild(button('☆ Save this website', function () { home('save', JSON.stringify({url: location.href, name: document.title.slice(0, 60)})); }));
        actions.appendChild(button('Reload this page', function () { location.reload(); }));
        actions.appendChild(button('Remote guide & diagnostics', help));
        p.appendChild(el('p', 'sofa-muted', blocker.count + ' resource attempts filtered · ' + blocker.popups + ' pop-ups stopped in this document. Filtering is best-effort.'));
        choose(actions.querySelector('button'));
    }
    function toggleMode() {
        mode = mode === 'focus' ? 'pointer' : 'focus';
        put('navigation', mode); closePanel(); updateCursor(); applyZoom();
        if (focused && focused.classList) focused.classList.remove('sofa-page-focus');
        focused = null; toast(mode === 'pointer' ? 'Pointer mode · Arrows move · OK clicks · Back opens menu' : 'Focus mode · Arrows move between links and controls');
    }
    function help() {
        var p = base('One remote is all you need.', 'Your UN55MU630D · Tizen 3 compatibility profile');
        var guide = el('div', 'sofa-guide');
        guide.innerHTML = '<p><b>Arrows</b> Move between controls. In Pointer mode, move the cursor; keep pushing at the edge to scroll.</p><p><b>OK / Select</b> Click. On a page, hold for 0.7 seconds to open the browser menu.</p><p><b>Back</b> Open the menu or close a dialog. Use “Page back” for website history.</p><p><b>Red / F2</b> Browser menu. <b>Green</b> Switch Focus / Pointer. <b>Yellow</b> Find video. <b>Blue</b> Home.</p><p><b>Play / Pause</b> Control video. <b>Rewind / Fast forward</b> Seek 10 seconds. During Sofa playback, Left / Right choose controls and OK selects.</p><p><b>Embedded players</b> Select the player frame to enter it. Back returns to the menu. Find video can discover accessible videos and direct media links.</p>';
        p.appendChild(guide);
        var avAvailable = !!(window.webapis && webapis.avplay);
        p.appendChild(el('p', 'sofa-diagnostics', 'Tizen APIs: ' + (window.tizen ? 'present' : 'not detected (desktop preview)') + '\nAVPlay: ' + (avAvailable ? 'available' : 'loaded on demand on TV') + '\nFilters: ' + C.domains.length + ' domains · document: ' + blocker.count + ' filtered / ' + blocker.popups + ' pop-ups\n' + navigator.userAgent));
        p.appendChild(el('p', 'sofa-muted', 'The TV’s old browser cannot run every modern website. DRM, codecs, login requirements, server-side ads and some embedded players remain site-dependent.'));
        var b = button('Back', function () { atHome ? renderHome() : showMenu(); }, 'sofa-primary'); p.appendChild(b); choose(b);
    }
    function startStream(url) {
        url = C.normalize(url);
        if (!url || !/^https?:\/\//i.test(url)) { toast('That stream address is not supported.'); return; }
        navigation.cancel();
        restoreFrameControl();
        // Keep the original document and player frames alive. Moving to the launcher
        // loses the loaded player's state and adds signed media URLs to history.
        discoveries.forEach(function (entry) { if (entry.data.hasVideo || entry.data.hasController) sendMedia(entry.route, 'pause'); });
        player.close();
        if (playerPanel && playerPanel.parentNode) playerPanel.parentNode.removeChild(playerPanel);
        playingURL = url;
        base('Sofa player'); panel.style.display = 'none'; panelOpen = false;
        playerPanel = el('div', 'sofa-player'); root.appendChild(playerPanel);
        var controls = el('div', 'sofa-player-controls'); playerPanel.appendChild(controls);
        controls.appendChild(el('h2', '', 'Sofa player'));
        playerStatus = el('div', 'sofa-player-status', 'Opening stream…'); controls.appendChild(playerStatus);
        var r = row(controls);
        r.appendChild(button('−10 s', function () { player.command('rewind'); }));
        r.appendChild(button('Play / Pause', function () { player.command('toggle'); }));
        r.appendChild(button('+10 s', function () { player.command('forward'); }));
        r.appendChild(button('Retry stream', function () { if (playingURL) player.open(playingURL, playerPanel); }));
        r.appendChild(button('Close player', stopStream));
        controls.appendChild(el('p', '', '← →: Choose a control    ·    OK: Select    ·    Back: Return to the page'));
        player.open(url, playerPanel);
        playerControlIndex = 1; choose(r.querySelectorAll('button')[playerControlIndex]); updateCursor();
    }
    function stopStream() {
        player.close(); if (playerPanel) playerPanel.parentNode.removeChild(playerPanel);
        playerPanel = null; playerStatus = null; playingURL = null;
        if (atHome) renderHome(); else { closePanel(); focused = null; updateCursor(); }
    }
    function controlVideo(video, action) {
        if (!video) return;
        try {
            if (action === 'toggle') action = video.paused ? 'play' : 'pause';
            if (action === 'play') { var result = video.play(); if (result && result.catch) result.catch(function () { toast('Select Play inside the site’s player to begin.'); }); }
            if (action === 'pause') video.pause();
            if (action === 'forward') video.currentTime = Math.min(video.currentTime + 10, isFinite(video.duration) ? Math.max(0, video.duration - 1) : Infinity);
            if (action === 'rewind') video.currentTime = Math.max(0, video.currentTime - 10);
            if (action === 'fullscreen') {
                var fs = video.requestFullscreen || video.webkitRequestFullscreen;
                if (fs) { var fullscreen = fs.call(video); if (fullscreen && fullscreen.catch) fullscreen.catch(function () { toast('Use the website player’s full-screen control.'); }); }
                else toast('Use the website player’s full-screen control.');
            }
        } catch (ignore) { toast('This player does not support that action.'); }
    }
    function localVideo() {
        if (focused && focused.tagName === 'VIDEO') return focused;
        var videos = document.querySelectorAll('video'), best = null, size = -1;
        for (var i = 0; i < videos.length; i++) {
            if (root && root.contains(videos[i])) continue;
            var r = videos[i].getBoundingClientRect(), area = r.width * r.height;
            if (area > size) { best = videos[i]; size = area; }
        }
        return best;
    }
    function mediaCommand(action) {
        if (playerPanel) { player.command(action); return; }
        if (lastVideoRoute && sendMedia(lastVideoRoute, action)) return;
        var video = localVideo();
        if (video) controlVideo(video, action); else if (topFrame) findVideos();
    }
    var discoveries = [], discoveryToken = 0, waitingFrames = [], mediaRoutes = {}, mediaRouteCount = 0, receivedMedia = [];
    function sendMedia(route, action) {
        if (route === 'self') {
            if (!mediaFinder.command(action)) controlVideo(localVideo(), action);
            return true;
        }
        var destination = mediaRoutes[route];
        if (!destination || !isChildWindow(destination.source)) return false;
        destination.source.postMessage({sofa: 1, action: 'media', route: destination.route, command: action}, '*'); return true;
    }
    function collectMedia() {
        var scan = mediaFinder.scan(), urls = [], videos = document.querySelectorAll('video'), seen = {};
        function add(value) { var safe = C.normalize(value); if (safe && !seen[safe] && urls.length < 20) { seen[safe] = true; urls.push(safe); } }
        for (var i = 0; i < videos.length; i++) {
            if (root && root.contains(videos[i])) continue;
            add(videos[i].currentSrc || videos[i].src);
            var sources = videos[i].querySelectorAll('source[src]'); for (var j = 0; j < sources.length; j++) add(sources[j].src);
        }
        var links = document.querySelectorAll('a[href]');
        for (var k = 0; k < links.length && k < 2000; k++) if (C.isMedia(links[k].href)) add(links[k].href);
        scan.candidates.forEach(function (candidate) { add(candidate.url); });
        return {urls: urls, candidates: scan.candidates, hasVideo: !!localVideo(), hasController: scan.hasController === true,
            hasBlob: scan.hasBlob === true, protectedMedia: scan.protectedMedia === true, host: C.host(location.href), details: diagnostics.snapshot()};
    }
    function discoverFrames(token) {
        discoveryToken = token; waitingFrames = []; receivedMedia = []; mediaRoutes = {}; mediaRouteCount = 0; lastVideoRoute = null;
        var frames = directFrames();
        for (var i = 0; i < frames.length && i < 100; i++) {
            waitingFrames.push(frames[i].contentWindow);
            frames[i].contentWindow.postMessage({sofa: 1, action: 'discover', token: token}, '*');
        }
    }
    function findVideos(detailsOnly) {
        detailsOnly = detailsOnly === true;
        if (!topFrame) { requestParent('find'); return; }
        restoreFrameControl();
        var token = ++discoveryToken;
        discoveries = [{route: 'self', data: collectMedia()}]; discoverFrames(token);
        showList('Looking for video…', [], 'Checking page videos, direct media links and embedded frames.');
        setTimeout(function () {
            if (token !== discoveryToken || currentView !== 'Looking for video…') return;
            var items = [], streams = [], seen = {}, number = 0, controllers = [], blob = false, protectedMedia = false;
            discoveries.forEach(function (entry) {
                if (detailsOnly) { items.push({text: 'Error details · ' + entry.data.host, action: function () { showDiagnostics(entry.data.host, diagnostics.format(entry.data.details)); }}); return; }
                blob = blob || entry.data.hasBlob; protectedMedia = protectedMedia || entry.data.protectedMedia;
                if (entry.data.hasVideo || entry.data.hasController) {
                    controllers.push(entry);
                    items.push({text: 'Play / pause website video · ' + entry.data.host, action: function () { lastVideoRoute = entry.route; closePanel(); mediaCommand('toggle'); }});
                    items.push({text: 'Full-screen website video · ' + entry.data.host, action: function () { lastVideoRoute = entry.route; closePanel(); mediaCommand('fullscreen'); }});
                }
                if (entry.data.protectedMedia) return;
                var candidates = (entry.data.candidates || []).slice();
                // Retain explicit DOM media links as well as the richer player sources.
                entry.data.urls.forEach(function (url) {
                    for (var i = 0; i < candidates.length; i++) if (candidates[i].url === url) return;
                    candidates.push({url: url, kind: /\.m3u8(?:[?#]|$)/i.test(url) ? 'hls' : /\.mpd(?:[?#]|$)/i.test(url) ? 'dash' : 'video'});
                });
                candidates.forEach(function (candidate) {
                    var url = candidate.url;
                    if (seen[url]) return; seen[url] = true;
                    number++;
                    streams.push({text: 'Play in Sofa · ' + candidate.kind.toUpperCase() + ' ' + number + ' · ' + C.host(url), action: function () { startStream(url); }});
                });
            });
            if (detailsOnly) showList('Page and player diagnostics', items, 'Choose the main page or an embedded player to view captured errors and video state. Frames without Sofa injection cannot report details.');
            else {
                items = streams.concat(items);
                if (controllers.length && !number) items.unshift({text: 'Start website player, then find stream', action: function () {
                    controllers.forEach(function (entry) { sendMedia(entry.route, 'play'); });
                    showList('Starting website player…', [], 'Waiting for the player to expose its stream.');
                    setTimeout(function () { if (currentView === 'Starting website player…') findVideos(); }, 1800);
                }});
                items.push({text: 'Refresh stream list', action: findVideos});
                if (sites.servers().length) items.push({text: 'Choose another server', action: showServers});
                items.push({text: 'Return to website player', action: closePanel});
                var hint = number ? 'Choose a stream to play in the Sofa overlay. The website stays open. Some providers require their original player.' :
                    protectedMedia ? 'This player requires protected playback. Use its website controls or choose another server.' :
                    controllers.length ? 'Start the website player to request its stream, then choose Play in Sofa when a source appears.' :
                    'This server has not exposed a usable stream or controllable player. Try another server or check Page and player diagnostics.';
                if (blob && !number && !protectedMedia) hint += ' Its current video uses an in-memory source; Sofa needs the original stream request.';
                showList('Play in Sofa', items, hint);
            }
        }, 900);
    }
    window.addEventListener('message', function (event) {
        var data = event.data;
        if (!data || data.sofa !== 1) return;
        if (!topFrame && event.source === window.parent) {
            if (data.action === 'page-policy' && typeof data.blocking === 'boolean') {
                blocker.setEnabled(data.blocking); pagePolicyKnown = true; sharePagePolicy();
            }
            if (data.action === 'activate' && root) {
                deactivateFrames(); frameActive = true; mode = 'pointer';
                px = typeof data.x === 'number' && isFinite(data.x) ? Math.max(0, Math.min(innerWidth - 1, data.x * innerWidth)) : innerWidth / 2;
                py = typeof data.y === 'number' && isFinite(data.y) ? Math.max(0, Math.min(innerHeight - 1, data.y * innerHeight)) : innerHeight / 2;
                window.focus(); updateCursor(); pointAtTarget();
                event.source.postMessage({sofa: 1, action: 'activated'}, '*');
                toast('Player cursor active · OK clicks · Back returns to the browser');
            }
            if (data.action === 'deactivate') makeFramePassive();
            if (data.action === 'media' && /^(toggle|play|pause|forward|rewind|fullscreen)$/.test(data.command)) sendMedia(data.route || 'self', data.command);
            if (data.action === 'discover' && typeof data.token === 'number' && isFinite(data.token)) {
                discoverFrames(data.token);
                event.source.postMessage({sofa: 1, action: 'discovered', token: data.token, route: 'self', data: collectMedia()}, '*');
            }
            return;
        }
        if (!isChildWindow(event.source)) return;
        if (data.action === 'page-policy-request' && pagePolicyKnown) event.source.postMessage({sofa: 1, action: 'page-policy', blocking: blocker.enabled}, '*');
        if (data.action === 'activated' && event.source === activeChildWindow) { clearTimeout(frameEntryTimer); frameEntryTimer = null; }
        if (data.action === 'menu') { topFrame ? showMenu() : requestParent('menu'); }
        if (data.action === 'find') { topFrame ? findVideos() : requestParent('find'); }
        if (data.action === 'home') { topFrame ? home() : requestParent('home'); }
        if (data.action === 'discovered' && data.token === discoveryToken && waitingFrames.indexOf(event.source) !== -1 &&
                typeof data.route === 'string' && /^(self|r[0-9]+)$/.test(data.route) && data.data && Array.isArray(data.data.urls) && mediaRouteCount < 100) {
            for (var i = 0; i < receivedMedia.length; i++) if (receivedMedia[i].source === event.source && receivedMedia[i].route === data.route) return;
            receivedMedia.push({source: event.source, route: data.route});
            var route = 'r' + (++mediaRouteCount);
            mediaRoutes[route] = {source: event.source, route: data.route};
            var details = diagnostics.sanitizeSnapshot(data.data.details);
            var safeHost = C.normalize(typeof data.data.host === 'string' ? data.data.host : '');
            var media = {hasVideo: data.data.hasVideo === true, hasController: data.data.hasController === true,
                hasBlob: data.data.hasBlob === true, protectedMedia: data.data.protectedMedia === true,
                candidates: mediaFinder.sanitizeCandidates(data.data.candidates),
                host: safeHost ? C.host(safeHost).slice(0, 120) : 'embedded player', urls: data.data.urls.slice(0, 20).filter(function (url) { return typeof url === 'string' && /^https?:\/\//i.test(url) && C.normalize(url) === url; }), details: details};
            if (topFrame) discoveries.push({route: route, data: media});
            else window.parent.postMessage({sofa: 1, action: 'discovered', token: discoveryToken, route: route, data: media}, '*');
        }
    });
    // Request as soon as injection is ready, and again at boot if the parent was still starting.
    if (!topFrame) window.parent.postMessage({sofa: 1, action: 'page-policy-request'}, '*');
    function back() {
        if (keyboard) { dismissKeyboard(); return; }
        if (playerPanel) { stopStream(); return; }
        if (cinejoyView && cinejoyView.active()) { cinejoyView.back(); return; }
        if (currentView === 'opening' && panelOpen) { cancelNavigation(); return; }
        if (currentView === 'compatibility' && panelOpen) { compatibility.cancel(); home(); return; }
        if (!topFrame) { requestParent('menu'); return; }
        if (atHome) {
            if (currentView !== 'home') { renderHome(); return; }
            showList('Leave Sofa Browser?', [{text: 'Keep browsing', action: renderHome}, {text: 'Exit to TV', action: function () { try { tizen.application.getCurrentApplication().exit(); } catch (ignore) { toast('Exit is available when running on your TV.'); } }}]); return;
        }
        if (panelOpen && currentView === 'streams') showMenu();
        else if (panelOpen) closePanel(); else showMenu();
    }
    function cancelEnter() { clearTimeout(enterTimer); enterTimer = null; enterDown = false; enterHeld = false; }
    function handleKey(event) {
        var key = event.keyCode || event.which;
        if (!frameActive && key !== 10009 && key !== 27 && key !== 113 && key !== 403) return;
        var textInput = editField(event.target);
        // Physical keyboards and Samsung's IME keep ordinary text-editing keys.
        if (textInput && (key !== 10009 && key !== 27 && key !== 113 && key !== 403) && (key !== 13 || keyboard && event.target.className === 'sofa-keyboard-display')) return;
        var used = true;
        if (key === 10009 || key === 27) { cancelEnter(); back(); }
        else if (key === 403 || key === 113) { cancelEnter(); if (keyboard) dismissKeyboard(); showMenu(); }
        else if (cinejoyView && cinejoyView.active() && [404, 405, 10252, 415, 19, 412, 417, 413].indexOf(key) !== -1) {
            toast(key === 404 ? 'Use the arrows to select a Cinejoy card and OK to open it.' : 'Cinejoy playback is not available on Tizen 3. This overlay browses its catalog.');
        }
        else if (playerPanel) {
            if (key === 37 || key === 39) {
                var controls = playerPanel.querySelectorAll('button');
                playerControlIndex = Math.max(0, Math.min(controls.length - 1, playerControlIndex + (key === 37 ? -1 : 1))); choose(controls[playerControlIndex]);
            }
            else if (key === 412) player.command('rewind');
            else if (key === 417) player.command('forward');
            else if (key === 13) { if (!event.repeat && focused && playerPanel.contains(focused)) focused.click(); }
            else if (key === 10252) { if (!event.repeat) player.command('toggle'); }
            else if (key === 415) player.command('play'); else if (key === 19) player.command('pause');
            else if (key === 413) stopStream();
        }
        else if (key >= 37 && key <= 40) move(key);
        else if (key === 13) {
            if ((panelOpen && currentView !== 'streams') || keyboard) { if (!event.repeat) activate(); }
            else if (!enterDown) {
                enterDown = true; enterHeld = false;
                enterTimer = setTimeout(function () { enterHeld = true; showMenu(); }, 700);
            }
        }
        else if (key === 404) toggleMode();
        else if (key === 405) findVideos();
        else if (key === 406) home();
        else if (key === 10252) mediaCommand('toggle');
        else if (key === 415) mediaCommand('play');
        else if (key === 19) mediaCommand('pause');
        else if (key === 412) mediaCommand('rewind');
        else if (key === 417) mediaCommand('forward');
        else if (key === 413) mediaCommand('pause');
        else used = false;
        if (used) { event.preventDefault(); event.stopImmediatePropagation(); }
    }
    function boot() {
        if (!document.body) return;
        var style = el('style'); style.setAttribute('data-sofa-style', 'true'); style.textContent = SOFA_CSS; document.documentElement.appendChild(style);
        root = el('div', 'sofa-root'); root.id = 'sofa-browser'; document.documentElement.appendChild(root);
        panel = el('section', 'sofa-panel'); root.appendChild(panel); panel.style.display = 'none';
        toastBox = el('div', 'sofa-toast'); toastBox.setAttribute('role', 'status'); root.appendChild(toastBox);
        cursor = el('div', 'sofa-cursor'); cursor.setAttribute('aria-hidden', 'true'); cursor.innerHTML = '<svg width="36" height="46" viewBox="0 0 36 46"><path d="M4 3 L4 35 L13 27 L21 43 L28 40 L20 25 L32 25 Z" fill="#b3ffd7" stroke="#06130c" stroke-width="3" stroke-linejoin="round"/></svg>'; root.appendChild(cursor);
        hud = el('div', 'sofa-hud'); hud.appendChild(el('span', 'sofa-hud-label'));
        if (topFrame && sites.repairPlayer()) {
            pageZoom = Number(get('playerPageZoom', 1));
            if ([1, 1.25, 1.5, 1.75, 2].indexOf(pageZoom) === -1) pageZoom = 1;
            hud.appendChild(button('Servers', showServers));
            hud.appendChild(button('Play in Sofa', findVideos, 'sofa-primary'));
            hud.appendChild(button('Go to player', function () { closePanel(); sites.playerElement().scrollIntoView(true); }));
        }
        hud.appendChild(button('Menu / Back', showMenu)); root.appendChild(hud); applyZoom(); updateCursor();
        if (topFrame) cinejoyView = SofaCinejoyView({
            base: function (title, subtitle) { var p = base(title, subtitle, true); currentView = 'cinejoy'; return p; },
            el: el, button: button, row: row, choose: choose, keyboard: showKeyboard,
            home: function () { home(); }, go: go
        }, SofaCinejoyCatalog());
        if (!topFrame) window.parent.postMessage({sofa: 1, action: 'page-policy-request'}, '*');
        else sharePagePolicy();
        document.addEventListener('focusin', function (event) { focused = event.target; }, true);
        window.addEventListener('keydown', handleKey, true);
        window.addEventListener('keyup', function (event) {
            if ((event.keyCode || event.which) === 13 && enterDown) {
                var click = !enterHeld; cancelEnter();
                event.preventDefault(); event.stopImmediatePropagation(); if (click) activate();
            }
        }, true);
        window.addEventListener('blur', cancelEnter);
        window.addEventListener('resize', function () { px = Math.min(px, innerWidth - 32); py = Math.min(py, innerHeight - 75); updateCursor(); });
        if (topFrame) {
            ['MediaPlayPause', 'MediaPlay', 'MediaPause', 'MediaStop', 'MediaFastForward', 'MediaRewind', 'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'].forEach(function (name) { try { tizen.tvinputdevice.registerKey(name); } catch (ignore) {} });
            if (atHome) {
                document.title = 'Sofa Browser'; document.body.style.background = '#0c1119'; renderHome();
                var hash = location.hash, match = hash.match(/&play=([^&]*)/), save = hash.match(/&save=([^&]*)/), movy = hash.match(/&movy=(open|settings)(?:&|$)/);
                try {
                    if (match || save || movy) history.replaceState(null, '', HOME + '#sofa-home');
                    if (match) { var url = C.normalize(decodeURIComponent(match[1])); if (url) startStream(url); }
                    if (save) { var data = JSON.parse(decodeURIComponent(save[1])); if (C.normalize(data.url)) addSite(data.url, typeof data.name === 'string' ? data.name : ''); }
                    if (!match && !save && movy) { if (movy[1] === 'open') openMovy(); else movySettings(); }
                } catch (ignore2) { toast('That saved address could not be read.'); }
            } else {
                toast('Arrows move the cursor · OK selects · Back opens menu');
                if (sites.isStreamEast) {
                    var attempts = 0, detectMatches = setInterval(function () {
                        attempts++;
                        if (sites.matches().length && !panelOpen && !matchViewDismissed) { clearInterval(detectMatches); showMatches(); }
                        else if (attempts >= 20) clearInterval(detectMatches);
                    }, 500);
                }
                if (sites.isAether) compatibility.begin(false);
                if (isCinejoyHome(location.href)) openCinejoy();
            }
        }
        window.SofaBrowser = {version: '0.6.0', diagnostics: function () { return {blocking: blocker.enabled, blocked: blocker.count, popups: blocker.popups, atHome: atHome, topFrame: topFrame, mode: mode, pageZoom: pageZoom, matches: sites.matches().length, servers: sites.servers().length, compatibility: compatibility.status(), page: diagnostics.snapshot()}; }};
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
}());

}());
