// src/components/ColorPicker.jsx
import { useRef } from "react";

export const ColorPicker = ({
  icon: Icon,
  gradientClasses,
  value,
  onChange,
}) => {
  const colorPickerRef = useRef(null);

  return (
    <div className="relative">
      <div
        onClick={() => colorPickerRef.current.click()}
        className={`w-12 h-12 ${gradientClasses} p-2 rounded-full flex items-center justify-center`}
      >
        <Icon className="text-4xl text-white cursor-pointer" />
      </div>
      <input
        type="color"
        ref={colorPickerRef}
        value={value}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
};
