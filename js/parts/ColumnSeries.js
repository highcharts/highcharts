/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Color.js';
import './Legend.js';
import './Series.js';
import './Options.js';
var animObject = H.animObject,
	color = H.color,
	each = H.each,
	extend = H.extend,
	isNumber = H.isNumber,
	LegendSymbolMixin = H.LegendSymbolMixin,
	merge = H.merge,
	noop = H.noop,
	pick = H.pick,
	Series = H.Series,
	seriesType = H.seriesType,
	svg = H.svg;
/**
 * The column series type.
 *
 * @constructor seriesTypes.column
 * @augments Series
 */
seriesType('column', 'line', {
	borderRadius: 0,
	//colorByPoint: undefined,
	groupPadding: 0.2,
	//grouping: true,
	marker: null, // point options are specified in the base options
	pointPadding: 0.1,
	//pointWidth: null,
	minPointLength: 0,
	cropThreshold: 50, // when there are more points, they will not animate out of the chart on xAxis.setExtremes
	pointRange: null, // null means auto, meaning 1 in a categorized axis and least distance between points if not categories
	states: {
		hover: {
			halo: false,
			/*= if (build.classic) { =*/
			brightness: 0.1,
			shadow: false
			/*= } =*/
		},
		/*= if (build.classic) { =*/
		select: {
			color: '${palette.neutralColor20}',
			borderColor: '${palette.neutralColor100}',
			shadow: false
		}
		/*= } =*/
	},
	dataLabels: {
		align: null, // auto
		verticalAlign: null, // auto
		y: null
	},
	softThreshold: false,
	startFromThreshold: true, // false doesn't work well: http://jsfiddle.net/highcharts/hz8fopan/14/
	stickyTracking: false,
	tooltip: {
		distance: 6
	},
	threshold: 0,
	/*= if (build.classic) { =*/
	borderColor: '${palette.backgroundColor}'
	// borderWidth: 1
	/*= } =*/

}, /** @lends seriesTypes.column.prototype */ {
	cropShoulder: 0,
	directTouch: true, // When tooltip is not shared, this series (and derivatives) requires direct touch/hover. KD-tree does not apply.
	trackerGroups: ['group', 'dataLabelsGroup'],
	negStacks: true, // use separate negative stacks, unlike area stacks where a negative
		// point is substracted from previous (#1910)

	/**
	 * Initialize the series. Extends the basic Series.init method by
	 * marking other series of the same type as dirty.
	 *
	 * @function #init
	 * @memberOf seriesTypes.column
	 * @returns {void}
	 */
	init: function () {
		Series.prototype.init.apply(this, arguments);

		var series = this,
			chart = series.chart;

		// if the series is added dynamically, force redraw of other
		// series affected by a new column
		if (chart.hasRendered) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.type === series.type) {
					otherSeries.isDirty = true;
				}
			});
		}
	},

	/**
	 * Return the width and x offset of the columns adjusted for grouping, groupPadding, pointPadding,
	 * pointWidth etc.
	 */
	getColumnMetrics: function () {

		var series = this,
			options = series.options,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			reversedXAxis = xAxis.reversed,
			stackKey,
			stackGroups = {},
			columnCount = 0;

		// Get the total number of column type series.
		// This is called on every series. Consider moving this logic to a
		// chart.orderStacks() function and call it on init, addSeries and removeSeries
		if (options.grouping === false) {
			columnCount = 1;
		} else {
			each(series.chart.series, function (otherSeries) {
				var otherOptions = otherSeries.options,
					otherYAxis = otherSeries.yAxis,
					columnIndex;
				if (otherSeries.type === series.type && otherSeries.visible &&
						yAxis.len === otherYAxis.len && yAxis.pos === otherYAxis.pos) {  // #642, #2086
					if (otherOptions.stacking) {
						stackKey = otherSeries.stackKey;
						if (stackGroups[stackKey] === undefined) {
							stackGroups[stackKey] = columnCount++;
						}
						columnIndex = stackGroups[stackKey];
					} else if (otherOptions.grouping !== false) { // #1162
						columnIndex = columnCount++;
					}
					otherSeries.columnIndex = columnIndex;
				}
			});
		}

		var categoryWidth = Math.min(
				Math.abs(xAxis.transA) * (xAxis.ordinalSlope || options.pointRange || xAxis.closestPointRange || xAxis.tickInterval || 1), // #2610
				xAxis.len // #1535
			),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / (columnCount || 1),
			pointWidth = Math.min(
				options.maxPointWidth || xAxis.len,
				pick(options.pointWidth, pointOffsetWidth * (1 - 2 * options.pointPadding))
			),
			pointPadding = (pointOffsetWidth - pointWidth) / 2,
			colIndex = (series.columnIndex || 0) + (reversedXAxis ? 1 : 0), // #1251, #3737
			pointXOffset = pointPadding + (groupPadding + colIndex *
				pointOffsetWidth - (categoryWidth / 2)) *
				(reversedXAxis ? -1 : 1);

		// Save it for reading in linked series (Error bars particularly)
		series.columnMetrics = {
			width: pointWidth,
			offset: pointXOffset
		};
		return series.columnMetrics;

	},

	/**
	 * Make the columns crisp. The edges are rounded to the nearest full pixel.
	 */
	crispCol: function (x, y, w, h) {
		var chart = this.chart,
			borderWidth = this.borderWidth,
			xCrisp = -(borderWidth % 2 ? 0.5 : 0),
			yCrisp = borderWidth % 2 ? 0.5 : 1,
			right,
			bottom,
			fromTop;

		if (chart.inverted && chart.renderer.isVML) {
			yCrisp += 1;
		}

		// Horizontal. We need to first compute the exact right edge, then round it
		// and compute the width from there.
		right = Math.round(x + w) + xCrisp;
		x = Math.round(x) + xCrisp;
		w = right - x;

		// Vertical
		bottom = Math.round(y + h) + yCrisp;
		fromTop = Math.abs(y) <= 0.5 && bottom > 0.5; // #4504, #4656
		y = Math.round(y) + yCrisp;
		h = bottom - y;

		// Top edges are exceptions
		if (fromTop && h) { // #5146
			y -= 1;
			h += 1;
		}

		return {
			x: x,
			y: y,
			width: w,
			height: h
		};
	},

	/**
	 * Translate each point to the plot area coordinate system and find shape positions
	 */
	translate: function () {
		var series = this,
			chart = series.chart,
			options = series.options,
			dense = series.dense = series.closestPointRange * series.xAxis.transA < 2,
			borderWidth = series.borderWidth = pick(
				options.borderWidth, 
				dense ? 0 : 1  // #3635
			),
			yAxis = series.yAxis,
			threshold = options.threshold,
			translatedThreshold = series.translatedThreshold = yAxis.getThreshold(threshold),
			minPointLength = pick(options.minPointLength, 5),
			metrics = series.getColumnMetrics(),
			pointWidth = metrics.width,
			seriesBarW = series.barW = Math.max(pointWidth, 1 + 2 * borderWidth), // postprocessed for border width
			pointXOffset = series.pointXOffset = metrics.offset;

		if (chart.inverted) {
			translatedThreshold -= 0.5; // #3355
		}

		// When the pointPadding is 0, we want the columns to be packed tightly, so we allow individual
		// columns to have individual sizes. When pointPadding is greater, we strive for equal-width
		// columns (#2694).
		if (options.pointPadding) {
			seriesBarW = Math.ceil(seriesBarW);
		}

		Series.prototype.translate.apply(series);

		// Record the new values
		each(series.points, function (point) {
			var yBottom = pick(point.yBottom, translatedThreshold),
				safeDistance = 999 + Math.abs(yBottom),
				plotY = Math.min(Math.max(-safeDistance, point.plotY), yAxis.len + safeDistance), // Don't draw too far outside plot area (#1303, #2241, #4264)
				barX = point.plotX + pointXOffset,
				barW = seriesBarW,
				barY = Math.min(plotY, yBottom),
				up,
				barH = Math.max(plotY, yBottom) - barY;

			// Handle options.minPointLength
			if (Math.abs(barH) < minPointLength) {
				if (minPointLength) {
					barH = minPointLength;
					up = (!yAxis.reversed && !point.negative) || (yAxis.reversed && point.negative);
					barY = Math.abs(barY - translatedThreshold) > minPointLength ? // stacked
							yBottom - minPointLength : // keep position
							translatedThreshold - (up ? minPointLength : 0); // #1485, #4051
				}
			}

			// Cache for access in polar
			point.barX = barX;
			point.pointWidth = pointWidth;

			// Fix the tooltip on center of grouped columns (#1216, #424, #3648)
			point.tooltipPos = chart.inverted ?
				[yAxis.len + yAxis.pos - chart.plotLeft - plotY, series.xAxis.len - barX - barW / 2, barH] :
				[barX + barW / 2, plotY + yAxis.pos - chart.plotTop, barH];

			// Register shape type and arguments to be used in drawPoints
			point.shapeType = 'rect';
			point.shapeArgs = series.crispCol.apply(
				series,
				point.isNull ? 
					[point.plotX, yAxis.len / 2, 0, 0] : // #3169, drilldown from null must have a position to work from
					[barX, barY, barW, barH]
			);
		});

	},

	getSymbol: noop,

	/**
	 * Use a solid rectangle like the area series types
	 */
	drawLegendSymbol: LegendSymbolMixin.drawRectangle,


	/**
	 * Columns have no graph
	 */
	drawGraph: function () {
		this.group[this.dense ? 'addClass' : 'removeClass']('highcharts-dense-data');
	},

	/*= if (build.classic) { =*/
	/**
	 * Get presentational attributes
	 */
	pointAttribs: function (point, state) {
		var options = this.options,
			stateOptions,
			ret,
			p2o = this.pointAttrToOptions || {},
			strokeOption = p2o.stroke || 'borderColor',
			strokeWidthOption = p2o['stroke-width'] || 'borderWidth',
			fill = (point && point.color) || this.color,
			stroke = point[strokeOption] || options[strokeOption] ||
				this.color || fill, // set to fill when borderColor null
			strokeWidth = point[strokeWidthOption] || 
				options[strokeWidthOption] || this[strokeWidthOption] || 0,
			dashstyle = options.dashStyle,
			zone,
			brightness;
		
		// Handle zone colors
		if (point && this.zones.length) {
			zone = point.getZone();
			fill = (zone && zone.color) || point.options.color || this.color; // When zones are present, don't use point.color (#4267)
		}

		// Select or hover states
		if (state) {
			stateOptions = options.states[state];
			brightness = stateOptions.brightness;
			fill = stateOptions.color || 
				(brightness !== undefined && color(fill).brighten(stateOptions.brightness).get()) ||
				fill;
			stroke = stateOptions[strokeOption] || stroke;
			strokeWidth = stateOptions[strokeWidthOption] || strokeWidth;
			dashstyle = stateOptions.dashStyle || dashstyle;
		}

		ret = {
			'fill': fill,
			'stroke': stroke,
			'stroke-width': strokeWidth
		};
		if (options.borderRadius) {
			ret.r = options.borderRadius;
		}

		if (dashstyle) {
			ret.dashstyle = dashstyle;
		}

		return ret;
	},
	/*= } =*/

	/**
	 * Draw the columns. For bars, the series.group is rotated, so the same coordinates
	 * apply for columns and bars. This method is inherited by scatter series.
	 *
	 */
	drawPoints: function () {
		var series = this,
			chart = this.chart,
			options = series.options,
			renderer = chart.renderer,
			animationLimit = options.animationLimit || 250,
			shapeArgs;

		// draw the columns
		each(series.points, function (point) {
			var plotY = point.plotY,
				graphic = point.graphic;

			if (isNumber(plotY) && point.y !== null) {
				shapeArgs = point.shapeArgs;

				if (graphic) { // update
					graphic[chart.pointCount < animationLimit ? 'animate' : 'attr'](
						merge(shapeArgs)
					);

				} else {
					point.graphic = graphic = renderer[point.shapeType](shapeArgs)
						.attr({
							'class': point.getClassName()
						})
						.add(point.group || series.group);
				}

				/*= if (build.classic) { =*/
				// Presentational
				graphic
					.attr(series.pointAttribs(point, point.selected && 'select'))
					.shadow(options.shadow, null, options.stacking && !options.borderRadius);
				/*= } =*/

			} else if (graphic) {
				point.graphic = graphic.destroy(); // #1269
			}
		});
	},

	/**
	 * Animate the column heights one by one from zero
	 * @param {Boolean} init Whether to initialize the animation or run it
	 */
	animate: function (init) {
		var series = this,
			yAxis = this.yAxis,
			options = series.options,
			inverted = this.chart.inverted,
			attr = {},
			translatedThreshold;

		if (svg) { // VML is too slow anyway
			if (init) {
				attr.scaleY = 0.001;
				translatedThreshold = Math.min(yAxis.pos + yAxis.len, Math.max(yAxis.pos, yAxis.toPixels(options.threshold)));
				if (inverted) {
					attr.translateX = translatedThreshold - yAxis.len;
				} else {
					attr.translateY = translatedThreshold;
				}
				series.group.attr(attr);

			} else { // run the animation

				attr[inverted ? 'translateX' : 'translateY'] = yAxis.pos;
				series.group.animate(attr, extend(animObject(series.options.animation), {
					// Do the scale synchronously to ensure smooth updating (#5030)
					step: function (val, fx) {
						series.group.attr({
							scaleY: Math.max(0.001, fx.pos) // #5250
						});
					}
				}));

				// delete this function to allow it only once
				series.animate = null;
			}
		}
	},

	/**
	 * Remove this series from the chart
	 */
	remove: function () {
		var series = this,
			chart = series.chart;

		// column and bar series affects other series of the same type
		// as they are either stacked or grouped
		if (chart.hasRendered) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.type === series.type) {
					otherSeries.isDirty = true;
				}
			});
		}

		Series.prototype.remove.apply(series, arguments);
	}
});
