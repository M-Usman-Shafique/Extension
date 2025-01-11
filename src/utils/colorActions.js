// src/utils.colorActions.js
import { sendMessageToAllTabs } from "./sendMsg";

export const changeBgColor = (color, isEnabled) => {
  if (!isEnabled) return;

  sendMessageToAllTabs({ action: "changeBgColor", bgColor: color });
  chrome.storage.local.set({ backgroundColor: color });
};

export const changeTextColor = (color, isEnabled) => {
  if (!isEnabled) return;
  sendMessageToAllTabs({ action: "changeTextColor", textColor: color });
  chrome.storage.local.set({ textColor: color });
};

export const resetColors = (setIsLoading) => {
  setIsLoading(true);
  sendMessageToAllTabs({ action: "resetColors" });
  chrome.storage.local.remove(["backgroundColor", "textColor"], () => {
    setIsLoading(false);
  });
};
