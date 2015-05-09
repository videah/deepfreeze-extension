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
	finalDomain = finalDomain + ".com";
	return finalDomain;

}

function getFullDomainFromOutlet(outlet) { // www.outlet.domain

	var finalDomain;
	finalDomain = outlet.toLowerCase();
	finalDomain = finalDomain.replace(" ", ""); // Strip spaces
	finalDomain = "www." + finalDomain;
	finalDomain = finalDomain + ".com";
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
		outletList[i] = outletList[i].trim()

	}

	return outletList;

}

function getOutletStatus(outlet) {

	//TODO

}

////////////////////////////////////////

var outlets = getOutletList()

function DeepFreeze() {

	var self = this;
	kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
		self._setLevel(5);
	});

	// Redirect from boycotted sites.
	kango.browser.addEventListener(kango.browser.event.BEFORE_NAVIGATE, function(event) {

		for (i = 0; i < outlets.length; i++) {

			var domain = getDomainFromUrl(event.url);
			var outletDomain = getDomainFromOutlet(outlets[i]); // outlet.domain
			var outletFullDomain = getFullDomainFromOutlet(outlets[i]); // www.outlet.domain

			if (domain == outletDomain || domain == outletFullDomain) {
				event.target.navigate(convertToOutletPage(outlets[i]));
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