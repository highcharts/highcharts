/**
 *	Pies
 */

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
		options3d = series.chart.options.chart.options3d;

	H.each(series.data, function (point) {
		point.shapeType = 'pie3d';
		point.shapeArgs = {
			x: point.shapeArgs.x,
			y: point.shapeArgs.y,
			a1: options3d.angle1,
			d: options3d.depth,
			options: {
				start: point.shapeArgs.start,
				end: point.shapeArgs.end,
				r: point.shapeArgs.r
			}
		};
	});    
});