/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Chart.js';
import '../parts/Color.js';
import '../parts/Legend.js';
var Axis = H.Axis,
	Chart = H.Chart,
	color = H.color,
	ColorAxis,
	each = H.each,
	extend = H.extend,
	isNumber = H.isNumber,
	Legend = H.Legend,
	LegendSymbolMixin = H.LegendSymbolMixin,
	noop = H.noop,
	merge = H.merge,
	pick = H.pick,
	wrap = H.wrap;

/**
 * The ColorAxis object for inclusion in gradient legends
 */
ColorAxis = H.ColorAxis = function () {
	this.init.apply(this, arguments);
};
extend(ColorAxis.prototype, Axis.prototype);
extend(ColorAxis.prototype, {
	/**	 
	 * @extends {xAxis}
	 * @optionparent colorAxis
	 */
	defaultColorAxisOptions: {

		/**
		 */
		lineWidth: 0,

		/**
		 * Padding of the min value relative to the length of the axis. A
		 * padding of 0.05 will make a 100px axis 5px longer.
		 * 
		 * @type {Number}
		 * @product highmaps
		 */
		minPadding: 0,

		/**
		 * Padding of the max value relative to the length of the axis. A
		 * padding of 0.05 will make a 100px axis 5px longer.
		 * 
		 * @type {Number}
		 * @product highmaps
		 */
		maxPadding: 0,

		/**
		 * The width of the grid lines extending from the axis across the
		 * gradient of a scalar color axis.
		 * 
		 * @type {Number}
		 * @sample {highmaps} maps/coloraxis/gridlines/ Grid lines demonstrated
		 * @default {all} 1
		 * @product highmaps
		 */
		gridLineWidth: 1,

		/**
		 * If [tickInterval](#colorAxis.tickInterval) is `null` this option
		 * sets the approximate pixel interval of the tick marks.
		 * 
		 * @type {Number}
		 * @default {all} 72
		 * @product highmaps
		 */
		tickPixelInterval: 72,

		/**
		 * Whether to force the axis to start on a tick. Use this option with
		 * the `maxPadding` option to control the axis start.
		 * 
		 * @type {Boolean}
		 * @default {all} true
		 * @product highmaps
		 */
		startOnTick: true,

		/**
		 * Whether to force the axis to end on a tick. Use this option with
		 * the [maxPadding](#colorAxis.maxPadding) option to control the axis
		 * end.
		 * 
		 * @type {Boolean}
		 * @default {all} true
		 * @product highmaps
		 */
		endOnTick: true,

		/**
		 */
		offset: 0,

		/**
		 * The triangular marker on a scalar color axis that points to the
		 * value of the hovered area. To disable the marker, set `marker:
		 * null`.
		 * 
		 * @type {Object}
		 * @sample {highmaps} maps/coloraxis/marker/ Black marker
		 * @product highmaps
		 */
		marker: {

			/**
			 * Animation for the marker as it moves between values. Set to `false`
			 * to disable animation. Defaults to `{ duration: 50 }`.
			 * 
			 * @type {Object|Boolean}
			 * @product highmaps
			 */
			animation: {

				/**
				 */
				duration: 50
			},

			/**
			 */
			width: 0.01,
			/*= if (build.classic) { =*/

			/**
			 * The color of the marker.
			 * 
			 * @type {Color}
			 * @default {all} #999999
			 * @product highmaps
			 */
			color: '${palette.neutralColor40}'
			/*= } =*/
		},

		/**
		 * The axis labels show the number for each tick.
		 * 
		 * For more live examples on label options, see [xAxis.labels in the
		 * Highcharts API.](/highcharts#xAxis.labels)
		 * 
		 * @type {Object}
		 * @extends xAxis.labels
		 * @product highmaps
		 */
		labels: {

			/**
			 * How to handle overflowing labels on horizontal axis. Can be undefined
			 * or "justify". If "justify", labels will not render outside the
			 * plot area. If there is room to move it, it will be aligned to
			 * the edge, else it will be removed.
			 * 
			 * @validvalue [null, "justify"]
			 * @type {String}
			 * @default {all} justify
			 * @product highmaps
			 */
			overflow: 'justify',

			/**
			 */
			rotation: 0
		},

		/**
		 * The color to represent the minimum of the color axis. Unless [dataClasses](#colorAxis.
		 * dataClasses) or [stops](#colorAxis.stops) are set, the gradient
		 * starts at this value.
		 * 
		 * If dataClasses are set, the color is based on minColor and maxColor
		 * unless a color is set for each data class, or the [dataClassColor](#colorAxis.
		 * dataClassColor) is set.
		 * 
		 * @type {Color}
		 * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/ Min and max colors on scalar (gradient) axis
		 * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/ On data classes
		 * @default {all} #e6ebf5
		 * @product highmaps
		 */
		minColor: '${palette.highlightColor10}',

		/**
		 * The color to represent the maximum of the color axis. Unless [dataClasses](#colorAxis.
		 * dataClasses) or [stops](#colorAxis.stops) are set, the gradient
		 * ends at this value.
		 * 
		 * If dataClasses are set, the color is based on minColor and maxColor
		 * unless a color is set for each data class, or the [dataClassColor](#colorAxis.
		 * dataClassColor) is set.
		 * 
		 * @type {Color}
		 * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/ Min and max colors on scalar (gradient) axis
		 * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/ On data classes
		 * @default {all} #003399
		 * @product highmaps
		 */
		maxColor: '${palette.highlightColor100}',

		/**
		 */
		tickLength: 5,

		/**
		 * Whether to display the colorAxis in the legend.
		 * 
		 * @type {Boolean}
		 * @see [heatmap.showInLegend](#series<heatmap>.showInLegend)
		 * @default {all} true
		 * @since 4.2.7
		 * @product highmaps
		 */
		showInLegend: true
	},

	// Properties to preserve after destroy, for Axis.update (#5881, #6025)
	keepProps: [
		'legendGroup',
		'legendItemHeight',
		'legendItemWidth',
		'legendItem',
		'legendSymbol'
	].concat(Axis.prototype.keepProps),

	/**
	 * Initialize the color axis
	 */
	init: function (chart, userOptions) {
		var horiz = chart.options.legend.layout !== 'vertical',
			options;

		this.coll = 'colorAxis';

		// Build the options
		options = merge(this.defaultColorAxisOptions, {
			side: horiz ? 2 : 1,
			reversed: !horiz
		}, userOptions, {
			opposite: !horiz,
			showEmpty: false,
			title: null
		});

		Axis.prototype.init.call(this, chart, options);

		// Base init() pushes it to the xAxis array, now pop it again
		// chart[this.isXAxis ? 'xAxis' : 'yAxis'].pop();

		// Prepare data classes
		if (userOptions.dataClasses) {
			this.initDataClasses(userOptions);
		}
		this.initStops();

		// Override original axis properties
		this.horiz = horiz;
		this.zoomEnabled = false;
		
		// Add default values		
		this.defaultLegendLength = 200;
	},

	initDataClasses: function (userOptions) {
		var chart = this.chart,
			dataClasses,
			colorCounter = 0,
			colorCount = chart.options.chart.colorCount,
			options = this.options,
			len = userOptions.dataClasses.length;
		this.dataClasses = dataClasses = [];
		this.legendItems = [];

		each(userOptions.dataClasses, function (dataClass, i) {
			var colors;

			dataClass = merge(dataClass);
			dataClasses.push(dataClass);
			if (!dataClass.color) {
				if (options.dataClassColor === 'category') {
					/*= if (build.classic) { =*/
					colors = chart.options.colors;
					colorCount = colors.length;
					dataClass.color = colors[colorCounter];
					/*= } =*/
					dataClass.colorIndex = colorCounter;

					// increase and loop back to zero
					colorCounter++;
					if (colorCounter === colorCount) {
						colorCounter = 0;
					}
				} else {
					dataClass.color = color(options.minColor).tweenTo(
						color(options.maxColor),
						len < 2 ? 0.5 : i / (len - 1) // #3219
					);
				}
			}
		});
	},

	initStops: function () {
		this.stops = this.options.stops || [
			[0, this.options.minColor],
			[1, this.options.maxColor]
		];
		each(this.stops, function (stop) {
			stop.color = color(stop[1]);
		});
	},

	/**
	 * Extend the setOptions method to process extreme colors and color
	 * stops.
	 */
	setOptions: function (userOptions) {
		Axis.prototype.setOptions.call(this, userOptions);

		this.options.crosshair = this.options.marker;
	},

	setAxisSize: function () {
		var symbol = this.legendSymbol,
			chart = this.chart,
			legendOptions = chart.options.legend || {},
			x,
			y,
			width,
			height;

		if (symbol) {
			this.left = x = symbol.attr('x');
			this.top = y = symbol.attr('y');
			this.width = width = symbol.attr('width');
			this.height = height = symbol.attr('height');
			this.right = chart.chartWidth - x - width;
			this.bottom = chart.chartHeight - y - height;

			this.len = this.horiz ? width : height;
			this.pos = this.horiz ? x : y;
		} else {
			// Fake length for disabled legend to avoid tick issues
			// and such (#5205)
			this.len = (
					this.horiz ?
						legendOptions.symbolWidth :
						legendOptions.symbolHeight
				) || this.defaultLegendLength;
		}
	},

	normalizedValue: function (value) {
		if (this.isLog) {
			value = this.val2lin(value);
		}
		return 1 - ((this.max - value) / ((this.max - this.min) || 1));
	},

	/**
	 * Translate from a value to a color
	 */
	toColor: function (value, point) {
		var pos,
			stops = this.stops,
			from,
			to,
			color,
			dataClasses = this.dataClasses,
			dataClass,
			i;

		if (dataClasses) {
			i = dataClasses.length;
			while (i--) {
				dataClass = dataClasses[i];
				from = dataClass.from;
				to = dataClass.to;
				if (
					(from === undefined || value >= from) &&
					(to === undefined || value <= to)
				) {
					color = dataClass.color;
					if (point) {
						point.dataClass = i;
						point.colorIndex = dataClass.colorIndex;
					}
					break;
				}
			}

		} else {

			pos = this.normalizedValue(value);
			i = stops.length;
			while (i--) {
				if (pos > stops[i][0]) {
					break;
				}
			}
			from = stops[i] || stops[i + 1];
			to = stops[i + 1] || from;

			// The position within the gradient
			pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);

			color = from.color.tweenTo(
				to.color,
				pos
			);
		}
		return color;
	},

	/**
	 * Override the getOffset method to add the whole axis groups inside
	 * the legend.
	 */
	getOffset: function () {
		var group = this.legendGroup,
			sideOffset = this.chart.axisOffset[this.side];

		if (group) {

			// Hook for the getOffset method to add groups to this parent group
			this.axisParent = group;

			// Call the base
			Axis.prototype.getOffset.call(this);

			// First time only
			if (!this.added) {

				this.added = true;

				this.labelLeft = 0;
				this.labelRight = this.width;
			}
			// Reset it to avoid color axis reserving space
			this.chart.axisOffset[this.side] = sideOffset;
		}
	},

	/**
	 * Create the color gradient
	 */
	setLegendColor: function () {
		var grad,
			horiz = this.horiz,
			reversed = this.reversed,
			one = reversed ? 1 : 0,
			zero = reversed ? 0 : 1;

		grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one]; // #3190
		this.legendColor = {
			linearGradient: {
				x1: grad[0], y1: grad[1],
				x2: grad[2], y2: grad[3]
			},
			stops: this.stops
		};
	},

	/**
	 * The color axis appears inside the legend and has its own legend symbol
	 */
	drawLegendSymbol: function (legend, item) {
		var padding = legend.padding,
			legendOptions = legend.options,
			horiz = this.horiz,
			width = pick(
				legendOptions.symbolWidth,
				horiz ? this.defaultLegendLength : 12
			),
			height = pick(
				legendOptions.symbolHeight,
				horiz ? 12 : this.defaultLegendLength
			),
			labelPadding = pick(legendOptions.labelPadding, horiz ? 16 : 30),
			itemDistance = pick(legendOptions.itemDistance, 10);

		this.setLegendColor();

		// Create the gradient
		item.legendSymbol = this.chart.renderer.rect(
			0,
			legend.baseline - 11,
			width,
			height
		).attr({
			zIndex: 1
		}).add(item.legendGroup);

		// Set how much space this legend item takes up
		this.legendItemWidth = width + padding +
			(horiz ? itemDistance : labelPadding);
		this.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
	},
	/**
	 * Fool the legend
	 */
	setState: noop,
	visible: true,
	setVisible: noop,
	getSeriesExtremes: function () {
		var series = this.series,
			i = series.length;
		this.dataMin = Infinity;
		this.dataMax = -Infinity;
		while (i--) {
			if (series[i].valueMin !== undefined) {
				this.dataMin = Math.min(this.dataMin, series[i].valueMin);
				this.dataMax = Math.max(this.dataMax, series[i].valueMax);
			}
		}
	},
	drawCrosshair: function (e, point) {
		var plotX = point && point.plotX,
			plotY = point && point.plotY,
			crossPos,
			axisPos = this.pos,
			axisLen = this.len;

		if (point) {
			crossPos = this.toPixels(point[point.series.colorKey]);
			if (crossPos < axisPos) {
				crossPos = axisPos - 2;
			} else if (crossPos > axisPos + axisLen) {
				crossPos = axisPos + axisLen + 2;
			}

			point.plotX = crossPos;
			point.plotY = this.len - crossPos;
			Axis.prototype.drawCrosshair.call(this, e, point);
			point.plotX = plotX;
			point.plotY = plotY;

			if (this.cross) {
				this.cross
					.addClass('highcharts-coloraxis-marker')
					.add(this.legendGroup);

				/*= if (build.classic) { =*/
				this.cross.attr({
					fill: this.crosshair.color
				});
				/*= } =*/
					
			}
		}
	},
	getPlotLinePath: function (a, b, c, d, pos) {
		// crosshairs only
		return isNumber(pos) ? // pos can be 0 (#3969)
			(
				this.horiz ? [
					'M',
					pos - 4, this.top - 6,
					'L',
					pos + 4, this.top - 6,
					pos, this.top,
					'Z'
				] :	[
					'M',
					this.left, pos,
					'L',
					this.left - 6, pos + 6,
					this.left - 6, pos - 6,
					'Z'
				]
			) :
			Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
	},

	update: function (newOptions, redraw) {
		var chart = this.chart,
			legend = chart.legend;

		each(this.series, function (series) {
			// Needed for Axis.update when choropleth colors change
			series.isDirtyData = true;
		});

		// When updating data classes, destroy old items and make sure new ones
		// are created (#3207)
		if (newOptions.dataClasses && legend.allItems) {
			each(legend.allItems, function (item) {
				if (item.isDataClass && item.legendGroup) {
					item.legendGroup.destroy();
				}
			});
			chart.isDirtyLegend = true;
		}

		// Keep the options structure updated for export. Unlike xAxis and
		// yAxis, the colorAxis is not an array. (#3207)
		chart.options[this.coll] = merge(this.userOptions, newOptions);

		Axis.prototype.update.call(this, newOptions, redraw);
		if (this.legendItem) {
			this.setLegendColor();
			legend.colorizeItem(this, true);
		}
	},

	/**
	 * Extend basic axis remove by also removing the legend item.
	 */
	remove: function () {
		if (this.legendItem) {
			this.chart.legend.destroyItem(this);
		}
		Axis.prototype.remove.call(this);
	},

	/**
	 * Get the legend item symbols for data classes
	 */
	getDataClassLegendSymbols: function () {
		var axis = this,
			chart = this.chart,
			legendItems = this.legendItems,
			legendOptions = chart.options.legend,
			valueDecimals = legendOptions.valueDecimals,
			valueSuffix = legendOptions.valueSuffix || '',
			name;

		if (!legendItems.length) {
			each(this.dataClasses, function (dataClass, i) {
				var vis = true,
					from = dataClass.from,
					to = dataClass.to;

				// Assemble the default name. This can be overridden
				// by legend.options.labelFormatter
				name = '';
				if (from === undefined) {
					name = '< ';
				} else if (to === undefined) {
					name = '> ';
				}
				if (from !== undefined) {
					name += H.numberFormat(from, valueDecimals) + valueSuffix;
				}
				if (from !== undefined && to !== undefined) {
					name += ' - ';
				}
				if (to !== undefined) {
					name += H.numberFormat(to, valueDecimals) + valueSuffix;
				}
				// Add a mock object to the legend items
				legendItems.push(extend({
					chart: chart,
					name: name,
					options: {},
					drawLegendSymbol: LegendSymbolMixin.drawRectangle,
					visible: true,
					setState: noop,
					isDataClass: true,
					setVisible: function () {
						vis = this.visible = !vis;
						each(axis.series, function (series) {
							each(series.points, function (point) {
								if (point.dataClass === i) {
									point.setVisible(vis);
								}
							});
						});

						chart.legend.colorizeItem(this, vis);
					}
				}, dataClass));
			});
		}
		return legendItems;
	},
	name: '' // Prevents 'undefined' in legend in IE8
});

