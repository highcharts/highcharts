/***
	EXTENSION FOR 3D CHARTS
***/
// Shorthand to check the is3d flag
Highcharts.Chart.prototype.is3d = function () {
	return this.options.chart.options3d && this.options.chart.options3d.enabled; // #4280
};

/**
 * Calculate scale of the 3D view. That is required to
 * fit chart's 3D projection into the actual plotting area. Reported as #4933.
 * @notice This function should ideally take the plot values instead of a chart object, 
 *         but since the chart object is needed for perspective it is not practical. 
 *         Possible to make both getScale and perspective more logical and also immutable.
 * @param  {Object} chart Chart object
 * @param  {Number} chart.plotLeft
 * @param  {Number} chart.plotWidth
 * @param  {Number} chart.plotTop
 * @param  {Number} chart.plotHeight
 * @param  {Number} depth The depth of the chart
 * @return {Number} The scale to fit the 3D chart into the plotting area.
 */
function getScale(chart, depth) {
	var plotLeft = chart.plotLeft,
		plotRight = chart.plotWidth + plotLeft,
		plotTop = chart.plotTop,
		plotBottom = chart.plotHeight + plotTop,
		originX = plotLeft + chart.plotWidth / 2,
		originY = plotTop + chart.plotHeight / 2,
		bbox3d = {
			minX: Number.MAX_VALUE,
			maxX: -Number.MAX_VALUE,
			minY: Number.MAX_VALUE,
			maxY: -Number.MAX_VALUE
		},
		corners,
		scale = 1;

	// Top left corners:
	corners = [{
		x: plotLeft,
		y: plotTop,
		z: 0
	}, {
		x: plotLeft,
		y: plotTop,
		z: depth
	}];

	// Top right corners:
	each([0, 1], function (i) { 
		corners.push({
			x: plotRight,
			y: corners[i].y,
			z: corners[i].z
		});
	});

	// All bottom corners:
	each([0, 1, 2, 3], function (i) {
		corners.push({
			x: corners[i].x,
			y: plotBottom,
			z: corners[i].z
		});
	});

	// Calculate 3D corners:
	corners = perspective(corners, chart, false);

	// Get bounding box of 3D element:
	each(corners, function (corner) {
		bbox3d.minX = Math.min(bbox3d.minX, corner.x);
		bbox3d.maxX = Math.max(bbox3d.maxX, corner.x);
		bbox3d.minY = Math.min(bbox3d.minY, corner.y);
		bbox3d.maxY = Math.max(bbox3d.maxY, corner.y);
	});

	// Left edge:
	if (plotLeft > bbox3d.minX) {
		scale = Math.min(scale, 1 - Math.abs((plotLeft + originX) / (bbox3d.minX + originX)) % 1);
	}

	// Right edge:
	if (plotRight < bbox3d.maxX) {
		scale = Math.min(scale, (plotRight - originX) / (bbox3d.maxX - originX));
	}

	// Top edge:
	if (plotTop > bbox3d.minY) {
		if (bbox3d.minY < 0) {
			scale = Math.min(scale, (plotTop + originY) / (-bbox3d.minY + plotTop + originY));
		} else {
			scale = Math.min(scale, 1 - (plotTop + originY) / (bbox3d.minY + originY) % 1);
		}
	}

	// Bottom edge:
	if (plotBottom < bbox3d.maxY) {
		scale = Math.min(scale, Math.abs((plotBottom - originY) / (bbox3d.maxY - originY)));
	}

	return scale;
}



Highcharts.wrap(Highcharts.Chart.prototype, 'isInsidePlot', function (proceed) {
	return this.is3d() || proceed.apply(this, [].slice.call(arguments, 1));
});

var defaultChartOptions = Highcharts.getOptions();
defaultChartOptions.chart.options3d = {
	enabled: false,
	alpha: 0,
	beta: 0,
	depth: 100,
	fitToPlot: true,
	viewDistance: 25,
	frame: {
		bottom: { size: 1, color: 'rgba(255,255,255,0)' },
		side: { size: 1, color: 'rgba(255,255,255,0)' },
		back: { size: 1, color: 'rgba(255,255,255,0)' }
	}
};

Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed) {
	var args = [].slice.call(arguments, 1),
		plotOptions,
		pieOptions;

	if (args[0].chart && args[0].chart.options3d && args[0].chart.options3d.enabled) {
		// Normalize alpha and beta to (-360, 360) range
		args[0].chart.options3d.alpha = (args[0].chart.options3d.alpha || 0) % 360;
		args[0].chart.options3d.beta = (args[0].chart.options3d.beta || 0) % 360;

		plotOptions = args[0].plotOptions || {};
		pieOptions = plotOptions.pie || {};

		pieOptions.borderColor = Highcharts.pick(pieOptions.borderColor, undefined);
	}
	proceed.apply(this, args);
});

Highcharts.wrap(Highcharts.Chart.prototype, 'setChartSize', function (proceed) {
	var chart = this,
		options3d = chart.options.chart.options3d;

	proceed.apply(chart, [].slice.call(arguments, 1));

	if (chart.is3d()) {
		var inverted = chart.inverted,
			clipBox = chart.clipBox,
			margin = chart.margin,
			x = inverted ? 'y' : 'x',
			y = inverted ? 'x' : 'y',
			w = inverted ? 'height' : 'width',
			h = inverted ? 'width' : 'height';

		clipBox[x] = -(margin[3] || 0);
		clipBox[y] = -(margin[0] || 0);
		clipBox[w] = chart.chartWidth + (margin[3] || 0) + (margin[1] || 0);
		clipBox[h] = chart.chartHeight + (margin[0] || 0) + (margin[2] || 0);

		// Set scale, used later in perspective method():
		chart.scale3d = 1; // @notice getScale uses perspective, so scale3d has to be reset.
		if (options3d.fitToPlot === true) {
			chart.scale3d = getScale(chart, options3d.depth);
		}
	}
});

Highcharts.wrap(Highcharts.Chart.prototype, 'redraw', function (proceed) {
	if (this.is3d()) {
		// Set to force a redraw of all elements
		this.isDirtyBox = true;
	}
	proceed.apply(this, [].slice.call(arguments, 1));
});

// Draw the series in the reverse order (#3803, #3917)
Highcharts.wrap(Highcharts.Chart.prototype, 'renderSeries', function (proceed) {
	var series,
		i = this.series.length;

	if (this.is3d()) {
		while (i--) {
			series = this.series[i];
			series.translate();
			series.render();
		}
	} else {
		proceed.call(this);
	}
});

Highcharts.Chart.prototype.retrieveStacks = function (stacking) {
	var series = this.series,
		stacks = {},
		stackNumber,
		i = 1;

	Highcharts.each(this.series, function (s) {
		stackNumber = pick(s.options.stack, (stacking ? 0 : series.length - 1 - s.index)); // #3841, #4532
		if (!stacks[stackNumber]) {
			stacks[stackNumber] = { series: [s], position: i };
			i++;
		} else {
			stacks[stackNumber].series.push(s);
		}
	});

	stacks.totalStacks = i + 1;
	return stacks;
};

