/* eslint-disable no-undef */
// src/background.jsx
chrome.runtime.onInstalled.addListener(() => {
    console.log('Color changer extension installed');
  });