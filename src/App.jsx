/* eslint-disable no-undef */
// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import CustomizedSwitches from "./components/CustomizedSwitches";

export default function App() {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
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
      chrome.storage.local.get(["backgroundColor", "textColor"], (result) => {
        if (isEnabled) {
          if (result.backgroundColor) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "changeBgColor",
                bgColor: result.backgroundColor,
              });
            });
          }
          if (result.textColor) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "changeTextColor",
                textColor: result.textColor,
              });
            });
          }
        }
      });
    }
  }, [isChromeExtension, isEnabled]);

  const changeBgColor = (color) => {
    if (!isEnabled) return;

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "changeBgColor", bgColor: color },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              console.log("Bg color changed successfully");
              chrome.storage.local.set({ backgroundColor: color });
            }
          }
        );
      });
    });
  };

  const changeTextColor = (color) => {
    if (!isEnabled) return;

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "changeTextColor", textColor: color },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              console.log("Text color changed successfully");
              chrome.storage.local.set({ textColor: color });
            }
          }
        );
      });
    });
  };

  const resetColors = () => {
    // Query all open tabs and send the reset message to all of them
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "resetColors" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              console.log("Colors reset successfully");
              chrome.storage.local.remove(["backgroundColor", "textColor"]);
            }
          }
        );
      });
    });
  };

  const handleToggle = (checked) => {
    setIsEnabled(checked);
    chrome.storage.local.set({ isEnabled: checked });

    // Query all open tabs and apply or disable the background color based on the toggle state
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
              value={bgColor}
              onChange={(e) => {
                const selectedColor = e.target.value;
                setBgColor(selectedColor);
                changeBgColor(selectedColor);
              }}
              className="picker bg-transparent cursor-pointer border-none w-16 h-16 rounded-full"
            />
          </div>
          <div className="flex justify-center mb-4">
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                const selectedColor = e.target.value;
                setTextColor(selectedColor);
                changeTextColor(selectedColor);
              }}
              className="picker bg-transparent cursor-pointer border-none w-16 h-16 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={resetColors}
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
