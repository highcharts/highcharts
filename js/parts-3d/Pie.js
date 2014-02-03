/*** 
	EXTENSION FOR 3D PIES
***/

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var type = this.chart.options.chart.type;

	var series = this,
		chart = series.chart,
		options = chart.options,
		depth = options.chart.options3d.depth,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2,
			z: depth * chart.series.length,
		},
		alpha = options.chart.options3d.alpha,
		beta = options.chart.options3d.beta;

	var z = options.plotOptions[type].stacking ? (this.options.stack || 0) * depth : series._i * depth;

	if (options.plotOptions[type].grouping !== false) { z = 0; }

	H.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		
		point.shapeArgs.z = z;
		point.shapeArgs.depth = depth * 0.75;
		point.shapeArgs.origin = origin;
		point.shapeArgs.alpha = alpha;
		point.shapeArgs.beta = beta;
	
		var angle = (point.shapeArgs.end + point.shapeArgs.start) / 2;

		var tx = point.slicedTranslation.translateX = Math.round(cos(angle) * series.options.slicedOffset * cos(alpha));
		var ty = point.slicedTranslation.translateY = Math.round(sin(angle) * series.options.slicedOffset * cos(alpha));
	});



});