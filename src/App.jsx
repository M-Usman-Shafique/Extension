/* eslint-disable no-undef */
// src/App.jsx
import { useEffect, useState, useRef } from "react";
import { GrPowerReset } from "react-icons/gr";
import "./App.css";
import CustomizedSwitches from "./components/CustomizedSwitches";
import { CiText } from "react-icons/ci";
import { IoColorPaletteOutline } from "react-icons/io5";

export default function App() {
  const [bgColor, setBgColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const bgColorPickerRef = useRef(null);
  const textColorPickerRef = useRef(null);

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
    setIsLoading(true);
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "resetColors" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              chrome.storage.local.remove(["backgroundColor", "textColor"]);
              console.log("Colors reset successfully");
              setIsLoading(false);
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
      <div className="flex justify-between items-center">
        <CustomizedSwitches isEnabled={isEnabled} onToggle={handleToggle} />
        {isEnabled && (
          <button
            onClick={resetColors}
            className="hover:bg-gray-800 group font-bold p-2 rounded-full"
          >
            <GrPowerReset
              className={`text-slate-500 group-hover:text-slate-400 text-lg ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        )}
      </div>
      {isEnabled && (
        <div className="flex justify-center gap-3 mb-4">
          <div className="relative">
            <div
              onClick={() => bgColorPickerRef.current.click()}
              className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-full flex items-center justify-center"
            >
              <IoColorPaletteOutline className="text-4xl text-white cursor-pointer" />
            </div>
            <input
              type="color"
              ref={bgColorPickerRef}
              value={bgColor}
              onChange={(e) => {
                const selectedColor = e.target.value;
                setBgColor(selectedColor);
                changeBgColor(selectedColor);
              }}
              className="hidden"
            />
          </div>
          <div className="relative">
            <div
              onClick={() => textColorPickerRef.current.click()}
              className="w-12 h-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 p-2 rounded-full flex items-center justify-center"
            >
              <CiText className="text-4xl text-white cursor-pointer" />
            </div>
            <input
              type="color"
              ref={textColorPickerRef}
              value={textColor}
              onChange={(e) => {
                const selectedColor = e.target.value;
                setTextColor(selectedColor);
                changeTextColor(selectedColor);
              }}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
