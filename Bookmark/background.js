chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.includes("youtube.com/watch")) {
    const videoId = new URLSearchParams(tab.url.split('?')[1] || '').get('v');
    if (!videoId) return;

    chrome.tabs.sendMessage(tabId, { type: "NEW", videoId })
      .catch((err) => {
        console.warn("Send failed, retrying after injection...", err);
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["contentScript.js"]
        }).then(() => {
          chrome.tabs.sendMessage(tabId, { type: "NEW", videoId })
            .catch(err => console.error("Retry also failed:", err));
        });
      });
  }
});
