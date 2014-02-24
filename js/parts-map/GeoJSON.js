
/**
 * Convert a geojson object to map data of a given Highcharts type (map, mappoint or mapline).
 */
Highcharts.geojson = function (geojson, hType) {
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
	
	each(geojson.features, function (feature) {

		var geometry = feature.geometry,
			type = geometry.type,
			coordinates = geometry.coordinates,
			properties = feature.properties,
			point;
		
		path = [];

		if (hType === 'map') {
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
	return mapData;
};