/**
 * Handle animation of the color attributes directly
 */
each(['fill', 'stroke'], function (prop) {
	H.Fx.prototype[prop + 'Setter'] = function () {
		this.elem.attr(
			prop,
			color(this.start).tweenTo(
				color(this.end),
				this.pos
			),
			null,
			true
		);
	};
});

/**
 * Extend the chart getAxes method to also get the color axis
 */
wrap(Chart.prototype, 'getAxes', function (proceed) {

	var options = this.options,
		colorAxisOptions = options.colorAxis;

	proceed.call(this);

	this.colorAxis = [];
	if (colorAxisOptions) {
		new ColorAxis(this, colorAxisOptions); // eslint-disable-line no-new
	}
});


/**
 * Wrap the legend getAllItems method to add the color axis. This also removes
 * the axis' own series to prevent them from showing up individually.
 */
wrap(Legend.prototype, 'getAllItems', function (proceed) {
	var allItems = [],
		colorAxis = this.chart.colorAxis[0];

	if (colorAxis && colorAxis.options) {
		if (colorAxis.options.showInLegend) {
			// Data classes
			if (colorAxis.options.dataClasses) {
				allItems = allItems.concat(
					colorAxis.getDataClassLegendSymbols()
				);
			// Gradient legend
			} else {
				// Add this axis on top
				allItems.push(colorAxis);
			}
		}

		// Don't add the color axis' series
		each(colorAxis.series, function (series) {
			series.options.showInLegend = false;
		});
	}

	return allItems.concat(proceed.call(this));
});

wrap(Legend.prototype, 'colorizeItem', function (proceed, item, visible) {
	proceed.call(this, item, visible);
	if (visible && item.legendColor) {
		item.legendSymbol.attr({
			fill: item.legendColor
		});
	}
});

// Updates in the legend need to be reflected in the color axis (6888)
wrap(Legend.prototype, 'update', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.colorAxis[0]) {
		this.chart.colorAxis[0].update({});
	}
});
