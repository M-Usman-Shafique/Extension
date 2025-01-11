// components/Header.jsx
import { GrPowerReset } from "react-icons/gr";
import CustomizedSwitches from "./CustomizedSwitches";

export const Header = ({ isEnabled, onToggle, onReset, isLoading }) => (
  <div className="flex justify-between items-center">
    <CustomizedSwitches isEnabled={isEnabled} onToggle={onToggle} />
    {isEnabled && (
      <button
        onClick={onReset}
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
);
