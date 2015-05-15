// ==UserScript==
// @name JournalistScan
// @include http://*
// @include https://*
// @require jquery-1.9.1.min.js
// ==/UserScript==

// Creates a case insensitive :contains()
$.extend($.expr[":"], {
	"containsNC": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});

var foundJournos = []
var journoLevels = []
var journoLinks = []

function scanForJournos(journoList, levels, links) {

	foundJournos.length = 0; // Reset foundJournos array.
	journoLevels.length = 0; // Reset journoLevels array.
	journoLinks.length = 0; // Reset journoLinks array.

	for (i = 0; i < journoList.length; i++) {

		var containsJourno = $('div:containsNC("' + journoList[i] + '")')

		if (containsJourno.length) {
			
			journoLevels[foundJournos.length] = levels[i]
			journoLinks[foundJournos.length] = links[i]
			foundJournos[foundJournos.length] = journoList[i]

		}

	}

	var data = {
		journos: foundJournos,
		levels: journoLevels,
		links: journoLinks
	}

	kango.dispatchMessage("foundJournos", data);
	kango.console.log("Finished scan.");

}

kango.addMessageListener("generateJournos", function(event) {

	scanForJournos(event.data.journos, event.data.levels, event.data.links);

});

kango.addMessageListener("getJournos", function(event) {

	var data = {
		journos: foundJournos,
		levels: journoLevels,
		links: journoLinks
	}

	kango.dispatchMessage("foundJournos", data);

});