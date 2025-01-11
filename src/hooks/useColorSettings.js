// src/hooks/useColorSettings.js
import { useState, useEffect } from "react";
import { applyStoredColors } from "../utils/tabColors";

export const useColorSettings = () => {
  const [settings, setSettings] = useState({
    isEnabled: true,
    bgColor: "#000000",
    textColor: "#000000",
  });

  const isChromeExtension = typeof chrome !== "undefined" && chrome.storage;

  useEffect(() => {
    if (!isChromeExtension) return;

    chrome.storage.local.get(
      ["isEnabled", "backgroundColor", "textColor"],
      (result) => {
        const { isEnabled, backgroundColor, textColor } = result;

        if (isEnabled === undefined) {
          chrome.storage.local.set({ isEnabled: true });
        }

        setSettings((prev) => ({
          ...prev,
          isEnabled: isEnabled ?? true,
        }));

        if (isEnabled) {
          applyStoredColors(backgroundColor, textColor);
        }
      }
    );
  }, [isChromeExtension, settings.isEnabled]);

  return [settings, setSettings];
};
