/*** 
	EXTENSION FOR 3D COLUMNS
***/
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

		depth = typeOptions.depth || 25,
		origin = {
			x: chart.plotWidth / 2,
			y: chart.plotHeight / 2, 
			z: options3d.depth,
			vd: options3d.viewDistance
		},
		alpha = options3d.alpha,
		beta = options3d.beta * (chart.yAxis[0].opposite ? -1 : 1);

	var stack = typeOptions.stacking ? (this.options.stack || 0) : series._i; 
	var z = stack * (depth + (typeOptions.groupZPadding || 1));

	if (typeOptions.grouping !== false) { z = 0; }

	z += (typeOptions.groupZPadding || 1);

	Highcharts.each(series.data, function (point) {
		var shapeArgs = point.shapeArgs,
			tooltipPos = point.tooltipPos;

		point.shapeType = 'cuboid';
		shapeArgs.alpha = alpha;
		shapeArgs.beta = beta; 
		shapeArgs.z = z;
		shapeArgs.origin = origin;
		shapeArgs.depth = depth;

		// Translate the tooltip position in 3d space
		tooltipPos = perspective([{ x: tooltipPos[0], y: tooltipPos[1], z: z }], alpha, beta, origin)[0];
		point.tooltipPos = [tooltipPos.x, tooltipPos.y];

	});	    
});

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'animate', function (proceed) {
	if (!this.chart.is3d()) {
		proceed.apply(this, [].slice.call(arguments, 1));
	} else {
		var args = arguments,
			init = args[1],
			yAxis = this.yAxis,
			series = this,
			reversed = this.yAxis.reversed;

		if (Highcharts.svg) { // VML is too slow anyway
			if (init) {
				Highcharts.each(series.data, function (point) {
					point.height = point.shapeArgs.height;
					point.shapey = point.shapeArgs.y;	//#2968				
					point.shapeArgs.height = 1;
					if (!reversed) {
						if (point.stackY) {
							point.shapeArgs.y = point.plotY + yAxis.translate(point.stackY);
						} else {
							point.shapeArgs.y = point.plotY + (point.negative ? -point.height : point.height);
						}
					}
				});

			} else { // run the animation				
				Highcharts.each(series.data, function (point) {					
					point.shapeArgs.height = point.height;
					point.shapeArgs.y = point.shapey;	//#2968
					// null value do not have a graphic
					if (point.graphic) {
						point.graphic.animate(point.shapeArgs, series.options.animation);					
					}
				});

				// redraw datalabels to the correct position
				this.drawDataLabels();

				// delete this function to allow it only once
				series.animate = null;
			}
		}
	}
});

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'init', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {
	var grouping = this.chart.options.plotOptions.column.grouping,
		stacking = this.chart.options.plotOptions.column.stacking,
		z = this.options.zIndex;
		if (!z) {		
			if (!(grouping !== undefined && !grouping) && stacking) {
				var stacks = this.chart.retrieveStacks(),
					stack = this.options.stack || 0,
					i; // position within the stack
				for (i = 0; i < stacks[stack].series.length; i++) {
					if (stacks[stack].series[i] === this) {
						break;
					}
				}
				z = (stacks.totalStacks * 10) - (10 * (stacks.totalStacks - stacks[stack].position)) - i;
				
				this.options.zIndex = z;
			}
		}
	}
});
function draw3DPoints(proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.is3d()) {		
		var grouping = this.chart.options.plotOptions.column.grouping;
		if (grouping !== undefined && !grouping && this.group.zIndex !== undefined) {
			this.group.attr({zIndex : (this.group.zIndex * 10)});
		} 
		if (this.userOptions.borderColor === undefined) {
			this.options.borderColor = this.color;
		}

		// Set the border color to the fill color to provide a smooth edge
		Highcharts.each(this.data, function (point) {
			var c = point.options.borderColor || point.color || point.series.userOptions.borderColor;
			point.options.borderColor = c;
			point.borderColor = c;
			point.pointAttr[''].stroke = c;
			// same bordercolor on hover and select
			point.pointAttr.hover.stroke = c;
			point.pointAttr.select.stroke = c;
		});	
	}

	proceed.apply(this, [].slice.call(arguments, 1));
}

Highcharts.wrap(Highcharts.Series.prototype, 'alignDataLabel', function (proceed) {
	
	// Only do this for 3D columns and columnranges
	if (this.chart.is3d() && (this.type === 'column' || this.type === 'columnrange')) {
		var series = this,
			chart = series.chart,
			options = chart.options,		
			options3d = options.chart.options3d,
			origin = {
				x: chart.plotWidth / 2,
				y: chart.plotHeight / 2, 
				z: options3d.depth,
				vd: options3d.viewDistance
			},
			alpha = options3d.alpha,
			beta = options3d.beta * (chart.yAxis[0].opposite ? -1 : 1);

		var args = arguments,
			alignTo = args[4];
		
		var pos = ({x: alignTo.x, y: alignTo.y, z: 0});
		pos = perspective([pos], alpha, beta, origin)[0];
		alignTo.x = pos.x;
		alignTo.y = pos.y;
	}

	proceed.apply(this, [].slice.call(arguments, 1));
});

if (Highcharts.seriesTypes.columnrange) {
	Highcharts.wrap(Highcharts.seriesTypes.columnrange.prototype, 'drawPoints', draw3DPoints);
}

Highcharts.wrap(Highcharts.seriesTypes.column.prototype, 'drawPoints', draw3DPoints);

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
			z: options3d.depth,
			vd: options3d.viewDistance
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
