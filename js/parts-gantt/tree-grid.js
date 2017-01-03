/**
* (c) 2016 Highsoft AS
* Authors: Jon Arild Nygard
*
* License: www.highcharts.com/license
*/
/* eslint no-console: 0 */
'use strict';
import H from '../parts/Globals.js';
import './grid-axis.js';
var wrap = H.wrap,
	each = H.each,
	map = H.map,
	pick = H.pick,
	GridAxis = H.Axis;
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
var getTree = function (tree) {
	var allIds = map(tree, function (d) {
			return d.id;
		}),
		parentList = getListOfParents(tree, allIds);
	console.log('allIds', allIds);
	console.log('parentList', parentList);
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
override(GridAxis.prototype, {
	init: function (proceed) {
		var axis = this,
			tree,
			options;
		// Now apply the original function with the original arguments, 
		// which are sliced off this function's arguments
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		options = axis.options;
		if (options.type === 'tree-grid') {
			tree = getTree(options.tree);
			console.log(tree);
		}
	}
});

