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
import './grid-axis.js';
var wrap = H.wrap,
	each = H.each,
	map = H.map,
	merge = H.merge,
	pick = H.pick,
	GridAxis = H.Axis,
	GridAxisTick = H.Tick;
var reduce = function (arr, func, previous, context) {
	context = context || this;
	arr = arr || []; // @note should each be able to handle empty values automatically?
	each(arr, function (current, i) {
		previous = func.call(context, previous, current, i, arr);
	});
	return previous;
};
var objectKeys = function (obj) {
	var result = [],
		prop;
	for (prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			result.push(prop);
		}
	}
	return result;
};
/**
 * Creates an object map from parent id to childrens index.
 * @param {Array} data List of points set in options.
 * @param {string} data[].parent Parent id of point.
 * @param {Array} ids List of all point ids.
 * @return {Object} Map from parent id to children index in data.
 */
var getListOfParents = function (data, ids) {
	var listOfParents = reduce(data, function (prev, curr) {
			var parent = pick(curr.parent, '');
			if (prev[parent] === undefined) {
				prev[parent] = [];
			}
			prev[parent].push(curr);
			return prev;
		}, {}),
		keys = objectKeys(listOfParents);

	// If parent does not exist, hoist parent to root of tree.
	each(keys, function (parent, list) {
		var children = listOfParents[parent];
		if ((parent !== '') && (H.inArray(parent, ids) === -1)) {
			each(children, function (child) {
				list[''].push(child);
			});
			delete list[parent];
		}
	});
	return listOfParents;
};
var getNode = function (id, parent, level, data, mapOfIdToChildren) {
	return {
		children: map((mapOfIdToChildren[id] || []), function (child) {
			return getNode(child.id, id, (level + 1), child, mapOfIdToChildren);
		}),
		data: data,
		id: id,
		level: level,
		parent: parent
	};
};
var getTree = function (data) {
	var ids = map(data, function (d) {
			return d.id;
		}),
		mapOfIdToChildren = getListOfParents(data, ids);
	return getNode('', null, 0, null, mapOfIdToChildren);
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
 * GetCategories based on a tree
 * @param  {object} tree Root of tree to collect categories from
 * @return {Array}       Array of categories
 */
var getCategoriesFromTree = function (tree) {
	var categories = [],
		map = {},
		grandChildren;
	if (tree.data) {
		categories.push(tree.data.name);
		map[tree.data.y] = tree;
	}
	each(tree.children, function (child) {
		grandChildren = getCategoriesFromTree(child);
		categories = categories.concat(grandChildren.categories);
		map = merge(map, grandChildren.map);
	});
	return {
		categories: categories,
		map: map
	};
};
override(GridAxis.prototype, {
	init: function (proceed, chart, userOptions) {
		var axis = this,
			axisData = [],
			tree,
			nodeInfo,
			options;
		userOptions.reversed = true;

		// Now apply the original function with the original arguments,
		// which are sliced off this function's arguments
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		options = axis.options;
		if (options.type === 'tree-grid') {
			// Gather data from all series with same treeGrid axis
			each(chart.options.series, function (series) {
				// Get the series which use this axis
				if (
					// Series yAxis is the same as this axis
					(series.yAxis && chart.yAxis[series.yAxis] === axis) ||
					// Series yAxis is not set, check if this is first yAxis
					!series.yAxis && chart.yAxis[0] === axis
				) {
					axisData = axisData.concat(series.data);
				}
			});
			tree = getTree(axisData);
			// TODO Do this before proceed to avoid resetting hasNames and showLastLabel
			nodeInfo = getCategoriesFromTree(tree);
			axis.categories = nodeInfo.categories;
			axis.treeGridMap = nodeInfo.map;
			axis.hasNames = true;
			options.showLastLabel = true;
		}
	}
});
override(GridAxisTick.prototype, {
	renderLabel: function (proceed, xy, old, opacity, index) {
		var tick = this,
			pos = tick.pos,
			axis = tick.axis,
			treeGridMap = axis.treeGridMap,
			options = axis.options;
		if (options.type === 'tree-grid' && index >= 0) {
			if (treeGridMap[pos] && treeGridMap[pos].level) {
				xy.x += (treeGridMap[pos].level - 1) * 10;
			}
		}
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});
