////Utility Functions///////////////////
function convertToOutletPage(outlet) {

	var finalDomain;
	finalDomain = outlet.toLowerCase();
	finalDomain = finalDomain.replace(" ", "_"); // Replace spaces
	finalDomain = "http://deepfreeze.it/outlet.php?o=" + finalDomain
	return finalDomain;

}

function getDomainFromOutlet(outlet) { // outlet.domain

	var finalDomain;
	finalDomain = outlet.toLowerCase();
	finalDomain = finalDomain.replace(" ", ""); // Strip spaces
	if (finalDomain.indexOf(".") == -1 ) { // Find full stops, if there is then we don't need to supply a TLD :D
		finalDomain = finalDomain + ".com";
	}
	return finalDomain;

}

function getFullDomainFromOutlet(outlet) { // www.outlet.domain

	var finalDomain;
	finalDomain = outlet.toLowerCase();
	finalDomain = finalDomain.replace(" ", ""); // Strip spaces
	if (finalDomain.indexOf(".") == -1 ) {
		finalDomain = finalDomain + ".com";
	}
	finalDomain = "www." + finalDomain;
	return finalDomain;

}

function getDomainFromUrl(url) {
	var matches = url.match(/:\/\/(.[^/]+)/);
	return ((matches != null && typeof matches[1] != 'undefined') ? matches[1] : null);
}

function getOutletList() {

	var request = kango.xhr.getXMLHttpRequest();
	request.open('GET', 'http://deepfreeze.it/outlet.php', false);
	request.send(null);

	var deepFreezeHTML = document.implementation.createHTMLDocument("outlets");
	deepFreezeHTML.documentElement.innerHTML = request.responseText;

	var outletList = deepFreezeHTML.getElementsByClassName("td_w");
	outletList = [].slice.call(outletList);
	outletList.shift();

	for (i = 0; i < outletList.length; i++) {

		outletList[i] = outletList[i].textContent;
		outletList[i] = outletList[i].trim();

	}

	return outletList;

}

function getOutletStatuses() {

	var request = kango.xhr.getXMLHttpRequest();
	request.open('GET', 'http://deepfreeze.it/outlet.php', false);
	request.send(null);

	var deepFreezeHTML = document.implementation.createHTMLDocument("outlets");
	deepFreezeHTML.documentElement.innerHTML = request.responseText;

	var statusList = deepFreezeHTML.getElementsByClassName("td_t");
	statusList = [].slice.call(statusList);

	for (i = 0; i < statusList.length; i++) {

		statusList[i] = statusList[i].textContent;
		statusList[i] = statusList[i].trim();

	}

	return statusList;

}

function getJournoList() { // Hehe, get it, JournoList.

	var request = kango.xhr.getXMLHttpRequest();
	request.open('GET', 'http://deepfreeze.it/journo.php', false);
	request.send(null);

	var deepFreezeHTML = document.implementation.createHTMLDocument("journalists");
	deepFreezeHTML.documentElement.innerHTML = request.responseText;

	var journoList = deepFreezeHTML.getElementsByClassName("td_w");
	journoList = [].slice.call(journoList);
	journoList.shift();

	for (i = 0; i < journoList.length; i++) {

		journoList[i] = journoList[i].textContent;
		journoList[i] = journoList[i].trim();

	}

	return journoList;

}

function encodeToURL(string) {

	string = string.toLowerCase();
	string = string.replace(" ", "_");

	string = string.replace("“", "%26%23147%3B");
	string = string.replace("”", "%26%23148%3B")

	return string
	
}

////////////////////////////////////////

function DeepFreeze() {

	var self = this;

	kango.ui.browserButton.setPopup({
		url: 'popup.html',
		width: 300,
		height: 300
	});

	kango.storage.setItem('outlets', getOutletList()); // Get the list of outlets from DeepFreeze.

	self._generateDefaultSettings()

	kango.storage.setItem('journoList', getJournoList()); // Get the list of Journolists from DeepFreeze

	var emptyJournos = []
	kango.storage.setItem("foundJournos", emptyJournos) // Reset the foundJournos List.

	// Redirect from boycotted sites.
	kango.browser.addEventListener(kango.browser.event.BEFORE_NAVIGATE, function(event) {

		var emptyJournos = []
		self._setNumOfJournos(0) // Reset the level to be sure
		kango.storage.setItem("foundJournos", emptyJournos) // Reset the Journo list for popup

		var outlets = kango.storage.getItem('outlets');
		var outletStatuses = kango.storage.getItem('outletStatuses');

		for (i = 0; i < outlets.length; i++) {

			var domain = getDomainFromUrl(event.url);
			var outletDomain = getDomainFromOutlet(outlets[i]); // outlet.domain
			var outletFullDomain = getFullDomainFromOutlet(outlets[i]); // www.outlet.domain

			var status = outletStatuses[i]

			if (domain == outletDomain || domain == outletFullDomain) {

				kango.console.log("Site " + outletFullDomain + " is on the DeepFreeze outlet list.")

				if (status == "Boycotted") {

					kango.console.log("Site " + outletFullDomain + " is boycotted!")

					event.target.navigate(convertToOutletPage(outlets[i]));

				}
			}

		}

	});

	kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, function(event) {

		// We've loaded the page, quickly scan for journo names.
		// NOTE: Can be pretty slow if it's a big page...

		var emptyJournos = []
		self._setNumOfJournos(0) // Reset the level to be sure
		kango.storage.setItem("foundJournos", emptyJournos) // Reset the Journo list for popup#

		var journoList = kango.storage.getItem('journoList');
		var data = {
			journos: journoList
		}

		event.target.dispatchMessage("generateJournos", data)

	});

	kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function(event) {

		// We already know if a journo name is on the page, no need to generate again,
		// Just retrieve it from the pages content script.

		var emptyJournos = []
		self._setNumOfJournos(0)
		kango.storage.setItem("foundJournos", emptyJournos)

		event.target.dispatchMessage("getJournos")

	});

	kango.addMessageListener("foundJournos", function(event) {

		// Set the badge icon + store the found Journalists.

		kango.storage.setItem("foundJournos", event.data.journos)
		self._setNumOfJournos(event.data.journos.length)
		kango.console.log("Yeeeeh boi")

	});


}

DeepFreeze.prototype = {

	_setNumOfJournos: function(lvl) {
		kango.ui.browserButton.setBadgeValue(lvl);
	},

	_generateDefaultSettings: function() {

		if (kango.storage.getItem('outletStatuses') == null) { // Boycott Statuses

			kango.console.log("Created new status list.")
		
			// We haven't created a status list, do that now.

			var newStatuses = []
			var o = kango.storage.getItem('outlets')

			for (i = 0; i < o.length; i++) {

				newStatuses[i] = 'Neutral'

			}

			kango.storage.setItem('outletStatuses', newStatuses)

		}

		var o = kango.storage.getItem('outlets')
		var s = kango.storage.getItem('outletStatuses')

		if (o.length > s.length) {

			// If a new outlets been added to DeepFreeze, add it to the list. 
			// NOTE: What happens if an outlets deleted from DeepFreeze? No idea, but I doubt it'll happen.

			var dif = o.length - s.length

			for (i = 0; i < dif; i++) {

				s[s.length + i] = 'Neutral'

			}

		}

		if (kango.storage.getItem('boycottEnabled') == null) {

			// Should we redirect outlets?

			kango.storage.setItem('boycottEnabled', false)

		}

	}

};

var extension = new DeepFreeze();