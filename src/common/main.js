////Utility Functions///////////////////
function convertToOutletPage(outlet) {

	var finalDomain;
	finalDomain = outlet.toLowerCase();
	finalDomain = finalDomain.replace(/ /g, "_"); // Replace spaces
	finalDomain = "http://deepfreeze.it/outlet.php?o=" + finalDomain
	return finalDomain;

}

function getDomainFromOutlet(outlet) { // outlet.domain

	var finalDomain;
	finalDomain = outlet.toLowerCase();
	finalDomain = finalDomain.replace(/ /g, ""); // Strip spaces
	if (finalDomain.indexOf(".") == -1 ) { // Find full stops, if there is then we don't need to supply a TLD :D
		finalDomain = finalDomain + ".com";
	}
	return finalDomain;

}

function getFullDomainFromOutlet(outlet) { // www.outlet.domain

	var finalDomain;
	finalDomain = outlet.toLowerCase();
	finalDomain = finalDomain.replace(/ /g, ""); // Strip spaces
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

function getJournoLevels() {

	var request = kango.xhr.getXMLHttpRequest();
	request.open('GET', 'http://deepfreeze.it/journo.php', false);
	request.send(null);

	var deepFreezeHTML = document.implementation.createHTMLDocument("journalists");
	deepFreezeHTML.documentElement.innerHTML = request.responseText;

	var levelList = deepFreezeHTML.getElementsByClassName("td_n");
	levelList = [].slice.call(levelList);

	for (i = 0; i < 3; i++) {
		levelList.shift();
	}

	for (i = 0; i < levelList.length; i++) {

		levelList[i] = levelList[i].textContent;
		levelList[i] = levelList[i].trim();

	}

	kango.console.log(levelList)

	return levelList;

}

function getJournoLinks() {

	var request = kango.xhr.getXMLHttpRequest();
	request.open('GET', 'http://deepfreeze.it/journo.php', false);
	request.send(null);

	var deepFreezeHTML = document.implementation.createHTMLDocument("journalists");
	deepFreezeHTML.documentElement.innerHTML = request.responseText;

	var linkList = deepFreezeHTML.getElementsByClassName("td_w");
	linkList = [].slice.call(linkList);
	linkList.shift();

	for (i = 0; i < linkList.length; i++) {

		linkList[i] = linkList[i].children.item(0);
		linkList[i] = linkList[i].attributes.href.value;

	}

	return linkList;

}

function encodeToURL(string) {

	string = string.toLowerCase();
	string = string.replace(/ /g, "_");
	string = unescape(string)

	return string
	
}

function objectSort(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

////////////////////////////////////////

function DeepFreeze() {

	var self = this;

	kango.ui.browserButton.setPopup({
		url: 'popup.html',
		width: 310,
		height: 500
	});

	kango.storage.setItem('journoList', getJournoList()); // Get the list of Journalists from DeepFreeze.

	kango.storage.setItem('journoLinks', getJournoLinks()); // Get's the links to Journalists DeepFreeze pages.

	kango.storage.setItem('levelList', getJournoLevels()); // Get the DeepFreeze levels of the Journalists.

	self._generateDefaultSettings();

	var emptyJournos = []
	kango.storage.setItem("foundJournos", emptyJournos) // Reset the foundJournos List.

	// Redirect from boycotted sites.
	kango.browser.addEventListener(kango.browser.event.BEFORE_NAVIGATE, function(event) {

		var enabled = kango.storage.getItem('boycottEnabled')

		if (enabled == true) {

			kango.console.log("Detecting boycott...")
			var emptyJournos = []
			self._setNumOfJournos(0) // Reset the level to be sure
			kango.storage.setItem("foundJournos", emptyJournos) // Reset the Journo list for popup
			var outletList = kango.storage.getItem("outletList")

			for (i = 0; i < outletList.length; i++) {

				var outletName = outletList[i].name
				var outletStatus = outletList[i].status

				var domain = getDomainFromUrl(event.url);
				var outletDomain = getDomainFromOutlet(outletName); // outlet.domain
				var outletFullDomain = getFullDomainFromOutlet(outletName); // www.outlet.domain

				if (domain == outletDomain || domain == outletFullDomain) {

					kango.console.log(outletStatus)

					kango.console.log("Site " + outletFullDomain + " is on the DeepFreeze outlet list.")

					if (outletStatus == "Boycotted") {

						kango.console.log("Site " + outletFullDomain + " is boycotted!")

						event.target.navigate(convertToOutletPage(outletName));

					}
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
		kango.storage.setItem("foundLevels", emptyJournos)
		kango.storage.setItem("foundLinks", emptyJournos)

		var journoList = kango.storage.getItem('journoList');
		var levelList = kango.storage.getItem('levelList');
		var journoLinks = kango.storage.getItem('journoLinks')
		var data = {
			journos: journoList,
			levels: levelList,
			links: journoLinks
		}

		event.target.dispatchMessage("generateJournos", data)

	});

	kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function(event) {

		// We already know if a journo name is on the page, no need to generate again,
		// Just retrieve it from the pages content script.

		var emptyJournos = []
		self._setNumOfJournos(0)
		kango.storage.setItem("foundJournos", emptyJournos)
		kango.storage.setItem("foundLevels", emptyJournos)
		kango.storage.setItem("foundLinks", emptyJournos)

		event.target.dispatchMessage("getJournos")

	});

	kango.addMessageListener("foundJournos", function(event) {

		// Set the badge icon + store the found Journalists.

		kango.storage.setItem("foundJournos", event.data.journos)
		kango.storage.setItem("foundLevels", event.data.levels)
		kango.storage.setItem("foundLinks", event.data.links)

		self._setNumOfJournos(event.data.journos.length)

	});


}

DeepFreeze.prototype = {

	_setNumOfJournos: function(lvl) {
		kango.ui.browserButton.setBadgeValue(lvl);
	},

	_generateDefaultSettings: function() {

		var outlets = getOutletList();

		if (kango.storage.getItem('outletList') == null) {

			var outletList = []

			for (i = 0; i < outlets.length; i++) {

				outletList[i] = {name:outlets[i], status:"Neutral"}

			}

			kango.storage.setItem('outletList', outletList)

			kango.console.log('Created outletList...')

		}

		var o = kango.storage.getItem('outletList')
		var n = outlets

		if (o.length < n.length) { 

			kango.console.log('New outlet(s) detected, adding to outletList...')

			// If new outlets are on DeepFreeze, add them to the end of the outletList and sort it.
			// No idea if this works lol.

			var dif = n.length - o.length

			for (i = 0; i < diff; i++) {

				for (j = 0; j < n.length; j++) {

					for (k = 0; k < o.length; k++) {

						if (n[j] == o[k]) {

							o[o.length] = {name:n[j], status:"Neutral"}

						}

					}

				}

			}

			o.sort(objectSort('name'))
			kango.storage.setItem('outletList', o)

			kango.console.log('Finished!')

		}

		if (kango.storage.getItem('boycottEnabled') == null) {

			// Should we redirect outlets?

			kango.storage.setItem('boycottEnabled', false)

		}

	}

};

var extension = new DeepFreeze();