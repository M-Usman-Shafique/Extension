import {
  changeBackgroundColor,
  changeTextColor,
  disableColors,
  resetColors,
} from "./utils/contUtils";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "changeBgColor") {
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
  } else if (message.action === "changeTextColor") {
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
  } else if (message.action === "disableColors") {
    disableColors();
    sendResponse({ success: true });
  } else if (message.action === "resetColors") {
    resetColors();
    sendResponse({ success: true });
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
