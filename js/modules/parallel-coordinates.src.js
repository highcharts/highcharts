/**
 * Parallel coordinates module
 *
 * (c) 2010-2017 Pawel Fus
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Axis.js';
import '../parts/Chart.js';
import '../parts/Series.js';

/**
 * Extensions for parallel coordinates plot.
 */
var SeriesProto = H.Series.prototype,
	AxisProto = H.Axis.prototype;

var pick = H.pick,
	each = H.each,
	wrap = H.wrap,
	merge = H.merge,
	erase = H.erase,
	splat = H.splat,
	defined = H.defined,
	arrayMin = H.arrayMin,
	arrayMax = H.arrayMax;

var defaultXAxisOptions = {
	/*= if (build.classic) { =*/
	lineWidth: 0,
	tickLength: 0,
	/*= } =*/
	opposite: true,
	type: 'category'
};

H.setOptions({
	chart: {
		/**
		 * Flag to render charts as a parallel coordinates plot.
		 * In a parallel coordinates plot (||-coords) by default all required yAxes are generated and legend is disabled.
		 * This feature requires `modules/parallel-coordinates.js`, found in the download package or online at
		 * [code.highcharts.com/modules/parallel-coordinates.js](http://code.highcharts.com/modules/parallel-coordinates.js).
		 *
		 * @type {Boolean}
		 * @default false
		 * @since 6.0.0
		 * @product highcharts
		 */
		parallelCoordinates: false,
		/**
		 * Common options for all yAxes rendered in a parallel coordinates plot. This feature requires
		 * `modules/parallel-coordinates.js`, found in the download package or online at
		 * [code.highcharts.com/modules/parallel-coordinates.js](http://code.highcharts.com/modules/parallel-coordinates.js).
		 *
		 * @optionparent yAxis
		 * @since 6.0.0
		 * @product highcharts
		 */
		parallelAxes: {
			/*= if (build.classic) { =*/
			lineWidth: 1,
			gridlinesWidth: 0,
			/*= } =*/
			title: {
				text: '',
				reserveSpace: false
			},
			labels: {
				x: 0,
				y: 0,
				align: 'center',
				reserveSpace: false
			},
			offset: 0
		}
	}
});

/**
 * Initialize parallelCoordinates
 */
wrap(H.Chart.prototype, 'init', function (proceed, options) {
	var defaultyAxis = splat(options.yAxis || {}),
		yAxisLength = defaultyAxis.length,
		newYAxes = [];

	this.hasParallelCoordinates = options.chart && options.chart.parallelCoordinates;

	if (this.hasParallelCoordinates) {

		this.setParallelInfo(options);

		// Push empty yAxes in case user did not define them:
		for (; yAxisLength <= this.parallelInfo.counter; yAxisLength++) {
			newYAxes.push({});
		}

		options = merge(
			{
				legend: {
					enabled: false // docs
				}
			},
			options,
			// Disable boost:
			{
				boost: {
					seriesThreshold: Number.MAX_SAFE_INTEGER
				},
				plotOptions: {
					series: {
						boostThreshold: Number.MAX_SAFE_INTEGER
					}
				}
			}
		);

		options.yAxis = defaultyAxis.concat(newYAxes); // docs
		options.xAxis = merge(
			defaultXAxisOptions, // docs
			splat(options.xAxis || {})[0]
		);
	}

	return proceed.call(this, options);
});


/**
 * Define how many parellel axes we have according to the longest  dataset
 * This is quite heavy - loop over all series and check series.data.length
 * Consider:
 * - make this an option, so user needs to set this to get better performance
 * - check only first series for number of points and assume the rest is the same
 */
H.Chart.prototype.setParallelInfo = function (options) {
	var chart = this,
		seriesOptions = options.series;

	chart.parallelInfo = {
		counter: 0
	};

	each(seriesOptions, function (series) {
		if (series.data) {
			chart.parallelInfo.counter = Math.max(
				chart.parallelInfo.counter,
				series.data.length - 1
			);
		}
	});
};


/**
 * On update, keep parallelPosition.
 */
AxisProto.keepProps.push('parallelPosition');

