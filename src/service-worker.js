// src/service-worker.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("Color changer extension installed");

  const notifOptions = {
    type: "basic",
    iconUrl: "nerd.png",
    title: "Welcome to Nerd Mode!",
    message:
      "Your extension to change background and text colors is now ready to use.",
    priority: 2,
  };

  chrome.notifications.create(
    "notifWelcome",
    notifOptions,
    (notificationId) => {
      console.log("Notification displayed with ID: " + notificationId);
    }
  );
});
