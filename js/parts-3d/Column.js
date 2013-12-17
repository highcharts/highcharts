/**
 *	Column Extension
 */
H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	var series = this,
	chart = series.chart,
	zPos = chart.getZPosition(series),
	options3d = chart.options.chart.options3d;

	options3d.depth = options3d.depth || 0;

	options3d.origin = { 
		x: chart.plotWidth / 2,
		y: chart.plotHeight / 2,
		z: chart.getTotalDepth()
	};

	H.each(series.data, function (point) {
		point.shapeType = 'cube';
		point.shapeArgs = {
			x: point.shapeArgs.x,
			y: point.shapeArgs.y,
			z: zPos * options3d.depth * 1.3 + (options3d.depth * 0.3),
			w: point.shapeArgs.width,
			h: point.shapeArgs.height,
			d: options3d.depth,
			i: chart.getNumberOfStacks() - zPos,
			options: options3d,
			opposite: series.yAxis.opposite,
			animate: true
		};
	});	    
});

H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	var options = this.chart.options.plotOptions.column,
		nz;

	// Without grouping all stacks are on the front line.
	if (options.grouping !== false) {
		nz = this._i;
	} else {
		nz = this.chart.getZPosition2(this) + 1;		
	}

	this.group.attr({zIndex: nz});

	proceed.apply(this, [].slice.call(arguments, 1));
	
	H.each(this.data, function (point) {
		H.each(point.graphic.children, function (child) {
			child.element.point = point;
		});
	});	

});
