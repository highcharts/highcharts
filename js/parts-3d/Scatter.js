/*** 
	EXTENSION FOR 3D SCATTER CHART
***/
// Add a third coordinate to the scatter type
H.seriesTypes.scatter = Highcharts.extendClass(H.seriesTypes.scatter, {
	pointArrayMap: ['x', 'y', 'z']
});

// Change tooltip formatter to display z-coordinate
defaultOptions.plotOptions.scatter = H.merge(defaultOptions.plotOptions.scatter, {
	tooltip: {
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>'
	}
});

H.wrap(H.seriesTypes.scatter.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	
	var series = this,
		chart = series.chart,
		options3d = series.chart.options.chart.options3d,
		alpha = options3d.alpha,
		beta = options3d.beta,
		origin = {
			x: chart.inverted ? chart.plotHeight / 2 : chart.plotWidth / 2,
			y: chart.inverted ? chart.plotWidth / 2 : chart.plotHeight / 2, 
			z: options3d.depth
		},
		depth = options3d.depth,
		zAxis = chart.options.zAxis || { min : 0, max: depth };
	
	var rangeModifier = depth / (zAxis.max - zAxis.min);
	
	Highcharts.each(series.data, function (point) {
		var pCo = { 
			x: point.plotX,
			y: point.plotY,
			z: (point.z - zAxis.min) * rangeModifier
		};

		pCo = perspective([pCo], alpha, beta, origin)[0];		

		point.plotX = pCo.x;
		point.plotY = pCo.y;
	});	  
});
