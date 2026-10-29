"use strict";

function markdownLink(tab) {
  const title = (tab.title || tab.url).replace(/([\\[\]])/g, "\\$1");
  const url = tab.url.replace(/\)/g, "%29").replace(/ /g, "%20");
  return `[${title}](${url})`;
}

// Injected into the page: a toast that fades out on its own. Kept in a closed
// shadow root so page styles can't touch it.
function showToast(message) {
  const host = document.createElement("div");
  host.style.cssText =
    "all: initial; position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 2147483647;";
  const shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = `
    <style>
      div {
        font: 500 13px/1 system-ui, sans-serif;
        padding: 10px 14px;
        border-radius: 10px;
        background: rgba(30,30,34,.92);
        color: #fff;
        box-shadow: 0 4px 16px rgba(0,0,0,.25);
        transition: opacity .3s, transform .3s;
        opacity: 0;
        transform: translateY(-6px);
      }
      div.in { opacity: 1; transform: none; }
    </style>
    <div></div>`;
  const toast = shadow.querySelector("div");
  toast.textContent = message;
  (document.body ?? document.documentElement).append(host);
  requestAnimationFrame(() => toast.classList.add("in"));
  setTimeout(() => toast.classList.remove("in"), 1400);
  setTimeout(() => host.remove(), 1800);
}

async function confirm(tab, message) {
  try {
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: showToast,
      args: [message],
    });
  } catch {
    // Pages extensions can't script (about:, addons.mozilla.org, PDFs, the
    // reader view) get a system notification instead.
    browser.notifications.create("copied", {
      type: "basic",
      title: message,
      message: tab.url,
    });
  }
}

browser.commands.onCommand.addListener(async (command, tab) => {
  if (!tab?.url) return;
  if (command === "copy-url") {
    await navigator.clipboard.writeText(tab.url);
    await confirm(tab, "Copied URL");
  }
  if (command === "copy-markdown") {
    await navigator.clipboard.writeText(markdownLink(tab));
    await confirm(tab, "Copied Markdown link");
  }
});
