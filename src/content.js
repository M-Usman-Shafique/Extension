// src/content.js

import {
  changeBackgroundColor,
  changeTextColor,
  disableColors,
  resetColors,
} from "./utils/contUtils";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.action) {
    case "changeBgColor":
      chrome.storage.local.get("isEnabled", (result) => {
        if (result.isEnabled) {
          changeBackgroundColor(message.bgColor);

          // Storing the selected background color in Chrome storage
          chrome.storage.local.set({ backgroundColor: message.bgColor }, () => {
            console.log("Background color saved");
          });

          sendResponse({ success: true });
        }
      });
      break;

    case "changeTextColor":
      chrome.storage.local.get("isEnabled", (result) => {
        if (result.isEnabled) {
          changeTextColor(message.textColor);

          // Storing the selected text color in Chrome storage
          chrome.storage.local.set({ textColor: message.textColor }, () => {
            console.log("Text color saved");
          });

          sendResponse({ success: true });
        }
      });
      break;

    case "disableColors":
      disableColors();
      sendResponse({ success: true });
      break;

    case "resetColors":
      resetColors();
      sendResponse({ success: true });
      break;

    default:
      console.warn(`Unhandled action: ${message.action}`);
      break;
  }
  return true;
});

// Getting & applying stored colors
chrome.storage.local.get(
  ["backgroundColor", "textColor", "isEnabled"],
  (result) => {
    if (result.isEnabled) {
      if (result.backgroundColor) changeBackgroundColor(result.backgroundColor);
      if (result.textColor) changeTextColor(result.textColor);
    }
  }
);
