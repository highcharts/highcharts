

// The mappoint series type
defaultPlotOptions.mappoint = merge(defaultPlotOptions.scatter, {
	dataLabels: {
		enabled: true,
		formatter: function () { // #2945
			return this.point.name; 
		},
		color: 'black',
		crop: false,
		defer: false,
		overflow: false,
		style: {
			textShadow: '0 0 4px contrast, 0 0 2px contrast'
		}
	}
});
seriesTypes.mappoint = extendClass(seriesTypes.scatter, {
	type: 'mappoint',
	forceDL: true,
	pointClass: extendClass(Point, {
		applyOptions: function (options, x) {
			var point = Point.prototype.applyOptions.call(this, options, x);
			if (options.lat !== undefined && options.lon !== undefined) {
				point = extend(point, this.series.chart.fromLatLonToPoint(point));
			}
			return point;
		}
	})
});