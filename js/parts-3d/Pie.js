/*** 
	EXTENSION FOR 3D PIES
***/

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	
	
	var series = this,
		chart = series.chart,
		options = chart.options,
		pieOptions = options.plotOptions.pie,
		depth = pieOptions.depth || 0,
		options3d = options.chart.options3d,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = pieOptions.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (pieOptions.grouping !== false) { z = 0; }

	Highcharts.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		var shapeArgs = point.shapeArgs;

		shapeArgs.z = z;
		shapeArgs.depth = depth * 0.75;
		shapeArgs.origin = origin;
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta;
	
		var angle = (shapeArgs.end + shapeArgs.start) / 2;

		point.slicedTranslation = {
			translateX : round(cos(angle) * series.options.slicedOffset * cos(alpha * deg2rad)),
			translateY : round(sin(angle) * series.options.slicedOffset * cos(alpha * deg2rad))
		};
	});
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	

	var series = this;
	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		var r = shapeArgs.r,
			d = shapeArgs.depth,
			a1 = shapeArgs.alpha * deg2rad,
			b1 = shapeArgs.beta * deg2rad,
			a2 = (shapeArgs.start + shapeArgs.end) / 2; 

		if (point.connector) {
			point.connector.translate(
				(-r * (1 - cos(b1)) * cos(a2)) + (cos(a2) > 0 ? sin(b1) * d : 0),
				(-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0)
			);
		}
		if (point.dataLabel) {
			point.dataLabel.attr({
				x: point.dataLabel.connX + (-r * (1 - cos(b1)) * cos(a2)) + (cos(a2) > 0 ? cos(b1) * d : 0) - (point.dataLabel.width / 2),
				y: point.dataLabel.connY + (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0) - (point.dataLabel.height / 2)
			});
		}
	});
});

Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'addPoint', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));	
	if (this.chart.is3d()) {
		// destroy (and rebuild) everything!!!
		this.update();
	}
});