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
	PlotLineOrBand = H.PlotLineOrBand,
	dateFormat = '%a, %b %d %Y, %H:%M:%S',
	nowText = H.dateFormat(dateFormat, new Date()),
	defaultConfig = {
		color: '#FF0000',
		width: 2,
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

		cdiOptions.value = new Date();

		if (!userOptions.plotLines) {
			userOptions.plotLines = [];
		}

		userOptions.plotLines.push(cdiOptions);
	}

	proceed.apply(axis, Array.prototype.slice.call(arguments, 1));

});

wrap(PlotLineOrBand.prototype, 'render', function (proceed) {
	var plotLoB = this,
		axis = plotLoB.axis,
		cdiOptions = axis.options.currentDateIndicator;

	if (cdiOptions) {
		plotLoB.options.value = new Date();
		plotLoB.options.label.text = H.dateFormat(dateFormat, new Date());
	}
	return proceed.apply(plotLoB, Array.prototype.slice.call(arguments, 1));
});

wrap(PlotLineOrBand.prototype, 'renderLabel', function (proceed) {
	var plotLoB = this,
		axis = plotLoB.axis,
		cdiOptions = axis.options.currentDateIndicator;

	if (cdiOptions && plotLoB.label) {
		plotLoB.label.destroy();
		delete plotLoB.label;
	}

	proceed.apply(plotLoB, Array.prototype.slice.call(arguments, 1));
});
