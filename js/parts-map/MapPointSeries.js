(function (H) {
	var Point = H.Point;

// The mappoint series type
H.defaultPlotOptions.mappoint = H.merge(H.defaultPlotOptions.scatter, {
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
H.seriesTypes.mappoint = H.extendClass(H.seriesTypes.scatter, {
	type: 'mappoint',
	forceDL: true,
	pointClass: H.extendClass(Point, {
		applyOptions: function (options, x) {
			var point = Point.prototype.applyOptions.call(this, options, x);
			if (options.lat !== undefined && options.lon !== undefined) {
				point = H.extend(point, this.series.chart.fromLatLonToPoint(point));
			}
			return point;
		}
	})
});
	return H;
}(Highcharts));
