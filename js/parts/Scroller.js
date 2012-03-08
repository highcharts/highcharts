
// constants
var MOUSEDOWN = hasTouch ? 'touchstart' : 'mousedown',
	MOUSEMOVE = hasTouch ? 'touchmove' : 'mousemove',
	MOUSEUP = hasTouch ? 'touchend' : 'mouseup';




/* ****************************************************************************
 * Start Scroller code														*
 *****************************************************************************/
/*jslint white:true */
var buttonGradient = hash(
		LINEAR_GRADIENT, { x1: 0, y1: 0, x2: 0, y2: 1 },
		STOPS, [
			[0, '#FFF'],
			[1, '#CCC']
		]
	),
	units = [].concat(defaultDataGroupingUnits); // copy

// add more resolution to units
units[4] = [DAY, [1, 2, 3, 4]]; // allow more days
units[5] = [WEEK, [1, 2, 3]]; // allow more weeks

extend(defaultOptions, {
	navigator: {
		//enabled: true,
		handles: {
			backgroundColor: '#FFF',
			borderColor: '#666'
		},
		height: 40,
		margin: 10,
		maskFill: 'rgba(255, 255, 255, 0.75)',
		outlineColor: '#444',
		outlineWidth: 1,
		series: {
			type: 'areaspline',
			color: '#4572A7',
			compare: null,
			fillOpacity: 0.4,
			dataGrouping: {
				approximation: 'average',
				groupPixelWidth: 2,
				smoothed: true,
				units: units
			},
			dataLabels: {
				enabled: false
			},
			id: PREFIX + 'navigator-series',
			lineColor: '#4572A7',
			lineWidth: 1,
			marker: {
				enabled: false
			},
			pointRange: 0,
			shadow: false
		},
		//top: undefined, // docs
		xAxis: {
			tickWidth: 0,
			lineWidth: 0,
			gridLineWidth: 1,
			tickPixelInterval: 200,
			labels: {
				align: 'left',
				x: 3,
				y: -4
			}
		},
		yAxis: {
			gridLineWidth: 0,
			startOnTick: false,
			endOnTick: false,
			minPadding: 0.1,
			maxPadding: 0.1,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			tickWidth: 0
		}
	},
	scrollbar: {
		//enabled: true
		height: hasTouch ? 20 : 14,
		barBackgroundColor: buttonGradient,
		barBorderRadius: 2,
		barBorderWidth: 1,
		barBorderColor: '#666',
		buttonArrowColor: '#666',
		buttonBackgroundColor: buttonGradient,
		buttonBorderColor: '#666',
		buttonBorderRadius: 2,
		buttonBorderWidth: 1,
		rifleColor: '#666',
		trackBackgroundColor: hash(
			LINEAR_GRADIENT, { x1: 0, y1: 0, x2: 0, y2: 1 },
			STOPS, [
				[0, '#EEE'],
				[1, '#FFF']
			]
		),
		trackBorderColor: '#CCC',
		trackBorderWidth: 1
		// trackBorderRadius: 0
	}
});
/*jslint white:false */

/**
 * The Scroller class
 * @param {Object} chart
 */
