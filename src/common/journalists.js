// ==UserScript==
// @name JournalistScan
// @include http://*
// @include https://*
// @require jquery-1.9.1.min.js
// ==/UserScript==

kango.invokeAsync("kango.storage.getItem", "journoList", function(data) {

	scanForJournos(data);

});

function scanForJournos(journoList) {

	var foundJournos = []

	for (i = 0; i < journoList.length; i++) {

		var containsJourno = $('div:contains("' + journoList[i] + '")')

		if (containsJourno.length) {
			
			foundJournos[foundJournos.length] = journoList[i]

		}

	}

	var data = {
		journos: foundJournos
	}

	kango.dispatchMessage("foundJournos", data)
	kango.console.log("Finished scan.")

}

kango.addMessageListener("getJournos", function(event) {

	scanForJournos(event.data.journos);

});