/**
 * Update default options with predefined for a parallel coords.
 */
wrap(AxisProto, 'init', function (proceed, chart, options) {
	var axisPosition = ['left', 'width', 'height', 'top'];

	this.chart = chart;

	if (chart.inverted) {
		axisPosition = axisPosition.reverse();
	}

	if (chart.hasParallelCoordinates) {
		if (options.isX) {
			options = merge(defaultXAxisOptions, options);
		} else {
			options = merge(chart.options.chart.parallelAxes, options);
			this.parallelPosition = pick(
				this.parallelPosition,
				chart.yAxis.length
			);
			this.setParallelPosition(axisPosition, options);
		}
	}
	proceed.call(this, chart, options);
});


/**
 * Each axis should gather extremes from points on a particular position in series.data
 * Not like the default one, which gathers extremes from all series bind to this axis
 * Consider:
 * - using series.points instead of series.yData
 */
wrap(AxisProto, 'getSeriesExtremes', function (proceed) {
	if (this.chart.hasParallelCoordinates && !this.isXAxis) {
		var index = this.parallelPosition,
			currentPoints = [];
		each(this.series, function (series) {
			if (defined(series.yData[index])) {
				// We need to use push() beacause of null points
				currentPoints.push(series.yData[index]);
			}
		});
		this.dataMin = arrayMin(currentPoints);
		this.dataMax = arrayMax(currentPoints);
	} else {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});


/**
 * Set predefined left+width and top+height (inverted) for yAxes.
 */
AxisProto.setParallelPosition = function (axisPosition, options) {
	options[axisPosition[0]] = 100 * (this.parallelPosition + 0.5) / (this.chart.parallelInfo.counter + 1) + '%';
	this[axisPosition[1]] = options[axisPosition[1]] = 0;

	// In case of chart.update(inverted), remove old options:
	this[axisPosition[2]] = options[axisPosition[2]] = null;
	this[axisPosition[3]] = options[axisPosition[3]] = null;
};


/**
 * Bind each series to each yAxis.
 * yAxis needs a reference to all series to calculate extremes.
 */
wrap(SeriesProto, 'bindAxes', function (proceed) {
	if (this.chart.hasParallelCoordinates) {
		var series = this;
		each(this.chart.axes, function (axis) {
			series.insert(axis.series);
			axis.isDirty = true;
		});
		series.xAxis = this.chart.xAxis[0];
		series.yAxis = this.chart.yAxis[0];
	} else {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});


/**
 * Translate each point using corresponding yAxis.
 */
wrap(SeriesProto, 'translate', function (proceed) {
	proceed.apply(this, Array.prototype.slice.call(arguments, 1));

	var series = this,
		chart = this.chart,
		points = series.points,
		dataLength = points && points.length,
		closestPointRangePx = Number.MAX_VALUE,
		lastPlotX,
		point,
		i;

	if (this.chart.hasParallelCoordinates) {
		for (i = 0; i < dataLength; i++) {
			point = points[i];
			if (defined(point.y)) {
				point.plotX = point.clientX = chart.inverted ?
					chart.plotHeight - chart.yAxis[i].top + chart.plotTop :
					chart.yAxis[i].left - chart.plotLeft;

				point.plotY = chart.yAxis[i].toPixels(point.y, true);

				if (lastPlotX !== undefined) {
					closestPointRangePx = Math.min(
						closestPointRangePx,
						Math.abs(point.plotX - lastPlotX)
					);
				}
				lastPlotX = point.plotX;
				point.isInside = chart.isInsidePlot(
					point.plotX,
					point.plotY,
					chart.inverted
				);
			} else {
				point.isNull = true;
			}
		}
		this.closestPointRangePx = closestPointRangePx;
	}
});

/**
 * On destroy, we need to remove series from each axis.series
 */
wrap(SeriesProto, 'destroy', function (proceed) {
	if (this.chart.hasParallelCoordinates) {
		var series = this;
		each(this.chart.axes || [], function (axis) {
			if (axis && axis.series) {
				erase(axis.series, series);
				axis.isDirty = axis.forceRedraw = true;
			}
		});
	}
	proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});
