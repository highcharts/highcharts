/*** 
	EXTENSION FOR 3D PIES
***/

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
		return;
	}	


	var type = this.chart.options.chart.type;

	var series = this,
		chart = series.chart,
		options = chart.options,
		depth = options.plotOptions[type].depth || 0,
		options3d = options.chart.options3d,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = options.plotOptions[type].stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (options.plotOptions[type].grouping !== false) { z = 0; }

	H.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		
		point.shapeArgs.z = z;
		point.shapeArgs.depth = depth * 0.75;
		point.shapeArgs.origin = origin;
		point.shapeArgs.alpha = alpha;
		point.shapeArgs.beta = beta;
	
		var angle = (point.shapeArgs.end + point.shapeArgs.start) / 2;

		var tx = point.slicedTranslation.translateX = Math.round(cos(angle) * series.options.slicedOffset * cos(alpha * PI / 180));
		var ty = point.slicedTranslation.translateY = Math.round(sin(angle) * series.options.slicedOffset * cos(alpha * PI / 180));
	});
});

H.wrap(H.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
		return;
	}	

	var series = this;
	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		var r = shapeArgs.r,
			d = shapeArgs.depth,
			a1 = shapeArgs.alpha * (Math.PI / 180),
			b1 = shapeArgs.beta * (Math.PI / 180),
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

H.wrap(H.seriesTypes.pie.prototype, 'addPoint', function (proceed) {

	proceed.apply(this, [].slice.call(arguments, 1));	
	if (this.chart.options.chart.is3d) {
		// destroy (and rebuild) everything!!!
		this.update();
	}
});