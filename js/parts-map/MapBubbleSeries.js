

// The mapbubble series type
if (seriesTypes.bubble) {

	defaultPlotOptions.mapbubble = merge(defaultPlotOptions.bubble, {
		animationLimit: 500,
		tooltip: {
			pointFormat: '{point.name}: {point.z}'
		}
	});
	seriesTypes.mapbubble = extendClass(seriesTypes.bubble, {
		pointClass: extendClass(Point, {
			applyOptions: MapAreaPoint.prototype.applyOptions
		}),
		xyFromShape: true,
		type: 'mapbubble',
		pointArrayMap: ['z'], // If one single value is passed, it is interpreted as z
		/**
		 * Return the map area identified by the dataJoinBy option
		 */
		getMapData: seriesTypes.map.prototype.getMapData,
		getBox: seriesTypes.map.prototype.getBox,
		setData: seriesTypes.map.prototype.setData
	});
}
