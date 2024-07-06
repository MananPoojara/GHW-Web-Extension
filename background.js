// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get({ blockedSites: [] }, (data) => {
            if (data.blockedSites.includes(tab.url)) {
                chrome.tabs.remove(tabId);
            }
        });
    }
});
