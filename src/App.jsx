// src/App.jsx
import React, { useEffect, useState } from "react";
import "./App.css";
import CustomizedSwitches from "./components/CustomizedSwitches";

export default function App() {
  const [color, setColor] = useState("#ffffff");
  const [isEnabled, setIsEnabled] = useState(true);

  const isChromeExtension = typeof chrome !== "undefined" && chrome.storage;

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get("isEnabled", (result) => {
        if (result.isEnabled !== undefined) {
          setIsEnabled(result.isEnabled);
        } else {
          chrome.storage.local.set({ isEnabled: true });
        }
      });

      // Get the stored background color and apply it if enabled
      chrome.storage.local.get("backgroundColor", (result) => {
        if (result.backgroundColor && isEnabled) {
          changeBackgroundColor(result.backgroundColor);
        }
      });
    }
  }, [isEnabled]);

  const changeColor = () => {
    if (!isEnabled) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "changeColor", color: color },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else if (response && response.success) {
            console.log("Color changed successfully");
            chrome.storage.local.set({ backgroundColor: color });
          }
        }
      );
    });
  };

  const resetColor = () => {
    // if (!isEnabled) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "resetColor" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else if (response && response.success) {
            console.log("Colors reset successfully");
            chrome.storage.local.remove("backgroundColor");
          }
        }
      );
    });
  };

  const handleToggle = (checked) => {
    setIsEnabled(checked);
    chrome.storage.local.set({ isEnabled: checked });

    // Immediately apply or stop applying color when toggling
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (checked) {
        chrome.storage.local.get("backgroundColor", (result) => {
          if (result.backgroundColor) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "changeColor",
              color: result.backgroundColor,
            });
          }
        });
      } else {
        chrome.tabs.sendMessage(tabs[0].id, { action: "disableColor" });
      }
    });
  };

  return (
    <div className="px-4 pb-4 bg-gray-900 rounded-lg w-[300px] h-[200px] shadow-lg">
      <div className="flex justify-center items-center">
        <CustomizedSwitches isEnabled={isEnabled} onToggle={handleToggle} />
      </div>
      {isEnabled && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-white text-center">
            Color Changer
          </h1>
          <div className="flex justify-center mb-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="picker bg-transparent cursor-pointer border-none w-16 h-16 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={changeColor}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded w-full"
            >
              Apply
            </button>
            <button
              onClick={resetColor}
              className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded w-full"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
