/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var defaultPlotOptions = H.defaultPlotOptions,
	each = H.each,
	merge = H.merge,
	noop = H.noop,
	pick = H.pick,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

var colProto = seriesTypes.column.prototype;

/**
 * The ColumnRangeSeries class
 */
seriesType('columnrange', 'arearange', merge(defaultPlotOptions.column, defaultPlotOptions.arearange, {
	lineWidth: 1,
	pointRange: null,
	marker: null,
	states: {
		hover: {
			halo: false
		}
	}
// Prototype members
}), {
	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis,
			xAxis = series.xAxis,
			startAngleRad = xAxis.startAngleRad,
			start,
			chart = series.chart,
			isRadial = series.xAxis.isRadial,
			plotHigh;

		colProto.translate.apply(series);

		// Set plotLow and plotHigh
		each(series.points, function (point) {
			var shapeArgs = point.shapeArgs,
				minPointLength = series.options.minPointLength,
				heightDifference,
				height,
				y;

			point.plotHigh = plotHigh = yAxis.translate(point.high, 0, 1, 0, 1);
			point.plotLow = point.plotY;

			// adjust shape
			y = plotHigh;
			height = pick(point.rectPlotY, point.plotY) - plotHigh;

			// Adjust for minPointLength
			if (Math.abs(height) < minPointLength) {
				heightDifference = (minPointLength - height);
				height += heightDifference;
				y -= heightDifference / 2;

			// Adjust for negative ranges or reversed Y axis (#1457)
			} else if (height < 0) {
				height *= -1;
				y -= height;
			}

			if (isRadial) {

				start = point.barX + startAngleRad;
				point.shapeType = 'path';
				point.shapeArgs = {
					d: series.polarArc(y + height, y, start, start + point.pointWidth)
				};
			} else {
				shapeArgs.height = height;
				shapeArgs.y = y;

				point.tooltipPos = chart.inverted ? 
				[ 
					yAxis.len + yAxis.pos - chart.plotLeft - y - height / 2, 
					xAxis.len + xAxis.pos - chart.plotTop - shapeArgs.x -
						shapeArgs.width / 2, 
					height
				] : [
					xAxis.left - chart.plotLeft + shapeArgs.x +
						shapeArgs.width / 2, 
					yAxis.pos - chart.plotTop + y + height / 2, 
					height
				]; // don't inherit from column tooltip position - #3372
			}
		});
	},
	directTouch: true,
	trackerGroups: ['group', 'dataLabelsGroup'],
	drawGraph: noop,
	getSymbol: noop,
	crispCol: colProto.crispCol,
	drawPoints: colProto.drawPoints,
	drawTracker: colProto.drawTracker,
	getColumnMetrics: colProto.getColumnMetrics,
	animate: function () {
		return colProto.animate.apply(this, arguments);
	},
	polarArc: function () {
		return colProto.polarArc.apply(this, arguments);
	},
	pointAttribs: colProto.pointAttribs
}, {
	setState: colProto.pointClass.prototype.setState
});
