/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import 'current-date-indicator.js';
import 'grid-axis.js';
import 'tree-grid.js';
import 'pathfinder.js';
import 'xrange-series.js';

var each = H.each,
	dateFormat = H.dateFormat,
	defined = H.defined,
	isObject = H.isObject,
	isNumber = H.isNumber,
	map = H.map,
	merge = H.merge,
	pick = H.pick,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	splat = H.splat,
	stop = H.stop,
	Chart = H.Chart,
	Point = H.Point,
	parentName = 'xrange',
	parent = seriesTypes[parentName];

/**
 * Sets aliases on a point options object
 * @param {Object} options a poit options object
 */
var setPointAliases = function (options) {
	// Get value from aliases
	options.x = pick(options.start, options.x);
	options.x2 = pick(options.end, options.x2);
	if (options.milestone) {
		options.x2 = options.x;
	}
	options.y = pick(
		// If taskGroup is a number, it's a reference to the category index
		isNumber(options.taskGroup) ? options.taskGroup : undefined,
		options.y
	);
	options.name = pick(options.taskGroup, options.name);
	options.partialFill = pick(options.completed, options.partialFill);
	options.connect = pick(options.dependency, options.connect);
};

/**
 * The GanttChart class.
 * @class Highcharts.GanttChart
 * @memberOf Highcharts
 * @param {String|HTMLDOMElement} renderTo The DOM element to render to, or
 *                                         its id.
 * @param {ChartOptions}          options  The chart options structure.
 * @param {Function}              callback Function to run when the chart has
 *                                         loaded.
 */
H.GanttChart = H.ganttChart = function (renderTo, options, callback) {
	var hasRenderToArg = typeof renderTo === 'string' || renderTo.nodeName,
		seriesOptions = options.series,
		defaultOptions = H.getOptions();
	options = arguments[hasRenderToArg ? 1 : 0];

	// apply X axis options to both single and multi y axes
	options.xAxis = map(splat(options.xAxis || {}), function (xAxisOptions) {
		return merge(
			defaultOptions.xAxis,
			{ // defaults
				grid: true,
				tickInterval: 1000 * 60 * 60 * 24, // Day
				opposite: true
			},
			xAxisOptions, // user options
			{ // forced options
				type: 'datetime'
			}
		);
	});

	// apply Y axis options to both single and multi y axes
	options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions) {
		return merge(
			defaultOptions.yAxis, // #3802
			{ // defaults
				grid: true,

				// Set default type tree-grid, but onlf categories is undefined
				type: yAxisOptions.categories ? yAxisOptions.type : 'tree-grid'
			},
			yAxisOptions // user options
		);
	});

	options.series = null;

	options = merge(
		{
			chart: {
				type: 'gantt'
			},
			title: {
				text: null
			}
		},

		options // user's options
	);

	options.series = seriesOptions;

	each(options.series, function (series) {
		each(series.data, function (point) {
			setPointAliases(point);
		});
	});

	return hasRenderToArg ?
		new Chart(renderTo, options, callback) :
		new Chart(options, options);
};

