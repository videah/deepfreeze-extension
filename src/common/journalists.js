// ==UserScript==
// @name JournalistScan
// @include http://*
// @include https://*
// @require jquery-1.9.1.min.js
// ==/UserScript==

foundJournos = []
journoLevels = []

function scanForJournos(journoList, levels) {

	foundJournos.length = 0; // Reset foundJournos array.
	journoLevels.length = 0; // Reset journoLevels array.

	for (i = 0; i < journoList.length; i++) {

		var containsJourno = $('div:contains("' + journoList[i] + '")')

		if (containsJourno.length) {
			
			journoLevels[foundJournos.length] = levels[i]
			foundJournos[foundJournos.length] = journoList[i]

		}

	}

	var data = {
		journos: foundJournos,
		levels: journoLevels
	}

	kango.dispatchMessage("foundJournos", data);
	kango.console.log("Finished scan.");

}

kango.addMessageListener("generateJournos", function(event) {

	scanForJournos(event.data.journos, event.data.levels);

});

kango.addMessageListener("getJournos", function(event) {

	var data = {
		journos: foundJournos,
		levels: journoLevels
	}

	kango.dispatchMessage("foundJournos", data);

});