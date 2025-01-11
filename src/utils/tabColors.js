// src/utils/tabColors.js
import { sendMessageToAllTabs } from "./sendMsg";

export const applyStoredColors = (backgroundColor, textColor) => {
  if (backgroundColor) {
    sendMessageToAllTabs({
      action: "changeBgColor",
      bgColor: backgroundColor,
    });
  }
  if (textColor) {
    sendMessageToAllTabs({
      action: "changeTextColor",
      textColor: textColor,
    });
  }
};

export const applyToAllTabs = (checked) => {
  if (checked) {
    chrome.storage.local.get(["backgroundColor", "textColor"], (result) => {
      if (result.backgroundColor) {
        sendMessageToAllTabs({
          action: "changeBgColor",
          bgColor: result.backgroundColor,
        });
      }
      if (result.textColor) {
        sendMessageToAllTabs({
          action: "changeTextColor",
          textColor: result.textColor,
        });
      }
    });
  } else {
    sendMessageToAllTabs({ action: "disableColors" });
  }
};
