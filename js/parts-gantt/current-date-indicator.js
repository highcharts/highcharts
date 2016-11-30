/**
* (c) 2016 Highsoft AS
* Author: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';


var merge = H.merge,
	wrap = H.wrap,
	Axis = H.Axis,
	now = new Date(),
	nowText = H.dateFormat('%a, %b %d %Y, %H:%M', now.getTime()),
	// TODO
	// update on redraw
	defaultConfig = {
		color: '#FF0000',
		width: 2,
		value: now.getTime(), // sets the value to the current date
		label: {
			// TODO:
			// Format
			// Formatter
			text: nowText, // Automatic
			rotation: 0 // display horizontally
		}
	};

wrap(Axis.prototype, 'setOptions', function (proceed, userOptions) {
	var axis = this,
		cdiOptions = userOptions.currentDateIndicator;

	if (cdiOptions) {
		if (typeof cdiOptions === 'object') {
			cdiOptions = merge(defaultConfig, cdiOptions);
		} else {
			cdiOptions = merge(defaultConfig);
		}

		if (!userOptions.plotLines) {
			userOptions.plotLines = [cdiOptions];
		} else {
			userOptions.plotLines.push(cdiOptions);
		}
	}

	proceed.apply(axis, Array.prototype.slice.call(arguments, 1));

});
