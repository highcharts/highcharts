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
	extend = H.extend,
	merge = H.merge,
	inArray = H.inArray,
	isNumber = H.isNumber,
	isObject = function (x) {
		// Always use strict mode.
		return H.isObject(x, true);
	},
	isString = H.isString,
	keys = H.keys,
	pick = H.pick,
	reduce = Tree.reduce,
	wrap = H.wrap,
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

var getBreakFromNode = function (node, pos, max) {
	var from = pos + 0.5,
		to = from + node.descendants;

	// In broken-axis, the axis.max is minimized until it is not within a break.
	// Therefore, if break.to is larger than axis.max, the axis.to should not
	// add the 0.5 axis.tickMarkOffset, to avoid adding a break larger than
	// axis.max
	// TODO consider simplifying broken-axis and this might solve itself
	if (to >= max) {
		from -= 0.5;
	}

	return {
		from: from,
		to: to,
		showPoints: false
	};
};

var isCollapsed = function (axis, node, pos) {
	var breaks = (axis.options.breaks || []),
		obj = getBreakFromNode(node, pos, axis.max);
	return some(breaks, function (b) {
		return b.from === obj.from && b.to === obj.to;
	});
};
var collapse = function (axis, node, pos) {
	var breaks = (axis.options.breaks || []),
		obj = getBreakFromNode(node, pos, axis.max);
	breaks.push(obj);
	axis.setBreaks(breaks);
};
var expand = function (axis, node, pos) {
	var breaks = (axis.options.breaks || []),
		obj = getBreakFromNode(node, pos, axis.max);
	// Remove the break from the axis breaks array.
	breaks = reduce(breaks, function (arr, b) {
		if (b.to !== obj.to || b.from !== obj.from) {
			arr.push(b);
		}
		return arr;
	}, []);
	axis.setBreaks(breaks);
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
			translateX: iconCenter.x,
			translateY: iconCenter.y,
			rotation: rotation
		})
		.add(label.parentGroup);
	} else {
		icon.animate({
			translateX: iconCenter.x,
			translateY: iconCenter.y,
			rotation: rotation
		});
	}
	icon.attr({
		'stroke-width': 1,
		'fill': pick(label.styles.color, '#666')
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
		textDecoration: 'underline'
	});
	/*= } =*/
};
var onTickHoverExit = function (label) {
	label.addClass('highcharts-treegrid-node-active');
	/*= if (build.classic) { =*/
	label.css({
		textDecoration: 'none'
	});
	/*= } =*/
};

/**
 * Creates a tree structure of the data, and the tree-grid. Calculates
 * categories, and y-values of points based on the tree.
 * @param {Array} data All the data points to display in the axis.
 * @returns {object} Returns an object containing categories, mapOfIdToNode,
 * mapOfPosToGridNode, and tree.
 * @todo There should be only one point per line.
 * @todo It should be optional to have one category per point, or merge cells
 * @todo Add unit-tests.
 */
