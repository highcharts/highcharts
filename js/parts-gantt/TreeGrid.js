/**
* (c) 2016 Highsoft AS
* Authors: Jon Arild Nygard
*
* License: www.highcharts.com/license
*/
/* eslint no-console: 0 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import './GridAxis.js';
import Tree from './Tree.js';
import '../modules/broken-axis.src.js';
var argsToArray = function (args) {
		return Array.prototype.slice.call(args, 1);
	},
	indentPx = 10,
	iconRadius = 5,
	iconSpacing = 5,
	each = H.each,
	merge = H.merge,
	wrap = H.wrap,
	pick = H.pick,
	reduce = Tree.reduce,
	GridAxis = H.Axis,
	GridAxisTick = H.Tick;

/**
 * some - Equivalent of Array.prototype.some
 *
 * @param  {Array}    arr       Array to look for matching elements in.
 * @param  {function} condition The condition to check against.
 * @return {boolean}            Whether some elements pass the condition.
 */
var some = function (arr, condition) {
	var result = false;
	each(arr, function (element, index, array) {
		if (!result) {
			result = condition(element, index, array);
		}
	});
	return result;
};

var override = function (obj, methods) {
	var method,
		func;
	for (method in methods) {
		if (methods.hasOwnProperty(method)) {
			func = methods[method];
			wrap(obj, method, func);
		}
	}
};

var getBreakFromNode = function (node, pos) {
	var from = pos,
		to = from + node.descendants + 0.5;
	return {
		from: from,
		to: to
	};
};

var isCollapsed = function (axis, node, pos) {
	var breaks = (axis.options.breaks || []),
		obj = getBreakFromNode(node, pos);
	return some(breaks, function (b) {
		return b.from === obj.from && b.to === obj.to;
	});
};
var collapse = function (axis, node, pos) {
	var breaks = (axis.options.breaks || []),
		obj = getBreakFromNode(node, pos);
	breaks.push(obj);
	axis.update({
		breaks: breaks
	});
};
var expand = function (axis, node, pos) {
	var breaks = (axis.options.breaks || []),
		obj = getBreakFromNode(node, pos);
	// Remove the break from the axis breaks array.
	breaks = reduce(breaks, function (arr, b) {
		if (b.to !== obj.to || b.from !== obj.from) {
			arr.push(b);
		}
		return arr;
	}, []);
	axis.update({
		breaks: breaks
	});
};
var toggleCollapse = function (axis, node, pos) {
	if (isCollapsed(axis, node, pos)) {
		expand(axis, node, pos);
	} else {
		collapse(axis, node, pos);
	}
};
var renderLabelIcon = function (label, radius, spacing, collapsed) {
	var renderer = label.renderer,
		labelBox = label.xy,
		icon = label.treeIcon,
		iconPosition = {
			x: labelBox.x - (radius * 2) - spacing,
			y: labelBox.y - (radius * 2)
		},
		iconCenter = {
			x: iconPosition.x + radius,
			y: iconPosition.y + radius
		},
		rotation = collapsed ? 90 : 180;
	if (!icon) {
		label.treeIcon = icon = renderer.path(renderer.symbols.triangle(
			0 - radius,
			0 - radius,
			radius * 2,
			radius * 2
		))
		.attr({
			'translateX': iconCenter.x,
			'translateY': iconCenter.y
		})
		.add(label.parentGroup);
	} else {
		icon.animate({
			'translateX': iconCenter.x,
			'translateY': iconCenter.y
		});
	}
	icon.attr({
		'stroke-width': 1,
		'fill': pick(label.styles.color, '#666'),
		rotation: rotation
	});

	// Set the new position, and show or hide
	if (!H.isNumber(iconPosition.y)) {
		icon.attr('y', -9999); // #1338
	}
};
var onTickHover = function (label) {
	label.addClass('highcharts-treegrid-node-active');
	/*= if (build.classic) { =*/
	label.css({
		cursor: 'pointer',
		textDecoration: 'underline'
	});
	/*= } =*/
};
var onTickHoverExit = function (label) {
	label.removeClass('highcharts-treegrid-node-active');
	/*= if (build.classic) { =*/
	label.css({
		cursor: 'default',
		textDecoration: 'none'
	});
	/*= } =*/
};
override(GridAxis.prototype, {
	init: function (proceed, chart, userOptions) {
		var axis = this,
			isTreeGrid = userOptions.type === 'tree-grid';

		// Set default and forced options for TreeGrid
		if (isTreeGrid) {
			merge(true, userOptions, {
				// Default options
				grid: true,
				labels: {
					align: 'left'
				}
			}, userOptions, { // User options
				// Forced options
				reversed: true
			});
		}

		// Now apply the original function with the original arguments,
		// which are sliced off this function's arguments
		proceed.apply(axis, argsToArray(arguments));
		if (isTreeGrid) {
			axis.options.showLastLabel = true;
		}
	},
	/**
	 * Override to add indentation to axis.maxLabelLength.
	 * @param  {Function}   proceed the original function
	 * @returns {undefined}
	 */
	getMaxLabelLength: function (proceed) {
		var axis = this,
			retVal = proceed.apply(axis, argsToArray(arguments)),
			treeDepth = axis.tree && axis.tree.height;

		if (axis.options.type === 'tree-grid') {
			retVal += indentPx * 2 * (treeDepth - 1);
		}

		return retVal;
	}
});
override(GridAxisTick.prototype, {
	renderLabel: function (proceed, xy) {
		var tick = this,
			pos = tick.pos,
			axis = tick.axis,
			label = tick.label,
			treeGridMap = axis.treeGridMap,
			options = axis.options,
			node = treeGridMap && treeGridMap[pos],
			isTreeGrid = options.type === 'tree-grid',
			hasLabel = label && label.element;
		if (isTreeGrid && node) {
			xy.x += iconRadius + iconSpacing + ((node.depth - 1) * indentPx);

			if (hasLabel && node.children.length > 0) {
				// On hover
				H.addEvent(label.element, 'mouseover', function () {
					onTickHover(label);
				});

				// On hover out
				H.addEvent(label.element, 'mouseout', function () {
					onTickHoverExit(label);
				});

				H.addEvent(label.element, 'click', function () {
					var axis = tick.axis,
						pos = tick.pos;
					if (axis) {
						toggleCollapse(axis, axis.treeGridMap[pos], pos);
					}
				});
			}
		}

		proceed.apply(tick, argsToArray(arguments));

		if (isTreeGrid && hasLabel && node && node.children.length > 0) {
			renderLabelIcon(label, iconRadius, iconSpacing, isCollapsed(axis, node, pos));
		}
	}
});
