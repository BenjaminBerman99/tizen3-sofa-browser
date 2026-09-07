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

var SOFA_CSS = ".sofa-root { all: initial; position: fixed; z-index: 2147483646; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; font-family: Arial, Helvetica, sans-serif; color: #eef2f5; font-size: 22px; line-height: 1.5; text-align: left; }\n.sofa-root * { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }\n.sofa-root h1,.sofa-root h2,.sofa-root p { padding: 0; margin: 0; color: inherit; }\n.sofa-root h1 { font-size: 42px; font-weight: 500; line-height: 1.15; letter-spacing: -1px; }\n.sofa-root h2 { font-size: 24px; font-weight: 500; }\n.sofa-panel { pointer-events: auto; position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: 55px 6%; background: #0c1119; overflow-y: auto; }\n.sofa-dialog-head { margin-bottom: 28px; }\n.sofa-dialog-head h1 { margin: 12px 0 16px; }\n.sofa-eyebrow { color: #99a4b2; font-size: 13px; letter-spacing: 2px; font-weight: bold; }\n.sofa-muted { color: #96a1b0 !important; font-size: 17px; line-height: 1.6; }\n.sofa-button { all: initial; display: inline-block; box-sizing: border-box; cursor: pointer; pointer-events: auto; font: 20px/1.35 Arial, Helvetica, sans-serif; text-align: center; border: 2px solid #293341; border-radius: 10px; padding: 16px 23px; margin: 0 12px 12px 0; color: #edf2f6; background: #18212d; min-height: 60px; vertical-align: middle; transition: background-color .12s, border-color .12s; }\n.sofa-button:focus,.sofa-input:focus,.sofa-keyboard-display:focus { outline: 3px solid #a9f3d0 !important; outline-offset: 4px; border-color: #a9f3d0; background-color: #243c3a; }\n.sofa-button:hover { border-color: #a9f3d0; }\n.sofa-primary { background: #b3f1d3; color: #10221e; border-color: #b3f1d3; font-weight: bold; }\n.sofa-primary:focus { color: #0c211a; background: #ccffe7; }\n.sofa-secondary { color: #aeb9c6; }\n.sofa-row { display: flex; flex-wrap: wrap; align-items: center; margin-top: 22px; }\n.sofa-input { display: block; width: 100%; padding: 20px 25px; font-size: 26px; color: #edf2f6; background: #141e2a; border: 2px solid #3c4858; border-radius: 10px; margin-bottom: 24px; }\n.sofa-list { max-width: 1100px; }\n.sofa-list .sofa-button { display: block; width: 100%; text-align: left; overflow-wrap: break-word; word-wrap: break-word; }\n.sofa-menu-grid { display: flex; flex-wrap: wrap; margin-bottom: 22px; }\n.sofa-menu-grid .sofa-button { width: 31%; margin-bottom: 18px; text-align: left; font-size: 19px; }\n.sofa-home { padding: 0; display: flex !important; }\n.sofa-sidebar { flex: 0 0 235px; width: 235px; border-right: 1px solid #242b35; padding: 45px 26px; position: relative; }\n.sofa-brand-mark { display: inline-block; width: 45px; height: 45px; text-align: center; border: 2px solid #b3f1d3; border-radius: 15px; color: #b3f1d3; font-size: 33px; line-height: 35px; margin-right: 10px; vertical-align: middle; }\n.sofa-brand { display: inline-block; font-size: 39px; font-weight: bold; letter-spacing: -2px; vertical-align: middle; }\n.sofa-brand-sub { font-size: 9px; letter-spacing: 1.7px; color: #788492; margin: 16px 0 60px; }\n.sofa-nav { width: 100%; text-align: left; font-size: 17px; border: 1px solid transparent; background: transparent; padding: 16px 12px; margin: 0 0 10px; min-height: 54px; color: #96a1ae; }\n.sofa-selected { color: #b3f1d3; background: #172e2a; border-color: #29433b; }\n.sofa-device { white-space: pre-line; font-size: 12px; line-height: 1.9; position: absolute; bottom: 35px; left: 38px; color: #748292; }\n.sofa-main { flex: 1; min-width: 0; padding: 42px 48px 28px; }\n.sofa-home-top { display: flex; justify-content: space-between; align-items: center; }\n.sofa-pill { font-size: 12px; color: #b3f1d3; border: 1px solid #35443e; border-radius: 30px; padding: 8px 14px; background: #16261f; }\n.sofa-hero { display: flex; position: relative; height: 275px; margin: 32px 0 12px; align-items: center; }\n.sofa-hero-copy { width: 65%; z-index: 1; }\n.sofa-hero h1 { font-size: 62px; line-height: 1.02; font-weight: 500; letter-spacing: -2.6px; }\n.sofa-accent { color: #b3f1d3 !important; }\n.sofa-intro { color: #96a1af !important; font-size: 17px; line-height: 1.7; margin-top: 22px !important; white-space: pre-line; }\n.sofa-remote-art { position: relative; flex: 1; height: 260px; }\n.sofa-orbit { width: 260px; height: 260px; position: absolute; top: -5px; left: -14px; border-radius: 50%; border: 1px solid #2a403c; background: radial-gradient(ellipse at center, #224237 0%, #16251f 38%, #0c1119 70%); }\n.sofa-orbit:after { content: ''; position: absolute; top: 35px; left: 35px; right: 35px; bottom: 35px; border: 1px solid #294039; border-radius: 50%; }\n.sofa-remote { position: absolute; left: 68px; top: -10px; width: 92px; height: 236px; border-radius: 38px; transform: rotate(19deg); background: linear-gradient(110deg, #44514f, #222d2d 40%, #151e20 100%); box-shadow: -8px 12px 35px rgba(0,0,0,.4); border: 2px solid #50605a; }\n.sofa-remote i { position: absolute; top: 20px; left: 38px; width: 11px; height: 11px; border-radius: 100%; border: 2px solid #b3f1d3; }\n.sofa-dpad { position: absolute; top: 55px; left: 12px; width: 64px; height: 64px; border-radius: 100%; border: 1px solid #668075; background: #263d34; text-align: center; font-size: 11px; line-height: 16px; }\n.sofa-dpad b { display: block; font-size: 12px; line-height: 29px; color: #b3f1d3; }\n.sofa-remote-keys { position: absolute; top: 135px; left: 18px; color: #a8b9b2; font-size: 19px; }\n.sofa-remote-line { position: absolute; top: 183px; left: 31px; width: 24px; height: 3px; border-radius: 5px; background: #52655d; }\n.sofa-art-label { position: absolute; bottom: 0; width: 250px; text-align: center; font-size: 8px; letter-spacing: 1.4px; color: #73877d; }\n.sofa-address-launch { width: 100%; display: flex; align-items: center; text-align: left; background: #151e28; padding: 20px 25px; margin: 0; font-size: 20px; border-color: #45584f; border-radius: 12px; }\n.sofa-address-icon { color: #b3f1d3; font-size: 25px; margin-right: 18px; }\n.sofa-address-hint { font-size: 12px; color: #93a097; margin-left: auto; padding-left: 15px; }\n.sofa-section-label { display: flex; align-items: center; justify-content: space-between; margin: 30px 0 20px; }\n.sofa-section-label .sofa-muted { font-size: 9px; letter-spacing: 1.4px; }\n.sofa-cards { display: flex; }\n.sofa-card { flex: 1; display: block; min-width: 0; height: 147px; text-align: left; padding: 19px; background: #192026; border-color: #2f3c43; margin-right: 15px; }\n.sofa-card:last-child { margin-right: 0; }\n.sofa-card-symbol { display: block; color: #b3f1d3; font-size: 26px; margin-bottom: 15px; line-height: 1; }\n.sofa-card strong { display: block; font-size: 18px; margin-bottom: 6px; }\n.sofa-card small { display: block; font-size: 11px; color: #84919e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.sofa-card-0 { background: linear-gradient(130deg, #253433, #172127); }\n.sofa-card-1 { background: linear-gradient(130deg, #282d40, #181e2c); }\n.sofa-card-1 .sofa-card-symbol { color: #bcbdf5; }\n.sofa-card-2 { background: linear-gradient(130deg, #39342b, #211f20); }\n.sofa-add-card { background: transparent; border-style: dashed; }\n.sofa-add-card .sofa-card-symbol { color: #93a09c; }\n.sofa-home-footer { display: flex; justify-content: space-between; margin-top: 29px; padding-top: 20px; border-top: 1px solid #242c37; font-size: 11px; color: #acb7c0; }\n.sofa-home-footer .sofa-muted { font-size: 11px; }\n.sofa-keyboard { pointer-events: auto; position: absolute; z-index: 8; bottom: 3%; left: 10%; width: 80%; background: #121c29; border: 2px solid #43574f; border-radius: 20px; padding: 24px 30px; box-shadow: 0 0 0 2000px rgba(0,0,0,.65); }\n.sofa-keyboard-display { display: block; background: #0a1018; color: #eef2f5; border: 1px solid #50615b; border-radius: 8px; width: 100%; padding: 12px 18px; font-size: 26px; margin: 10px 0 20px; }\n.sofa-key-row { display: flex; margin-bottom: 9px; }\n.sofa-key { flex: 1; padding: 8px 0; margin: 0 8px 0 0; min-height: 40px; font-size: 21px; border-radius: 7px; }\n.sofa-key:last-child { margin-right: 0; }\n.sofa-keyboard .sofa-row { margin-top: 16px; }\n.sofa-keyboard .sofa-row .sofa-button { flex: 1; padding: 10px 8px; font-size: 17px; min-height: 42px; margin-bottom: 0; }\n.sofa-toast { pointer-events: none; display: none; position: absolute; bottom: 6%; left: 15%; width: 70%; padding: 18px 26px; border: 1px solid #587666; color: #ebfff4; background: #1b3029; border-radius: 12px; text-align: center; z-index: 10; font-size: 21px; }\n.sofa-cursor { pointer-events: none; position: absolute; display: none; z-index: 20; width: 36px; height: 46px; margin: 0; filter: drop-shadow(0 2px 3px #000); }\n.sofa-cursor svg,.sofa-cursor path { pointer-events: none; }\n.sofa-cursor-link svg path { fill: #ffffff; }\n.sofa-pointer-target { outline: 3px solid #b3ffd7 !important; outline-offset: 3px !important; }\n.sofa-hud { pointer-events: auto; position: absolute; display: none; z-index: 4; right: 30px; bottom: 18px; padding: 8px 12px 8px 18px; background: rgba(10,24,20,.95); border: 1px solid #5e8975; border-radius: 10px; color: #e1f9eb; }\n.sofa-hud-label { font-size: 17px; margin-right: 16px; }\n.sofa-hud .sofa-button { min-height: 34px; font-size: 16px; padding: 8px 12px; margin: 0; }\n.sofa-loading-message { padding: 28px 0; font-size: 26px; max-width: 1000px; line-height: 1.5; }\n.sofa-streams { padding: 32px 4% 80px; overflow: hidden; }\n.sofa-streams .sofa-dialog-head { margin-bottom: 10px; }\n.sofa-streams .sofa-dialog-head h1 { margin: 6px 0; }\n.sofa-streams .sofa-dialog-head .sofa-muted { font-size: 20px; }\n.sofa-streams .sofa-row { margin-top: 10px; }\n.sofa-streams .sofa-row .sofa-button,.sofa-stream-tabs .sofa-button { min-height: 44px; padding: 10px 15px; font-size: 18px; }\n.sofa-stream-tabs { white-space: nowrap; overflow-x: auto; padding: 6px; margin: 0 -6px 12px; }\n.sofa-stream-list { display: flex; flex-wrap: wrap; align-content: flex-start; overflow-y: auto; height: calc(100vh - 360px); padding: 8px; margin: -8px; }\n.sofa-match { display: block; width: calc(50% - 16px); min-height: 160px; text-align: left; padding: 22px 25px; margin: 8px; background: #1b303c; border-color: #3e6169; }\n.sofa-match-meta { display: block; font-size: 16px; color: #b3f1d3; margin-bottom: 12px; }\n.sofa-match-title { display: block; font-size: 27px; line-height: 1.3; white-space: normal; }\n.sofa-match-footer { display: block; font-size: 19px; color: #bccbd5; margin-top: 14px; }\n@media (min-width: 1600px) { .sofa-streams { padding: 45px 5% 80px; } .sofa-stream-list { height: calc(100vh - 390px); } .sofa-match { min-height: 205px; padding: 30px; } .sofa-match-title { font-size: 35px; } .sofa-match-meta { font-size: 20px; } .sofa-match-footer { font-size: 24px; } }\n.sofa-page-focus { outline: 4px solid #73f3b7 !important; outline-offset: 4px !important; box-shadow: 0 0 0 7px rgba(12,30,21,.7) !important; }\n.sofa-guide p { font-size: 20px; margin: 0 0 16px; color: #abb8c4; }\n.sofa-guide b { color: #b3f1d3; }\n.sofa-diagnostics { font-size: 13px; color: #929fab !important; white-space: pre-line; padding: 18px; border: 1px solid #303c49; border-radius: 8px; margin: 20px 0 !important; word-break: break-word; }\n.sofa-guide + .sofa-muted { margin: 20px 0; }\n.sofa-player { pointer-events: auto; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; }\n.sofa-player-surface,.sofa-av-object,.sofa-html-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }\n.sofa-player-controls { position: absolute; z-index: 2; bottom: 0; left: 0; width: 100%; padding: 20px 5% 22px; background: linear-gradient(transparent, rgba(0,0,0,.88)); }\n.sofa-player-status { font-size: 22px; }\n.sofa-player-controls p { color: #b4c0cb; font-size: 15px; }\n@media (max-height: 760px) { .sofa-main { padding-top: 30px; } .sofa-hero { height: 210px; margin-top: 18px; } .sofa-remote-art { transform: scale(.8); transform-origin: center; } .sofa-section-label { margin-top: 22px; margin-bottom: 16px; } .sofa-card { height: 128px; padding: 15px 19px; } .sofa-card-symbol { margin-bottom: 10px; } .sofa-home-footer { margin-top: 17px; padding-top: 15px; } .sofa-keyboard { padding: 18px 25px; } .sofa-keyboard-display { font-size: 23px; margin-bottom: 16px; } }\n@media (min-width: 1600px) { .sofa-sidebar { flex-basis: 300px; width: 300px; padding: 65px 40px; } .sofa-main { padding: 65px 70px 35px; } .sofa-hero { height: 390px; margin: 45px 0 24px; } .sofa-hero h1 { font-size: 88px; } .sofa-intro { font-size: 23px; } .sofa-remote-art { transform: scale(1.3); transform-origin: center; margin-left: 70px; } .sofa-address-launch { padding: 29px 32px; font-size: 28px; } .sofa-address-hint { font-size: 18px; } .sofa-section-label { margin-top: 45px; } .sofa-card { height: 195px; padding: 28px; } .sofa-card strong { font-size: 24px; } .sofa-card small { font-size: 16px; } .sofa-card-symbol { font-size: 34px; margin-bottom: 24px; } .sofa-nav { font-size: 22px; margin-bottom: 20px; } .sofa-device { font-size: 16px; } .sofa-home-footer { font-size: 16px; margin-top: 40px; } .sofa-home-footer .sofa-muted { font-size: 15px; } .sofa-keyboard { width: 70%; left: 15%; padding: 35px; } .sofa-key { min-height: 65px; font-size: 28px; } }\n@media (max-width: 1050px) { .sofa-sidebar { flex-basis: 180px; width: 180px; padding: 25px 15px; } .sofa-main { padding: 28px; } .sofa-brand-sub { margin-bottom: 28px; } .sofa-hero h1 { font-size: 46px; } .sofa-hero { height: 220px; } .sofa-remote-art { transform: scale(.75); transform-origin: left center; } .sofa-intro { font-size: 13px; } .sofa-device { left: 22px; font-size: 10px; } .sofa-address-hint { display: none; } .sofa-card { height: 125px; padding: 14px; } .sofa-home-footer { margin-top: 20px; } .sofa-pill { font-size: 10px; } .sofa-home-top .sofa-eyebrow { font-size: 10px; } }\n";
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
            cosmetic.textContent = 'ins.adsbygoogle,[id^="google_ads_iframe"],[id^="div-gpt-ad"],.taboola,.' + 'OUTBRAIN,[data-ad-slot],[data-ad-client]{display:none!important}';
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
    var av = null, video = null, layer = null, active = false, generation = 0, timer = null;
    function close() {
        generation++;
        active = false;
        clearTimeout(timer);
        if (av) {
            try { var s = av.getState(); if (s === 'PLAYING' || s === 'PAUSED' || s === 'READY') av.stop(); } catch (ignore) {}
            try { av.close(); } catch (ignore2) {}
        }
        if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
        if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
        av = null; video = null; layer = null;
    }
    function loadAPI(done) {
        if (window.webapis && webapis.avplay) { done(webapis.avplay); return; }
        if (!window.tizen) { done(null); return; }
        var script = document.createElement('script'), ended = false;
        function finish() {
            if (ended) return; ended = true;
            done(window.webapis && webapis.avplay ? webapis.avplay : null);
        }
        script.onload = finish; script.onerror = finish;
        script.src = '$WEBAPIS/webapis/webapis.js';
        (document.head || document.documentElement).appendChild(script);
        setTimeout(finish, 2500);
    }
    function open(url, parent) {
        url = core.normalize(url);
        if (!url) { status('Enter a valid HTTP or HTTPS stream URL.'); return; }
        close(); active = true;
        var current = generation;
        layer = document.createElement('div'); layer.className = 'sofa-player-surface';
        parent.appendChild(layer);
        status('Opening stream…');
        loadAPI(function (api) {
            if (!active || current !== generation) return;
            if (api) {
                av = api;
                var object = document.createElement('object');
                object.type = 'application/avplayer'; object.className = 'sofa-av-object'; layer.appendChild(object);
                try {
                    av.open(url);
                    av.setDisplayRect(0, 0, 1920, 1080);
                    av.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
                    av.setListener({
                        onbufferingstart: function () { if (active && current === generation) status('Buffering…'); },
                        onbufferingcomplete: function () { if (active && current === generation) status('Playing · Samsung AVPlay'); },
                        onstreamcompleted: function () { if (active && current === generation) { close(); status('Stream ended. Press Back to return.'); } },
                        onerror: function (error) { if (active && current === generation) { close(); status('Playback failed: ' + error + '. Try another stream or use the website’s player.'); } }
                    });
                    timer = setTimeout(function () { if (active && current === generation) { close(); status('Stream timed out. Check the URL, then try again.'); } }, 30000);
                    av.prepareAsync(function () {
                        if (!active || current !== generation) return;
                        clearTimeout(timer);
                        try { av.play(); status('Playing · Samsung AVPlay'); } catch (error) { close(); status('Could not start playback: ' + error.message); }
                    }, function (error) {
                        if (!active || current !== generation) return;
                        close(); status('Unable to prepare this stream: ' + (error && error.message || error) + '. Check codec, login and stream availability.');
                    });
                } catch (error) { close(); status('Samsung player error: ' + error.message); }
            } else {
                video = document.createElement('video'); video.controls = false; video.autoplay = true; video.className = 'sofa-html-video';
                video.onplaying = function () { status('Playing · HTML5'); };
                video.onwaiting = function () { status('Buffering…'); };
                video.onended = function () { status('Stream ended. Press Back to return.'); };
                video.onerror = function () { status('This stream could not play. HLS/DASH need Samsung AVPlay; codecs, login or CORS can also prevent playback.'); };
                layer.appendChild(video); video.src = url;
                var promise = video.play();
                if (promise && promise.catch) promise.catch(function () { if (active) status('Press Play to start; this browser may not support the stream.'); });
            }
        });
    }
    function command(action) {
        if (!active) return;
        try {
            var s = av ? av.getState() : video && (video.paused ? 'PAUSED' : 'PLAYING');
            if (action === 'toggle') action = s === 'PLAYING' ? 'pause' : 'play';
            if (action === 'pause' && s === 'PLAYING') { if (av) av.pause(); else video.pause(); status('Paused'); }
            if (action === 'play' && (s === 'PAUSED' || s === 'READY')) {
                var result = av ? av.play() : video.play(); if (result && result.catch) result.catch(function () { status('Could not resume playback.'); });
                status('Playing');
            }
            if ((action === 'forward' || action === 'rewind') && (s === 'PLAYING' || s === 'PAUSED')) {
                var delta = action === 'forward' ? 10 : -10;
                if (av) {
                    var duration = av.getDuration(), target = Math.max(0, av.getCurrentTime() + delta * 1000);
                    if (duration > 0) target = Math.min(target, Math.max(0, duration - 1000));
                    av.seekTo(target, function () {}, function () { status('Seeking is unavailable for this stream.'); });
                } else if (video) video.currentTime = Math.max(0, Math.min(video.currentTime + delta, isFinite(video.duration) ? Math.max(0, video.duration - 1) : Infinity));
            }
        } catch (error) { status('Player: ' + error.message); }
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) command('pause'); });
    window.addEventListener('pagehide', close);
    return {open: open, close: close, command: command, active: function () { return active; }};
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
    return {matches: matches, cardLink: cardLink, isStreamEast: /(^|\.)streameast\.ga$/.test(core.host(location.href)), isAether: core.host(location.href) === 'aether.ist'};
}

