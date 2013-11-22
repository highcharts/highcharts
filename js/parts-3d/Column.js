/**
 *	Column Extension
 */
 H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
    	
	var series = this,
		chart = series.chart,
		zPos = chart.getZPosition(series),
		d3options = chart.options.D3;

    d3options.origin = { 
    	x: series.yAxis.opposite ? chart.plotWidth : 0,
    	y: chart.plotHeight,
		z: chart.getTotalDepth()
    }
	
	H.each(series.data, function (point) {
		point.shapeType = 'cube';
		point.shapeArgs = {
			x: point.shapeArgs.x,
			y: point.shapeArgs.y,
			z: zPos * d3options.depth * 1.3 + (d3options.depth * 0.3),
			w: point.shapeArgs.width,
			h: point.shapeArgs.height,
			d: d3options.depth,
			options: d3options,
			opposite: series.yAxis.opposite,
			animate: true
		};
	});	    
});

  H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	var nz = this.chart.getZPosition(this) + 1;
	this.group.attr({zIndex: nz}); 
	proceed.apply(this, [].slice.call(arguments, 1));
});