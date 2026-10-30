# Copy URL Shortcut

Arc's Shift-Cmd-C for Firefox.

| Shortcut (macOS) | Shortcut (Windows/Linux) | Copies |
|---|---|---|
| Shift-Cmd-C | Ctrl-Shift-C | The current tab's URL |
| Ctrl-Shift-C | Alt-Shift-C | A Markdown link: `[Page title](url)` |

**Tracking parameters are removed by default.** Things like `utm_source`, `fbclid`, `gclid` and Mailchimp/HubSpot IDs, plus a few site-specific ones (YouTube and Spotify `si`, X `s`/`t`, Amazon `pd_rd_*`), are stripped before copying. Every other part of the link stays exactly as it was. You can turn this off in the extension's settings (`about:addons` → Copy URL Shortcut → Preferences).

A small toast confirms it: "Copied a clean link without trackers", or "Copied URL" if cleaning is off. On pages extensions can't touch (`about:` pages, addons.mozilla.org, PDFs), you get a system notification instead.

**Note:** Shift-Cmd-C is also Firefox's DevTools "Pick an element" shortcut, and this extension takes it over. Cmd-Opt-I still opens DevTools. To change either binding, go to `about:addons` → ⚙︎ → Manage Extension Shortcuts.

## Development

```bash
npx web-ext run
npx web-ext lint
```

Licensed under the [GNU General Public License v3.0](LICENSE).
