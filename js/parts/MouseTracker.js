/**
 * Context holding the variables that were in local closure in the chart.
 */
function MouseTrackerContext(
		chart,
		optionsChart,
		getRenderer,
		inverted,
		getPlotLeft,
		getPlotTop,
		getPlotWidth,
		getPlotHeight,
		getChartWidth,
		axes,
		getZoomFunction,
		getHasCartesianSeries,
		runChartClick
	) {
	return {
		chart: chart, // object
		optionsChart: optionsChart, // object
		getRenderer: getRenderer, // object
		inverted: inverted, // constant
		getPlotLeft: getPlotLeft, // function
		getPlotTop: getPlotTop, // function
		getPlotWidth: getPlotWidth, // function
		getPlotHeight: getPlotHeight, // function
		getChartWidth: getChartWidth, // function
		axes: axes, // object (Array)
		getZoomFunction: getZoomFunction, // function returning a function
		getHasCartesianSeries: getHasCartesianSeries, // function
		runChartClick: runChartClick // constant
	};
}

/**
 * The mouse tracker object
 * @param {Object} context The MouseTrackerContext
 * @param {Object} options
 */
function MouseTracker(context, options) {
	var optionsChart = context.optionsChart,
		chart = context.chart,
		renderer = context.getRenderer(),
		inverted = context.inverted,
		getPlotLeft = context.getPlotLeft,
		getPlotTop = context.getPlotTop,
		getPlotWidth = context.getPlotWidth,
		getPlotHeight = context.getPlotHeight,
		getChartWidth = context.getChartWidth,
		container = chart.container,
		axes = context.axes,
		series = chart.series,
		zoom = context.getZoomFunction(),
		isInsidePlot = chart.isInsidePlot,
		getHasCartesianSeries = context.getHasCartesianSeries,
		runChartClick = context.runChartClick,
		tooltipTick;

	var chartPosition,
		mouseDownX,
		mouseDownY,
		hasDragged,
		selectionMarker,
		zoomType = useCanVG ? '' : optionsChart.zoomType,
		zoomX = /x/.test(zoomType),
		zoomY = /y/.test(zoomType),
		zoomHor = (zoomX && !inverted) || (zoomY && inverted),
		zoomVert = (zoomY && !inverted) || (zoomX && inverted),
		tooltipInterval,
		hoverX;

	/**
	 * Add crossbrowser support for chartX and chartY
	 * @param {Object} e The event object in standard browsers
	 */
	function normalizeMouseEvent(e) {
		var ePos,
			chartPosLeft,
			chartPosTop,
			chartX,
			chartY;

		// common IE normalizing
		e = e || win.event;
		if (!e.target) {
			e.target = e.srcElement;
		}

		// jQuery only copies over some properties. IE needs e.x and iOS needs touches.
		if (e.originalEvent) {
			e = e.originalEvent;
		}

		// The same for MooTools. It renames e.pageX to e.page.x. #445.
		if (e.event) {
			e = e.event;
		}

		// iOS
		ePos = e.touches ? e.touches.item(0) : e;

		// get mouse position
		chartPosition = offset(container);
		chartPosLeft = chartPosition.left;
		chartPosTop = chartPosition.top;

		// chartX and chartY
		if (isIE) { // IE including IE9 that has pageX but in a different meaning
			chartX = e.x;
			chartY = e.y;
		} else {
			chartX = ePos.pageX - chartPosLeft;
			chartY = ePos.pageY - chartPosTop;
		}

		return extend(e, {
			chartX: mathRound(chartX),
			chartY: mathRound(chartY)
		});
	}

	/**
	 * Get the click position in terms of axis values.
	 *
	 * @param {Object} e A mouse event
	 */
	function getMouseCoordinates(e) {
		var coordinates = {
			xAxis: [],
			yAxis: []
		};
		each(axes, function (axis) {
			var translate = axis.translate,
				isXAxis = axis.isXAxis,
				isHorizontal = inverted ? !isXAxis : isXAxis;

			coordinates[isXAxis ? 'xAxis' : 'yAxis'].push({
				axis: axis,
				value: translate(
					isHorizontal ?
						e.chartX - getPlotLeft() :
						getPlotHeight() - e.chartY + getPlotTop(),
					true
				)
			});
		});
		return coordinates;
	}

	/**
	 * With line type charts with a single tracker, get the point closest to the mouse
	 */
	function onmousemove(e) {
		var point,
			points,
			hoverPoint = chart.hoverPoint,
			hoverSeries = chart.hoverSeries,
			i,
			j,
			distance = getChartWidth(),
			index = inverted ? e.chartY : e.chartX - getPlotLeft(); // wtf?

		// shared tooltip
		if (chart.tooltip && options.shared && !(hoverSeries && hoverSeries.noSharedTooltip)) {
			points = [];

			// loop over all series and find the ones with points closest to the mouse
			i = series.length;
			for (j = 0; j < i; j++) {
				if (series[j].visible &&
						series[j].options.enableMouseTracking !== false &&
						!series[j].noSharedTooltip && series[j].tooltipPoints.length) {
					point = series[j].tooltipPoints[index];
					point._dist = mathAbs(index - point.plotX);
					distance = mathMin(distance, point._dist);
					points.push(point);
				}
			}
			// remove furthest points
			i = points.length;
			while (i--) {
				if (points[i]._dist > distance) {
					points.splice(i, 1);
				}
			}
			// refresh the tooltip if necessary
			if (points.length && (points[0].plotX !== hoverX)) {
				chart.tooltip.refresh(points);
				hoverX = points[0].plotX;
			}
		}

		// separate tooltip and general mouse events
		if (hoverSeries && hoverSeries.tracker) { // only use for line-type series with common tracker

			// get the point
			point = hoverSeries.tooltipPoints[index];

			// a new point is hovered, refresh the tooltip
			if (point && point !== hoverPoint) {

				// trigger the events
				point.onMouseOver();

			}
		}
	}



	/**
	 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
	 */
	function resetTracker() {
		var hoverSeries = chart.hoverSeries,
			hoverPoint = chart.hoverPoint;

		if (hoverPoint) {
			hoverPoint.onMouseOut();
		}

		if (hoverSeries) {
			hoverSeries.onMouseOut();
		}

		if (chart.tooltip) {
			chart.tooltip.hide();
			chart.tooltip.hideCrosshairs();
		}

		hoverX = null;
	}

	/**
	 * Mouse up or outside the plot area
	 */
	function drop() {
		if (selectionMarker) {
			var selectionData = {
					xAxis: [],
					yAxis: []
				},
				selectionBox = selectionMarker.getBBox(),
				selectionLeft = selectionBox.x - getPlotLeft(),
				selectionTop = selectionBox.y - getPlotTop();


			// a selection has been made
			if (hasDragged) {

				// record each axis' min and max
				each(axes, function (axis) {
					if (axis.options.zoomEnabled !== false) {
						var translate = axis.translate,
							isXAxis = axis.isXAxis,
							isHorizontal = inverted ? !isXAxis : isXAxis,
							selectionMin = translate(
								isHorizontal ?
									selectionLeft :
									getPlotHeight() - selectionTop - selectionBox.height,
								true,
								0,
								0,
								1
							),
							selectionMax = translate(
								isHorizontal ?
									selectionLeft + selectionBox.width :
									getPlotHeight() - selectionTop,
								true,
								0,
								0,
								1
							);

							selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
								axis: axis,
								min: mathMin(selectionMin, selectionMax), // for reversed axes,
								max: mathMax(selectionMin, selectionMax)
							});
					}
				});
				fireEvent(chart, 'selection', selectionData, zoom);

			}
			selectionMarker = selectionMarker.destroy();
		}

		css(container, { cursor: 'auto' });

		chart.mouseIsDown = hasDragged = false;
		removeEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);

	}

	/**
	 * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
	 */
	function hideTooltipOnMouseMove(e) {
		var pageX = defined(e.pageX) ? e.pageX : e.page.x, // In mootools the event is wrapped and the page x/y position is named e.page.x
			pageY = defined(e.pageX) ? e.pageY : e.page.y; // Ref: http://mootools.net/docs/core/Types/DOMEvent

		if (chartPosition &&
				!isInsidePlot(pageX - chartPosition.left - getPlotLeft(),
					pageY - chartPosition.top - getPlotTop())) {
			resetTracker();
		}
	}

	/**
	 * When mouse leaves the container, hide the tooltip.
	 */
	function hideTooltipOnMouseLeave() {
		resetTracker();
		chartPosition = null; // also reset the chart position, used in #149 fix
	}

	/**
	 * Set the JS events on the container element
	 */
	function setDOMEvents() {
		var lastWasOutsidePlot = true;
		/*
		 * Record the starting position of a dragoperation
		 */
		container.onmousedown = function (e) {
			e = normalizeMouseEvent(e);

			// issue #295, dragging not always working in Firefox
			if (!hasTouch && e.preventDefault) {
				e.preventDefault();
			}

			// record the start position
			chart.mouseIsDown = true;
			chart.mouseDownX = mouseDownX = e.chartX;
			mouseDownY = e.chartY;

			addEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);
		};

		// The mousemove, touchmove and touchstart event handler
		var mouseMove = function (e) {

			// let the system handle multitouch operations like two finger scroll
			// and pinching
			if (e && e.touches && e.touches.length > 1) {
				return;
			}

			// normalize
			e = normalizeMouseEvent(e);
			if (!hasTouch) { // not for touch devices
				e.returnValue = false;
			}

			var chartX = e.chartX,
				chartY = e.chartY,
				isOutsidePlot = !isInsidePlot(chartX - getPlotLeft(), chartY - getPlotTop());

			// on touch devices, only trigger click if a handler is defined
			if (hasTouch && e.type === 'touchstart') {
				if (attr(e.target, 'isTracker')) {
					if (!chart.runTrackerClick) {
						e.preventDefault();
					}
				} else if (!runChartClick && !isOutsidePlot) {
					e.preventDefault();
				}
			}

			// cancel on mouse outside
			if (isOutsidePlot) {

				/*if (!lastWasOutsidePlot) {
					// reset the tracker
					resetTracker();
				}*/

				// drop the selection if any and reset mouseIsDown and hasDragged
				//drop();
				if (chartX < getPlotLeft()) {
					chartX = getPlotLeft();
				} else if (chartX > getPlotLeft() + getPlotWidth()) {
					chartX = getPlotLeft() + getPlotWidth();
				}

				if (chartY < getPlotTop()) {
					chartY = getPlotTop();
				} else if (chartY > getPlotTop() + getPlotHeight()) {
					chartY = getPlotTop() + getPlotHeight();
				}

			}

			if (chart.mouseIsDown && e.type !== 'touchstart') { // make selection

				// determine if the mouse has moved more than 10px
				hasDragged = Math.sqrt(
					Math.pow(mouseDownX - chartX, 2) +
					Math.pow(mouseDownY - chartY, 2)
				);
				if (hasDragged > 10) {
					var clickedInside = isInsidePlot(mouseDownX - getPlotLeft(), mouseDownY - getPlotTop());

					// make a selection
					if (getHasCartesianSeries() && (zoomX || zoomY) && clickedInside) {
						if (!selectionMarker) {
							selectionMarker = renderer.rect(
								getPlotLeft(),
								getPlotTop(),
								zoomHor ? 1 : getPlotWidth(),
								zoomVert ? 1 : getPlotHeight(),
								0
							)
							.attr({
								fill: optionsChart.selectionMarkerFill || 'rgba(69,114,167,0.25)',
								zIndex: 7
							})
							.add();
						}
					}

					// adjust the width of the selection marker
					if (selectionMarker && zoomHor) {
						var xSize = chartX - mouseDownX;
						selectionMarker.attr({
							width: mathAbs(xSize),
							x: (xSize > 0 ? 0 : xSize) + mouseDownX
						});
					}
					// adjust the height of the selection marker
					if (selectionMarker && zoomVert) {
						var ySize = chartY - mouseDownY;
						selectionMarker.attr({
							height: mathAbs(ySize),
							y: (ySize > 0 ? 0 : ySize) + mouseDownY
						});
					}

					// panning
					if (clickedInside && !selectionMarker && optionsChart.panning) {
						chart.pan(chartX);
					}
				}

			} else if (!isOutsidePlot) {
				// show the tooltip
				onmousemove(e);
			}

			lastWasOutsidePlot = isOutsidePlot;

			// when outside plot, allow touch-drag by returning true
			return isOutsidePlot || !getHasCartesianSeries();
		};

		/*
		 * When the mouse enters the container, run mouseMove
		 */
		container.onmousemove = mouseMove;

		/*
		 * When the mouse leaves the container, hide the tracking (tooltip).
		 */
		addEvent(container, 'mouseleave', hideTooltipOnMouseLeave);

		// issue #149 workaround
		// The mouseleave event above does not always fire. Whenever the mouse is moving
		// outside the plotarea, hide the tooltip
		addEvent(doc, 'mousemove', hideTooltipOnMouseMove);

		container.ontouchstart = function (e) {
			// For touch devices, use touchmove to zoom
			if (zoomX || zoomY) {
				container.onmousedown(e);
			}
			// Show tooltip and prevent the lower mouse pseudo event
			mouseMove(e);
		};

		/*
		 * Allow dragging the finger over the chart to read the values on touch
		 * devices
		 */
		container.ontouchmove = mouseMove;

		/*
		 * Allow dragging the finger over the chart to read the values on touch
		 * devices
		 */
		container.ontouchend = function () {
			if (hasDragged) {
				resetTracker();
			}
		};


		// MooTools 1.2.3 doesn't fire this in IE when using addEvent
		container.onclick = function (e) {
			var hoverPoint = chart.hoverPoint;
			e = normalizeMouseEvent(e);

			e.cancelBubble = true; // IE specific


			if (!hasDragged) {
				if (hoverPoint && attr(e.target, 'isTracker')) {
					var plotX = hoverPoint.plotX,
						plotY = hoverPoint.plotY;

					// add page position info
					extend(hoverPoint, {
						pageX: chartPosition.left + getPlotLeft() +
							(inverted ? getPlotWidth() - plotY : plotX),
						pageY: chartPosition.top + getPlotTop() +
							(inverted ? getPlotHeight() - plotX : plotY)
					});

					// the series click event
					fireEvent(hoverPoint.series, 'click', extend(e, {
						point: hoverPoint
					}));

					// the point click event
					hoverPoint.firePointEvent('click', e);

				} else {
					extend(e, getMouseCoordinates(e));

					// fire a click event in the chart
					if (isInsidePlot(e.chartX - getPlotLeft(), e.chartY - getPlotTop())) {
						fireEvent(chart, 'click', e);
					}
				}


			}
			// reset mouseIsDown and hasDragged
			hasDragged = false;
		};

	}

	/**
	 * Destroys the MouseTracker object and disconnects DOM events.
	 */
	function destroy() {
		// Destroy the tracker group element
		if (chart.trackerGroup) {
			chart.trackerGroup = chart.trackerGroup.destroy();
		}

		removeEvent(container, 'mouseleave', hideTooltipOnMouseLeave);
		removeEvent(doc, 'mousemove', hideTooltipOnMouseMove);
		container.onclick = container.onmousedown = container.onmousemove = container.ontouchstart = container.ontouchend = container.ontouchmove = null;

		// memory and CPU leak
		clearInterval(tooltipInterval);
	}


	// Run MouseTracker

	if (!chart.trackerGroup) {
		chart.trackerGroup = renderer.g('tracker')
			.attr({ zIndex: 9 })
			.add();
	}

	if (options.enabled) {
		var tooltipContext = new TooltipContext(
				chart,
				function () { return renderer; },
				inverted,
				getPlotLeft,
				getPlotTop,
				getPlotWidth,
				getPlotHeight,
				function (tooltipFunction) { tooltipTick = tooltipFunction; }
			);

		chart.tooltip = Tooltip(tooltipContext, options);

		// set the fixed interval ticking for the smooth tooltip
		tooltipInterval = setInterval(function () {
			if (tooltipTick) {
				tooltipTick();
			}
		}, 32);
	}

	setDOMEvents();

	// expose properties
	extend(this, {
		zoomX: zoomX,
		zoomY: zoomY,
		resetTracker: resetTracker,
		normalizeMouseEvent: normalizeMouseEvent,
		destroy: destroy
	});
}
