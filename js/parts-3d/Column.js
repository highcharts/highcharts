/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Series.js';
var each = H.each,
	perspective = H.perspective,
	pick = H.pick,
	Series = H.Series,
	seriesTypes = H.seriesTypes,
	svg = H.svg,
	wrap = H.wrap;
/***
	EXTENSION FOR 3D COLUMNS
***/
wrap(seriesTypes.column.prototype, 'translate', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d()) {
		return;
	}

	var series = this,
		chart = series.chart,
		seriesOptions = series.options,
		depth = seriesOptions.depth || 25;

	var stack = seriesOptions.stacking ? (seriesOptions.stack || 0) : series._i;
	var z = stack * (depth + (seriesOptions.groupZPadding || 1));

	if (seriesOptions.grouping !== false) {
		z = 0;
	}

	z += (seriesOptions.groupZPadding || 1);

	each(series.data, function (point) {
		if (point.y !== null) {
			var shapeArgs = point.shapeArgs,
				tooltipPos = point.tooltipPos;

			point.shapeType = 'cuboid';
			shapeArgs.z = z;
			shapeArgs.depth = depth;
			shapeArgs.insidePlotArea = true;

			// Translate the tooltip position in 3d space
			tooltipPos = perspective([{ x: tooltipPos[0], y: tooltipPos[1], z: z }], chart, true)[0];
			point.tooltipPos = [tooltipPos.x, tooltipPos.y];
		}
	});
	// store for later use #4067
	series.z = z;
});

wrap(seriesTypes.column.prototype, 'animate', function (proceed) {
	if (!this.chart.is3d()) {
		proceed.apply(this, [].slice.call(arguments, 1));
	} else {
		var args = arguments,
			init = args[1],
			yAxis = this.yAxis,
			series = this,
			reversed = this.yAxis.reversed;

		if (svg) { // VML is too slow anyway
			if (init) {
				each(series.data, function (point) {
					if (point.y !== null) {
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
					}
				});

			} else { // run the animation				
				each(series.data, function (point) {					
					if (point.y !== null) {
						point.shapeArgs.height = point.height;
						point.shapeArgs.y = point.shapey;	//#2968
						// null value do not have a graphic
						if (point.graphic) {
							point.graphic.animate(point.shapeArgs, series.options.animation);
						}
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

wrap(seriesTypes.column.prototype, 'init', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {
		var seriesOptions = this.options,
			grouping = seriesOptions.grouping,
			stacking = seriesOptions.stacking,
			reversedStacks = pick(this.yAxis.options.reversedStacks, true),
			z = 0;	
		
		if (!(grouping !== undefined && !grouping)) {
			var stacks = this.chart.retrieveStacks(stacking),
				stack = seriesOptions.stack || 0,
				i; // position within the stack
			for (i = 0; i < stacks[stack].series.length; i++) {
				if (stacks[stack].series[i] === this) {
					break;
				}
			}
			z = (10 * (stacks.totalStacks - stacks[stack].position)) + (reversedStacks ? i : -i); // #4369

			// In case when axis is reversed, columns are also reversed inside the group (#3737)
			if (!this.xAxis.reversed) {
				z = (stacks.totalStacks * 10) - z;
			}
		}

		seriesOptions.zIndex = z;
	}
});

/*= if (build.classic) { =*/
function pointAttribs(proceed) {
	var attr = proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {
		// Set the fill color to the fill color to provide a smooth edge
		attr.stroke = this.options.edgeColor || attr.fill;
		attr['stroke-width'] = pick(this.options.edgeWidth, 1); // #4055
	}

	return attr;
}

wrap(seriesTypes.column.prototype, 'pointAttribs', pointAttribs);
if (seriesTypes.columnrange) {
	wrap(seriesTypes.columnrange.prototype, 'pointAttribs', pointAttribs);
}
/*= } =*/

function draw3DPoints(proceed) {
	// Do not do this if the chart is not 3D
	if (this.chart.is3d()) {
		var grouping = this.chart.options.plotOptions.column.grouping;
		if (grouping !== undefined && !grouping && this.group.zIndex !== undefined && !this.zIndexSet) {
			this.group.attr({ zIndex: this.group.zIndex * 10 });
			this.zIndexSet = true; // #4062 set zindex only once
		}
	}

	proceed.apply(this, [].slice.call(arguments, 1));
}

wrap(Series.prototype, 'alignDataLabel', function (proceed) {
	
	// Only do this for 3D columns and columnranges
	if (this.chart.is3d() && (this.type === 'column' || this.type === 'columnrange')) {
		var series = this,
			chart = series.chart;

		var args = arguments,
			alignTo = args[4];

		var pos = ({ x: alignTo.x, y: alignTo.y, z: series.z });
		pos = perspective([pos], chart, true)[0];
		alignTo.x = pos.x;
		alignTo.y = pos.y;
	}

	proceed.apply(this, [].slice.call(arguments, 1));
});

if (seriesTypes.columnrange) {
	wrap(seriesTypes.columnrange.prototype, 'drawPoints', draw3DPoints);
}

wrap(seriesTypes.column.prototype, 'drawPoints', draw3DPoints);

/***
	EXTENSION FOR 3D CYLINDRICAL COLUMNS
	Not supported
***/
/*
var defaultOptions = H.getOptions();
defaultOptions.plotOptions.cylinder = H.merge(defaultOptions.plotOptions.column);
var CylinderSeries = H.extendClass(seriesTypes.column, {
	type: 'cylinder'
});
seriesTypes.cylinder = CylinderSeries;

wrap(seriesTypes.cylinder.prototype, 'translate', function (proceed) {
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
		alpha = chart.alpha3d;

	var z = cylOptions.stacking ? (this.options.stack || 0) * depth : series._i * depth;
	z += depth / 2;

	if (cylOptions.grouping !== false) { z = 0; }

	each(series.data, function (point) {
		var shapeArgs = point.shapeArgs,
			deg2rad = H.deg2rad;
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
	});
});
*/
