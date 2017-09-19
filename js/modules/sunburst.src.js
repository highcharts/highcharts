/**
 * (c) 2016 Highsoft AS
 * Authors: Jon Arild Nygard
 *
 * License: www.highcharts.com/license
 *
 * This is an experimental Highcharts module which enables visualization
 * of a word cloud.
 */
'use strict';
import H from '../parts/Globals.js';
import '../mixins/centered-series.js';
import '../parts/Series.js';
import './treemap.src.js';
var CenteredSeriesMixin = H.CenteredSeriesMixin,
	each = H.each,
	getCenter = CenteredSeriesMixin.getCenter,
	getStartAndEndRadians = CenteredSeriesMixin.getStartAndEndRadians,
	grep = H.grep,
	isNumber = H.isNumber,
	merge = H.merge,
	pick = H.pick,
	Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	reduce = H.reduce;

var layoutAlgorithm = function layoutAlgorithm(parent, children) {
	var startAngle = parent.start,
		range = parent.end - startAngle,
		total = parent.val,
		x = parent.x,
		y = parent.y,
		innerRadius = parent.r,
		outerRadius = innerRadius + parent.radius;

	return reduce(children || [], function (arr, child) {
		var percentage = (1 / total) * child.val,
			radians = percentage * range,
			values = {
				x: x,
				y: y,
				innerR: innerRadius,
				r: outerRadius,
				radius: parent.radius,
				start: startAngle,
				end: startAngle + radians
			};
		arr.push(values);
		startAngle = values.end;
		return arr;
	}, []);
};

/**
 * getEndPoint - Find a set of coordinates given a start coordinates, an angle,
 *     and a distance.
 *
 * @param  {number} x Start coordinate x
 * @param  {number} y Start coordinate y
 * @param  {number} angle Angle in radians
 * @param  {number} distance Distance from start to end coordinates
 * @return {object} Returns the end coordinates, x and y.
 */
var getEndPoint = function getEndPoint(x, y, angle, distance) {
	return {
		x: x + (Math.cos(angle) * distance),
		y: y + (Math.sin(angle) * distance)
	};
};

var setShapeArgs = function setShapeArgs(parent, parentValues) {
	var childrenValues = [],
		// Collect all children which should be included
		children = grep(parent.children, function (n) {
			return !n.ignore;
		});
	childrenValues = layoutAlgorithm(parentValues, children);
	each(children, function (child, index) {
		var values = childrenValues[index],
			angle = values.start + ((values.end - values.start) / 2),
			radius = values.innerR + ((values.r - values.innerR) / 2),
			center = getEndPoint(values.x, values.y, angle, radius),
			val = (
				child.val ?
				(
					child.childrenTotal > child.val ?
					child.childrenTotal :
					child.val
				) :
				child.childrenTotal
			);
		child.shapeArgs = values;
		child.values = merge(values, {
			val: val
		});
		child.tooltipPos = [
			center.x,
			center.y
		];
		// If node has children, then call method recursively
		if (child.children.length) {
			setShapeArgs(child, child.values);
		}
	});
};

/**
 * Default options for the Sunburst series.
 */
var sunburstOptions = {
	center: [null, null]
};

/**
 * Properties of the Sunburst series.
 */
var sunburstSeries = {
	drawPoints: function drawPoints() {
		var series = this,
			group = series.group,
			points = series.points,
			renderer = series.chart.renderer;
		each(points, function (point) {
			var node = point.node;
			point.tooltipPos = node.tooltipPos;
			point.draw({
				attr: series.pointAttribs(point, point.selected && 'select'),
				group: group,
				renderer: renderer,
				shapeType: 'arc',
				shapeArgs: node.shapeArgs
			});
		});
	},
	pointAttribs: seriesTypes.column.prototype.pointAttribs,
	translate: function translate() {
		var series = this,
			options = series.options,
			positions = getCenter.call(series),
			radians = getStartAndEndRadians(options.startAngle, options.endAngle),
			innerRadius = positions[3] / 2,
			outerRadius = positions[2] / 2,
			radiusPerLevel,
			rootId = series.rootNode = pick(series.rootNode, options.rootId, ''),
			tree,
			values,
			rootNode;

		// Call prototype function
		Series.prototype.translate.call(series);
		// Create a object map from level to options
		series.levelMap = reduce(series.options.levels || [],
			function (arr, item) {
				arr[item.level] = item;
				return arr;
			}, {});
		// @todo Only if series.isDirtyData is true
		tree = series.tree = series.getTree();
		rootNode = series.nodeMap[rootId];
		if (
			rootId !== '' &&
			(!rootNode || !rootNode.children.length)
		) {
			series.drillToNode('', false);
			rootId = series.rootNode;
			rootNode = series.nodeMap[rootId];
		}
		// TODO Try to combine setTreeValues & setColorRecursive to avoid
		//  unnecessary looping.
		series.setTreeValues(tree);
		series.setColorRecursive(series.tree);
		radiusPerLevel = (outerRadius - innerRadius) / tree.height;
		values = series.nodeMap[''].values = {
			start: radians.start,
			end: radians.end,
			r: innerRadius,
			radius: radiusPerLevel,
			val: tree.val,
			x: positions[0],
			y: positions[1]
		};
		setShapeArgs(tree, values);
	},

	/**
	 * Animate the slices in. Similar to the animation of polar charts.
	 */
	animate: function (init) {
		var chart = this.chart,
			center = [
				chart.plotWidth / 2,
				chart.plotHeight / 2
			],
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			attribs, 
			group = this.group;

		// Initialize the animation
		if (init) {

			// Scale down the group and place it in the center
			attribs = {
				translateX: center[0] + plotLeft,
				translateY: center[1] + plotTop,
				scaleX: 0.001, // #1499
				scaleY: 0.001,
				rotation: 10,
				opacity: 0.01
			};

			group.attr(attribs);

		// Run the animation
		} else {
			attribs = {
				translateX: plotLeft,
				translateY: plotTop,
				scaleX: 1,
				scaleY: 1,
				rotation: 0,
				opacity: 1
			};
			group.animate(attribs, this.options.animation);

			// Delete this function to allow it only once
			this.animate = null;
		}
	}
};

/**
 * Properties of the Sunburst series.
 */
var sunburstPoint = {
	draw: function draw(options) {
		var point = this,
			graphic = point.graphic,
			group = options.group,
			renderer = options.renderer,
			shape = options.shapeArgs,
			type = options.shapeType,
			attr = options.attr;
		if (point.shouldDraw()) {
			if (!graphic) {
				point.graphic = graphic = renderer[type](shape).add(group);
			}
			graphic.attr(attr).animate(shape);
		} else {
			point.graphic = point.destroy();
		}
	},
	shouldDraw: function shouldDraw() {
		var point = this,
			value = point.value;
		return isNumber(value) && (value > 0);
	}
};

/**
 * Assemble the Sunburst series type.
 */
seriesType(
	'sunburst',
	'treemap',
	sunburstOptions,
	sunburstSeries,
	sunburstPoint
);
