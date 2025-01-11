// src/utils.appUtils.js
export const changeBgColor = (color, isEnabled) => {
    if (!isEnabled) return;
  
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "changeBgColor", bgColor: color },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              console.log("Bg color changed successfully");
              chrome.storage.local.set({ backgroundColor: color });
            }
          }
        );
      });
    });
  };
  
  export const changeTextColor = (color, isEnabled) => {
    if (!isEnabled) return;
  
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "changeTextColor", textColor: color },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              console.log("Text color changed successfully");
              chrome.storage.local.set({ textColor: color });
            }
          }
        );
      });
    });
  };
  
  export const resetColors = (setIsLoading) => {
    setIsLoading(true);
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "resetColors" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (response && response.success) {
              chrome.storage.local.remove(["backgroundColor", "textColor"]);
              console.log("Colors reset successfully");
              setIsLoading(false);
            }
          }
        );
      });
    });
  };
  