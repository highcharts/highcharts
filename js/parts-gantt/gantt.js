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
import 'pathfinder.js';
import 'xrange-series.js';

// TODO
// - dataLabel alignment (verticalAlign, inside)

var dateFormat = H.dateFormat,
	defined = H.defined,
	isObject = H.isObject,
	isNumber = H.isNumber,
	merge = H.merge,
	pick = H.pick,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	stop = H.stop,
	Point = H.Point,
	parentName = 'xrange',
	parent = seriesTypes[parentName];

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
		headerFormat: '<span style="color:{point.color}; text-align: right">{series.name}</span><br/>',
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
		type: 'straight', // TODO change to 'fastAvoid' when done
		startMarker: {
			enabled: true,
			symbol: 'arrow',
			fill: '#fa0'
		},
		endMarker: {
			enabled: false // Only show arrow on the dependent task
		}
	}
}, {
	// props - member overrides

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

		// Get value from aliases
		retVal.x = pick(options.start, options.x);
		retVal.x2 = pick(options.end, options.x2);
		if (options.milestone) {
			retVal.x2 = options.x;
		}
		retVal.y = pick(
			options.taskGroup,
			options.name,
			options.taskName,
			options.y
		);
		retVal.name = pick(options.taskGroup, options.name);
		retVal.partialFill = pick(options.completed, options.partialFill);
		retVal.connect = pick(options.dependency, options.connect);

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
