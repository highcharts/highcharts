

// The mappoint series type
defaultPlotOptions.mappoint = merge(defaultPlotOptions.scatter, {
	dataLabels: {
		enabled: true,
		formatter: function () { // #2945
			return this.point.name;
		},
		crop: false,
		defer: false,
		overflow: false,
		style: {
			color: '#000000'
		}
	}
});
seriesTypes.mappoint = extendClass(seriesTypes.scatter, {
	type: 'mappoint',
	forceDL: true,
	pointClass: extendClass(Point, {
		applyOptions: function (options, x) {
			var mergedOptions = options.lat !== undefined && options.lon !== undefined ? merge(options, this.series.chart.fromLatLonToPoint(options)) : options;
			return Point.prototype.applyOptions.call(this, mergedOptions, x);
		}
	})
});
