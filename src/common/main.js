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
	finalDomain = "www." + finalDomain;
	if (finalDomain.indexOf(".") == -1 ) {
		finalDomain = finalDomain + ".com";
	}
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

////////////////////////////////////////

function DeepFreeze() {

	var self = this;

	kango.ui.browserButton.setPopup({
		url: 'popup.html',
		width: 200,
		height: 300
	});

	kango.storage.setItem('outlets', getOutletList());
	kango.storage.setItem('outletStatuses', getOutletStatuses());

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

					event.target.navigate(convertToOutletPage(outlets[i]));

				}
			}

		}

	});

}

DeepFreeze.prototype = {

	_setLevel: function(lvl) {
		kango.ui.browserButton.setBadgeValue(lvl);
	}

};

var extension = new DeepFreeze();