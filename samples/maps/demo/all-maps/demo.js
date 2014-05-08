$(function () {

	// Base path to maps
	var baseMapPath = "http://code.highcharts.com/mapdata/1.0.0/",
		showDataLabels = true, // Switch for data labels enabled/disabled
		mapOptions = '<option value="custom/world.js">Search maps</option>'; // default selected

	// Populate dropdown menus and turn into jQuery UI widgets
	$.each(Highcharts.mapDataIndex, function (mapGroup, maps) {

		mapOptions += '<option>--- ' + mapGroup + ' ---</option>';
		$.each(maps, function (desc, path) {
            mapOptions += '<option value="' + path + '">' + desc + '</option>';
		});
	});
	$("#mapDropdown").append(mapOptions).combobox();

	// Change map when item selected in dropdown 
	$("#mapDropdown").change(function () {
		var mapDesc = $("option:selected", this).text(),
			mapKey = this.value.slice(0, -3),
			svgPath = baseMapPath + mapKey + '.svg',
			geojsonPath = baseMapPath + mapKey + '.geo.json',
			javascriptPath = baseMapPath + this.value;

        // Hide default selected
        if (mapDesc === 'Search maps') {
            mapDesc = '';
        }

		// Get map from server
		$.getScript(javascriptPath, function () {
			var mapGeoJSON = Highcharts.maps[mapKey],
				data = [];

			// Update info box download links
			$("#download").html('<a target="_blank" href="' + svgPath +
				'">SVG</a> <a target="_blank" href="' + geojsonPath +
				'">GeoJSON</a> <a target="_blank" href="' + javascriptPath + '">JavaScript</a>');

			// Generate non-random data for the map    
			$.each(mapGeoJSON.features, function (index, feature) {
				data.push({
					code: feature.properties.code,
					value: index
				});
			});

			// Instantiate chart
			$("#container").highcharts('Map', {

				title: {
					text: 'Map Choice Demo'
				},

				subtitle: {
					text: mapDesc
				},

				mapNavigation: {
					enabled: true,
					buttonOptions: {
						verticalAlign: 'bottom'
					}
				},

				colorAxis: {
					min: 0
				},

				series: [{
					data: data,
					mapData: Highcharts.geojson(mapGeoJSON, 'map'),
					joinBy: 'code',
					name: 'Random data',
					states: {
						hover: {
							color: '#BADA55'
						}
					},
					dataLabels: {
						enabled: showDataLabels,
						formatter: function () {
							var props = this.point.properties,
                                bBox = this.point.graphic && this.point.graphic.getBBox();
							
                            if (props && bBox.width > 30 && bBox.height > 20) {
                                return props['postal-code'] && props['postal-code'] !== 'NULL' ? props['postal-code'] :
								    props.code;
                            }
						}
					}
				}, {
					type: 'mapline',
					name: "Separators",
					data: Highcharts.geojson(mapGeoJSON, 'mapline'),
					color: 'black',
					showInLegend: false,
					enableMouseTracking: false
				}]
			});
		});
	});

	// Toggle data labels - Note: Reloads map with new random data
	$("#chkDataLabels").change(function () {
		showDataLabels = !showDataLabels;
		$("#mapDropdown").change();
	});

	// Switch to previous map on button click
	$("#btn-prev-map").click(function () {
		$("#mapDropdown option:selected").prev("option").prop("selected", true).change();
	});

	// Switch to next map on button click
	$("#btn-next-map").click(function () {
		$("#mapDropdown option:selected").next("option").prop("selected", true).change();
	});

	// Trigger change event to load map on startup
	$("#mapDropdown").change();

});