// src/utils.contUtils.js
export function changeBackgroundColor(bgColor) {
  const allElements = document.querySelectorAll("*");

  const mediaElements = document.querySelectorAll(
    "img, video, iframe, canvas, picture, code"
  );

  const excludedElements = new Set();

  mediaElements.forEach((mediaElement) => {
    excludedElements.add(mediaElement);
  });

  allElements.forEach((el) => {
    if (!excludedElements.has(el)) {
      el.style.backgroundColor = bgColor;
    }
  });
}

export function changeTextColor(textColor) {
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.color = textColor;
  });
}

export function disableColors() {
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
    el.style.color = "";
  });
}

export function resetColors() {
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.backgroundColor = "";
    el.style.color = "";
  });

  chrome.storage.local.remove(["backgroundColor", "textColor"], () => {
    console.log("Colors reset");
  });
}
