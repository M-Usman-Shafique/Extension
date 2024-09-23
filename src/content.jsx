/* eslint-disable no-undef */
// src/content.jsx
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "changeBgColor") {
    chrome.storage.local.get("isEnabled", (result) => {
      if (result.isEnabled) {
        changeBackgroundColor(message.bgColor);

        // Store the selected color in Chrome storage
        chrome.storage.local.set({ backgroundColor: message.bgColor }, () => {
          console.log("Background color saved");
        });

        sendResponse({ success: true });
      }
    });
  } else if (message.action === "changeTextColor") {
    chrome.storage.local.get("isEnabled", (result) => {
      if (result.isEnabled) {
        changeTextColor(message.textColor);

        chrome.storage.local.set({ textColor: message.textColor }, () => {
          console.log("Text color saved");
        });

        sendResponse({ success: true });
      }
    });
  } else if (message.action === "disableColors") {
    // Disable the applied color but keep it saved in storage
    disableColors();
    sendResponse({ success: true });
  } else if (message.action === "resetColors") {
    // Reset the background color completely
    resetColors();
    sendResponse({ success: true });
  }
  return true;
});

// On page load, get the stored background color and apply it
chrome.storage.local.get(
  ["backgroundColor", "textColor", "isEnabled"],
  (result) => {
    if (result.isEnabled) {
      if (result.backgroundColor) changeBackgroundColor(result.backgroundColor);
      if (result.textColor) changeTextColor(result.textColor);
    }
  }
);

function changeBackgroundColor(bgColor) {
  // Select all elements on the page
  const allElements = document.querySelectorAll("*");

  // Select media elements that we want to exclude
  const mediaElements = document.querySelectorAll(
    "img, video, iframe, canvas, object, picture, code"
  );

  // Create a set to store excluded elements (media elements + their parents)
  const excludedElements = new Set();

  // Apply "transparent" background color to media elements and their parents
  mediaElements.forEach((mediaElement) => {
    if (!excludedElements.has(mediaElement)) {
      mediaElement.style.setProperty(
        "background-color",
        "transparent",
        "important"
      );
      excludedElements.add(mediaElement);
    }
  });

  // Apply the background color to non-excluded elements
  allElements.forEach((el) => {
    if (!excludedElements.has(el)) {
      el.style.setProperty("background-color", bgColor, "important");
    }
  });
}

function changeTextColor(textColor) {
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.color = textColor;
  });
}

function disableColors() {
  // Loop through all elements and remove the background color
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
    el.style.color = "";
  });
}

// Function to reset the background color of all elements
function resetColors() {
  // Clear the background color from the body and all elements
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
    el.style.color = "";
  });

  // Optionally, clear the stored color in Chrome storage
  chrome.storage.local.remove(["backgroundColor", "textColor"], () => {
    console.log("Colors reset");
  });
}
