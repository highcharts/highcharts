/*** 
	EXTENSION FOR 3D SCATTER CHART
***/
Highcharts.wrap(Highcharts.seriesTypes.scatter.prototype, 'translate', function (proceed) {
//function translate3d(proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	
	if (!this.chart.is3d()) {
		return;
	}	

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

		point.plotXold = point.plotX;
		point.plotYold = point.plotY;
		
		point.plotX = pCo.x;
		point.plotY = pCo.y;
		point.plotZ = pCo.z;
	});	  
});

Highcharts.wrap(Highcharts.seriesTypes.scatter.prototype, 'init', function (proceed) {
	var result = proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {
		// Add a third coordinate
		this.pointArrayMap = ['x', 'y', 'z'];

		// Set a new default tooltip formatter
		var default3dScatterTooltip = 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>';
		if (this.userOptions.tooltip) {
			this.tooltipOptions.pointFormat = this.userOptions.tooltip.pointFormat || default3dScatterTooltip;
		} else {
			this.tooltipOptions.pointFormat = default3dScatterTooltip;
		}
	}
	return result;
});