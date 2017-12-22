/**
 * Parallel coordinates module
 *
 * (c) 2010-2017 Pawel Fus
 *
 * License: www.highcharts.com/license
 */
/* eslint max-len: ["warn", 80, 4] */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Axis.js';
import '../parts/Chart.js';
import '../parts/Series.js';

/**
 * Extensions for parallel coordinates plot.
 */
var SeriesProto = H.Series.prototype,
	ChartProto = H.Chart.prototype,
	AxisProto = H.Axis.prototype;

var pick = H.pick,
	each = H.each,
	wrap = H.wrap,
	merge = H.merge,
	erase = H.erase,
	splat = H.splat,
	extend = H.extend,
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

/**
 * @optionparent chart
 */
var defaultParallelOptions = {
	/**
	 * Flag to render charts as a parallel coordinates plot. In a parallel
	 * coordinates plot (||-coords) by default all required yAxes are generated
	 * and the legend is disabled. This feature requires
	 * `modules/parallel-coordinates.js`.
	 *
	 * @sample {highcharts} /highcharts/demo/parallel-coordinates/
	 *         Parallel coordinates demo
	 * @since 6.0.0
	 * @product highcharts
	 */
	parallelCoordinates: false,
	/**
	 * Common options for all yAxes rendered in a parallel coordinates plot.
	 * This feature requires `modules/parallel-coordinates.js`.
	 *
	 * The default options are:
	 * <pre>
	 * parallelAxes: {
	 *	lineWidth: 1,       // classic mode only
	 *	gridlinesWidth: 0,  // classic mode only
	 *	title: {
	 *		text: '',
	 *		reserveSpace: false
	 *	},
	 *	labels: {
	 *		x: 0,
	 *		y: 0,
	 *		align: 'center',
	 *		reserveSpace: false
	 *	},
	 *	offset: 0
	 * }</pre>
	 *
	 * @extends {yAxis}
	 * @excluding alternateGridColor,breaks,id,gridLineColor,gridLineDashStyle,
	 *            gridLineWidth,minorGridLineColor,minorGridLineDashStyle,
	 *            minorGridLineWidth,plotBands,plotLines,angle,
	 *            gridLineInterpolation,maxColor,maxZoom,minColor,scrollbar,
	 *            stackLabels,stops
	 *
	 * @product highcharts
	 * @sample {highcharts} highcharts/parallel-coordinates/parallelaxes/
	 *         Set the same tickAmount for all yAxes
	 * @since 6.0.0
	 */
	parallelAxes: {
		/*= if (build.classic) { =*/
		lineWidth: 1,
		/*= } =*/
		/**
		 * Titles for yAxes are taken from 
		 * [xAxis.categories](#xAxis.categories). All options for 
		 * `xAxis.labels` applies to parallel coordinates titles.
		 * For example, to style categories, use 
		 * [xAxis.labels.style](#xAxis.labels.style).
		 *
		 * @excluding align,enabled,margin,offset,position3d,reserveSpace,
		 *            rotation,skew3d,style,text,useHTML,x,y
		 */
		title: {
			text: '',
			reserveSpace: false
		},
		labels: {
			x: 0,
			y: 4,
			align: 'center',
			reserveSpace: false
		},
		offset: 0
	}
};

H.setOptions({
	chart: defaultParallelOptions
});

/**
 * Initialize parallelCoordinates
 */
