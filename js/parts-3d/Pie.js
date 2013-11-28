/**
 *	Pies
 */

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
		options3d = series.chart.options.chart.options3d;

	H.each(series.data, function (point) {
		point.shapeType = 'arc3d';
		point.shapeArgs = {
			x: point.shapeArgs.x,
			y: point.shapeArgs.y,
			a1: options3d.angle1,
			d: options3d.depth,
			options: {
				start: point.shapeArgs.start,
				end: point.shapeArgs.end,
				r: point.shapeArgs.r,
				ir: point.shapeArgs.innerR
			}
		};
	});    
});

H.wrap(H.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	var series = this;

	H.each(series.data, function (point) {
		var options = point.shapeArgs.options;
		var r = options.r,
			d = point.shapeArgs.d,
			a1 = point.shapeArgs.a1,
			a2 = (options.start + options.end) / 2; 

		point.connector.translate(0, (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0));
		point.dataLabel.attr({y: point.dataLabel.connY + (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0) - (point.dataLabel.height / 2)});

	});
});
