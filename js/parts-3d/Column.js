/*** 
	EXTENSION FOR 3D COLUMNS
***/
H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {  
		return;
	}	

	var type = this.chart.options.chart.type;

	var series = this,
		chart = series.chart,
		options = chart.options,
		options3d = options.chart.options3d,

		depth = options.plotOptions[type].depth || 0,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var stack = options.plotOptions[type].stacking ? (this.options.stack || 0) : series._i; 
	var z = stack * (depth + (options.plotOptions[type].groupZPadding || 1));

	if (options.plotOptions[type].grouping !== false) { z = 0; }

	z += (options.plotOptions[type].groupZPadding || 1);

	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'cuboid';
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta; 
		shapeArgs.z = z;
		shapeArgs.origin = origin;
		shapeArgs.depth = depth;
	});	    
});

H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.options.chart.is3d) {
		var type = this.chart.options.chart.type,
			options = this.chart.options.plotOptions[type];
		
		var stack = (this.options.stack || 0),
			order = this.chart.series.length - this._i;

		var z = this.group.zIndex * 10;

		this.group.attr({zIndex: z});
	}
	proceed.apply(this, [].slice.call(arguments, 1));
});

/*** 
	EXTENSION FOR 3D CYLINDRICAL COLUMNS
	Not supported
***/
defaultOptions.plotOptions.cylinder = H.merge(defaultOptions.plotOptions.column);
var CylinderSeries = H.extendClass(H.seriesTypes.column, {
	type: 'cylinder'
});
H.seriesTypes.cylinder = CylinderSeries;

H.wrap(H.seriesTypes.cylinder.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.options.chart.is3d) {
		return;
	}	

	var series = this,
		chart = series.chart,
		options = chart.options,
		options3d = options.chart.options3d,
		depth = options.plotOptions.cylinder.depth || 0,
		origin = {
			x: chart.inverted ? chart.plotHeight / 2 : chart.plotWidth / 2,
			y: chart.inverted ? chart.plotWidth / 2 : chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var z = options.plotOptions.cylinder.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (options.plotOptions.cylinder.grouping !== false) { z = 0; }

	H.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'arc3d';
		shapeArgs.x += depth / 2;
		shapeArgs.z = z;
		shapeArgs.start = 0;
		shapeArgs.end = 2 * PI;
		shapeArgs.r = depth * 0.95;
		shapeArgs.innerR = 0;
		shapeArgs.depth = shapeArgs.height * (1 / sin((90 - alpha) * (Math.PI / 180))) - z;
		shapeArgs.alpha = 90 - alpha;
		shapeArgs.beta = 0;
		shapeArgs.origin = origin;	
	});
});
