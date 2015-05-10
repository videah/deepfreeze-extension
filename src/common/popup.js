var DeepFreezePopup = {

	init: function() {

		kango.invokeAsync('kango.storage.getItem', 'foundJournos', function(data) {

			foundJournos = data

			if (foundJournos.length > 0) {

				$('#noFoundLabel').hide();

				var tableDiv = document.getElementById("journalistTable")
				var table = document.createElement("table")
				var tableBody = document.createElement("tbody")

				table.appendChild(tableBody);

				foundJournos.sort();

				for (i = 0; i < foundJournos.length; i++) {

					var tr = document.createElement("tr");
					var td = document.createElement("td");
					var div = document.createElement("div");

					div.style.width = "200px"
					div.style.height = "25px"
					div.innerHTML = foundJournos[i]

					td.appendChild(div);
					tr.appendChild(td);
					tableBody.appendChild(tr);

				}

				tableDiv.appendChild(table)

			}

		});

		$('#refresh').click(function(event) {

			kango.invokeAsync("kango.storage.getItem", "journoList", function(journoList) {

				kango.browser.tabs.getCurrent(function(tab) {

					var data = {
					journos: journoList
					}

					tab.dispatchMessage("getJournos", data)
					KangoAPI.closeWindow();

				});

			});

		});

	}

};

KangoAPI.onReady(function() {

	DeepFreezePopup.init();

});