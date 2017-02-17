/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import 'CurrentDateIndicator.js';
import 'GridAxis.js';
import '../modules/static-scale.src.js';
import 'TreeGrid.js';
import 'Pathfinder.js';
import 'XRangeSeries.js';
import Tree from './Tree.js';

var dateFormat = H.dateFormat,
	each = H.each,
	extend = H.extend,
	inArray = H.inArray,
	isObject = H.isObject,
	isNumber = H.isNumber,
	merge = H.merge,
	pick = H.pick,
	reduce = Tree.reduce,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	stop = H.stop,
	Axis = H.Axis,
	Point = H.Point,
	Series = H.Series,
	parentName = 'xrange',
	parent = seriesTypes[parentName];

/**
 * getCategoriesFromTree - getCategories based on a tree
 *
 * @param  {object} tree Root of tree to collect categories from
 * @return {Array}       Array of categories
 */
var getCategoriesFromTree = function (tree) {
	var categories = [];
	if (tree.data) {
		categories.push(tree.data.name);
	}
	each(tree.children, function (child) {
		categories = categories.concat(getCategoriesFromTree(child));
	});
	return categories;
};

var mapTickPosToNode = function (node, categories) {
	var map = {},
		name = node.data && node.data.name,
		pos = inArray(name, categories);
	map[pos] = node;
	each(node.children, function (child) {
		extend(map, mapTickPosToNode(child, categories));
	});
	return map;
};

Axis.prototype.updateYNames = function () {
	var axis = this,
		isYAxis = !axis.isXAxis,
		series = axis.series,
		data;
	if (isYAxis) {
		// Concatenate data from all series assigned to this axis.
		data = reduce(series, function (arr, s) {
			return arr.concat(s.options.data);
		}, []);
		// Build the tree from the series data. 
		axis.tree = Tree.getTree(data);
		axis.categories = getCategoriesFromTree(axis.tree);
		axis.treeGridMap = mapTickPosToNode(axis.tree, axis.categories);
		axis.hasNames = true;
	}
};

Axis.prototype.nameToY = function (point) {
	var axis = this,
		name = point.name,
		names = axis.categories;
	return inArray(name, names);
};

// type, parent, options, props, pointProps
seriesType('gantt', parentName, {
	// options - default options merged with parent
	dataLabels: {
		enabled: true,
		formatter: function () {
			var point = this,
				amount = point.point.partialFill;

			if (isObject(amount)) {
				amount = amount.amount;
			}
			if (isNumber(amount) && amount > 0) {
				return (amount * 100) + '%';
			}
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
		type: 'simpleConnect', // TODO: Set to 'fastAvoid' when not crashing
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
	},
	
	setData: function () {
		var series = this;
		series.yAxis.updateYNames();
		Series.prototype.setData.apply(this, arguments);
	},

	setGanttPointAliases: function (options) {
		// Get value from aliases
		options.x = pick(options.start, options.x);
		options.x2 = pick(options.end, options.x2);
		if (options.milestone) {
			options.x2 = options.x;
		}
		options.name = pick(options.taskName, options.name);
		options.partialFill = pick(options.completed, options.partialFill);
		options.connect = pick(options.dependency, options.connect);
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
			series = point.series,
			retVal = merge(options);

		series.setGanttPointAliases(retVal);

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

/**
 * Sets aliases on a point options object
 * @param   {Object}    options a point options object
 * @returns {undefined}
 */
seriesTypes.gantt.sadf = function (options) {
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
