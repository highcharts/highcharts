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
	defaultConfig = {
		currentDateIndicator: true,
		color: '#FF0000',
		width: 2,
		label: {
			format: '%a, %b %d %Y, %H:%M:%S',
			formatter: undefined,
			rotation: 0
		}
	};

wrap(Axis.prototype, 'setOptions', function (proceed, userOptions) {
	var axis = this,
		cdiOptions = userOptions.currentDateIndicator;

	if (cdiOptions) {
		if (typeof cdiOptions === 'object') {
			// Ignore formatter if custom format is defined
			if (cdiOptions.label && cdiOptions.label.format) {
				cdiOptions.label.formatter = undefined;
			}
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
	var options = this.options,
		format,
		formatter;

	if (options.currentDateIndicator && options.label) {
		format = options.label.format;
		formatter = options.label.formatter;
		
		options.value = new Date();
		if (typeof formatter === 'function') {
			options.label.text = formatter(this);
		} else {
			options.label.text = H.dateFormat(format, new Date());
		}
	}

	return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
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
