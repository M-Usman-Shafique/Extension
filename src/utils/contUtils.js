// Change background color
export function changeBackgroundColor(bgColor) {
  const allElements = document.querySelectorAll("*");

  // Selecting media elements to exclude
  const mediaElements = document.querySelectorAll(
    "img, video, iframe, canvas, picture, code"
  );

  const excludedElements = new Set();

  mediaElements.forEach((mediaElement) => {
    excludedElements.add(mediaElement);
  });

  // Applying bg color to all elements except those in the excluded set
  allElements.forEach((el) => {
    if (!excludedElements.has(el)) {
      el.style.backgroundColor = bgColor;
    }
  });
}

// Change text color
export function changeTextColor(textColor) {
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.color = textColor;
  });
}

// Disable background and text color
export function disableColors() {
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
    el.style.color = "";
  });
}

// Reset background and text color
export function resetColors() {
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
    el.style.color = "";
  });

  // Clearing the colors stored in Chrome storage
  chrome.storage.local.remove(["backgroundColor", "textColor"], () => {
    console.log("Colors reset");
  });
}
