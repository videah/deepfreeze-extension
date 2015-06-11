var DeepFreezeOptions = {

	init: function() {

		self = this
		self.createOutletTable();

	},

	createOutletTable: function() {

		kango.invokeAsync("kango.storage.getItem", "boycottEnabled", function(enabled) {

			if (enabled == true) {

				kango.invokeAsync("kango.storage.getItem", "outletList", function(outlets) {
			
					var myTableDiv = document.getElementById("outletTable")
					var table = document.createElement('TABLE')
					var tableBody = document.createElement('TBODY')

					table.border = '1'
					table.id = 'actualOutletTable'
					table.style.textAlign = 'center';
					table.appendChild(tableBody);

					var heading = new Array();
					heading[0] = "Outlet"
					heading[1] = "Outlet Status"

					//Table Columns
					var tr = document.createElement('TR');
					tableBody.appendChild(tr);
					for (i = 0; i < heading.length; i++) {
						var th = document.createElement('TH')
						th.width = '200';
						th.appendChild(document.createTextNode(heading[i]));
						tr.appendChild(th);
					}

					//Table Rows
					for (i = 0; i < outlets.length; i++) {
						var outletStatus = outlets[i].status
						var tr = document.createElement('TR');
						for (j = 0; j < 2; j++) {
							var td = document.createElement('TD')

							if (j == 0) {

								var outletName = document.createTextNode(outlets[i].name);

								if (outletStatus == "Boycotted") {
									td.style.color = 'red'
								}

								td.appendChild(outletName);
							}

							if (j == 1) {

								var status = document.createElement("select");
								status.className = "dropdownSetting"

								optionNeutral = document.createElement("option")
								optionNeutral.value = "Neutral"
								optionNeutral.text = "Neutral"

								optionBoycotted = document.createElement("option")
								optionBoycotted.value = "Boycotted"
								optionBoycotted.text = "Boycotted"

								status.options.add(optionNeutral)
								status.options.add(optionBoycotted)

								status.style.width = '100%'

								if (outletStatus == "Boycotted") {
									status.selectedIndex = 1
								}

								td.appendChild(status)
							}

							tr.appendChild(td)
						}
						tableBody.appendChild(tr);
					}
					myTableDiv.appendChild(table)
				});
			}
		});
	}

}

KangoAPI.onReady(function() {

	var outlets = kango.storage.getItem('outlets')
	var outletStatuses = kango.storage.getItem('outletStatuses')

	if (kango.storage.getItem('boycottEnabled') == true) {

		$('#enabled').attr('checked', true)

	}

	$('#save').click(function(event) {

		kango.browser.tabs.getCurrent(function(tab) {

			kango.invokeAsync("kango.storage.getItem", "outletList", function(outlets) {

				var dropList = document.getElementsByClassName("dropdownSetting")
				dropList = [].slice.call(dropList);

				for (i = 0; i < dropList.length; i++) {

					outlets[i].status = dropList[i].value;

				}

				kango.invokeAsync('kango.storage.setItem', 'outletList', outlets);

				if ($('#enabled').is(':checked')) {

					kango.invokeAsync('kango.storage.setItem', 'boycottEnabled', true);
					kango.console.log("Boycott: Enabled")

				} else {

					kango.invokeAsync('kango.storage.setItem', 'boycottEnabled', false);
					kango.console.log("Boycott: Disabled")

				}

				tab.navigate(tab.getUrl())

			});

		});

	});

	DeepFreezeOptions.init();

});