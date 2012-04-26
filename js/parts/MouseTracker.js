/**
 * The mouse tracker object
 * @param {Object} chart The Chart instance
 * @param {Object} options The root options object
 */
function MouseTracker(chart, options) {
	var zoomType = useCanVG ? '' : options.chart.zoomType;

	// Zoom status
	this.zoomX = /x/.test(zoomType);
	this.zoomY = /y/.test(zoomType);

	// Store reference to options
	this.options = options;

	// Reference to the chart
	this.chart = chart;

	// The interval id
	//this.tooltipInterval = UNDEFINED;

	// The cached x hover position
	//this.hoverX = UNDEFINED;

	// The chart position
	//this.chartPosition = UNDEFINED;

	// The selection marker element
	//this.selectionMarker = UNDEFINED;

	// False or a value > 0 if a dragging operation
	//this.mouseDownX = UNDEFINED;
	//this.mouseDownY = UNDEFINED;
	this.init(chart, options.tooltip);
}

MouseTracker.prototype = {
	/**
	 * Add crossbrowser support for chartX and chartY
	 * @param {Object} e The event object in standard browsers
	 */
	normalizeMouseEvent: function (e) {
		var chartPosition,
			chartX,
			chartY,
			ePos;

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
		this.chartPosition = chartPosition = offset(this.chart.container);

		// chartX and chartY
		if (ePos.pageX === UNDEFINED) { // IE < 9. #886.
			chartX = e.x;
			chartY = e.y;
		} else {
			chartX = ePos.pageX - chartPosition.left;
			chartY = ePos.pageY - chartPosition.top;
		}

		return extend(e, {
			chartX: mathRound(chartX),
			chartY: mathRound(chartY)
		});
	},

	/**
	 * Get the click position in terms of axis values.
	 *
	 * @param {Object} e A mouse event
	 */
	getMouseCoordinates: function (e) {
		var coordinates = {
				xAxis: [],
				yAxis: []
			},
			chart = this.chart;

		each(chart.axes, function (axis) {
			var isXAxis = axis.isXAxis,
				isHorizontal = chart.inverted ? !isXAxis : isXAxis;

			coordinates[isXAxis ? 'xAxis' : 'yAxis'].push({
				axis: axis,
				value: axis.translate(
					isHorizontal ?
						e.chartX - chart.plotLeft :
						chart.plotHeight - e.chartY + chart.plotTop,
					true
				)
			});
		});
		return coordinates;
	},

	/**
	 * With line type charts with a single tracker, get the point closest to the mouse
	 */
	onmousemove: function (e) {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			series = chart.series,
			point,
			points,
			hoverPoint = chart.hoverPoint,
			hoverSeries = chart.hoverSeries,
			i,
			j,
			distance = chart.chartWidth,
			// the index in the tooltipPoints array, corresponding to pixel position in plot area
			index = chart.inverted ? chart.plotHeight + chart.plotTop - e.chartY : e.chartX - chart.plotLeft;

		// shared tooltip
		if (chart.tooltip && mouseTracker.options.tooltip.shared && !(hoverSeries && hoverSeries.noSharedTooltip)) {
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
			if (points.length && (points[0].plotX !== mouseTracker.hoverX)) {
				chart.tooltip.refresh(points);
				mouseTracker.hoverX = points[0].plotX;
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
	},



	/**
	 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
	 */
	resetTracker: function (allowMove) {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			hoverSeries = chart.hoverSeries,
			hoverPoint = chart.hoverPoint,
			tooltipPoints = chart.hoverPoints || hoverPoint,
			tooltip = chart.tooltip;

		// Just move the tooltip, #349
		if (allowMove && tooltip && tooltipPoints) {
			tooltip.refresh(tooltipPoints);

		// Full reset
		} else {

			if (hoverPoint) {
				hoverPoint.onMouseOut();
			}

			if (hoverSeries) {
				hoverSeries.onMouseOut();
			}

			if (tooltip) {
				tooltip.hide();
				tooltip.hideCrosshairs();
			}

			mouseTracker.hoverX = null;

		}
	},

	/**
	 * Set the JS events on the container element
	 */
	setDOMEvents: function () {
		var lastWasOutsidePlot = true,
			mouseTracker = this,
			chart = mouseTracker.chart,
			container = chart.container,
			hasDragged,
			zoomHor = (mouseTracker.zoomX && !chart.inverted) || (mouseTracker.zoomY && chart.inverted),
			zoomVert = (mouseTracker.zoomY && !chart.inverted) || (mouseTracker.zoomX && chart.inverted);

		/**
		 * Mouse up or outside the plot area
		 */
		function drop() {
			if (mouseTracker.selectionMarker) {
				var selectionData = {
						xAxis: [],
						yAxis: []
					},
					selectionBox = mouseTracker.selectionMarker.getBBox(),
					selectionLeft = selectionBox.x - chart.plotLeft,
					selectionTop = selectionBox.y - chart.plotTop,
					runZoom;

				// a selection has been made
				if (hasDragged) {

					// record each axis' min and max
					each(chart.axes, function (axis) {
						if (axis.options.zoomEnabled !== false) {
							var isXAxis = axis.isXAxis,
								isHorizontal = chart.inverted ? !isXAxis : isXAxis,
								selectionMin = axis.translate(
									isHorizontal ?
										selectionLeft :
										chart.plotHeight - selectionTop - selectionBox.height,
									true,
									0,
									0,
									1
								),
								selectionMax = axis.translate(
									isHorizontal ?
										selectionLeft + selectionBox.width :
										chart.plotHeight - selectionTop,
									true,
									0,
									0,
									1
								);

								if (!isNaN(selectionMin) && !isNaN(selectionMax)) { // #859
									selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
										axis: axis,
										min: mathMin(selectionMin, selectionMax), // for reversed axes,
										max: mathMax(selectionMin, selectionMax)
									});
									runZoom = true;
								}
						}
					});
					if (runZoom) {
						fireEvent(chart, 'selection', selectionData, function (args) { chart.zoom(args); });
					}

				}
				mouseTracker.selectionMarker = mouseTracker.selectionMarker.destroy();
			}

			if (chart) { // it may be destroyed on mouse up - #877
				css(container, { cursor: 'auto' });
				chart.cancelClick = hasDragged; // #370
				chart.mouseIsDown = hasDragged = false;
			}

			removeEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);
		}

		/**
		 * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
		 */
		mouseTracker.hideTooltipOnMouseMove = function (e) {

			// Get e.pageX and e.pageY back in MooTools
			washMouseEvent(e);

			// If we're outside, hide the tooltip
			if (mouseTracker.chartPosition &&
				!chart.isInsidePlot(e.pageX - mouseTracker.chartPosition.left - chart.plotLeft,
				e.pageY - mouseTracker.chartPosition.top - chart.plotTop)) {
					mouseTracker.resetTracker();
			}
		};

		/**
		 * When mouse leaves the container, hide the tooltip.
		 */
		mouseTracker.hideTooltipOnMouseLeave = function () {
			mouseTracker.resetTracker();
			mouseTracker.chartPosition = null; // also reset the chart position, used in #149 fix
		};


		/*
		 * Record the starting position of a dragoperation
		 */
		container.onmousedown = function (e) {
			e = mouseTracker.normalizeMouseEvent(e);

			// issue #295, dragging not always working in Firefox
			if (!hasTouch && e.preventDefault) {
				e.preventDefault();
			}

			// record the start position
			chart.mouseIsDown = true;
			chart.cancelClick = false;
			chart.mouseDownX = mouseTracker.mouseDownX = e.chartX;
			mouseTracker.mouseDownY = e.chartY;

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
			e = mouseTracker.normalizeMouseEvent(e);
			if (!hasTouch) { // not for touch devices
				e.returnValue = false;
			}

			var chartX = e.chartX,
				chartY = e.chartY,
				isOutsidePlot = !chart.isInsidePlot(chartX - chart.plotLeft, chartY - chart.plotTop);

			// on touch devices, only trigger click if a handler is defined
			if (hasTouch && e.type === 'touchstart') {
				if (attr(e.target, 'isTracker')) {
					if (!chart.runTrackerClick) {
						e.preventDefault();
					}
				} else if (!chart.runChartClick && !isOutsidePlot) {
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
				if (chartX < chart.plotLeft) {
					chartX = chart.plotLeft;
				} else if (chartX > chart.plotLeft + chart.plotWidth) {
					chartX = chart.plotLeft + chart.plotWidth;
				}

				if (chartY < chart.plotTop) {
					chartY = chart.plotTop;
				} else if (chartY > chart.plotTop + chart.plotHeight) {
					chartY = chart.plotTop + chart.plotHeight;
				}
			}

			if (chart.mouseIsDown && e.type !== 'touchstart') { // make selection

				// determine if the mouse has moved more than 10px
				hasDragged = Math.sqrt(
					Math.pow(mouseTracker.mouseDownX - chartX, 2) +
					Math.pow(mouseTracker.mouseDownY - chartY, 2)
				);
				if (hasDragged > 10) {
					var clickedInside = chart.isInsidePlot(mouseTracker.mouseDownX - chart.plotLeft, mouseTracker.mouseDownY - chart.plotTop);

					// make a selection
					if (chart.hasCartesianSeries && (mouseTracker.zoomX || mouseTracker.zoomY) && clickedInside) {
						if (!mouseTracker.selectionMarker) {
							mouseTracker.selectionMarker = chart.renderer.rect(
								chart.plotLeft,
								chart.plotTop,
								zoomHor ? 1 : chart.plotWidth,
								zoomVert ? 1 : chart.plotHeight,
								0
							)
							.attr({
								fill: mouseTracker.options.chart.selectionMarkerFill || 'rgba(69,114,167,0.25)',
								zIndex: 7
							})
							.add();
						}
					}

					// adjust the width of the selection marker
					if (mouseTracker.selectionMarker && zoomHor) {
						var xSize = chartX - mouseTracker.mouseDownX;
						mouseTracker.selectionMarker.attr({
							width: mathAbs(xSize),
							x: (xSize > 0 ? 0 : xSize) + mouseTracker.mouseDownX
						});
					}
					// adjust the height of the selection marker
					if (mouseTracker.selectionMarker && zoomVert) {
						var ySize = chartY - mouseTracker.mouseDownY;
						mouseTracker.selectionMarker.attr({
							height: mathAbs(ySize),
							y: (ySize > 0 ? 0 : ySize) + mouseTracker.mouseDownY
						});
					}

					// panning
					if (clickedInside && !mouseTracker.selectionMarker && mouseTracker.options.chart.panning) {
						chart.pan(chartX);
					}
				}

			} else if (!isOutsidePlot) {
				// show the tooltip
				mouseTracker.onmousemove(e);
			}

			lastWasOutsidePlot = isOutsidePlot;

			// when outside plot, allow touch-drag by returning true
			return isOutsidePlot || !chart.hasCartesianSeries;
		};

		/*
		 * When the mouse enters the container, run mouseMove
		 */
		container.onmousemove = mouseMove;

		/*
		 * When the mouse leaves the container, hide the tracking (tooltip).
		 */
		addEvent(container, 'mouseleave', mouseTracker.hideTooltipOnMouseLeave);

		// issue #149 workaround
		// The mouseleave event above does not always fire. Whenever the mouse is moving
		// outside the plotarea, hide the tooltip
		addEvent(doc, 'mousemove', mouseTracker.hideTooltipOnMouseMove);

		container.ontouchstart = function (e) {
			// For touch devices, use touchmove to zoom
			if (mouseTracker.zoomX || mouseTracker.zoomY) {
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
				mouseTracker.resetTracker();
			}
		};


		// MooTools 1.2.3 doesn't fire this in IE when using addEvent
		container.onclick = function (e) {
			var hoverPoint = chart.hoverPoint;
			e = mouseTracker.normalizeMouseEvent(e);

			e.cancelBubble = true; // IE specific


			if (!chart.cancelClick) {
				// Detect clicks on trackers or tracker groups, #783
				if (hoverPoint && (attr(e.target, 'isTracker') || attr(e.target.parentNode, 'isTracker'))) {
					var plotX = hoverPoint.plotX,
						plotY = hoverPoint.plotY;

					// add page position info
					extend(hoverPoint, {
						pageX: mouseTracker.chartPosition.left + chart.plotLeft +
							(chart.inverted ? chart.plotWidth - plotY : plotX),
						pageY: mouseTracker.chartPosition.top + chart.plotTop +
							(chart.inverted ? chart.plotHeight - plotX : plotY)
					});

					// the series click event
					fireEvent(hoverPoint.series, 'click', extend(e, {
						point: hoverPoint
					}));

					// the point click event
					hoverPoint.firePointEvent('click', e);

				} else {
					extend(e, mouseTracker.getMouseCoordinates(e));

					// fire a click event in the chart
					if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
						fireEvent(chart, 'click', e);
					}
				}


			}
		};

	},

	/**
	 * Destroys the MouseTracker object and disconnects DOM events.
	 */
	destroy: function () {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			container = chart.container;

		// Destroy the tracker group element
		if (chart.trackerGroup) {
			chart.trackerGroup = chart.trackerGroup.destroy();
		}

		removeEvent(container, 'mouseleave', mouseTracker.hideTooltipOnMouseLeave);
		removeEvent(doc, 'mousemove', mouseTracker.hideTooltipOnMouseMove);
		container.onclick = container.onmousedown = container.onmousemove = container.ontouchstart = container.ontouchend = container.ontouchmove = null;

		// memory and CPU leak
		clearInterval(this.tooltipInterval);
	},

	// Run MouseTracker
	init: function (chart, options) {
		if (!chart.trackerGroup) {
			chart.trackerGroup = chart.renderer.g('tracker')
				.attr({ zIndex: 9 })
				.add();
		}

		if (options.enabled) {
			chart.tooltip = new Tooltip(chart, options);

			// set the fixed interval ticking for the smooth tooltip
			this.tooltipInterval = setInterval(function () { chart.tooltip.tick(); }, 32);
		}

		this.setDOMEvents();
	}
};
