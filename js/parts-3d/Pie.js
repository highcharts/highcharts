/**
 *	Pies
 */

H.wrap(H.seriesTypes.pie.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
		chart = series.chart,
		zPos = chart.getZPosition(series),
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


		var angle = (point.shapeArgs.options.end + point.shapeArgs.options.start) / 2;
		point.slicedTranslation.translateX = Math.round(cos(angle) * sin(options3d.angle1) * series.options.slicedOffset);
		point.slicedTranslation.translateY = Math.round(sin(angle) * cos(options3d.angle1) * series.options.slicedOffset);

	});    
});

H.wrap(H.seriesTypes.pie.prototype, 'drawDataLabels', function (proceed) {
	var series = this;
	proceed.apply(this, [].slice.call(arguments, 1));

	H.each(series.data, function (point) {
		var options = point.shapeArgs.options;
		var r = options.r,
			d = point.shapeArgs.d,
			a1 = point.shapeArgs.a1,
			a2 = (options.start + options.end) / 2; 

		if (point.connector) {
			point.connector.translate(0, (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0));
		}
		if (point.dataLabel) {
			point.dataLabel.attr({y: point.dataLabel.connY + (-r * (1 - cos(a1)) * sin(a2)) + (sin(a2) > 0 ? sin(a1) * d : 0) - (point.dataLabel.height / 2)});
		}
	});
});

H.wrap(H.seriesTypes.pie.prototype, 'drawPoints', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	
	var group = this.group;

	H.each(this.data, function (point) {		
		H.each(point.graphic.children, function (child) {
			child.element.point = point;
		});
	});	
});