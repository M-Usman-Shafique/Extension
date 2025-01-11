// src/App.jsx
import { useState } from "react";
import { TbBackground } from "react-icons/tb";
import { CiText } from "react-icons/ci";
import {
  changeBgColor,
  changeTextColor,
  resetColors,
} from "./utils/colorActions";
import { useColorSettings } from "./hooks/useColorSettings";
import { ColorPicker } from "./components/ColorPicker";
import { Header } from "./components/Header";
import { applyToAllTabs } from "./utils/tabColors";

export default function App() {
  const [settings, setSettings] = useColorSettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (checked) => {
    setSettings((prev) => ({
      ...prev,
      isEnabled: checked,
    }));
    chrome.storage.local.set({ isEnabled: checked });
    applyToAllTabs(checked);
  };

  const handleColorChange = (colorType) => (e) => {
    const selectedColor = e.target.value;
    setSettings((prev) => ({
      ...prev,
      [colorType]: selectedColor,
    }));

    if (colorType === "bgColor") {
      changeBgColor(selectedColor, settings.isEnabled);
    } else {
      changeTextColor(selectedColor, settings.isEnabled);
    }
  };

  return (
    <div className="px-4 pb-4 w-[300px] h-[250px]">
      <Header
        isEnabled={settings.isEnabled}
        onToggle={handleToggle}
        onReset={() => resetColors(setIsLoading)}
        isLoading={isLoading}
      />
      {settings.isEnabled && (
        <div className="flex justify-center gap-10 py-8">
          <ColorPicker
            icon={TbBackground}
            gradientClasses="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            value={settings.bgColor}
            onChange={handleColorChange("bgColor")}
          />
          <ColorPicker
            icon={CiText}
            gradientClasses="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"
            value={settings.textColor}
            onChange={handleColorChange("textColor")}
          />
        </div>
      )}
    </div>
  );
}
