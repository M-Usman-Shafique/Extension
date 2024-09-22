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
    "img, video, iframe, canvas, object, picture"
  );

  // Create a set of elements to exclude: media elements and their parents
  const excludedElements = new Set();

  // Add media elements and their parents to the set
  mediaElements.forEach((mediaElement) => {
    excludedElements.add(mediaElement); // Exclude the media element itself
    if (mediaElement.parentElement) {
      excludedElements.add(mediaElement.parentElement); // Exclude its parent container
    }
  });

  // Apply background color to all elements except those in the excluded set
  allElements.forEach((el) => {
      el.style.backgroundColor = bgColor;
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
