

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
	forceDL: true
});