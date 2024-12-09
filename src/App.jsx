/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import CustomizedSwitches from "./components/CustomizedSwitches";
import { TbBackground } from "react-icons/tb";
import { GrPowerReset } from "react-icons/gr";
import { CiText } from "react-icons/ci";
import "./App.css";
import {
  changeBgColor,
  changeTextColor,
  resetColors,
} from "./utils/appUtils";

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

      // Getting & applying stored colors
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
    <div className="px-4 pb-4 bg-gray-900 rounded-lg w-[300px] h-[200px] shadow-lg">
      <div className="flex justify-between items-center">
        <CustomizedSwitches isEnabled={isEnabled} onToggle={handleToggle} />
        {isEnabled && (
          <button
            onClick={() => resetColors(setIsLoading)}
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
