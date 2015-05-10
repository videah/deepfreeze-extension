var DeepFreezeOptions = {

	init: function() {

		self = this
		self.createOutletTable();

	},

	createOutletTable: function() {

		var outlets = kango.storage.getItem('outlets')
		var outletStatuses = kango.storage.getItem('outletStatuses')

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
			var tr = document.createElement('TR');
			for (j = 0; j < 2; j++) {
				var td = document.createElement('TD')

				if (j == 0) {

					var outletName = document.createTextNode(outlets[i]);

					if (outletStatuses[i] == "Boycotted") {
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

					if (outletStatuses[i] == "Boycotted") {
						status.selectedIndex = 1
					}

					td.appendChild(status)
				}

				tr.appendChild(td)
			}
			tableBody.appendChild(tr);
		}
		myTableDiv.appendChild(table)
	}

}

KangoAPI.onReady(function() {

	var outlets = kango.storage.getItem('outlets')
	var outletStatuses = kango.storage.getItem('outletStatuses')

	$('#save').click(function(event) {

		var dropList = document.getElementsByClassName("dropdownSetting")
		dropList = [].slice.call(dropList);

		for (i = 0; i < dropList.length; i++) {

			dropList[i] = dropList[i].value;

		}

		kango.invokeAsync('kango.storage.setItem', 'outletStatuses', dropList);

		KangoAPI.closeWindow();

	});

	DeepFreezeOptions.init();

});

// var StorageTest = {

// 	init: function() {
// 		$('#storage-get').click(function(event) {
// 			StorageTest.testGet();
// 		});

// 		$('#storage-set').click(function(event) {
// 			StorageTest.testSet();
// 		});

// 		$('#storage-remove').click(function(event) {
// 			StorageTest.testRemove();
// 		});

// 		$('#storage-keys').click(function(event) {
// 			StorageTest.testKeys();
// 		});
// 	},

// 	testGet: function() {
// 		kango.invokeAsync('kango.storage.getItem', $('#storage-key').val(), function(value) {
// 			$('#storage-value').val(value || 'null');
// 		});
// 	},

// 	testSet: function() {
// 		kango.invokeAsync('kango.storage.setItem', $('#storage-key').val(), $('#storage-value').val());
// 	},

// 	testRemove: function() {
// 		kango.invokeAsync('kango.storage.removeItem', $('#storage-key').val(), function() {
// 			$('#storage-value').val('null');
// 		});
// 	},

// 	testKeys: function() {
// 		kango.invokeAsync('kango.storage.getKeys', function(keys) {
// 			$('#storage-value').val(keys.toString());
// 		});
// 	}
// };

// KangoAPI.onReady(function() {
// 	$('#ready').show();
// 	$('#not-ready').hide();

// 	$('#close').click(function(event) {
// 		KangoAPI.closeWindow()
// 	});

// 	StorageTest.init();
// });