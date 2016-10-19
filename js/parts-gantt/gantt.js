/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import 'grid-axis.js';
import 'xrange-series.js';

var
	// extend = H.extend,
	// isNumber = H.isNumber,
	pick = H.pick,
	seriesType = H.seriesType,
	Point = H.Point;

// type, parent, options, props, pointProps
seriesType('gantt', 'xrange', {
	// options - default options merged with parent
	dataLabels: {
		enabled: true,
		verticalAlign: 'middle',
		inside: true,
		formatter: function () {
			var str = pick(this.taskName, this.y);
			return str === null ? '' : str;
		}
	}
}, {
	// props - member overrides

}, {
	// pointProps - point member overrides
	/**
	 * Apply the options containing the x and y data and possible some extra properties.
	 * This is called on point init or from point.update.
	 *
	 * @param {Object} options
	 */
	applyOptions: function (options, x) {
		var point = this,
			retVal = Point.prototype.applyOptions.call(point, options, x);

		// Get value from aliases
		retVal.x = pick(retVal.start, retVal.x);
		retVal.x2 = pick(retVal.end, retVal.x2);
		retVal.y = pick(retVal.taskGroup, retVal.name, retVal.taskName, retVal.y);
		retVal.name = pick(retVal.taskGroup, retVal.name);

		return retVal;
	},

	// Add x2 and yCategory to the available properties for tooltip formats
	getLabelConfig: function () {
		var point = this,
			cfg = Point.prototype.getLabelConfig.call(point);

		cfg.taskName = point.taskName;
		return cfg;
	}
});
