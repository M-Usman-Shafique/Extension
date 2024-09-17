/* eslint-disable no-undef */
// src/content.jsx
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "changeColor") {
    chrome.storage.local.get("isEnabled", (result) => {
      if (result.isEnabled) {
        changeBackgroundColor(message.color);

        // Store the selected color in Chrome storage
        chrome.storage.local.set({ backgroundColor: message.color }, () => {
          console.log("Background color saved");
        });

        sendResponse({ success: true });
      }
    });
  } else if (message.action === "disableColor") {
    // Disable the applied color but keep it saved in storage
    disableBackgroundColor();
    sendResponse({ success: true });
  } else if (message.action === "resetColor") {
    // Reset the background color completely
    resetBackgroundColor();
    sendResponse({ success: true });
  }
  return true;
});

// On page load, get the stored background color and apply it
chrome.storage.local.get(["backgroundColor", "isEnabled"], (result) => {
  if (result.isEnabled && result.backgroundColor) {
    changeBackgroundColor(result.backgroundColor);
  }
});

// Function to change background color of all elements
function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;

  // Loop through all elements and apply the background color
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = color;
  });

  // Explicitly set the background color for inputs and textareas
  const inputs = document.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.style.backgroundColor = color;
  });
}

function disableBackgroundColor() {
  document.body.style.backgroundColor = ""; // Clear body color

  // Loop through all elements and remove the background color
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
  });

  // Clear background color for inputs, textareas, and selects
  const inputs = document.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.style.backgroundColor = "";
  });
}

// Function to reset the background color of all elements
function resetBackgroundColor() {
  // Clear the background color from the body and all elements
  document.body.style.backgroundColor = "";
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
  });

  // Clear the background color for inputs, textareas, and selects
  const inputs = document.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.style.backgroundColor = "";
  });

  // Optionally, clear the stored color in Chrome storage
  chrome.storage.local.remove("backgroundColor", () => {
    console.log("Background color reset");
  });
}
