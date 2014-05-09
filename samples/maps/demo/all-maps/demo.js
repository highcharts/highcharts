$(function () {

	// Base path to maps
	var baseMapPath = "http://code.highcharts.com/mapdata/1.0.0/",
		showDataLabels = true, // Switch for data labels enabled/disabled
		mapCount = 0,
		searchText,
		mapOptions = '';

	// Populate dropdown menus and turn into jQuery UI widgets
	$.each(Highcharts.mapDataIndex, function (mapGroup, maps) {

		mapOptions += '<option>--- ' + mapGroup + ' ---</option>';
		$.each(maps, function (desc, path) {
            mapOptions += '<option value="' + path + '">' + desc + '</option>';
            mapCount++;
		});
	});
	searchText = 'Search ' + mapCount + ' maps';
	mapOptions = '<option value="custom/world.js">' + searchText + '</option>' + mapOptions;
	$("#mapDropdown").append(mapOptions).combobox();

	// Change map when item selected in dropdown 
	$("#mapDropdown").change(function () {
		var mapDesc = $("option:selected", this).text(),
			mapKey = this.value.slice(0, -3),
			svgPath = baseMapPath + mapKey + '.svg',
			geojsonPath = baseMapPath + mapKey + '.geo.json',
			javascriptPath = baseMapPath + this.value,
			isHeader = mapDesc.indexOf('---') === 0;

		// Dim or highlight search box
		if (mapDesc === searchText || isHeader) {
			$('.custom-combobox-input').removeClass('valid');
		} else {
			$('.custom-combobox-input').addClass('valid');
		}

		if (isHeader) {
			return;
		}

        // Show loading 
        if ($("#container").highcharts()) {
        	$("#container").highcharts().showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');
        }

		// Get map from server
		$.getScript(javascriptPath, function () {

			var mapGeoJSON = Highcharts.maps[mapKey],
				data = [],
				parent,
				match;

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

			// Show arrows the first time a real map is shown
			if (mapDesc !== searchText) {
				$('.selector .prev-next').show();
				$('#sideBox').show();
			}

			
			// Is there a layer above this?
			if (/^countries\/[a-z]{3}\/[a-z]{3}-all$/.test(mapKey)) { // country
				parent = {
					desc: 'World',
					key: 'custom/world'
				};
			} else if (match = mapKey.match(/^(countries\/[a-z]{3}\/[a-z]{3})-[a-z0-9]+-all$/)) { // admin1
				parent = {
					desc: $('option[value="' + match[1] + '-all.js"]').text(),
					key: match[1] + '-all'
				};
			}
			$('#up').html('');
			if (parent) {
				$('#up').append(
					$('<a><i class="fa fa-angle-up"></i> ' + parent.desc + '</a>')
					.click(function () {
						$('#mapDropdown').val(parent.key).change();
					})
				);
			}


			// Instantiate chart
			$("#container").highcharts('Map', {

				title: {
					text: null
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
                                /*return props['postal-code'] && props['postal-code'] !== 'NULL' ? props['postal-code'] :
								    props.code;*/
								return this.point.name && (this.point.name.substr(0, 3) + '.')
                            }
						}
					},
					point: {
						events: {
							// On click, look for a detailed map
							click: function () {
								var code = this.code.toLowerCase();
								$('#mapDropdown option').each(function (i) {
									if (this.value === 'countries/' + code + '/' + code + '-all.js') {
										$('#mapDropdown').val(this.value).change();
									}
								});
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