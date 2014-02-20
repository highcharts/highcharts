
/**
 * Convert a geojson object to map data of a given Highcharts type (map, mappoint or mapline).
 */
Highcharts.geojson = function (geojson, hType) { // docs: API methods
	var mapData = [],
		path = [],
		polygonToPath = function (polygon) {
			path.push('M');
			each(polygon, function (point, i) {
				if (i === 1) {
					path.push('L');
				}
				path.push(point[0], -point[1]);
			});
		};
	
	each(geojson.features, function (feature) {
		path = [];

		if (hType === 'map') {
			if (feature.geometry.type === 'Polygon') {
				each(feature.geometry.coordinates, polygonToPath);
				path.push('Z');

			} else if (feature.geometry.type === 'MultiPolygon') {
				each(feature.geometry.coordinates, function (items) {
					each(items, polygonToPath);
				});
				path.push('Z');
			}
		}
		mapData.push({
			path: path,
			name: feature.properties.name,
			properties: feature.properties
		});
		
	});
	return mapData;
};