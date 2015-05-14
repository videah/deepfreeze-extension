// ==UserScript==
// @name JournalistScan
// @include http://*
// @include https://*
// @require jquery-1.9.1.min.js
// ==/UserScript==

foundJournos = []

function scanForJournos(journoList) {

	foundJournos.length = 0; // Reset foundJournos array.

	for (i = 0; i < journoList.length; i++) {

		var containsJourno = $('div:contains("' + journoList[i] + '")')

		if (containsJourno.length) {
			
			foundJournos[foundJournos.length] = journoList[i]

		}

	}

	var data = {
		journos: foundJournos
	}

	kango.dispatchMessage("foundJournos", data);
	kango.console.log("Finished scan.");

}

kango.addMessageListener("generateJournos", function(event) {

	scanForJournos(event.data.journos);

});

kango.addMessageListener("getJournos", function(event) {

	var data = {
		journos: foundJournos
	}

	kango.dispatchMessage("foundJournos", data);

});