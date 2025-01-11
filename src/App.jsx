// src/App.jsx
import { useEffect, useState, useRef } from "react";
import CustomizedSwitches from "./components/CustomizedSwitches";
import { TbBackground } from "react-icons/tb";
import { GrPowerReset } from "react-icons/gr";
import { CiText } from "react-icons/ci";
import { changeBgColor, changeTextColor, resetColors } from "./utils/appUtils";

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
      chrome.storage.local.get(
        ["isEnabled", "backgroundColor", "textColor"],
        (result) => {
          const { isEnabled, backgroundColor, textColor } = result;

          if (isEnabled === undefined) {
            chrome.storage.local.set({ isEnabled: true });
          }

          setIsEnabled(isEnabled);

          if (isEnabled) {
            if (backgroundColor) {
              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  chrome.tabs.sendMessage(tabs[0].id, {
                    action: "changeBgColor",
                    bgColor: backgroundColor,
                  });
                }
              );
            }
            if (textColor) {
              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  chrome.tabs.sendMessage(tabs[0].id, {
                    action: "changeTextColor",
                    textColor: textColor,
                  });
                }
              );
            }
          }
        }
      );
    }
  }, [isChromeExtension, isEnabled]);

  const handleToggle = (checked) => {
    setIsEnabled(checked);
    chrome.storage.local.set({ isEnabled: checked });

    // Applying colors to all open tabs
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
    <div className="px-4 pb-4 w-[300px] h-[250px]">
      <div className="flex justify-between items-center">
        <CustomizedSwitches isEnabled={isEnabled} onToggle={handleToggle} />
        {isEnabled && (
          <button
            onClick={() => resetColors(setIsLoading)}
            className="hover:bg-white/10 group font-bold p-2 rounded-full"
          >
            <GrPowerReset
              className={`text-gray-500 group-hover:text-gray-300 text-lg ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        )}
      </div>
      {isEnabled && (
        <div className="flex justify-center gap-10 py-8">
          <div className="relative">
            <div
              onClick={() => bgColorPickerRef.current.click()}
              className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-full flex items-center justify-center"
            >
              <TbBackground className="text-4xl text-white cursor-pointer" />
            </div>
            <input
              type="color"
              ref={bgColorPickerRef}
              value={bgColor}
              onChange={(e) => {
                const selectedColor = e.target.value;
                setBgColor(selectedColor);
                changeBgColor(selectedColor, isEnabled);
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
                changeTextColor(selectedColor, isEnabled);
              }}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
