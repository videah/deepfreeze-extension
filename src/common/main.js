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

////////////////////////////////////////

function DeepFreeze() {

	var self = this;

	kango.ui.browserButton.setPopup({
		url: 'popup.html',
		width: 300,
		height: 300
	});

	kango.storage.setItem('outlets', getOutletList());
	kango.storage.setItem('outletStatuses', getOutletStatuses());
	kango.storage.setItem('journoList', getJournoList());

	var emptyJournos = []
	kango.storage.setItem("foundJournos", emptyJournos)

	// Redirect from boycotted sites.
	kango.browser.addEventListener(kango.browser.event.BEFORE_NAVIGATE, function(event) {

		var outlets = kango.storage.getItem('outlets');
		var outletStatuses = kango.storage.getItem('outletStatuses');

		for (i = 0; i < outlets.length; i++) {

			var domain = getDomainFromUrl(event.url);
			var outletDomain = getDomainFromOutlet(outlets[i]); // outlet.domain
			var outletFullDomain = getFullDomainFromOutlet(outlets[i]); // www.outlet.domain

			var status = outletStatuses[i]

			if (domain == outletDomain || domain == outletFullDomain) {

				kango.console.log("Site " + outletFullDomain + " is on the DeepFreeze outlet list.")

				kango.console.log(status)

				if (status == "Boycotted") {

					kango.console.log("Site " + outletFullDomain + " is boycotted!")

					//event.target.navigate(convertToOutletPage(outlets[i]));

				}
			}

		}

	});

	// Get the journalists from that page.
	kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, function(event) {

		var emptyJournos = []
		self._setLevel(0) // Reset the level to be sure
		kango.storage.setItem("foundJournos", emptyJournos) // Reset the Journo list for popup

		var journoList = kango.storage.getItem('journoList');
		var data = {
			journos: journoList
		}

		event.target.dispatchMessage("generateJournos", data)

	});

	kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function(event) {

		var emptyJournos = []
		self._setLevel(0)
		kango.storage.setItem("foundJournos", emptyJournos)

		event.target.dispatchMessage("getJournos")

	});

	kango.addMessageListener("foundJournos", function(event) {

		kango.storage.setItem("foundJournos", event.data.journos)
		self._setLevel(event.data.journos.length)

	});


}

DeepFreeze.prototype = {

	_setLevel: function(lvl) {
		kango.ui.browserButton.setBadgeValue(lvl);
	}

};

var extension = new DeepFreeze();

// var journoList = kango.storage.getItem('journoList');

// function scanForJournos() {

// 	var foundJournos = []

// 	for (i = 0; i < journoList.length; i++) {

// 		var containsJourno = $('*:contains("' + journoList[i] + '")')

// 		if (containsJourno.length) {
			
// 			foundJournos[foundJournos.length] = journoList[i]
// 			kango.console.log("Found journo " + journoList[i])

// 		}

// 	}

// 	kango.invokeAsync('kango.storage.setItem', 'foundJournos', foundJournos);
// 	kango.invokeAsync('extension._setLevel', foundJournos.length);

// }

// window.setInterval(scanForJournos, 2000)