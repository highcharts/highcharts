

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
			HcTextStroke: '3px auto'
		}
	}
});
seriesTypes.mappoint = extendClass(seriesTypes.scatter, {
	type: 'mappoint',
	forceDL: true
});