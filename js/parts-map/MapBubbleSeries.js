(function (H) {
	var MapAreaPoint = H.MapAreaPoint,
		Point = H.Point;

// The mapbubble series type
if (H.seriesTypes.bubble) {

	H.defaultPlotOptions.mapbubble = H.merge(H.defaultPlotOptions.bubble, {
		animationLimit: 500,
		tooltip: {
			pointFormat: '{point.name}: {point.z}'
		}
	});
	H.seriesTypes.mapbubble = H.extendClass(H.seriesTypes.bubble, {
		pointClass: H.extendClass(Point, {
			applyOptions: function (options, x) {
				var point;
				if (options.lat !== undefined && options.lon !== undefined) {
					point = Point.prototype.applyOptions.call(this, options, x);
					point = H.extend(point, this.series.chart.fromLatLonToPoint(point));
				} else {
					point = MapAreaPoint.prototype.applyOptions.call(this, options, x);
				}
				return point;
			},
			ttBelow: false
		}),
		xyFromShape: true,
		type: 'mapbubble',
		pointArrayMap: ['z'], // If one single value is passed, it is interpreted as z
		/**
		 * Return the map area identified by the dataJoinBy option
		 */
		getMapData: H.seriesTypes.map.prototype.getMapData,
		getBox: H.seriesTypes.map.prototype.getBox,
		setData: H.seriesTypes.map.prototype.setData
	});
}

	return H;
}(Highcharts));
