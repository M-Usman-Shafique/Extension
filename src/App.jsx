/* eslint-disable no-undef */
// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import CustomizedSwitches from "./components/CustomizedSwitches";

export default function App() {
  const [bgColor, setBgColor] = useState("#ffffff");
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
          // Trigger the content script to apply the color
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "changeBgColor",
              bgColor: result.backgroundColor,
            });
          });
        }
      });
    }
  }, [isChromeExtension, isEnabled]);

  const changeBgColor = (bgColor) => {
    if (!isEnabled) return;

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "changeBgColor", bgColor: bgColor },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              console.log("Bg color changed successfully");
              chrome.storage.local.set({ backgroundColor: bgColor });
            }
          }
        );
      });
    });
  };

  const resetBgColor = () => {
    // Query all open tabs and send the reset message to all of them
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
        { action: "resetBgColor" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else if (response && response.success) {
            console.log("Bg colors reset successfully");
            chrome.storage.local.remove("backgroundColor");
          }
        }
      );
    });
  });
}

  const handleToggle = (checked) => {
    setIsEnabled(checked);
    chrome.storage.local.set({ isEnabled: checked });

     // Query all open tabs and apply or disable the background color based on the toggle state
  chrome.tabs.query({}, (tabs) => {
    if (checked) {
      chrome.storage.local.get("backgroundColor", (result) => {
        if (result.backgroundColor) {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              action: "changeBgColor",
              bgColor: result.backgroundColor,
            });
          });
        }
      });
    } else {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { action: "disableBgColor" });
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
          <div className="flex items-center justify-between gap-2">
            {/* <button
              onClick={changeBgColor}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded w-full"
            >
              Apply
            </button> */}
            <button
              onClick={resetBgColor}
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
