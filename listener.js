// Get the current tab when icon is clicked
function getCurrentTab(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    callback(tab);
  });
}

// Repeat when page is updated, only active when initiated by clicking the extension icon
function onUpateListener(tabId, info) {

  // if load is complete
  if (info.status === 'complete') {

    // if the updated tab is indeed the designated tab (Issue #5)
    if (tabId == DesignatedTab.id) {
      // Run getSauce.js on the tab (Issue #4)
      chrome.tabs.executeScript(tabId, {file: 'getSauce.js'});
    }
    
  }
}

// Set up a listener for getSauce result
chrome.runtime.onMessage.addListener(function(request, sender) {

  // If "getSauce" message is received
  if (request.action == "getSauce") {
    
    // Download the returned image source
    chrome.downloads.download({
      url: request.img
    });
    
    // If the 'next' link differs from the current URL
    if (request.next != url) {

      // Update the DesignatedTab to the link accordingly (Issue #4)
      chrome.tabs.update(DesignatedTab.id, {
        url: request.next
      });
      url = request.next
    } else {

      // Otherwise just send a message
      alert('end of the image set');

      // Remove onUpdated listener once the action has been completed
      chrome.tabs.onUpdated.removeListener(onUpateListener);
    }
  }
  // If not, send an alert and do nothing
  else {
    alert('No object to download');
  }
});

// On click
chrome.browserAction.onClicked.addListener(function(tab) {
  
  // Create an empty URL for later if checks in onMessage listener.
  url = ''

  //remember the clicked tab as DesignatedTab
  DesignatedTab = tab;

  chrome.tabs.executeScript(tab.id, {file: 'getSauce.js'});

  // // Get the Current tab, ctab
  // getCurrentTab((ctab) =>{
  //   // Run the getSauce.js script in the tab
  //   chrome.tabs.executeScript(ctab.id, {file: 'getSauce.js'});
  // });

  // alert(ctab.id);

  // Set up onUpdate Listener on the DesignatedTab
  chrome.tabs.onUpdated.addListener(onUpateListener);
});