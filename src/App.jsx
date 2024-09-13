// src/App.jsx
import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [color, setColor] = useState("#ffffff");

  const changeColor = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "changeColor", color: color },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else if (response && response.success) {
            console.log("Color changed successfully");
          }
        }
      );
    });
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg w-[300px] h-[200px] shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-white text-center">Color Changer</h1>
      <div className="flex justify-center mb-4">
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          className="picker bg-transparent cursor-pointer border-none w-16 h-16 rounded-full"
        />
      </div>
      <button 
        onClick={changeColor}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded w-full"
      >
        Change Color
      </button>
    </div>
  )
}
