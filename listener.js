// This function is from chrome extension tutorial
function getCurrentTabUrl(callback) {
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

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

// Set up a listener for getSauce result
chrome.runtime.onMessage.addListener(function(request, sender) {
	
  // If "getSauce" message is received
  if (request.action == "getSauce") {
	  
	// Download the returned image source
	chrome.downloads.download({
		url: request.img
	});
	
	// Get the current url
	getCurrentTabUrl((url) => {
	  // If the 'next' link differs from the current URL
	  if (request.next != url) {
	    // Navigate the current tab to the link accordingly
	    chrome.tabs.update({
	      url: request.next
	    });
	  } else {
	    // Otherwise just send a message
	    alert('end of the image set');
	  }
	});
  }
  // If not, send an alert and do nothing
  else {
	alert('No object to download');
  }
});

// On click
chrome.browserAction.onClicked.addListener(function(tab) {
	// Run the getSauce.js script
	chrome.tabs.executeScript(null, {file: "getSauce.js"});
});