wrap(ChartProto, 'init', function (proceed, options, callback) {
	var defaultyAxis = splat(options.yAxis || {}),
		yAxisLength = defaultyAxis.length,
		newYAxes = [];
	/**
	 * Flag used in parallel coordinates plot to check if chart has ||-coords.
	 *
	 * @name hasParallelCoordinates
	 * @memberOf Chart
	 * @type {Boolean}
	 */
	this.hasParallelCoordinates = options.chart &&
		options.chart.parallelCoordinates;

	if (this.hasParallelCoordinates) {

		this.setParallelInfo(options);

		// Push empty yAxes in case user did not define them:
		for (; yAxisLength <= this.parallelInfo.counter; yAxisLength++) {
			newYAxes.push({});
		}

		options = merge(
			{
				legend: {
					enabled: false
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

		options.yAxis = defaultyAxis.concat(newYAxes);
		options.xAxis = merge(
			defaultXAxisOptions, // docs
			splat(options.xAxis || {})[0]
		);
	}

	return proceed.call(this, options, callback);
});

/**
 * Initialize parallelCoordinates
 */
wrap(ChartProto, 'update', function (proceed, options) {
	if (options.chart) {
		if (defined(options.chart.parallelCoordinates)) {
			this.hasParallelCoordinates = options.chart.parallelCoordinates;
		}

		if (this.hasParallelCoordinates && options.chart.parallelAxes) {
			this.options.chart.parallelAxes = merge(
				this.options.chart.parallelAxes,
				options.chart.parallelAxes
			);
			each(this.yAxis, function (axis) {
				axis.update({}, false);
			});
		}
	}

	return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});

extend(ChartProto, /** @lends Highcharts.Chart.prototype */ {
	/**
	 * Define how many parellel axes we have according to the longest  dataset
	 * This is quite heavy - loop over all series and check series.data.length
	 * Consider:
	 * - make this an option, so user needs to set this to get better
	 * 	 performance
	 * - check only first series for number of points and assume the rest is the
	 * 	 same
	 *
	 * @param {Object} options User options
	 */
	setParallelInfo: function (options) {
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
	}
});


/**
 * On update, keep parallelPosition.
 */
AxisProto.keepProps.push('parallelPosition');

/**
 * Update default options with predefined for a parallel coords.
 */
wrap(AxisProto, 'setOptions', function (proceed, userOptions) {
	var axis = this,
		chart = axis.chart,
		axisPosition = ['left', 'width', 'height', 'top'];

	proceed.apply(axis, Array.prototype.slice.call(arguments, 1));

	if (chart.hasParallelCoordinates) {
		if (chart.inverted) {
			axisPosition = axisPosition.reverse();
		}

		if (axis.isXAxis) {
			axis.options = merge(
				axis.options,
				defaultXAxisOptions,
				userOptions
			);
		} else {
			axis.options = merge(
				axis.options,
				axis.chart.options.chart.parallelAxes,
				userOptions
			);
			axis.parallelPosition = pick(
				axis.parallelPosition,
				chart.yAxis.length
			);
			axis.setParallelPosition(axisPosition, axis.options);
		}
	}
});


/**
 * Each axis should gather extremes from points on a particular position in
 * series.data. Not like the default one, which gathers extremes from all series
 * bind to this axis.
 * Consider:
 * - using series.points instead of series.yData
 */
wrap(AxisProto, 'getSeriesExtremes', function (proceed) {
	if (this.chart && this.chart.hasParallelCoordinates && !this.isXAxis) {
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


extend(AxisProto, /** @lends Highcharts.Axis.prototype */ {
	/**
	 * Set predefined left+width and top+height (inverted) for yAxes. This
	 * method modifies options param.
	 *
	 * @param  {Array} axisPosition
	 *         ['left', 'width', 'height', 'top'] or
	 *         ['top', 'height', 'width', 'left'] for an inverted chart.
	 * @param  {Object} options {@link Highcharts.Axis#options}.
	 */
	setParallelPosition: function (axisPosition, options) {
		options[axisPosition[0]] = 100 * (this.parallelPosition + 0.5) /
			(this.chart.parallelInfo.counter + 1) + '%';
		this[axisPosition[1]] = options[axisPosition[1]] = 0;

		// In case of chart.update(inverted), remove old options:
		this[axisPosition[2]] = options[axisPosition[2]] = null;
		this[axisPosition[3]] = options[axisPosition[3]] = null;
	}
});


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

				point.plotY = chart.yAxis[i]
					.translate(point.y, false, true, null, true);

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

function addFormattedValue(proceed) {
	var chart = this.series && this.series.chart,
		config = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
		formattedValue,
		yAxisOptions,
		labelFormat,
		yAxis;

	if (
		chart &&
		chart.hasParallelCoordinates &&
		!defined(config.formattedValue)
	) {
		yAxis = chart.yAxis[this.x];
		yAxisOptions = yAxis.options;

		labelFormat = pick(
			/**
			 * Parallel coordinates only. Format that will be used for point.y
			 * and available in [tooltip.pointFormat](#tooltip.pointFormat) as
			 * `{point.formattedValue}`. If not set, `{point.formattedValue}`
			 * will use other options, in this order:
			 *
			 * 1. [yAxis.labels.format](#yAxis.labels.format) will be used if
			 *    set
			 * 2. if yAxis is a category, then category name will be displayed
			 * 3. if yAxis is a datetime, then value will use the same format as
			 *    yAxis labels
			 * 4. if yAxis is linear/logarithmic type, then simple value will be
			 *    used
			 *
			 * @default undefined
			 * @memberOf yAxis
			 * @sample {highcharts}
			 *         /highcharts/parallel-coordinates/tooltipvalueformat/
			 *         Different tooltipValueFormats's
			 * @apioption yAxis.tooltipValueFormat
			 * @product highcharts
			 * @since 6.0.0
			 * @type {String}
			 */
			yAxisOptions.tooltipValueFormat,
			yAxisOptions.labels.format
		);
		if (labelFormat) {
			formattedValue = H.format(
				labelFormat,
				extend(
					this,
					{ value: this.y }
				),
				chart.time
			);
		} else if (yAxis.isDatetimeAxis) {
			formattedValue = chart.time.dateFormat(
				yAxisOptions.dateTimeLabelFormats[
					yAxis.tickPositions.info.unitName
				],
				this.y
			);
		} else if (yAxisOptions.categories) {
			formattedValue = yAxisOptions.categories[this.y];
		} else {
			formattedValue = this.y;
		}

		config.formattedValue = config.point.formattedValue = formattedValue;
	}

	return config;
}

each(['line', 'spline'], function (seriesName) {
	wrap(
		H.seriesTypes[seriesName].prototype.pointClass.prototype,
		'getLabelConfig',
		addFormattedValue
	);
});
