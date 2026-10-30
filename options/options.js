"use strict";

const box = document.getElementById("cleanLinks");

browser.storage.local.get("cleanLinks").then(({ cleanLinks = true }) => {
  box.checked = cleanLinks;
});

box.addEventListener("change", () => {
  browser.storage.local.set({ cleanLinks: box.checked });
});
