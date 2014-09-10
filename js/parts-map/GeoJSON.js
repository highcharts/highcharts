
/**
 * Convert a geojson object to map data of a given Highcharts type (map, mappoint or mapline).
 */
Highcharts.geojson = function (geojson, hType, series) {
	var mapData = [],
		path = [],
		polygonToPath = function (polygon) {
			var i = 0,
				len = polygon.length;
			path.push('M');
			for (; i < len; i++) {
				if (i === 1) {
					path.push('L');
				}
				path.push(polygon[i][0], -polygon[i][1]);
			}
		};

	hType = hType || 'map';
	
	each(geojson.features, function (feature) {

		var geometry = feature.geometry,
			type = geometry.type,
			coordinates = geometry.coordinates,
			properties = feature.properties,
			point;
		
		path = [];

		if (hType === 'map' || hType === 'mapbubble') {
			if (type === 'Polygon') {
				each(coordinates, polygonToPath);
				path.push('Z');

			} else if (type === 'MultiPolygon') {
				each(coordinates, function (items) {
					each(items, polygonToPath);
				});
				path.push('Z');
			}

			if (path.length) {
				point = { path: path };
			}
		
		} else if (hType === 'mapline') {
			if (type === 'LineString') {
				polygonToPath(coordinates);
			} else if (type === 'MultiLineString') {
				each(coordinates, polygonToPath);
			}

			if (path.length) {
				point = { path: path };
			}
		
		} else if (hType === 'mappoint') {
			if (type === 'Point') {
				point = {
					x: coordinates[0],
					y: -coordinates[1]
				};
			}
		}
		if (point) {
			mapData.push(extend(point, {
				name: properties.name || properties.NAME, 
				properties: properties
			}));
		}
		
	});

	// Create a credits text that includes map source, to be picked up in Chart.showCredits
	if (series && geojson.copyrightShort) {
		series.chart.mapCredits = '<a href="http://www.highcharts.com">Highcharts</a> \u00A9 ' +
			'<a href="' + geojson.copyrightUrl + '">' + geojson.copyrightShort + '</a>';
		series.chart.mapCreditsFull = geojson.copyright;
	}

	return mapData;
};

/**
 * Override showCredits to include map source by default
 */
wrap(Chart.prototype, 'showCredits', function (proceed, credits) {

	if (defaultOptions.credits.text === this.options.credits.text && this.mapCredits) { // default text and mapCredits is set
		credits.text = this.mapCredits;
		credits.href = null;
	}

	proceed.call(this, credits);

	if (this.credits) { 
		this.credits.attr({ 
			title: this.mapCreditsFull
		});
	}
});