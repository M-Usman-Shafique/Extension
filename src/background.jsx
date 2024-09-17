/* eslint-disable no-undef */
// src/background.jsx
chrome.runtime.onInstalled.addListener(() => {
    console.log('Background color changer extension installed');
  });