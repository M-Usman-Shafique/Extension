export const sendMessageToTab = (tabId, message) => {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log(response?.success ? "Message sent successfully" : "Failed");
    }
  });
};

export const sendMessageToAllTabs = (message) => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => sendMessageToTab(tab.id, message));
  });
};
