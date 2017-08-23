/**
 * (c) 2010-2017 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';

var each = H.each,
	error = H.error,
	Series = H.Series,
	addEvent = H.addEvent,
	correctFloat = H.correctFloat;

/**
 * A pareto diagram is a type of chart that contains both bars and a line graph, 
 * where individual values are represented in descending order by bars, 
 * and the cumulative total is represented by the line.
 * 
 * @extends {plotOptions.line}
 * @product highcharts
 * @sample {highcharts} highcharts/demo/pareto/
 *         Pareto diagram
 * @since 6.0.0
 * @optionparent plotOptions.line
 */

H.seriesType('pareto', 'line', {
	/**
	 * Higher zIndex than column series to draw line above shapes.
	 */
	zIndex: 3
}, {
	/**
	 * Init series
	 * 
	 * @param  {Object} chart
	 * @return {Object} Returns pareto series
	 */
	init: function (chart) {
		var pareto = this;

		Series.prototype.init.apply(pareto, arguments);

		// Make sure we find series which is a base for an pareto
		chart.linkSeries();

		function recalculateValues() {
			var values = pareto.getValues(pareto.linkedParent);
			pareto.setData(values, false);
		}

		if (!pareto.linkedParent) {
			return error(
				'Series ' +
				pareto.options.linkedTo +
				' not found! Check `linkedTo`.'
			);
		}

		// event which should be unbinded in destroy()
		pareto.dataEventsToUnbind = addEvent(
			pareto.linkedParent,
			'updatedData',
			recalculateValues
		);

		// calculate values
		recalculateValues();

		return pareto;
	},
	/**
	 * calculate sum and return percent points
	 * 
	 * @param  {Object} series
	 * @return {Array} Returns array of points [x,y]
	 */
	getValues: function (series) {
		var yValues = series.yData,
			xValues = series.xData,
			sum = this.sumPointsPercents(yValues, xValues, null, true);

		return this.sumPointsPercents(yValues, xValues, sum, false);
	},
	/**
	 * calculate y sum and each percent point
	 *
	 * @param  {Array} yValues y values
	 * @param  {Array} xValues x values
	 * @param  {Number} sum of all y values 
	 * @param  {Boolean} isSum declares if calculate sum of all points
	 * @return {Array} Returns sum of points or array of points [x,y]
	 */
	sumPointsPercents: function (yValues, xValues, sum, isSum) {
		var sumY = 0,
			sumPercent = 0,
			percentPoints = [],
			percentPoint;

		each(yValues, function (point, i) {
			if (point !== null) {
				if (isSum) {
					sumY += point;
				} else {
					percentPoint = (point / sum) * 100;
					percentPoints.push([xValues[i], correctFloat(sumPercent + percentPoint)]);
					sumPercent += percentPoint;
				}
			}
		});

		return isSum ? sumY : percentPoints;
	},
	/**
	 * Unbind events and destroy series
	 */
	destroy: function () {
		this.dataEventsToUnbind();
		Series.prototype.destroy.call(this);
	}
});
