/**
 * ColumnSeries object
 */
var ColumnSeries = extendClass(Series, {
	type: 'column',
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color',
		r: 'borderRadius'
	},
	init: function () {
		Series.prototype.init.apply(this, arguments);

		var series = this,
			chart = series.chart;

		// flag the chart in order to pad the x axis
		chart.hasColumn = true;

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
	 * Translate each point to the plot area coordinate system and find shape positions
	 */
	translate: function () {
		var series = this,
			chart = series.chart,
			options = series.options,
			stacking = options.stacking,
			borderWidth = options.borderWidth,
			columnCount = 0,
			reversedXAxis = series.xAxis.reversed,
			categories = series.xAxis.categories,
			stackGroups = {},
			stackKey,
			columnIndex;

		Series.prototype.translate.apply(series);

		// Get the total number of column type series.
		// This is called on every series. Consider moving this logic to a
		// chart.orderStacks() function and call it on init, addSeries and removeSeries
		each(chart.series, function (otherSeries) {
			if (otherSeries.type === series.type && otherSeries.visible) {
				if (otherSeries.options.stacking) {
					stackKey = otherSeries.stackKey;
					if (stackGroups[stackKey] === UNDEFINED) {
						stackGroups[stackKey] = columnCount++;
					}
					columnIndex = stackGroups[stackKey];
				} else {
					columnIndex = columnCount++;
				}
				otherSeries.columnIndex = columnIndex;
			}
		});

		// calculate the width and position of each column based on
		// the number of column series in the plot, the groupPadding
		// and the pointPadding options
		var data = series.data,
			closestPoints = series.closestPoints,
			categoryWidth = mathAbs(
				data[1] ? data[closestPoints].plotX - data[closestPoints - 1].plotX :
				chart.plotSizeX / ((categories && categories.length) || 1)
			),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / columnCount,
			optionPointWidth = options.pointWidth,
			pointPadding = defined(optionPointWidth) ? (pointOffsetWidth - optionPointWidth) / 2 :
				pointOffsetWidth * options.pointPadding,
			pointWidth = mathMax(pick(optionPointWidth, pointOffsetWidth - 2 * pointPadding), 1),
			colIndex = (reversedXAxis ? columnCount -
				series.columnIndex : series.columnIndex) || 0,
			pointXOffset = pointPadding + (groupPadding + colIndex *
				pointOffsetWidth - (categoryWidth / 2)) *
				(reversedXAxis ? -1 : 1),
			threshold = options.threshold || 0,
			translatedThreshold = series.yAxis.getThreshold(threshold),
			minPointLength = pick(options.minPointLength, 5);

		// record the new values
		each(data, function (point) {
			var plotY = point.plotY,
				yBottom = point.yBottom || translatedThreshold,
				barX = point.plotX + pointXOffset,
				barY = mathCeil(mathMin(plotY, yBottom)),
				barH = mathCeil(mathMax(plotY, yBottom) - barY),
				stack = series.yAxis.stacks[(point.y < 0 ? '-' : '') + series.stackKey],
				trackerY,
				shapeArgs;

			// Record the offset'ed position and width of the bar to be able to align the stacking total correctly
			if (stacking && series.visible && stack && stack[point.x]) {
				stack[point.x].setOffset(pointXOffset, pointWidth);
			}

			// handle options.minPointLength and tracker for small points
			if (mathAbs(barH) < minPointLength) {
				if (minPointLength) {
					barH = minPointLength;
					barY =
						mathAbs(barY - translatedThreshold) > minPointLength ? // stacked
							yBottom - minPointLength : // keep position
							translatedThreshold - (plotY <= translatedThreshold ? minPointLength : 0);
				}
				trackerY = barY - 3;
			}

			extend(point, {
				barX: barX,
				barY: barY,
				barW: pointWidth,
				barH: barH
			});

			// create shape type and shape args that are reused in drawPoints and drawTracker
			point.shapeType = 'rect';
			shapeArgs = extend(chart.renderer.Element.prototype.crisp.apply({}, [
				borderWidth,
				barX,
				barY,
				pointWidth,
				barH
			]), {
				r: options.borderRadius
			});
			if (borderWidth % 2) { // correct for shorting in crisp method, visible in stacked columns with 1px border
				shapeArgs.y -= 1;
				shapeArgs.height += 1;
			}
			point.shapeArgs = shapeArgs;

			// make small columns responsive to mouse
			point.trackerArgs = defined(trackerY) && merge(point.shapeArgs, {
				height: mathMax(6, barH + 3),
				y: trackerY
			});
		});

	},

	getSymbol: function () {
	},

	/**
	 * Columns have no graph
	 */
	drawGraph: function () {},

	/**
	 * Draw the columns. For bars, the series.group is rotated, so the same coordinates
	 * apply for columns and bars. This method is inherited by scatter series.
	 *
	 */
	drawPoints: function () {
		var series = this,
			options = series.options,
			renderer = series.chart.renderer,
			graphic,
			shapeArgs;


		// draw the columns
		each(series.data, function (point) {
			var plotY = point.plotY;
			if (plotY !== UNDEFINED && !isNaN(plotY) && point.y !== null) {
				graphic = point.graphic;
				shapeArgs = point.shapeArgs;
				if (graphic) { // update
					stop(graphic);
					graphic.animate(shapeArgs);

				} else {
					point.graphic = renderer[point.shapeType](shapeArgs)
						.attr(point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE])
						.add(series.group)
						.shadow(options.shadow);
				}

			}
		});
	},
	/**
	 * Draw the individual tracker elements.
	 * This method is inherited by scatter and pie charts too.
	 */
	drawTracker: function () {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			shapeArgs,
			tracker,
			trackerLabel = +new Date(),
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			rel;

		each(series.data, function (point) {
			tracker = point.tracker;
			shapeArgs = point.trackerArgs || point.shapeArgs;
			delete shapeArgs.strokeWidth;
			if (point.y !== null) {
				if (tracker) {// update
					tracker.attr(shapeArgs);

				} else {
					point.tracker =
						renderer[point.shapeType](shapeArgs)
						.attr({
							isTracker: trackerLabel,
							fill: TRACKER_FILL,
							visibility: series.visible ? VISIBLE : HIDDEN,
							zIndex: 1
						})
						.on(hasTouch ? 'touchstart' : 'mouseover', function (event) {
							rel = event.relatedTarget || event.fromElement;
							if (chart.hoverSeries !== series && attr(rel, 'isTracker') !== trackerLabel) {
								series.onMouseOver();
							}
							point.onMouseOver();

						})
						.on('mouseout', function (event) {
							if (!series.options.stickyTracking) {
								rel = event.relatedTarget || event.toElement;
								if (attr(rel, 'isTracker') !== trackerLabel) {
									series.onMouseOut();
								}
							}
						})
						.css(css)
						.add(point.group || chart.trackerGroup); // pies have point group - see issue #118
				}
			}
		});
	},


	/**
	 * Animate the column heights one by one from zero
	 * @param {Boolean} init Whether to initialize the animation or run it
	 */
	animate: function (init) {
		var series = this,
			data = series.data;

		if (!init) { // run the animation
			/*
			 * Note: Ideally the animation should be initialized by calling
			 * series.group.hide(), and then calling series.group.show()
			 * after the animation was started. But this rendered the shadows
			 * invisible in IE8 standards mode. If the columns flicker on large
			 * datasets, this is the cause.
			 */

			each(data, function (point) {
				var graphic = point.graphic,
					shapeArgs = point.shapeArgs;

				if (graphic) {
					// start values
					graphic.attr({
						height: 0,
						y: series.yAxis.translate(0, 0, 1)
					});

					// animate
					graphic.animate({
						height: shapeArgs.height,
						y: shapeArgs.y
					}, series.options.animation);
				}
			});


			// delete this function to allow it only once
			series.animate = null;
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
