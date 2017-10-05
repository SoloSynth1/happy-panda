// This function is from chrome extension tutorial


// Attempt to parse and retrieve a link
function getLink(document_root, fs_crit){
	
	// Get the image
	// Check if div id = "i7" has any child nodes
	if (document_root.getElementById('i7').children.length != 0){
		// Get the link
		var img_src = document_root.getElementById('i7').getElementsByTagName('a')[0].href;
	} else {
		// If no full size image link, get the standard	img instead
		var img_src = document_root.getElementById('img').src;
	}

	// Get the 'next' page link
	var page = document_root.getElementById('next').href;
	
	// Return both
	return [img_src, page];
}


// "fullimg" is the common denominator for full sized image link
// Will be used to check if "fullimg" link is present
var fs = "fullimg"

// Store getLink() result
var links = getLink(document, fs);

// If links is not null
if (links){
	// Send a message
	chrome.runtime.sendMessage({
		
		// Tell listener.js to "getSauce"
		action: "getSauce",
		
		// Relay the image source
		img: links[0],
		
		// And the next page link
		next: links[1]
	});
}	else {
		// Otherwise, send "NoSauce" and empty links
		chrome.runtime.sendMessage({
		action: "noSauce",
		img: null,
		next: null
	});
}