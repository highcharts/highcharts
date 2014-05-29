$(function () {

	/*
	TODO:
	- Don't download cached maps
	- Separators
	- Set location.hash to allow refresh and sending URL

	*/

	// Base path to maps
	var baseMapPath = "http://code.highcharts.com/mapdata/1.0.0/",
		showDataLabels = true, // Switch for data labels enabled/disabled
		mapCount = 0,
		searchText,
		mapOptions = '';

	// Populate dropdown menus and turn into jQuery UI widgets
	$.each(Highcharts.mapDataIndex, function (mapGroup, maps) {

		mapOptions += '<option class="option-header">' + mapGroup + '</option>';
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
		var $selectedItem = $("option:selected", this),
			mapDesc = $selectedItem.text(),
			mapKey = this.value.slice(0, -3),
			svgPath = baseMapPath + mapKey + '.svg',
			geojsonPath = baseMapPath + mapKey + '.geo.json',
			javascriptPath = baseMapPath + this.value,
			isHeader = $selectedItem.hasClass('option-header');

		// Dim or highlight search box
		if (mapDesc === searchText || isHeader) {
			$('.custom-combobox-input').removeClass('valid');
			location.hash = '';
		} else {
			$('.custom-combobox-input').addClass('valid');
			location.hash = mapKey;
		}

		if (isHeader) {
			return false;
		}

        // Show loading 
        if ($("#container").highcharts()) {
        	$("#container").highcharts().showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');
        }


        // When the map is loaded or ready from cache...
        function mapReady () {

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
					.attr({
						title: parent.key
					})
					.click(function () {
						$('#mapDropdown').val(parent.key + '.js').change();
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

				legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'middle'
				},

				loading: {
					labelStyle: {
						top: '200px'
					}
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
                                bBox = this.point.graphic && this.point.graphic.getBBox(),
                                label,
                                name = this.point.properties && this.point.properties['hc-key'];
							
                        	if (props && bBox.width > 20 && bBox.height > 20 && name) {
                        		name = name.split('.');
                        		name = name[name.length - 1];
                        		return name;
                            	/*label = name.substr(0, bBox.width / 8);
                                if (label.length === name.length - 1) {
                                	label = this.point.name;
                                } else  if (label !== name) {
                                	label += '.';
                                }
	                            return label;
	                            */
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
					nullColor: 'gray',
					showInLegend: false,
					enableMouseTracking: false
				}]
			});
		}

		// Check whether the map is already loaded, else load it and
		// then show it async
		if (Highcharts.maps[mapKey]) {
			mapReady(); 
		} else {
			$.getScript(javascriptPath, mapReady);
		}
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
	$("#mapDropdown").val(location.hash ? location.hash.substr(1) + '.js' : 0).change();

});