/* Site code stays on its original origin. Only this loader and public library URLs ship. */
function SofaCompatibility(progress) {
    'use strict';
    var running = false, completed = false, failure = '', cancelled = false, startupTimer;
    var CDN = 'https://cdn.jsdelivr.net/npm/';
    var libraries = [
        'core-js-bundle@3.46.0/minified.js',
        'systemjs@6.15.1/dist/system.min.js',
        'systemjs@6.15.1/dist/extras/transform.min.js',
        '@babel/standalone@7.28.4/babel.min.js'
    ];
    function script(path, done) {
        var node = document.createElement('script'), ended = false;
        var timer = setTimeout(function () { finish(new Error('Compatibility download timed out.')); }, 30000);
        function finish(error) { if (ended) return; ended = true; clearTimeout(timer); node.onload = null; node.onerror = null; done(error); }
        node.onload = function () { finish(); };
        node.onerror = function () { finish(new Error('A compatibility library was blocked or could not be downloaded.')); };
        node.src = CDN + path; (document.head || document.documentElement).appendChild(node);
    }
    function fail(error) {
        if (cancelled) return;
        clearTimeout(startupTimer); cancelled = true;
        running = false; failure = String(error && error.message || error).slice(0, 260);
        progress('failed', failure);
    }
    function begin(force) {
        if (running || completed) return;
        var scripts = document.querySelectorAll('script[type="module"][src]'), entries = [];
        if (!force && 'noModule' in document.createElement('script')) return;
        for (var i = 0; i < scripts.length; i++) {
            var link = document.createElement('a'); link.href = scripts[i].src;
            if (link.protocol === location.protocol && link.host === location.host && /^\/assets\//.test(link.pathname)) entries.push(link.href);
        }
        if (!entries.length) { fail('No supported app entry was found. Use Retry to reload the website.'); return; }
        running = true; cancelled = false; failure = '';
        startupTimer = setTimeout(function () { fail(new Error('The compatibility startup took too long. Try reloading the website.')); }, 120000);
        progress('loading', 'Preparing Aether for this TV. The first load can take a while.');
        var index = 0;
        function next(error) {
            if (error) { fail(error); return; }
            if (cancelled) { running = false; return; }
            if (index < libraries.length) { script(libraries[index++], next); return; }
            try {
                if (!window.System || !window.Babel || !window.fetch) throw new Error('Required compatibility tools or browser APIs are unavailable.');
                var loader = new window.System.constructor();
                // Keep the global register callback in sync with the loader evaluating modules.
                window.System = loader;
                loader.transform = function (url, source) {
                    if (cancelled) return Promise.reject(new Error('Loading cancelled.'));
                    if (running) progress('compiling', 'Adapting website code for the TV…');
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
                    running = false; completed = true;
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
    return {begin: begin, cancel: function () { cancelled = true; running = false; clearTimeout(startupTimer); }, status: function () { return {running: running, completed: completed, error: failure}; }};
}

(function () {
    'use strict';
    var C = window.SofaCore;
    var HOME = window.__SOFA_PREVIEW_HOME__ || 'http://127.0.0.1:8081/';
    var atHome = location.href.split('#')[0] === HOME;
    var topFrame = window === window.top;
    var root, panel, toastBox, cursor, outline, focused, keyboard, focusBeforeKeyboard, hud, hoverTarget;
    var mode = 'pointer', panelOpen = false, enterTimer = null, enterHeld = false, enterDown = false;
    var px = window.innerWidth / 2, py = window.innerHeight / 2;
    var currentView = 'home', toastTimer, playerStatus, playerPanel, lastVideoWindow = null;
    var storageWarning = false;
    var sites = SofaSites(C), matchCategory = 'All', matchLiveOnly = false, matchQuery = '', matchViewDismissed = false;
    var loadingTimer = null, navigationNumber = 0, compatibilityText = null, compatibilityState = '';
    function get(key, fallback) {
        try { var raw = localStorage.getItem('sofa.' + key); return raw === null ? fallback : JSON.parse(raw); }
        catch (ignore) { storageWarning = true; return fallback; }
    }
    function put(key, value) {
        try { localStorage.setItem('sofa.' + key, JSON.stringify(value)); return true; }
        catch (ignore) { storageWarning = true; toast('Storage unavailable. Changes last for this session only.'); return false; }
    }
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
    });
    var blocker = SofaBlocker(C, get('blocking', true) !== false, function (message) { if (topFrame) toast(message); });
    var player = SofaPlayer(C, function (message) { if (playerStatus) playerStatus.textContent = message; });
    var saved = get('saved', [{name: 'Aether', url: 'https://aether.ist/'}, {name: 'StreamEast', url: 'https://v2.streameast.ga/'}]);
    if (!Array.isArray(saved)) saved = [];
    saved = saved.filter(function (item) { return item && typeof item.name === 'string' && C.normalize(item.url); }).slice(0, 32);
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
    function pointerActive() { return mode === 'pointer' && !keyboard && !playerPanel && (!panelOpen || currentView === 'streams'); }
    function updateCursor() {
        if (!cursor) return;
        cursor.style.display = !atHome && pointerActive() ? 'block' : 'none';
        cursor.style.left = px + 'px'; cursor.style.top = py + 'px';
        if (hud) hud.style.display = !atHome && !keyboard && !playerPanel && (!panelOpen || currentView === 'streams') ? 'block' : 'none';
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
    function activate() {
        var target = pointerActive() ? document.elementFromPoint(px, py) : focused || document.activeElement;
        if (!target) return;
        var streamLink = !root.contains(target) && sites.cardLink(target);
        if (streamLink) { go(streamLink.href); return; }
        var parent = target;
        while (parent && parent !== document.body && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT|VIDEO|IFRAME)$/.test(parent.tagName) && parent.getAttribute('role') !== 'button' && !parent.isContentEditable) parent = parent.parentElement;
        if (parent && parent !== document.body) target = parent;
        if (target.tagName === 'IFRAME') {
            choose(target); target.contentWindow.postMessage({sofa: 1, action: 'activate'}, '*');
            cursor.style.display = 'none'; toast('Inside player frame · Back opens browser menu'); return;
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
        clearTimeout(loadingTimer);
        var number = ++navigationNumber;
        var p = base('Opening ' + C.host(url), 'Connecting to the website…'); currentView = 'opening';
        var message = el('p', 'sofa-loading-message', sites.isAether || C.host(url) === 'aether.ist' ? 'Aether may need extra time to start on this TV.' : 'Please wait while the website opens.'); p.appendChild(message);
        var cancel = button('Cancel', cancelNavigation); p.appendChild(cancel); choose(cancel);
        loadingTimer = setTimeout(function () {
            if (number !== navigationNumber || currentView !== 'opening') return;
            message.textContent = 'The TV has not finished opening this site. Its connection, certificates, or browser requirements may be incompatible. Try again or return to Sofa.';
            var actions = row(p); actions.appendChild(button('Retry', function () { go(url); })); actions.appendChild(button('Back to Sofa', function () { window.stop(); home(); }));
        }, 15000);
        // Defer navigation so loading feedback is painted before a slow TLS handshake.
        setTimeout(function () { if (number === navigationNumber) location.assign(url); }, 50);
    }
    function cancelNavigation() {
        navigationNumber++; clearTimeout(loadingTimer); window.stop();
        atHome ? renderHome() : closePanel();
    }
    function home(action, value) {
        if (atHome && !action) { renderHome(); return; }
        var hash = '#sofa-home';
        if (action) hash += '&' + action + '=' + encodeURIComponent(value);
        location.href = HOME + hash;
    }
    function closePanel() {
        if (keyboard) { dismissKeyboard(); return; }
        if (atHome) return;
        panelOpen = false; panel.style.display = 'none';
        updateCursor();
        if (focused && root.contains(focused)) focused = null;
    }
    function base(title, subtitle) {
        if (keyboard) dismissKeyboard();
        panelOpen = true; panel.style.display = 'block'; panel.className = 'sofa-panel'; panel.textContent = '';
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
    function showList(title, items, subtitle) {
        var p = base(title, subtitle), list = el('div', 'sofa-list'); p.appendChild(list);
        for (var i = 0; i < items.length; i++) list.appendChild(button(items[i].text, items[i].action));
        list.appendChild(button('Back', function () { atHome ? renderHome() : showMenu(); }, 'sofa-secondary'));
        choose(list.querySelector('button'));
    }
    function renderHome() {
        navigationNumber++; clearTimeout(loadingTimer);
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
        side.appendChild(button('?  Remote guide', help, 'sofa-nav'));
        side.appendChild(el('div', 'sofa-device', 'MADE FOR YOUR TV\nSamsung UN55MU630D\nTizen 3 · Sofa 0.2.0'));
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
        if (!topFrame) { window.top.postMessage({sofa: 1, action: 'menu'}, '*'); return; }
        if (playerPanel) return;
        if (atHome) { renderHome(); return; }
        var p = base('Make yourself comfortable.', C.host(location.href));
        var actions = el('div', 'sofa-menu-grid'); p.appendChild(actions);
        actions.appendChild(button('Resume browsing', closePanel, 'sofa-primary'));
        if (sites.isStreamEast) actions.appendChild(button('StreamEast TV match list', showMatches));
        actions.appendChild(button('Open another website', function () { address(false); }));
        actions.appendChild(button('← Page back', function () { closePanel(); if (history.length > 1) history.back(); else home(); }));
        actions.appendChild(button('⌂ Home & saved sites', function () { home(); }));
        actions.appendChild(button('Find video on this page', findVideos));
        actions.appendChild(button('Play a direct stream', function () { address(true); }));
        actions.appendChild(button('Navigation: ' + (mode === 'focus' ? 'Focus → Pointer' : 'Pointer → Focus'), toggleMode));
        actions.appendChild(button('Page size: ' + Math.round(pageZoom * 100) + '%', function () {
            var levels = [1, 1.25, 1.5, 1.75, 2]; pageZoom = levels[(levels.indexOf(pageZoom) + 1) % levels.length]; put('pageZoom', pageZoom); applyZoom(); showMenu();
        }));
        actions.appendChild(button('Ad blocking: ' + (blocker.enabled ? 'On' : 'Off') + ' for this site', function () { blocker.setEnabled(!blocker.enabled); put('blocking', blocker.enabled); showMenu(); toast('Setting saved for this origin. Reload the page if needed.'); }));
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
        guide.innerHTML = '<p><b>Arrows</b> Move between controls. In Pointer mode, move the cursor; keep pushing at the edge to scroll.</p><p><b>OK / Select</b> Click. On a page, hold for 0.7 seconds to open the browser menu.</p><p><b>Back</b> Open the menu or close a dialog. Use “Page back” for website history.</p><p><b>Red / F2</b> Browser menu. <b>Green</b> Switch Focus / Pointer. <b>Yellow</b> Find video. <b>Blue</b> Home.</p><p><b>Play / Pause</b> Control video. <b>Rewind / Fast forward</b> Seek 10 seconds. During direct playback, Left / Right also seek.</p><p><b>Embedded players</b> Select the player frame to enter it. Back returns to the menu. Find video can discover accessible videos and direct media links.</p>';
        p.appendChild(guide);
        var avAvailable = !!(window.webapis && webapis.avplay);
        p.appendChild(el('p', 'sofa-diagnostics', 'Tizen APIs: ' + (window.tizen ? 'present' : 'not detected (desktop preview)') + '\nAVPlay: ' + (avAvailable ? 'available' : 'loaded on demand on TV') + '\nFilters: ' + C.domains.length + ' domains · document: ' + blocker.count + ' filtered / ' + blocker.popups + ' pop-ups\n' + navigator.userAgent));
        p.appendChild(el('p', 'sofa-muted', 'The TV’s old browser cannot run every modern website. DRM, codecs, login requirements, server-side ads and some embedded players remain site-dependent.'));
        var b = button('Back', function () { atHome ? renderHome() : showMenu(); }, 'sofa-primary'); p.appendChild(b); choose(b);
    }
    function startStream(url) {
        if (!atHome) { home('play', url); return; }
        base('Direct player'); panel.style.display = 'none'; panelOpen = false;
        playerPanel = el('div', 'sofa-player'); root.appendChild(playerPanel);
        var controls = el('div', 'sofa-player-controls'); playerPanel.appendChild(controls);
        playerStatus = el('div', 'sofa-player-status', 'Opening stream…'); controls.appendChild(playerStatus);
        var r = row(controls);
        r.appendChild(button('−10 s', function () { player.command('rewind'); }));
        r.appendChild(button('Play / Pause', function () { player.command('toggle'); }));
        r.appendChild(button('+10 s', function () { player.command('forward'); }));
        r.appendChild(button('Close player', stopStream));
        controls.appendChild(el('p', '', 'OK: Play / Pause    ·    ← →: Seek 10 seconds    ·    Back: Close'));
        player.open(url, playerPanel);
    }
    function stopStream() {
        player.close(); if (playerPanel) playerPanel.parentNode.removeChild(playerPanel);
        playerPanel = null; playerStatus = null; renderHome();
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
        if (lastVideoWindow && lastVideoWindow !== window) { lastVideoWindow.postMessage({sofa: 1, action: 'media', command: action}, '*'); return; }
        var video = localVideo();
        if (video) controlVideo(video, action); else if (topFrame) findVideos();
    }
    var discoveries = [], discoveryToken = 0, waitingFrames = [];
    function collectMedia() {
        var urls = [], videos = document.querySelectorAll('video'), seen = {};
        function add(value) { var safe = C.normalize(value); if (safe && !seen[safe] && urls.length < 20) { seen[safe] = true; urls.push(safe); } }
        for (var i = 0; i < videos.length; i++) {
            if (root && root.contains(videos[i])) continue;
            add(videos[i].currentSrc || videos[i].src);
            var sources = videos[i].querySelectorAll('source[src]'); for (var j = 0; j < sources.length; j++) add(sources[j].src);
        }
        var links = document.querySelectorAll('a[href]');
        for (var k = 0; k < links.length && k < 2000; k++) if (C.isMedia(links[k].href)) add(links[k].href);
        return {urls: urls, hasVideo: !!localVideo(), host: C.host(location.href)};
    }
    function findVideos() {
        if (!topFrame) { window.top.postMessage({sofa: 1, action: 'find'}, '*'); return; }
        var token = ++discoveryToken;
        discoveries = [{source: window, data: collectMedia()}]; waitingFrames = [];
        var frames = document.querySelectorAll('iframe');
        for (var i = 0; i < frames.length; i++) {
            waitingFrames.push(frames[i].contentWindow);
            frames[i].contentWindow.postMessage({sofa: 1, action: 'discover', token: token}, '*');
        }
        showList('Looking for video…', [], 'Checking page videos, direct media links and embedded frames.');
        setTimeout(function () {
            if (token !== discoveryToken || currentView !== 'Looking for video…') return;
            var items = [], seen = {};
            discoveries.forEach(function (entry) {
                if (entry.data.hasVideo) {
                    items.push({text: 'Play / pause website video · ' + entry.data.host, action: function () { lastVideoWindow = entry.source; closePanel(); mediaCommand('toggle'); }});
                    items.push({text: 'Full-screen website video · ' + entry.data.host, action: function () { lastVideoWindow = entry.source; closePanel(); mediaCommand('fullscreen'); }});
                }
                entry.data.urls.forEach(function (url) {
                    if (seen[url]) return; seen[url] = true;
                    items.push({text: 'Open direct stream · ' + url.slice(0, 130), action: function () { startStream(url); }});
                });
            });
            showList('Video on this page', items, items.length ? 'Native playback may fail if a stream needs the website’s cookies or DRM. The website player keeps its own session.' : 'No accessible video found yet. Start the site’s player, try again, or use Pointer mode. Blob / DRM streams cannot be extracted as direct URLs.');
        }, 900);
    }
    window.addEventListener('message', function (event) {
        var data = event.data;
        if (!data || data.sofa !== 1) return;
        if (!topFrame && event.source === window.parent) {
            if (data.action === 'activate') { mode = 'pointer'; cursor.style.display = 'block'; window.focus(); }
            if (data.action === 'media' && /^(toggle|play|pause|forward|rewind|fullscreen)$/.test(data.command)) controlVideo(localVideo(), data.command);
            if (data.action === 'discover') event.source.postMessage({sofa: 1, action: 'discovered', token: data.token, data: collectMedia()}, '*');
        }
        if (topFrame) {
            var frames = document.querySelectorAll('iframe'), child = false;
            for (var i = 0; i < frames.length; i++) if (frames[i].contentWindow === event.source) child = true;
            if (!child) return;
            if (data.action === 'menu') { window.focus(); showMenu(); }
            if (data.action === 'find') findVideos();
            if (data.action === 'discovered' && data.token === discoveryToken && waitingFrames.indexOf(event.source) !== -1 && data.data && Array.isArray(data.data.urls)) {
                waitingFrames.splice(waitingFrames.indexOf(event.source), 1);
                discoveries.push({source: event.source, data: {hasVideo: data.data.hasVideo === true, host: String(data.data.host).slice(0, 120), urls: data.data.urls.slice(0, 20).filter(function (url) { return typeof url === 'string' && C.normalize(url) === url; })}});
            }
        }
    });
    function back() {
        if (keyboard) { dismissKeyboard(); return; }
        if (playerPanel) { stopStream(); return; }
        if (currentView === 'opening' && panelOpen) { cancelNavigation(); return; }
        if (currentView === 'compatibility' && panelOpen) { compatibility.cancel(); home(); return; }
        if (!topFrame) { window.top.postMessage({sofa: 1, action: 'menu'}, '*'); return; }
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
        var textInput = editField(event.target);
        // Physical keyboards and Samsung's IME keep ordinary text-editing keys.
        if (textInput && (key !== 10009 && key !== 27 && key !== 113 && key !== 403) && (key !== 13 || keyboard && event.target.className === 'sofa-keyboard-display')) return;
        var used = true;
        if (key === 10009 || key === 27) { cancelEnter(); back(); }
        else if (key === 403 || key === 113) { cancelEnter(); if (keyboard) dismissKeyboard(); showMenu(); }
        else if (playerPanel) {
            if (key === 37 || key === 412) player.command('rewind');
            else if (key === 39 || key === 417) player.command('forward');
            else if (key === 13 || key === 10252) { if (!event.repeat) player.command('toggle'); }
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
        hud.appendChild(button('Menu / Back', showMenu)); root.appendChild(hud); applyZoom(); updateCursor();
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
                var hash = location.hash, match = hash.match(/&play=([^&]*)/), save = hash.match(/&save=([^&]*)/);
                try {
                    if (match || save) history.replaceState(null, '', HOME + '#sofa-home');
                    if (match) { var url = C.normalize(decodeURIComponent(match[1])); if (url) startStream(url); }
                    if (save) { var data = JSON.parse(decodeURIComponent(save[1])); if (C.normalize(data.url)) addSite(data.url, typeof data.name === 'string' ? data.name : ''); }
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
            }
        }
        window.SofaBrowser = {version: '0.2.0', diagnostics: function () { return {blocking: blocker.enabled, blocked: blocker.count, popups: blocker.popups, atHome: atHome, topFrame: topFrame, mode: mode, pageZoom: pageZoom, matches: sites.matches().length, compatibility: compatibility.status()}; }};
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
}());

}());
