// src/content.jsx
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'changeColor') {
    changeBackgroundColor(message.color);
    
    // Store the selected color in Chrome storage
    chrome.storage.local.set({ backgroundColor: message.color }, () => {
      console.log('Background color saved');
    });

    sendResponse({ success: true });
  }
});

// On page load, get the stored background color and apply it
chrome.storage.local.get('backgroundColor', (result) => {
  if (result.backgroundColor) {
    changeBackgroundColor(result.backgroundColor);
  }
});

// Function to change background color of all elements
function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;

  // Loop through all elements and apply the background color
  const allElements = document.querySelectorAll('*');
  allElements.forEach((el) => {
    // Apply the color only if the element has no custom background color defined
    if (getComputedStyle(el).backgroundColor === 'rgba(0, 0, 0, 0)' || getComputedStyle(el).backgroundColor === 'transparent') {
      el.style.backgroundColor = color;
    }
  });

  // Explicitly set the background color for inputs and textareas
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    input.style.backgroundColor = color;
  });
}
