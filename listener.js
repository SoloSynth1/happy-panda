// Get the tab's URL
function geturl(tab) {

  var url = tab.url;

  // tab.url is only available if the "activeTab" permission is declared.
  // If you want to see the URL of other tabs (e.g. after removing active:true
  // from |queryInfo|), then the "tabs" permission is required to see their
  // "url" properties.
  console.assert(typeof url == 'string', 'tab.url should be a string');
  // return URL
  callback(url);

}

// Get the tab id, so the script can work on it even the tab is not active
async function getCurrentTabID(callback) {
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
    // Callback the tab
    callback(tab.id);
  });

}

// Repeat whenever page on any tab is updated
// activated when initiated by clicking the extension icon
function onUpateListener(tab, info) {
  // Checks if the updated page is indeed in the designated tab
  if (info.status === 'complete' && tab == tabID) {
    chrome.tabs.executeScript(null, {file: 'getSauce.js'});
  }
}

function onMessageListener() {
  // Set up a listener
  chrome.runtime.onMessage.addListener(function(request, sender) {
    
    // If "getSauce" message is received
    if (request.action == "getSauce") {
      
    // Download the returned image source
    chrome.downloads.download({
      url: request.obj[0]
    });
    
    // Get the current Url
    getCurrentUrl((url) => {
      // If the 'next' link differs from the current URL
      if (request.obj[1] != url) {
        // Navigate the current tab to the link accordingly
        chrome.tabs.update({
          url: request.obj[1]
        });
      } else {
        // Otherwise just send a message
        alert('end of the image set');
        // Remove onUpdated listener once the action has been completed
        chrome.tabs.onUpdated.removeListener(onUpateListener);
      }
    });
    }
    // If not, send an alert and do nothing
    else {
      alert('No object to download');
    }
  });
}

// On click
chrome.browserAction.onClicked.addListener(function(tab) {
  // Set up a message listener for chrome.tabs.query to respond
  chrome.runtime.onMessage.addListener() 
  getCurrentTabID((id) => {
    var tabID = id;
  });
  
  chrome.tabs.onUpdated.addListener(onUpateListener);
  alert('listener set up');
	// Run the getSauce.js script
  chrome.tabs.executeScript(tabID, {file: 'getSauce.js'});
  alert('injector executed');
});