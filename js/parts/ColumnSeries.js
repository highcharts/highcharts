/**
 * Set the default options for column
 */
defaultPlotOptions.column = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
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
			brightness: 0.1,
			shadow: false
		},
		select: {
			color: '#C0C0C0',
			borderColor: '#000000',
			shadow: false
		}
	},
	dataLabels: {
		align: null, // auto
		verticalAlign: null, // auto
		y: null
	},
	stickyTracking: false,
	threshold: 0
});

/**
 * ColumnSeries object
 */
var ColumnSeries = extendClass(Series, {
	type: 'column',
	tooltipOutsidePlot: true,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color',
		r: 'borderRadius'
	},
	trackerGroups: ['group', 'dataLabelsGroup'],
	
	/**
	 * Initialize the series
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
			xAxis = this.xAxis,
			reversedXAxis = xAxis.reversed,
			stackKey,
			stackGroups = {},
			columnIndex,
			columnCount = 0;

		// Get the total number of column type series.
		// This is called on every series. Consider moving this logic to a
		// chart.orderStacks() function and call it on init, addSeries and removeSeries
		if (options.grouping === false) {
			columnCount = 1;
		} else {
			each(series.yAxis.series, function (otherSeries) { // use Y axes separately, #642
				var otherOptions = otherSeries.options;
				if (otherSeries.type === series.type && otherSeries.visible &&
						series.options.group === otherOptions.group) { // used in Stock charts navigator series
					if (otherOptions.stacking) {
						stackKey = otherSeries.stackKey;
						if (stackGroups[stackKey] === UNDEFINED) {
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

		var categoryWidth = mathMin(
				mathAbs(xAxis.transA) * (xAxis.ordinalSlope || options.pointRange || xAxis.closestPointRange || 1), 
				xAxis.len // #1535
			),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / columnCount,
			optionPointWidth = options.pointWidth,
			pointPadding = defined(optionPointWidth) ? (pointOffsetWidth - optionPointWidth) / 2 :
				pointOffsetWidth * options.pointPadding,
			pointWidth = pick(optionPointWidth, pointOffsetWidth - 2 * pointPadding), // exact point width, used in polar charts
			colIndex = (reversedXAxis ? 
				columnCount - (series.columnIndex || 0) : // #1251
				series.columnIndex) || 0,
			pointXOffset = pointPadding + (groupPadding + colIndex *
				pointOffsetWidth - (categoryWidth / 2)) *
				(reversedXAxis ? -1 : 1);

		// Save it for reading in linked series (Error bars particularly)
		return (series.columnMetrics = { 
			width: pointWidth, 
			offset: pointXOffset 
		});
			
	},

	/**
	 * Translate each point to the plot area coordinate system and find shape positions
	 */
	translate: function () {
		var series = this,
			chart = series.chart,
			options = series.options,
			borderWidth = options.borderWidth,
			yAxis = series.yAxis,
			threshold = options.threshold,
			translatedThreshold = series.translatedThreshold = yAxis.getThreshold(threshold),
			minPointLength = pick(options.minPointLength, 5),
			metrics = series.getColumnMetrics(),
			pointWidth = metrics.width,
			barW = series.barW = mathCeil(mathMax(pointWidth, 1 + 2 * borderWidth)), // rounded and postprocessed for border width
			pointXOffset = series.pointXOffset = metrics.offset;

		Series.prototype.translate.apply(series);

		// record the new values
		each(series.points, function (point) {
			var plotY = mathMin(mathMax(-999, point.plotY), yAxis.len + 999), // Don't draw too far outside plot area (#1303)
				yBottom = pick(point.yBottom, translatedThreshold),
				barX = point.plotX + pointXOffset,
				barY = mathCeil(mathMin(plotY, yBottom)),
				barH = mathCeil(mathMax(plotY, yBottom) - barY),
				shapeArgs;

			// handle options.minPointLength
			if (mathAbs(barH) < minPointLength) {
				if (minPointLength) {
					barH = minPointLength;
					barY =
						mathRound(mathAbs(barY - translatedThreshold) > minPointLength ? // stacked
							yBottom - minPointLength : // keep position
							translatedThreshold - (yAxis.translate(point.y, 0, 1, 0, 1) <= translatedThreshold ? minPointLength : 0)); // use exact yAxis.translation (#1485)
				}
			}

			point.barX = barX;
			point.pointWidth = pointWidth;

			// create shape type and shape args that are reused in drawPoints and drawTracker
			point.shapeType = 'rect';
			point.shapeArgs = shapeArgs = chart.renderer.Element.prototype.crisp.call(0, borderWidth, barX, barY, barW, barH); 
			
			if (borderWidth % 2) { // correct for shorting in crisp method, visible in stacked columns with 1px border
				shapeArgs.y -= 1;
				shapeArgs.height += 1;
			}

		});

	},

	getSymbol: noop,
	
	/**
	 * Use a solid rectangle like the area series types
	 */
	drawLegendSymbol: AreaSeries.prototype.drawLegendSymbol,
	
	
	/**
	 * Columns have no graph
	 */
	drawGraph: noop,

	/**
	 * Draw the columns. For bars, the series.group is rotated, so the same coordinates
	 * apply for columns and bars. This method is inherited by scatter series.
	 *
	 */
	drawPoints: function () {
		var series = this,
			options = series.options,
			renderer = series.chart.renderer,
			shapeArgs;


		// draw the columns
		each(series.points, function (point) {
			var plotY = point.plotY,
				graphic = point.graphic;

			if (plotY !== UNDEFINED && !isNaN(plotY) && point.y !== null) {
				shapeArgs = point.shapeArgs;
				
				if (graphic) { // update
					stop(graphic);
					graphic.animate(merge(shapeArgs));

				} else {
					point.graphic = graphic = renderer[point.shapeType](shapeArgs)
						.attr(point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE])
						.add(series.group)
						.shadow(options.shadow, null, options.stacking && !options.borderRadius);
				}

			} else if (graphic) {
				point.graphic = graphic.destroy(); // #1269
			}
		});
	},

	/**
	 * Add tracking event listener to the series group, so the point graphics
	 * themselves act as trackers
	 */
	drawTracker: function () {
		var series = this,
			chart = series.chart,
			pointer = chart.pointer,
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			onMouseOver = function (e) {
				var target = e.target,
					point;

				if (chart.hoverSeries !== series) {
					series.onMouseOver();
				}
				while (target && !point) {
					point = target.point;
					target = target.parentNode;
				}
				if (point !== UNDEFINED && point !== chart.hoverPoint) { // undefined on graph in scatterchart
					point.onMouseOver(e);
				}
			};

		// Add reference to the point
		each(series.points, function (point) {
			if (point.graphic) {
				point.graphic.element.point = point;
			}
			if (point.dataLabel) {
				point.dataLabel.element.point = point;
			}
		});

		// Add the event listeners, we need to do this only once
		if (!series._hasTracking) {
			each(series.trackerGroups, function (key) {
				if (series[key]) { // we don't always have dataLabelsGroup
					series[key]
						.addClass(PREFIX + 'tracker')
						.on('mouseover', onMouseOver)
						.on('mouseout', function (e) { pointer.onTrackerMouseOut(e); })
						.css(css);
					if (hasTouch) {
						series[key].on('touchstart', onMouseOver);
					}
				}
			});
			
		} else {
			series._hasTracking = true;
		}
	},
	
	/** 
	 * Override the basic data label alignment by adjusting for the position of the column
	 */
	alignDataLabel: function (point, dataLabel, options,  alignTo, isNew) {
		var chart = this.chart,
			inverted = chart.inverted,
			dlBox = point.dlBox || point.shapeArgs, // data label box for alignment
			below = point.below || (point.plotY > pick(this.translatedThreshold, chart.plotSizeY)),
			inside = pick(options.inside, !!this.options.stacking); // draw it inside the box?
		
		// Align to the column itself, or the top of it
		if (dlBox) { // Area range uses this method but not alignTo
			alignTo = merge(dlBox);
			if (inverted) {
				alignTo = {
					x: chart.plotWidth - alignTo.y - alignTo.height,
					y: chart.plotHeight - alignTo.x - alignTo.width,
					width: alignTo.height,
					height: alignTo.width
				};
			}
				
			// Compute the alignment box
			if (!inside) {
				if (inverted) {
					alignTo.x += below ? 0 : alignTo.width;
					alignTo.width = 0;
				} else {
					alignTo.y += below ? alignTo.height : 0;
					alignTo.height = 0;
				}
			}
		}
		
		// When alignment is undefined (typically columns and bars), display the individual 
		// point below or above the point depending on the threshold
		options.align = pick(
			options.align, 
			!inverted || inside ? 'center' : below ? 'right' : 'left'
		);
		options.verticalAlign = pick(
			options.verticalAlign, 
			inverted || inside ? 'middle' : below ? 'top' : 'bottom'
		);
		
		// Call the parent method
		Series.prototype.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
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

		if (hasSVG) { // VML is too slow anyway
			if (init) {
				attr.scaleY = 0.001;
				translatedThreshold = mathMin(yAxis.pos + yAxis.len, mathMax(yAxis.pos, yAxis.toPixels(options.threshold)));
				if (inverted) {
					attr.translateX = translatedThreshold - yAxis.len;
				} else {
					attr.translateY = translatedThreshold;
				}
				series.group.attr(attr);

			} else { // run the animation
				
				attr.scaleY = 1;
				attr[inverted ? 'translateX' : 'translateY'] = yAxis.pos;
				series.group.animate(attr, series.options.animation);

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
seriesTypes.column = ColumnSeries;
