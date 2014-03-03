/*** 
	EXTENSION FOR 3D COLUMNS
***/
Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'init', function (proceed) {
	var args = arguments,
		series = this;
	if (args[1].is3d) {
		args[2].borderColor = args[2].borderColor || (function () {	
			return series.color;
		}());
	}
	proceed.apply(this, [].slice.call(arguments, 1));
});	

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {  
		return;
	}	

	var type = this.chart.options.chart.type,
		series = this,
		chart = series.chart,
		options = chart.options,
		typeOptions = options.plotOptions[type],		
		options3d = options.chart.options3d,

		depth = typeOptions.depth || 0,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha,
		beta = options3d.beta;

	var stack = typeOptions.stacking ? (this.options.stack || 0) : series._i; 
	var z = stack * (depth + (typeOptions.groupZPadding || 1));

	if (typeOptions.grouping !== false) { z = 0; }

	z += (typeOptions.groupZPadding || 1);

	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'cuboid';
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta; 
		shapeArgs.z = z;
		shapeArgs.origin = origin;
		shapeArgs.depth = depth;
	});	    
});

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.is3d()) {
		this.group.attr({zIndex: this.group.zIndex * 10});
	}
	proceed.apply(this, [].slice.call(arguments, 1));
});

/*** 
	EXTENSION FOR 3D CYLINDRICAL COLUMNS
	Not supported
***/
var defaultOptions = Highcharts.getOptions();
defaultOptions.plotOptions.cylinder = Highcharts.merge(defaultOptions.plotOptions.column);
var CylinderSeries = Highcharts.extendClass(Highcharts.seriesTypes.column, {
	type: 'cylinder'
});
Highcharts.seriesTypes.cylinder = CylinderSeries;

Highcharts.wrap(Highcharts.seriesTypes.cylinder.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}	

	var series = this,
		chart = series.chart,
		options = chart.options,
		cylOptions = options.plotOptions.cylinder,
		options3d = options.chart.options3d,
		depth = cylOptions.depth || 0,
		origin = {
			x: chart.inverted ? chart.plotHeight / 2 : chart.plotWidth / 2,
			y: chart.inverted ? chart.plotWidth / 2 : chart.plotHeight / 2, 
			z: options3d.depth
		},
		alpha = options3d.alpha;

	var z = cylOptions.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (cylOptions.grouping !== false) { z = 0; }

	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs;
		point.shapeType = 'arc3d';
		shapeArgs.x += depth / 2;
		shapeArgs.z = z;
		shapeArgs.start = 0;
		shapeArgs.end = 2 * PI;
		shapeArgs.r = depth * 0.95;
		shapeArgs.innerR = 0;
		shapeArgs.depth = shapeArgs.height * (1 / sin((90 - alpha) * deg2rad)) - z;
		shapeArgs.alpha = 90 - alpha;
		shapeArgs.beta = 0;
		shapeArgs.origin = origin;	
	});
});
