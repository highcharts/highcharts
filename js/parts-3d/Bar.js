/**
 *	Bar Extension
 */
H.wrap(H.seriesTypes.bar.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
	chart = series.chart,
	zPos = chart.getZPosition(series),

	options3d = {
		angle1: chart.options.chart.options3d.angle2,
		angle2: chart.options.chart.options3d.angle1,
		depth: chart.options.chart.options3d.depth || 0,
		origin: { 
			y: chart.plotWidth / 2,
			x: chart.plotHeight / 2,
			z: chart.getTotalDepth()
		}
	};

	H.each(series.data, function (point) {
		//point.shapeType = 'cube';	
		point.shapeArgs.options = options3d;
		//point.shapeArgs.opposite = true;
	});   
});

H.wrap(H.seriesTypes.bar.prototype, 'drawPoints', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

});
