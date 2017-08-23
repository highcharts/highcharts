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
	 * Pareto Series:
	 **/

H.seriesType('pareto', 'line', {
	zIndex: 3	//	draw line above column
}, {
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

		recalculateValues();

		return pareto;
	},
	/**
	 * calculate sum and return percent points
	 **/
	getValues: function (series) {
		var yValues = series.yData,
			xValues = series.xData,
			sum = this.sumPointsPercents(yValues, xValues, null, true);

		return this.sumPointsPercents(yValues, xValues, sum, false);
	},
	/**
	 * calculate y sum and each point
	 **/
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
	destroy: function () {
		this.dataEventsToUnbind();
		Series.prototype.destroy.call(this);
	}
});