// type, parent, options, props, pointProps
seriesType('gantt', parentName, {
	// options - default options merged with parent
	dataLabels: {
		enabled: true,
		formatter: function () {
			var point = this,
				amount = point.point.partialFill,
				str = pick(point.taskName, point.y);

			if (isObject(amount)) {
				amount = amount.amount;
			}
			if (!defined(amount)) {
				amount = 0;
			}

			if (defined(str)) {
				str += ': ';
			} else {
				str = '';
			}

			return str + (amount * 100) + '%';
		}
	},
	tooltip: {
		headerFormat:	'<span style="color:{point.color};text-align:right">' +
							'{series.name}' +
						'</span><br/>',
		pointFormatter: function () {
			var point = this,
				series = point.series,
				tooltip = series.chart.tooltip,
				taskName = point.taskName,
				xAxis = series.xAxis,
				options = xAxis.options,
				formats = options.dateTimeLabelFormats,
				startOfWeek = xAxis.options.startOfWeek,
				ttOptions = series.tooltipOptions,
				format = ttOptions.dateTimeLabelFormat,
				range = point.end ? point.end - point.start : 0,
				start,
				end,
				milestone = point.options.milestone,
				dateRowStart = '<span style="font-size: 0.8em">',
				dateRowEnd = '</span><br/>',
				retVal = '<b>' + taskName + '</b>';

			if (!format) {
				ttOptions.dateTimeLabelFormat = format = tooltip.getDateFormat(
					range,
					point.start,
					startOfWeek,
					formats
				);
			}

			start = dateFormat(format, point.start);
			end = dateFormat(format, point.end);

			retVal += '<br/>';

			if (!milestone) {
				retVal += dateRowStart + 'Start: ' + start + dateRowEnd;
				retVal += dateRowStart + 'End: ' + end + dateRowEnd;
			} else {
				retVal += dateRowStart + 'Date ' + start + dateRowEnd;
			}

			return retVal;
		}
	},
	pathfinder: {
		type: 'fastAvoid', // TODO change to 'fastAvoid' when done
		startMarker: {
			enabled: true,
			symbol: 'arrow',
			fill: '#fa0',
			align: 'left'
		},
		endMarker: {
			enabled: false, // Only show arrow on the dependent task
			align: 'right'
		}
	}
}, {
	// props - series member overrides

	translatePoint: function (point) {
		var series = this,
			shapeArgs,
			sizeMod = 1,
			size,
			milestone = point.options.milestone,
			sizeDifference;


		parent.prototype.translatePoint.call(series, point);

		if (milestone) {
			shapeArgs = point.shapeArgs;

			if (isNumber(milestone.sizeModifier)) {
				sizeMod = milestone.sizeModifier;
			}

			size = shapeArgs.height * sizeMod;
			sizeDifference = size - shapeArgs.height;

			point.shapeArgs = {
				x: shapeArgs.x - (size / 2),
				y: shapeArgs.y - (sizeDifference / 2),
				width: size,
				height: size
			};
		}
	},

	/**
	 * Draws a single point in the series.
	 *
	 * This override draws the point as a diamond if point.options.milestone is
	 * true, and uses the parent drawPoint() if it is false or not set.
	 *
	 * @param  {Object} point an instance of Point in the series
	 * @param  {string} verb 'animate' (animates changes) or 'attr' (sets
	 *                       options)
	 * @returns {void}
	 */
	drawPoint: function (point, verb) {
		var series = this,
			seriesOpts = series.options,
			renderer = series.chart.renderer,
			shapeArgs = point.shapeArgs,
			plotY = point.plotY,
			graphic = point.graphic,
			state = point.selected && 'select',
			cutOff = seriesOpts.stacking && !seriesOpts.borderRadius,
			diamondShape;

		if (point.options.milestone) {
			if (isNumber(plotY) && point.y !== null) {

				diamondShape = renderer.symbols.diamond(
					shapeArgs.x,
					shapeArgs.y,
					shapeArgs.width,
					shapeArgs.height
				);

				if (graphic) {
					stop(graphic);
					graphic[verb]({
						d: diamondShape
					});
				} else {
					point.graphic = graphic = renderer.path(diamondShape)
					.addClass(point.getClassName(), true)
					.add(point.group || series.group);
				}
				/*= if (build.classic) { =*/
				// Presentational
				point.graphic
					.attr(series.pointAttribs(point, state))
					.shadow(seriesOpts.shadow, null, cutOff);
				/*= } =*/
			} else if (graphic) {
				point.graphic = graphic.destroy(); // #1269
			}
		} else {
			parent.prototype.drawPoint.call(series, point, verb);
		}
	}
}, {
	// pointProps - point member overrides
	/**
	 * Applies the options containing the x and y data and possible some extra
	 * properties. This is called on point init or from point.update.
	 *
	 * @param {Object} options the point options
	 * @param {number} x the x value
	 * @return {Object} the Point instance
	 */
	applyOptions: function (options, x) {
		var point = this,
			retVal = merge(options);

		setPointAliases(retVal);

		retVal = Point.prototype.applyOptions.call(point, retVal, x);
		return retVal;
	},

	/**
	 * Get an information object used for the data label and tooltip formatters.
	 *
	 * This override adds point.taskName to the configuration, which makes it
	 * available in data label and tooltip formatters.
	 *
	 * @return {Object} an object with point information
	 */
	getLabelConfig: function () {
		var point = this,
			cfg = Point.prototype.getLabelConfig.call(point);

		cfg.taskName = point.taskName;
		return cfg;
	}
});