Highcharts.Scroller = function (chart) {

	var renderer = chart.renderer,
		chartOptions = chart.options,
		navigatorOptions = chartOptions.navigator,
		navigatorEnabled = navigatorOptions.enabled,
		navigatorLeft,
		navigatorWidth,
		navigatorSeries,
		navigatorData,
		scrollbarOptions = chartOptions.scrollbar,
		scrollbarEnabled = scrollbarOptions.enabled,
		grabbedLeft,
		grabbedRight,
		grabbedCenter,
		otherHandlePos,
		dragOffset,
		hasDragged,
		xAxis,
		yAxis,
		zoomedMin,
		zoomedMax,
		range,

		bodyStyle = document.body.style,
		defaultBodyCursor,

		handlesOptions = navigatorOptions.handles,
		height = navigatorEnabled ? navigatorOptions.height : 0,
		outlineWidth = navigatorOptions.outlineWidth,
		scrollbarHeight = scrollbarEnabled ? scrollbarOptions.height : 0,
		outlineHeight = height + scrollbarHeight,
		barBorderRadius = scrollbarOptions.barBorderRadius,
		top,
		halfOutline = outlineWidth / 2,
		outlineTop,
		scrollerLeft,
		scrollerWidth,
		rendered,
		baseSeriesOption = navigatorOptions.baseSeries,
		baseSeries = chart.series[baseSeriesOption] ||
			(typeof baseSeriesOption === 'string' && chart.get(baseSeriesOption)) ||
			chart.series[0],

		// element wrappers
		leftShade,
		rightShade,
		outline,
		handles = [],
		scrollbarGroup,
		scrollbarTrack,
		scrollbar,
		scrollbarRifles,
		scrollbarButtons = [],
		elementsToDestroy = []; // Array containing the elements to destroy when Scroller is destroyed

	chart.resetZoomEnabled = false;

	/**
	 * Return the top of the navigation 
	 */
	function getAxisTop(chartHeight) {
		return navigatorOptions.top || chartHeight - height - scrollbarHeight - chartOptions.chart.spacingBottom;
	}

	/**
	 * Draw one of the handles on the side of the zoomed range in the navigator
	 * @param {Number} x The x center for the handle
	 * @param {Number} index 0 for left and 1 for right
	 */
	function drawHandle(x, index) {

		var attr = {
				fill: handlesOptions.backgroundColor,
				stroke: handlesOptions.borderColor,
				'stroke-width': 1
			},
			tempElem;

		// create the elements
		if (!rendered) {

			// the group
			handles[index] = renderer.g()
				.css({ cursor: 'e-resize' })
				.attr({ zIndex: 4 - index }) // zIndex = 3 for right handle, 4 for left
				.add();

			// the rectangle
			tempElem = renderer.rect(-4.5, 0, 9, 16, 3, 1)
				.attr(attr)
				.add(handles[index]);
			elementsToDestroy.push(tempElem);

			// the rifles
			tempElem = renderer.path([
					'M',
					-1.5, 4,
					'L',
					-1.5, 12,
					'M',
					0.5, 4,
					'L',
					0.5, 12
				]).attr(attr)
				.add(handles[index]);
			elementsToDestroy.push(tempElem);
		}

		handles[index].translate(scrollerLeft + scrollbarHeight + parseInt(x, 10), top + height / 2 - 8);
	}

	/**
	 * Draw the scrollbar buttons with arrows
	 * @param {Number} index 0 is left, 1 is right
	 */
	function drawScrollbarButton(index) {
		var tempElem;
		if (!rendered) {

			scrollbarButtons[index] = renderer.g().add(scrollbarGroup);

			tempElem = renderer.rect(
				-0.5,
				-0.5,
				scrollbarHeight + 1, // +1 to compensate for crispifying in rect method
				scrollbarHeight + 1,
				scrollbarOptions.buttonBorderRadius,
				scrollbarOptions.buttonBorderWidth
			).attr({
				stroke: scrollbarOptions.buttonBorderColor,
				'stroke-width': scrollbarOptions.buttonBorderWidth,
				fill: scrollbarOptions.buttonBackgroundColor
			}).add(scrollbarButtons[index]);
			elementsToDestroy.push(tempElem);

			tempElem = renderer.path([
				'M',
				scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 - 3,
				'L',
				scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 + 3,
				scrollbarHeight / 2 + (index ? 2 : -2), scrollbarHeight / 2
			]).attr({
				fill: scrollbarOptions.buttonArrowColor
			}).add(scrollbarButtons[index]);
			elementsToDestroy.push(tempElem);
		}

		// adjust the right side button to the varying length of the scroll track
		if (index) {
			scrollbarButtons[index].attr({
				translateX: scrollerWidth - scrollbarHeight
			});
		}
	}

	/**
	 * Render the navigator and scroll bar
	 * @param {Number} min X axis value minimum
	 * @param {Number} max X axis value maximum
	 * @param {Number} pxMin Pixel value minimum
	 * @param {Number} pxMax Pixel value maximum
	 */
	function render(min, max, pxMin, pxMax) {

		// don't render the navigator until we have data (#486)
		if (isNaN(min)) {
			return;
		}

		var strokeWidth,
			scrollbarStrokeWidth = scrollbarOptions.barBorderWidth,
			centerBarX;

		outlineTop = top + halfOutline;
		navigatorLeft = pick(
			xAxis.left,
			chart.plotLeft + scrollbarHeight // in case of scrollbar only, without navigator
		);
		navigatorWidth = pick(xAxis.len, chart.plotWidth - 2 * scrollbarHeight);
		scrollerLeft = navigatorLeft - scrollbarHeight;
		scrollerWidth = navigatorWidth + 2 * scrollbarHeight;

		// Set the scroller x axis extremes to reflect the total. The navigator extremes
		// should always be the extremes of the union of all series in the chart as
		// well as the navigator series.
		if (xAxis.getExtremes) {
			var baseExtremes = chart.xAxis[0].getExtremes(), // the base
				noBase = baseExtremes.dataMin === null,
				navExtremes = xAxis.getExtremes(),
				newMin = mathMin(baseExtremes.dataMin, navExtremes.dataMin),
				newMax = mathMax(baseExtremes.dataMax, navExtremes.dataMax);

			if (!noBase && (newMin !== navExtremes.min || newMax !== navExtremes.max)) {
				xAxis.setExtremes(newMin, newMax, true, false);
			}
		}

		// get the pixel position of the handles
		pxMin = pick(pxMin, xAxis.translate(min));
		pxMax = pick(pxMax, xAxis.translate(max));


		// handles are allowed to cross
		zoomedMin = pInt(mathMin(pxMin, pxMax));
		zoomedMax = pInt(mathMax(pxMin, pxMax));
		range = zoomedMax - zoomedMin;

		// on first render, create all elements
		if (!rendered) {

			if (navigatorEnabled) {

				leftShade = renderer.rect()
					.attr({
						fill: navigatorOptions.maskFill,
						zIndex: 3
					}).add();
				rightShade = renderer.rect()
					.attr({
						fill: navigatorOptions.maskFill,
						zIndex: 3
					}).add();
				outline = renderer.path()
					.attr({
						'stroke-width': outlineWidth,
						stroke: navigatorOptions.outlineColor,
						zIndex: 3
					})
					.add();
			}

			if (scrollbarEnabled) {

				// draw the scrollbar group
				scrollbarGroup = renderer.g().add();

				// the scrollbar track
				strokeWidth = scrollbarOptions.trackBorderWidth;
				scrollbarTrack = renderer.rect().attr({
					y: -strokeWidth % 2 / 2,
					fill: scrollbarOptions.trackBackgroundColor,
					stroke: scrollbarOptions.trackBorderColor,
					'stroke-width': strokeWidth,
					r: scrollbarOptions.trackBorderRadius || 0,
					height: scrollbarHeight
				}).add(scrollbarGroup);

				// the scrollbar itself
				scrollbar = renderer.rect()
					.attr({
						y: -scrollbarStrokeWidth % 2 / 2,
						height: scrollbarHeight,
						fill: scrollbarOptions.barBackgroundColor,
						stroke: scrollbarOptions.barBorderColor,
						'stroke-width': scrollbarStrokeWidth,
						r: barBorderRadius
					})
					.add(scrollbarGroup);

				scrollbarRifles = renderer.path()
					.attr({
						stroke: scrollbarOptions.rifleColor,
						'stroke-width': 1
					})
					.add(scrollbarGroup);
			}
		}

		// place elements
		if (navigatorEnabled) {
			leftShade.attr({
				x: navigatorLeft,
				y: top,
				width: zoomedMin,
				height: height
			});
			rightShade.attr({
				x: navigatorLeft + zoomedMax,
				y: top,
				width: navigatorWidth - zoomedMax,
				height: height
			});
			outline.attr({ d: [
				M,
				scrollerLeft, outlineTop, // left
				L,
				navigatorLeft + zoomedMin + halfOutline, outlineTop, // upper left of zoomed range
				navigatorLeft + zoomedMin + halfOutline, outlineTop + outlineHeight - scrollbarHeight, // lower left of z.r.
				M,
				navigatorLeft + zoomedMax - halfOutline, outlineTop + outlineHeight - scrollbarHeight, // lower right of z.r.
				L,
				navigatorLeft + zoomedMax - halfOutline, outlineTop, // upper right of z.r.
				scrollerLeft + scrollerWidth, outlineTop // right
			]});
			// draw handles
			drawHandle(zoomedMin + halfOutline, 0);
			drawHandle(zoomedMax + halfOutline, 1);
		}

		// draw the scrollbar
		if (scrollbarEnabled) {

			// draw the buttons
			drawScrollbarButton(0);
			drawScrollbarButton(1);

			scrollbarGroup.translate(scrollerLeft, mathRound(outlineTop + height));

			scrollbarTrack.attr({
				width: scrollerWidth
			});

			scrollbar.attr({
				x: mathRound(scrollbarHeight + zoomedMin) + (scrollbarStrokeWidth % 2 / 2),
				width: range - scrollbarStrokeWidth
			});

			centerBarX = scrollbarHeight + zoomedMin + range / 2 - 0.5;

			scrollbarRifles.attr({ d: [
					M,
					centerBarX - 3, scrollbarHeight / 4,
					L,
					centerBarX - 3, 2 * scrollbarHeight / 3,
					M,
					centerBarX, scrollbarHeight / 4,
					L,
					centerBarX, 2 * scrollbarHeight / 3,
					M,
					centerBarX + 3, scrollbarHeight / 4,
					L,
					centerBarX + 3, 2 * scrollbarHeight / 3
				],
				visibility: range > 12 ? VISIBLE : HIDDEN
			});
		}

		rendered = true;
	}

	/**
	 * Event handler for the mouse down event.
	 */
	function mouseDownHandler(e) {
		e = chart.tracker.normalizeMouseEvent(e);
		var chartX = e.chartX,
			chartY = e.chartY,
			handleSensitivity = hasTouch ? 10 : 7,
			left,
			isOnNavigator;

		if (chartY > top && chartY < top + height + scrollbarHeight) { // we're vertically inside the navigator
			isOnNavigator = !scrollbarEnabled || chartY < top + height;

			// grab the left handle
			if (isOnNavigator && math.abs(chartX - zoomedMin - navigatorLeft) < handleSensitivity) {
				grabbedLeft = true;
				otherHandlePos = zoomedMax;

			// grab the right handle
			} else if (isOnNavigator && math.abs(chartX - zoomedMax - navigatorLeft) < handleSensitivity) {
				grabbedRight = true;
				otherHandlePos = zoomedMin;

			// grab the zoomed range
			} else if (chartX > navigatorLeft + zoomedMin && chartX < navigatorLeft + zoomedMax) {
				grabbedCenter = chartX;
				defaultBodyCursor = bodyStyle.cursor;
				bodyStyle.cursor = 'ew-resize';

				dragOffset = chartX - zoomedMin;

			// shift the range by clicking on shaded areas, scrollbar track or scrollbar buttons
			} else if (chartX > scrollerLeft && chartX < scrollerLeft + scrollerWidth) {

				if (isOnNavigator) { // center around the clicked point
					left = chartX - navigatorLeft - range / 2;
				} else { // click on scrollbar
					if (chartX < navigatorLeft) { // click left scrollbar button
						left = zoomedMin - mathMin(10, range);
					} else if (chartX > scrollerLeft + scrollerWidth - scrollbarHeight) {
						left = zoomedMin + mathMin(10, range);
					} else {
						// click on scrollbar track, shift the scrollbar by one range
						left = chartX < navigatorLeft + zoomedMin ? // on the left
							zoomedMin - range :
							zoomedMax;
					}
				}
				if (left < 0) {
					left = 0;
				} else if (left + range > navigatorWidth) {
					left = navigatorWidth - range;
				}
				if (left !== zoomedMin) { // it has actually moved
					chart.xAxis[0].setExtremes(
						xAxis.translate(left, true),
						xAxis.translate(left + range, true),
						true,
						false
					);
				}
			}
		}
		
	}

	/**
	 * Event handler for the mouse move event.
	 */
	function mouseMoveHandler(e) {
		e = chart.tracker.normalizeMouseEvent(e);
		var chartX = e.chartX;

		// validation for handle dragging
		if (chartX < navigatorLeft) {
			chartX = navigatorLeft;
		} else if (chartX > scrollerLeft + scrollerWidth - scrollbarHeight) {
			chartX = scrollerLeft + scrollerWidth - scrollbarHeight;
		}

		// drag left handle
		if (grabbedLeft) {
			hasDragged = true;
			render(0, 0, chartX - navigatorLeft, otherHandlePos);

		// drag right handle
		} else if (grabbedRight) {
			hasDragged = true;
			render(0, 0, otherHandlePos, chartX - navigatorLeft);

		// drag scrollbar or open area in navigator
		} else if (grabbedCenter) {
			hasDragged = true;
			if (chartX < dragOffset) { // outside left
				chartX = dragOffset;
			} else if (chartX > navigatorWidth + dragOffset - range) { // outside right
				chartX = navigatorWidth + dragOffset - range;
			}

			render(0, 0, chartX - dragOffset, chartX - dragOffset + range);
		}
	}

	/**
	 * Event handler for the mouse up event.
	 */
	function mouseUpHandler() {
		if (hasDragged) {
				chart.xAxis[0].setExtremes(
					xAxis.translate(zoomedMin, true),
					xAxis.translate(zoomedMax, true),
					true,
					false
				);
			}
			grabbedLeft = grabbedRight = grabbedCenter = hasDragged = dragOffset = null;
			bodyStyle.cursor = defaultBodyCursor;
	}

	function updatedDataHandler() {
		var baseXAxis = baseSeries.xAxis,
			baseExtremes = baseXAxis.getExtremes(),
			baseMin = baseExtremes.min,
			baseMax = baseExtremes.max,
			baseDataMin = baseExtremes.dataMin,
			baseDataMax = baseExtremes.dataMax,
			range = baseMax - baseMin,
			stickToMin,
			stickToMax,
			newMax,
			newMin,
			doRedraw,
			navXData = navigatorSeries.xData,
			hasSetExtremes = !!baseXAxis.setExtremes;

		// detect whether to move the range
		stickToMax = baseMax >= navXData[navXData.length - 1];
		stickToMin = baseMin <= baseDataMin;

		// set the navigator series data to the new data of the base series
		if (!navigatorData) {
			navigatorSeries.options.pointStart = baseSeries.xData[0];
			navigatorSeries.setData(baseSeries.options.data, false);
			doRedraw = true;
		}

		// if the zoomed range is already at the min, move it to the right as new data
		// comes in
		if (stickToMin) {
			newMin = baseDataMin;
			newMax = newMin + range;
		}

		// if the zoomed range is already at the max, move it to the right as new data
		// comes in
		if (stickToMax) {
			newMax = baseDataMax;
			if (!stickToMin) { // if stickToMin is true, the new min value is set above
				newMin = mathMax(newMax - range, navigatorSeries.xData[0]);
			}
		}

		// update the extremes
		if (hasSetExtremes && (stickToMin || stickToMax)) {
			baseXAxis.setExtremes(newMin, newMax, true, false);
		// if it is not at any edge, just move the scroller window to reflect the new series data
		} else {
			if (doRedraw) {
				chart.redraw(false);
			}

			render(
				mathMax(baseMin, baseDataMin),
				mathMin(baseMax, baseDataMax)
			);
		}
	}

	/**
	 * Set up the mouse and touch events for the navigator and scrollbar
	 */
	function addEvents() {
		addEvent(chart.container, MOUSEDOWN, mouseDownHandler);
		addEvent(chart.container, MOUSEMOVE, mouseMoveHandler);
		addEvent(document, MOUSEUP, mouseUpHandler);
	}

	/**
	 * Removes the event handlers attached previously with addEvents.
	 */
	function removeEvents() {
		removeEvent(chart.container, MOUSEDOWN, mouseDownHandler);
		removeEvent(chart.container, MOUSEMOVE, mouseMoveHandler);
		removeEvent(document, MOUSEUP, mouseUpHandler);
		if (navigatorEnabled) {
			removeEvent(baseSeries, 'updatedData', updatedDataHandler);
		}
	}

	/**
	 * Initiate the Scroller object
	 */
	function init() {
		var xAxisIndex = chart.xAxis.length,
			yAxisIndex = chart.yAxis.length,
			baseChartSetSize = chart.setSize;

		// make room below the chart
		chart.extraBottomMargin = outlineHeight + navigatorOptions.margin;
		// get the top offset
		top = getAxisTop(chart.chartHeight);

		if (navigatorEnabled) {
			var baseOptions = baseSeries.options,
				mergedNavSeriesOptions,
				baseData = baseOptions.data,
				navigatorSeriesOptions = navigatorOptions.series;

			// remove it to prevent merging one by one
			navigatorData = navigatorSeriesOptions.data;
			baseOptions.data = navigatorSeriesOptions.data = null;


			// an x axis is required for scrollbar also
			xAxis = new Axis(chart, merge({
				ordinal: baseSeries.xAxis.options.ordinal // inherit base xAxis' ordinal option
			}, navigatorOptions.xAxis, {
				isX: true,
				type: 'datetime',
				index: xAxisIndex,
				height: height, // docs + width
				top: top, // docs + left
				offset: 0,
				offsetLeft: scrollbarHeight, // docs
				offsetRight: -scrollbarHeight, // docs
				startOnTick: false,
				endOnTick: false,
				minPadding: 0,
				maxPadding: 0,
				zoomEnabled: false
			}));

			yAxis = new Axis(chart, merge(navigatorOptions.yAxis, {
				alignTicks: false, // docs
				height: height,
				top: top,
				offset: 0,
				index: yAxisIndex,
				zoomEnabled: false
			}));

			// dmerge the series options
			mergedNavSeriesOptions = merge(baseSeries.options, navigatorSeriesOptions, {
				threshold: null, // docs
				clip: false, // docs
				enableMouseTracking: false,
				group: 'nav', // for columns
				padXAxis: false,
				xAxis: xAxisIndex,
				yAxis: yAxisIndex,
				name: 'Navigator',
				showInLegend: false,
				isInternal: true,
				visible: true
			});

			// set the data back
			baseOptions.data = baseData;
			navigatorSeriesOptions.data = navigatorData;
			mergedNavSeriesOptions.data = navigatorData || baseData;

			// add the series
			navigatorSeries = chart.initSeries(mergedNavSeriesOptions);

			// respond to updated data in the base series
			// todo: use similiar hook when base series is not yet initialized
			addEvent(baseSeries, 'updatedData', updatedDataHandler);

		// in case of scrollbar only, fake an x axis to get translation
		} else {
			xAxis = {
				translate: function (value, reverse) {
					var ext = baseSeries.xAxis.getExtremes(),
						scrollTrackWidth = chart.plotWidth - 2 * scrollbarHeight,
						dataMin = ext.dataMin,
						valueRange = ext.dataMax - dataMin;

					return reverse ?
						// from pixel to value
						(value * valueRange / scrollTrackWidth) + dataMin :
						// from value to pixel
						scrollTrackWidth * (value - dataMin) / valueRange;
				}
			};
		}
		
		
		// Override the chart.setSize method to adjust the xAxis and yAxis top option as well.
		// This needs to be done prior to chart.resize
		chart.setSize = function (width, height, animation) {
			xAxis.options.top = yAxis.options.top = top = getAxisTop(height);
			baseChartSetSize.call(chart, width, height, animation);
		};

		addEvents();
	}

	/**
	 * Destroys allocated elements.
	 */
	function destroy() {
		// Disconnect events added in addEvents
		removeEvents();

		// Destroy local variables
		each([xAxis, yAxis, leftShade, rightShade, outline, scrollbarTrack, scrollbar, scrollbarRifles, scrollbarGroup], function (obj) {
			if (obj && obj.destroy) {
				obj.destroy();
			}
		});
		xAxis = yAxis = leftShade = rightShade = outline = scrollbarTrack = scrollbar = scrollbarRifles = scrollbarGroup = null;

		// Destroy elements in collection
		each([scrollbarButtons, handles, elementsToDestroy], function (coll) {
			destroyObjectProperties(coll);
		});
	}

	// Run scroller
	init();

	// Expose
	return {
		render: render,
		destroy: destroy
	};

};

/* ****************************************************************************
 * End Scroller code														  *
 *****************************************************************************/