var getTreeGridFromData = function (data) {
	var categories = [],
		mapOfIdToNode = {},
		mapOfPosToGridNode = {},
		posIterator = -1,
		tree,
		treeParams;

	// Build the tree from the series data.
	treeParams = {
		// After the children has been created.
		after: function (node) {
			var gridNode = mapOfPosToGridNode[node.pos],
				children = gridNode.children,
				height = 0,
				descendants = 0;
			each(keys(children), function (key) {
				var pos = children[key],
					child = mapOfPosToGridNode[pos];
				descendants += child.descendants + 1;
				height = Math.max(child.height + 1, height);
			});
			gridNode.descendants = descendants;
			gridNode.height = height;
		},
		// Before the children has been created.
		before: function (node) {
			var data = isObject(node.data) ? node.data : {},
				name = isString(data.name) ? data.name : '',
				parentNode = mapOfIdToNode[node.parent],
				parentGridNode,
				pos;

			// If the node has a parent, check if a gridNode with the same
			// name exists already.
			if (isObject(parentNode)) {
				parentGridNode = mapOfPosToGridNode[parentNode.pos];
				// If if there is a gridNode with the same name, reuse pos.
				if (isNumber(parentGridNode.children[name])) {
					pos = parentGridNode.children[name];
				// If not, add a new gridNode.
				} else {
					pos = posIterator++;
					categories.push(name);
					parentGridNode.children[name] = pos;
				}
			} else {
				pos = posIterator++;
			}

			// Add new grid node to map.
			if (!mapOfPosToGridNode[pos]) {
				mapOfPosToGridNode[pos] = {
					name: name,
					children: {}
				};
			}

			// Add data node to map
			if (isString(node.id)) {
				mapOfIdToNode[node.id] = node;
			}

			// Assign pos to data node
			node.pos = pos;

			// Assign position as y-value to the point
			// NOTE: this modifies the point data.
			if (pos > -1) {
				data.y = pos;
			}
		}
	};

	tree = Tree.getTree(data, treeParams);
	return {
		categories: categories,
		mapOfIdToNode: mapOfIdToNode,
		mapOfPosToGridNode: mapOfPosToGridNode,
		tree: tree
	};
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
			H.addEvent(axis.chart, 'beforeRender', function () {
				// beforeRender is fired after all the series is initialized,
				// which is an ideal time to update the axis.categories.
				axis.updateYNames();

				// We have to set the series data again to correct the y-values
				// which was set too early.
				each(axis.series, function (series) {
					series.setData(series.options.data, false, false, false);
				});
			});
			axis.hasNames = true;
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
			isTreeGrid = axis.options.type === 'tree-grid',
			treeDepth;

		if (isTreeGrid) {
			treeDepth = axis.mapOfPosToGridNode[-1].height;
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
			mapOfPosToGridNode = axis.mapOfPosToGridNode,
			options = axis.options,
			node = mapOfPosToGridNode && mapOfPosToGridNode[pos],
			level = node && node.depth - 1,
			isTreeGrid = options.type === 'tree-grid',
			hasLabel = label && label.element;

		proceed.apply(tick, argsToArray(arguments));

		if (isTreeGrid && node) {
			xy.x += iconRadius + (iconSpacing * 2) + (level * indentPx);

			if (hasLabel && node.descendants > 0) {
				renderLabelIcon(label, iconRadius, iconSpacing, isCollapsed(axis, node, pos));
				label.css({
					cursor: 'pointer'
				});
				label.treeIcon.css({
					cursor: 'pointer'
				});
				
				// Add events to both label text and icon
				each([label, label.treeIcon], function (object) {
					if (!object.attachedTreeGridEvents) {
						// On hover
						H.addEvent(object.element, 'mouseover', function () {
							onTickHover(label);
						});
						
						// On hover out
						H.addEvent(object.element, 'mouseout', function () {
							onTickHoverExit(label);
						});
						
						H.addEvent(object.element, 'click', function () {
							var axis = tick.axis,
								pos = tick.pos,
								gridNode = axis.mapOfPosToGridNode[pos];
							if (axis) {
								toggleCollapse(axis, gridNode, pos);
							}
						});
						object.attachedTreeGridEvents = true;
					}
				});
			}
		}
	}
});

GridAxis.prototype.updateYNames = function () {
	var axis = this,
		isTreeGrid = axis.options.type === 'tree-grid',
		isYAxis = !axis.isXAxis,
		series = axis.series,
		treeGrid,
		data;

	if (isTreeGrid && isYAxis) {
		// Concatenate data from all series assigned to this axis.
		data = reduce(series, function (arr, s) {
			return arr.concat(s.options.data);
		}, []);

		// Calculate categories and the hierarchy for the grid.
		treeGrid = getTreeGridFromData(data);

		// Assign values to the axis.
		axis.categories = treeGrid.categories;
		axis.mapOfPosToGridNode = treeGrid.mapOfPosToGridNode;
		axis.hasNames = true;
	}
};
