/**
 * The mouse tracker object. All methods starting with "on" are primary DOM event handlers. 
 * Subsequent methods should be named differently from what they are doing.
 * @param {Object} chart The Chart instance
 * @param {Object} options The root options object
 */
function MouseTracker(chart, options) {
	this.init(chart, options);
}

MouseTracker.prototype = {
	/**
	 * Initialize MouseTracker
	 */
	init: function (chart, options) {
		
		var zoomType = useCanVG ? '' : options.chart.zoomType,
			inverted = chart.inverted,
			zoomX,
			zoomY;

		// Store references
		this.options = options;
		this.chart = chart;
		
		// Zoom status
		this.zoomX = zoomX = /x/.test(zoomType);
		this.zoomY = zoomY = /y/.test(zoomType);
		this.zoomHor = (zoomX && !inverted) || (zoomY && inverted);
		this.zoomVert = (zoomY && !inverted) || (zoomX && inverted);

		this.pinchDown = [];

		if (!chart.trackerGroup) {
			chart.trackerGroup = chart.renderer.g('tracker')
				.attr({ zIndex: 9 })
				.add();
		}

		if (options.tooltip.enabled) {
			chart.tooltip = new Tooltip(chart, options.tooltip);
		}

		this.setDOMEvents();
	}, 

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

		// Framework specific normalizing (#1165)
		e = washMouseEvent(e);
		
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
					(isHorizontal ?
						e.chartX - chart.plotLeft :
						axis.top + axis.len - e.chartY) - axis.minPixelPadding, // #1051
					true
				)
			});
		});
		return coordinates;
	},
	
	/**
	 * Return the index in the tooltipPoints array, corresponding to pixel position in 
	 * the plot area.
	 */
	getIndex: function (e) {
		var chart = this.chart;
		return chart.inverted ? 
			chart.plotHeight + chart.plotTop - e.chartY : 
			e.chartX - chart.plotLeft;
	},

	/**
	 * With line type charts with a single tracker, get the point closest to the mouse.
	 * Run Point.onMouseOver and display tooltip for the point or points.
	 */
	runPointActions: function (e) {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			series = chart.series,
			tooltip = chart.tooltip,
			point,
			points,
			hoverPoint = chart.hoverPoint,
			hoverSeries = chart.hoverSeries,
			i,
			j,
			distance = chart.chartWidth,
			index = mouseTracker.getIndex(e),
			anchor;

		// shared tooltip
		if (tooltip && mouseTracker.options.tooltip.shared && !(hoverSeries && hoverSeries.noSharedTooltip)) {
			points = [];

			// loop over all series and find the ones with points closest to the mouse
			i = series.length;
			for (j = 0; j < i; j++) {
				if (series[j].visible &&
						series[j].options.enableMouseTracking !== false &&
						!series[j].noSharedTooltip && series[j].tooltipPoints.length) {
					point = series[j].tooltipPoints[index];
					point._dist = mathAbs(index - point[series[j].xAxis.tooltipPosName || 'plotX']);
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
				tooltip.refresh(points, e);
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
				point.onMouseOver(e);

			}
			
		} else if (tooltip && tooltip.followPointer && !tooltip.isHidden) {
			anchor = tooltip.getAnchor([{}], e);
			tooltip.updatePosition({ plotX: anchor[0], plotY: anchor[1] });
		}
	},



	/**
	 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
	 * 
	 * @param allowMove {Boolean} Instead of destroying the tooltip altogether, allow moving it if possible
	 */
	resetTracker: function (allowMove) {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			hoverSeries = chart.hoverSeries,
			hoverPoint = chart.hoverPoint,
			tooltip = chart.tooltip,
			tooltipPoints = tooltip && tooltip.shared ? chart.hoverPoints : hoverPoint;
			
		// Narrow in allowMove
		allowMove = allowMove && tooltip && tooltipPoints;
			
		// Check if the points have moved outside the plot area, #1003
		if (allowMove && splat(tooltipPoints)[0].plotX === UNDEFINED) {
			allowMove = false;
		}	

		// Just move the tooltip, #349
		if (allowMove) {
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
	 * Scale series groups to a certain scale and translation
	 */
	scaleGroups: function (attribs, clip) {

		var chart = this.chart;

		// Scale each series
		each(chart.series, function (series) {
			series.group.attr(attribs);
			if (series.markerGroup) {
				series.markerGroup.attr(attribs);
				series.markerGroup.clip(clip ? chart.clipRect : null);
			}
			if (series.dataLabelsGroup) {
				series.dataLabelsGroup.attr(attribs);
			}
		});
		
		// TODO: shorten. This is just a translated version of selectionMarker
		chart.clipRect.attr(clip ? {
			x: clip.x - chart.plotLeft,
			y: clip.y - chart.plotTop,
			width: clip.width,
			height: clip.height
		} : chart.clipBox);
	},
	
	/**
	 * Handle touch events with two touches
	 */
	pinchHandler: function (e) {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			pinchDown = mouseTracker.pinchDown,
			touches = e.touches,
			chartX1,
			chartX2,
			chartY1,
			chartY2,
			scaleX,
			scaleY,
			zoomHor = mouseTracker.zoomHor,
			zoomVert = mouseTracker.zoomVert,
			selectionMarker = mouseTracker.selectionMarker,
			plotWidth = chart.plotWidth,
			transform = {};
		
		// Normalize each touch
		map(touches, function (e) {
			return mouseTracker.normalizeMouseEvent(e);
		});
		
		// Handle touch move/pinching
		if (pinchDown[0] && pinchDown[1]) {
			
			// Set the marker
			if (!selectionMarker) {
				mouseTracker.selectionMarker = selectionMarker = {
					x: chart.plotLeft,
					y: chart.plotTop,
					width: zoomHor ? 1 : plotWidth,
					height: zoomVert ? 1 : chart.plotHeight,
					destroy: noop
				};
			}
			if (zoomHor) {
				chartX1 = mathMin(pinchDown[0].chartX, pinchDown[1].chartX);
				chartX2 = mathMin(touches[0].chartX, touches[1].chartX);
				
				transform.scaleX = scaleX = mathAbs(touches[0].chartX - touches[1].chartX) / mathAbs(pinchDown[1].chartX - pinchDown[0].chartX);
				transform.translateX = chartX2 - (chartX1 - chart.plotLeft) * scaleX;
			
				selectionMarker.x = ((chart.plotLeft - chartX2) / scaleX) + chartX1;
				selectionMarker.width = plotWidth / scaleX;
				mouseTracker.hasPinched = true;
			}
			if (zoomVert) {
				chartY1 = mathMin(pinchDown[0].chartY, pinchDown[1].chartY);
				chartY2 = mathMin(touches[0].chartY, touches[1].chartY);
				
				transform.scaleY = scaleY = mathAbs(touches[0].chartY - touches[1].chartY) / mathAbs(pinchDown[1].chartY - pinchDown[0].chartY);
				transform.translateY = chartY2 - (chartY1 - chart.plotTop) * scaleY;

				selectionMarker.y = ((chart.plotTop - chartY2) / scaleY) + chartY1;
				selectionMarker.height = chart.plotHeight / scaleY;
				mouseTracker.hasPinched = true;
			}

			// Scale and translate the groups to provide visual feedback during pinching
			this.scaleGroups(transform, selectionMarker);

			
		} 
			
		// Register the touch start position
		each(touches, function (e, i) {
			if (!pinchDown[i]) {
				pinchDown[i] = { chartX: e.chartX, chartY: e.chartY };
			}
		});
		return false;
	},

	

	onMouseDownContainer: function (e) {

		var chart = this.chart;

		e = this.normalizeMouseEvent(e);

		// issue #295, dragging not always working in Firefox
		if (e.type.indexOf('touch') === -1 && e.preventDefault) {
			e.preventDefault();
		}

		// record the start position
		chart.mouseIsDown = true;
		chart.cancelClick = false;
		chart.mouseDownX = this.mouseDownX = e.chartX;
		this.mouseDownY = e.chartY;
	},

	/**
	 * Mouse up or outside the plot area
	 */
	onMouseUpDocument: function () {

		var chart = this.chart;

		if (this.selectionMarker) {
			var selectionData = {
					xAxis: [],
					yAxis: []
				},
				selectionBox = this.selectionMarker,
				selectionLeft = selectionBox.x - chart.plotLeft,
				selectionTop = selectionBox.y - chart.plotTop,
				runZoom;
			// a selection has been made
			if (this.hasDragged || this.hasPinched) {

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
								(isHorizontal ?
										selectionLeft + selectionBox.width :
										chart.plotHeight - selectionTop) -  
									2 * axis.minPixelPadding, // #875
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
					fireEvent(chart, 'selection', selectionData, function (args) { 
						chart.zoom(extend(args, this.hasPinched ? { animation: false } : null)); 
					});
				}

			}
			this.selectionMarker = this.selectionMarker.destroy();

			// Reset scaling preview
			if (this.hasPinched) {
				this.scaleGroups({
					translateX: chart.plotLeft,
					translateY: chart.plotTop,
					scaleX: 1,
					scaleY: 1
				});
			}
		}

		if (chart) { // it may be destroyed on mouse up - #877
			css(chart.container, { cursor: 'auto' });
			chart.cancelClick = this.hasDragged; // #370
			chart.mouseIsDown = this.hasDragged = this.hasPinched = false;
			this.pinchDown = [];
		}
	},

	/**
	 * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
	 */
	onMouseMoveDocument: function (e) {
		var chart = this.chart,
			chartPosition = this.chartPosition,
			hoverSeries = chart.hoverSeries;

		// Get e.pageX and e.pageY back in MooTools
		e = washMouseEvent(e);

		// If we're outside, hide the tooltip
		if (chartPosition && hoverSeries && hoverSeries.isCartesian &&
			!chart.isInsidePlot(e.pageX - chartPosition.left - chart.plotLeft,
			e.pageY - chartPosition.top - chart.plotTop)) {
				this.resetTracker();
		}
	},

	/**
	 * When mouse leaves the container, hide the tooltip.
	 */
	onMouseLeaveContainer: function () {
		this.resetTracker();
		this.chartPosition = null; // also reset the chart position, used in #149 fix
	},

	// The mousemove, touchmove and touchstart event handler
	onMouseMoveContainer: function (e) {

		// let the system handle multitouch operations like two finger scroll
		// and pinching
		if (e && e.touches) {
			if (e.touches.length === 2) {
				return this.pinchHandler(e);
			} else if (e.touches.length > 2) {
				return true;
			}
		}

		// normalize
		e = this.normalizeMouseEvent(e);

		var type = e.type,
			chart = this.chart,
			chartX = e.chartX,
			chartY = e.chartY,
			zoomHor = this.zoomHor,
			zoomVert = this.zoomVert,
			isOutsidePlot = !chart.isInsidePlot(chartX - chart.plotLeft, chartY - chart.plotTop);
			
		
		if (type.indexOf('touch') === -1) {  // not for touch actions
			e.returnValue = false;
		}

		// on touch devices, only trigger click if a handler is defined
		if (type === 'touchstart') {
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

			// drop the selection if any and reset mouseIsDown and hasDragged
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

		if (chart.mouseIsDown && type !== 'touchstart') { // make selection

			// determine if the mouse has moved more than 10px
			this.hasDragged = Math.sqrt(
				Math.pow(this.mouseDownX - chartX, 2) +
				Math.pow(this.mouseDownY - chartY, 2)
			);
			if (this.hasDragged > 10) {
				var clickedInside = chart.isInsidePlot(this.mouseDownX - chart.plotLeft, this.mouseDownY - chart.plotTop);

				// make a selection
				if (chart.hasCartesianSeries && (this.zoomX || this.zoomY) && clickedInside) {
					if (!this.selectionMarker) {
						this.selectionMarker = chart.renderer.rect(
							chart.plotLeft,
							chart.plotTop,
							zoomHor ? 1 : chart.plotWidth,
							zoomVert ? 1 : chart.plotHeight,
							0
						)
						.attr({
							fill: this.options.chart.selectionMarkerFill || 'rgba(69,114,167,0.25)',
							zIndex: 7
						})
						.add();
					}
				}

				// adjust the width of the selection marker
				if (this.selectionMarker && zoomHor) {
					var xSize = chartX - this.mouseDownX;
					this.selectionMarker.attr({
						width: mathAbs(xSize),
						x: (xSize > 0 ? 0 : xSize) + this.mouseDownX
					});
				}
				// adjust the height of the selection marker
				if (this.selectionMarker && zoomVert) {
					var ySize = chartY - this.mouseDownY;
					this.selectionMarker.attr({
						height: mathAbs(ySize),
						y: (ySize > 0 ? 0 : ySize) + this.mouseDownY
					});
				}

				// panning
				if (clickedInside && !this.selectionMarker && this.options.chart.panning) {
					chart.pan(chartX);
				}
			}

		} 
		
		// Show the tooltip and run mouse over events (#977)			
		if (!isOutsidePlot) {
			this.runPointActions(e);
		}

		// when outside plot, allow touch-drag by returning true
		return isOutsidePlot || !chart.hasCartesianSeries;
	},

	onClickContainer: function (e) {
		var chart = this.chart,
			hoverPoint = chart.hoverPoint, 
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			inverted = chart.inverted,
			chartPosition,
			plotX,
			plotY;
		
		e = this.normalizeMouseEvent(e);
		e.cancelBubble = true; // IE specific


		if (!chart.cancelClick) {
			// Detect clicks on trackers or tracker groups, #783
			if (hoverPoint && (attr(e.target, 'isTracker') || attr(e.target.parentNode, 'isTracker'))) {
				chartPosition = this.chartPosition;
				plotX = hoverPoint.plotX;
				plotY = hoverPoint.plotY;

				// add page position info
				extend(hoverPoint, {
					pageX: chartPosition.left + plotLeft +
						(inverted ? chart.plotWidth - plotY : plotX),
					pageY: chartPosition.top + plotTop +
						(inverted ? chart.plotHeight - plotX : plotY)
				});

				// the series click event
				fireEvent(hoverPoint.series, 'click', extend(e, {
					point: hoverPoint
				}));

				// the point click event
				hoverPoint.firePointEvent('click', e);

			} else {
				extend(e, this.getMouseCoordinates(e));

				// fire a click event in the chart
				if (chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
					fireEvent(chart, 'click', e);
				}
			}


		}
	},

	/**
	 * Set the JS DOM events on the container and document
	 */
	setDOMEvents: function () {
		var mouseTracker = this,
			container = mouseTracker.chart.container;

		/*
		 * Record the starting position of a dragoperation
		 */
		container.onmousedown = function (e) {
			mouseTracker.onMouseDownContainer(e);
		};

		/*
		 * When the mouse enters the container, run mouseMove
		 */
		container.onmousemove = function (e) {
			mouseTracker.onMouseMoveContainer(e);
		};

		/*
		 * When the mouse leaves the container, hide the tracking (tooltip).
		 */
		addEvent(container, 'mouseleave', function (e) {
			mouseTracker.onMouseLeaveContainer(e);
		});

		// issue #149 workaround
		// The mouseleave event above does not always fire. Whenever the mouse is moving
		// outside the plotarea, hide the tooltip
		addEvent(doc, 'mousemove', function (e) {
			mouseTracker.onMouseMoveDocument(e);
		});

		addEvent(doc, 'mouseup', function (e) {
			mouseTracker.onMouseUpDocument(e);
		});

		// MooTools 1.2.3 doesn't fire this in IE when using addEvent
		container.onclick = function (e) {
			mouseTracker.onClickContainer(e);
		};

		if (hasTouch) {
			container.ontouchstart = function (e) {
				// For touch devices, use touchmove to zoom
				if (mouseTracker.zoomX || mouseTracker.zoomY) {
					mouseTracker.onMouseDownContainer(e);
				}
				// Show tooltip and prevent the lower mouse pseudo event
				mouseTracker.onMouseMoveContainer(e);
			};

			/*
			 * Allow dragging the finger over the chart to read the values on touch
			 * devices
			 */
			 // TODO: optional, perhaps with own wrapper
			container.ontouchmove = function (e) {
				mouseTracker.onMouseMoveContainer(e);
			};

			// What is this?
			container.ontouchend = function () {
				if (mouseTracker.hasDragged) {
					mouseTracker.resetTracker();
				}
			};

			addEvent(doc, 'touchend', function (e) {
				mouseTracker.onMouseUpDocument(e);
			});
		}
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
		clearInterval(this.tooltipTimeout);
	}
};
