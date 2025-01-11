// src/utils/chromeUtils.js
export const applyStoredColors = (backgroundColor, textColor) => {
  if (backgroundColor) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "changeBgColor",
        bgColor: backgroundColor,
      });
    });
  }
  if (textColor) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "changeTextColor",
        textColor: textColor,
      });
    });
  }
};

export const applyToAllTabs = (checked) => {
  chrome.tabs.query({}, (tabs) => {
    if (checked) {
      chrome.storage.local.get(["backgroundColor", "textColor"], (result) => {
        if (result.backgroundColor) {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              action: "changeBgColor",
              bgColor: result.backgroundColor,
            });
          });
        }
        if (result.textColor) {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              action: "changeTextColor",
              textColor: result.textColor,
            });
          });
        }
      });
    } else {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { action: "disableColors" });
      });
    }
  });
};
