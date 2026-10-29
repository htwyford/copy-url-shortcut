# Copy URL Shortcut

Arc's Shift-Cmd-C for Firefox.

| Shortcut (macOS) | Shortcut (Windows/Linux) | Copies |
|---|---|---|
| Shift-Cmd-C | Ctrl-Shift-C | The current tab's URL |
| Ctrl-Shift-C | Alt-Shift-C | A Markdown link: `[Page title](url)` |

A small "Copied" toast confirms it. On pages extensions can't touch (`about:` pages, addons.mozilla.org, PDFs), you get a system notification instead.

**Note:** Shift-Cmd-C is also Firefox's DevTools "Pick an element" shortcut, and this extension takes it over. Cmd-Opt-I still opens DevTools. To change either binding, go to `about:addons` → ⚙︎ → Manage Extension Shortcuts.

## Development

```bash
npx web-ext run
npx web-ext lint
```

MIT licensed.
