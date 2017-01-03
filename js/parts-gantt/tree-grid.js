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
	GridAxis = H.Axis;
var getTree = function () {
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

