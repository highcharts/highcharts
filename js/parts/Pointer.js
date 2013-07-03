/**
 * The mouse tracker object. All methods starting with "on" are primary DOM event handlers. 
 * Subsequent methods should be named differently from what they are doing.
 * @param {Object} chart The Chart instance
 * @param {Object} options The root options object
 */
function Pointer(chart, options) {
	this.init(chart, options);
}

Pointer.prototype = {
	/**
	 * Initialize Pointer
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
		this.lastValidTouch = {};

		if (options.tooltip.enabled) {
			chart.tooltip = new Tooltip(chart, options.tooltip);
		}

		this.setDOMEvents();
	}, 

	/**
	 * Add crossbrowser support for chartX and chartY
	 * @param {Object} e The event object in standard browsers
	 */
	normalize: function (e) {
		var chartPosition,
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

		// Old IE and compatibility mode use clientX. #886, #2005.
		return extend(e, {
			chartX: mathRound(pick(ePos.pageX, ePos.clientX) - chartPosition.left),
			chartY: mathRound(pick(ePos.pageY, ePos.clientY) - chartPosition.top)
		});
	},

	/**
	 * Get the click position in terms of axis values.
	 *
	 * @param {Object} e A pointer event
	 */
	getCoordinates: function (e) {
		var coordinates = {
				xAxis: [],
				yAxis: []
			};

		each(this.chart.axes, function (axis) {
			coordinates[axis.isXAxis ? 'xAxis' : 'yAxis'].push({
				axis: axis,
				value: axis.toValue(e[axis.horiz ? 'chartX' : 'chartY'])
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
		var pointer = this,
			chart = pointer.chart,
			series = chart.series,
			tooltip = chart.tooltip,
			point,
			points,
			hoverPoint = chart.hoverPoint,
			hoverSeries = chart.hoverSeries,
			i,
			j,
			distance = chart.chartWidth,
			index = pointer.getIndex(e),
			anchor;

		// shared tooltip
		if (tooltip && pointer.options.tooltip.shared && !(hoverSeries && hoverSeries.noSharedTooltip)) {
			points = [];

			// loop over all series and find the ones with points closest to the mouse
			i = series.length;
			for (j = 0; j < i; j++) {
				if (series[j].visible &&
						series[j].options.enableMouseTracking !== false &&
						!series[j].noSharedTooltip && series[j].tooltipPoints.length) {
					point = series[j].tooltipPoints[index];
					if (point.series) { // not a dummy point, #1544
						point._dist = mathAbs(index - point.clientX);
						distance = mathMin(distance, point._dist);
						points.push(point);
					}
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
			if (points.length && (points[0].clientX !== pointer.hoverX)) {
				tooltip.refresh(points, e);
				pointer.hoverX = points[0].clientX;
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
	reset: function (allowMove) {
		var pointer = this,
			chart = pointer.chart,
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

			pointer.hoverX = null;

		}
	},

	/**
	 * Scale series groups to a certain scale and translation
	 */
	scaleGroups: function (attribs, clip) {

		var chart = this.chart,
			seriesAttribs;

		// Scale each series
		each(chart.series, function (series) {
			seriesAttribs = attribs || series.getPlotBox(); // #1701
			if (series.xAxis && series.xAxis.zoomEnabled) {
				series.group.attr(attribs);
				if (series.markerGroup) {
					series.markerGroup.attr(attribs);
					series.markerGroup.clip(clip ? chart.clipRect : null);
				}
				if (series.dataLabelsGroup) {
					series.dataLabelsGroup.attr(attribs);
				}
			}
		});
		
		// Clip
		chart.clipRect.attr(clip || chart.clipBox);
	},

	/**
	 * Run translation operations for each direction (horizontal and vertical) independently
	 */
	pinchTranslateDirection: function (horiz, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch) {
		var chart = this.chart,
			xy = horiz ? 'x' : 'y',
			XY = horiz ? 'X' : 'Y',
			sChartXY = 'chart' + XY,
			wh = horiz ? 'width' : 'height',
			plotLeftTop = chart['plot' + (horiz ? 'Left' : 'Top')],
			selectionWH,
			selectionXY,
			clipXY,
			scale = 1,
			inverted = chart.inverted,
			bounds = chart.bounds[horiz ? 'h' : 'v'],
			singleTouch = pinchDown.length === 1,
			touch0Start = pinchDown[0][sChartXY],
			touch0Now = touches[0][sChartXY],
			touch1Start = !singleTouch && pinchDown[1][sChartXY],
			touch1Now = !singleTouch && touches[1][sChartXY],
			outOfBounds,
			transformScale,
			scaleKey,
			setScale = function () {
				if (!singleTouch && mathAbs(touch0Start - touch1Start) > 20) { // Don't zoom if fingers are too close on this axis
					scale = mathAbs(touch0Now - touch1Now) / mathAbs(touch0Start - touch1Start);	
				}
				
				clipXY = ((plotLeftTop - touch0Now) / scale) + touch0Start;
				selectionWH = chart['plot' + (horiz ? 'Width' : 'Height')] / scale;
			};

		// Set the scale, first pass
		setScale();

		selectionXY = clipXY; // the clip position (x or y) is altered if out of bounds, the selection position is not

		// Out of bounds
		if (selectionXY < bounds.min) {
			selectionXY = bounds.min;
			outOfBounds = true;
		} else if (selectionXY + selectionWH > bounds.max) {
			selectionXY = bounds.max - selectionWH;
			outOfBounds = true;
		}
		
		// Is the chart dragged off its bounds, determined by dataMin and dataMax?
		if (outOfBounds) {

			// Modify the touchNow position in order to create an elastic drag movement. This indicates
			// to the user that the chart is responsive but can't be dragged further.
			touch0Now -= 0.8 * (touch0Now - lastValidTouch[xy][0]);
			if (!singleTouch) {
				touch1Now -= 0.8 * (touch1Now - lastValidTouch[xy][1]);
			}

			// Set the scale, second pass to adapt to the modified touchNow positions
			setScale();

		} else {
			lastValidTouch[xy] = [touch0Now, touch1Now];
		}

		
		// Set geometry for clipping, selection and transformation
		if (!inverted) { // TODO: implement clipping for inverted charts
			clip[xy] = clipXY - plotLeftTop;
			clip[wh] = selectionWH;
		}
		scaleKey = inverted ? (horiz ? 'scaleY' : 'scaleX') : 'scale' + XY;
		transformScale = inverted ? 1 / scale : scale;

		selectionMarker[wh] = selectionWH;
		selectionMarker[xy] = selectionXY;
		transform[scaleKey] = scale;
		transform['translate' + XY] = (transformScale * plotLeftTop) + (touch0Now - (transformScale * touch0Start));
	},
	
	/**
	 * Handle touch events with two touches
	 */
	pinch: function (e) {

		var self = this,
			chart = self.chart,
			pinchDown = self.pinchDown,
			followTouchMove = chart.tooltip && chart.tooltip.options.followTouchMove,
			touches = e.touches,
			touchesLength = touches.length,
			lastValidTouch = self.lastValidTouch,
			zoomHor = self.zoomHor || self.pinchHor,
			zoomVert = self.zoomVert || self.pinchVert,
			hasZoom = zoomHor || zoomVert,
			selectionMarker = self.selectionMarker,
			transform = {},
			clip = {};

		// On touch devices, only proceed to trigger click if a handler is defined
		if (e.type === 'touchstart') {
			if (followTouchMove || hasZoom) {
				e.preventDefault();
			}
		}
			
		// Normalize each touch
		map(touches, function (e) {
			return self.normalize(e);
		});
			
		// Register the touch start position
		if (e.type === 'touchstart') {
			each(touches, function (e, i) {
				pinchDown[i] = { chartX: e.chartX, chartY: e.chartY };
			});
			lastValidTouch.x = [pinchDown[0].chartX, pinchDown[1] && pinchDown[1].chartX];
			lastValidTouch.y = [pinchDown[0].chartY, pinchDown[1] && pinchDown[1].chartY];

			// Identify the data bounds in pixels
			each(chart.axes, function (axis) {
				if (axis.zoomEnabled) {
					var bounds = chart.bounds[axis.horiz ? 'h' : 'v'],
						minPixelPadding = axis.minPixelPadding,
						min = axis.toPixels(axis.dataMin),
						max = axis.toPixels(axis.dataMax),
						absMin = mathMin(min, max),
						absMax = mathMax(min, max);

					// Store the bounds for use in the touchmove handler
					bounds.min = mathMin(axis.pos, absMin - minPixelPadding);
					bounds.max = mathMax(axis.pos + axis.len, absMax + minPixelPadding);
				}
			});
		
		// Event type is touchmove, handle panning and pinching
		} else if (pinchDown.length) { // can be 0 when releasing, if touchend fires first
			

			// Set the marker
			if (!selectionMarker) {
				self.selectionMarker = selectionMarker = extend({
					destroy: noop
				}, chart.plotBox);
			}

			

			if (zoomHor) {
				self.pinchTranslateDirection(true, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
			}
			if (zoomVert) {
				self.pinchTranslateDirection(false, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
			}

			self.hasPinched = hasZoom;

			// Scale and translate the groups to provide visual feedback during pinching
			self.scaleGroups(transform, clip);
			
			// Optionally move the tooltip on touchmove
			if (!hasZoom && followTouchMove && touchesLength === 1) {
				this.runPointActions(self.normalize(e));
			}
		}
	},

	/**
	 * Start a drag operation
	 */
	dragStart: function (e) {
		var chart = this.chart;

		// Record the start position
		chart.mouseIsDown = e.type;
		chart.cancelClick = false;
		chart.mouseDownX = this.mouseDownX = e.chartX;
		this.mouseDownY = e.chartY;
	},

	/**
	 * Perform a drag operation in response to a mousemove event while the mouse is down
	 */
	drag: function (e) {

		var chart = this.chart,
			chartOptions = chart.options.chart,
			chartX = e.chartX,
			chartY = e.chartY,
			zoomHor = this.zoomHor,
			zoomVert = this.zoomVert,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			clickedInside,
			size,
			mouseDownX = this.mouseDownX,
			mouseDownY = this.mouseDownY;

		// If the mouse is outside the plot area, adjust to cooordinates
		// inside to prevent the selection marker from going outside
		if (chartX < plotLeft) {
			chartX = plotLeft;
		} else if (chartX > plotLeft + plotWidth) {
			chartX = plotLeft + plotWidth;
		}

		if (chartY < plotTop) {
			chartY = plotTop;
		} else if (chartY > plotTop + plotHeight) {
			chartY = plotTop + plotHeight;
		}
		
		// determine if the mouse has moved more than 10px
		this.hasDragged = Math.sqrt(
			Math.pow(mouseDownX - chartX, 2) +
			Math.pow(mouseDownY - chartY, 2)
		);
		if (this.hasDragged > 10) {
			clickedInside = chart.isInsidePlot(mouseDownX - plotLeft, mouseDownY - plotTop);

			// make a selection
			if (chart.hasCartesianSeries && (this.zoomX || this.zoomY) && clickedInside) {
				if (!this.selectionMarker) {
					this.selectionMarker = chart.renderer.rect(
						plotLeft,
						plotTop,
						zoomHor ? 1 : plotWidth,
						zoomVert ? 1 : plotHeight,
						0
					)
					.attr({
						fill: chartOptions.selectionMarkerFill || 'rgba(69,114,167,0.25)',
						zIndex: 7
					})
					.add();
				}
			}

			// adjust the width of the selection marker
			if (this.selectionMarker && zoomHor) {
				size = chartX - mouseDownX;
				this.selectionMarker.attr({
					width: mathAbs(size),
					x: (size > 0 ? 0 : size) + mouseDownX
				});
			}
			// adjust the height of the selection marker
			if (this.selectionMarker && zoomVert) {
				size = chartY - mouseDownY;
				this.selectionMarker.attr({
					height: mathAbs(size),
					y: (size > 0 ? 0 : size) + mouseDownY
				});
			}

			// panning
			if (clickedInside && !this.selectionMarker && chartOptions.panning) {
				chart.pan(chartX);
			}
		}
	},

	/**
	 * On mouse up or touch end across the entire document, drop the selection.
	 */
	drop: function (e) {
		var chart = this.chart,
			hasPinched = this.hasPinched;

		if (this.selectionMarker) {
			var selectionData = {
					xAxis: [],
					yAxis: [],
					originalEvent: e.originalEvent || e
				},
				selectionBox = this.selectionMarker,
				selectionLeft = selectionBox.x,
				selectionTop = selectionBox.y,
				runZoom;
			// a selection has been made
			if (this.hasDragged || hasPinched) {

				// record each axis' min and max
				each(chart.axes, function (axis) {
					if (axis.zoomEnabled) {
						var horiz = axis.horiz,
							selectionMin = axis.toValue((horiz ? selectionLeft : selectionTop)),
							selectionMax = axis.toValue((horiz ? selectionLeft + selectionBox.width : selectionTop + selectionBox.height));

						if (!isNaN(selectionMin) && !isNaN(selectionMax)) { // #859
							selectionData[axis.xOrY + 'Axis'].push({
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
						chart.zoom(extend(args, hasPinched ? { animation: false } : null)); 
					});
				}

			}
			this.selectionMarker = this.selectionMarker.destroy();

			// Reset scaling preview
			if (hasPinched) {
				this.scaleGroups();
			}
		}

		// Reset all
		if (chart) { // it may be destroyed on mouse up - #877
			css(chart.container, { cursor: chart._cursor });
			chart.cancelClick = this.hasDragged > 10; // #370
			chart.mouseIsDown = this.hasDragged = this.hasPinched = false;
			this.pinchDown = [];
		}
	},

	onContainerMouseDown: function (e) {

		e = this.normalize(e);

		// issue #295, dragging not always working in Firefox
		if (e.preventDefault) {
			e.preventDefault();
		}
		
		this.dragStart(e);
	},

	

	onDocumentMouseUp: function (e) {
		this.drop(e);
	},

	/**
	 * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
	 * Issue #149 workaround. The mouseleave event does not always fire. 
	 */
	onDocumentMouseMove: function (e) {
		var chart = this.chart,
			chartPosition = this.chartPosition,
			hoverSeries = chart.hoverSeries;

		// Get e.pageX and e.pageY back in MooTools
		e = washMouseEvent(e);

		// If we're outside, hide the tooltip
		if (chartPosition && hoverSeries && hoverSeries.isCartesian &&
			!chart.isInsidePlot(e.pageX - chartPosition.left - chart.plotLeft,
			e.pageY - chartPosition.top - chart.plotTop)) {
				this.reset();
		}
	},

	/**
	 * When mouse leaves the container, hide the tooltip.
	 */
	onContainerMouseLeave: function () {
		this.reset();
		this.chartPosition = null; // also reset the chart position, used in #149 fix
	},

	// The mousemove, touchmove and touchstart event handler
	onContainerMouseMove: function (e) {

		var chart = this.chart;

		// normalize
		e = this.normalize(e);

		// #295
		e.returnValue = false;
		
		
		if (chart.mouseIsDown === 'mousedown') {
			this.drag(e);
		} 
		
		// Show the tooltip and run mouse over events (#977)
		if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop) && !chart.openMenu) {
			this.runPointActions(e);
		}
	},

	/**
	 * Utility to detect whether an element has, or has a parent with, a specific
	 * class name. Used on detection of tracker objects and on deciding whether
	 * hovering the tooltip should cause the active series to mouse out.
	 */
	inClass: function (element, className) {
		var elemClassName;
		while (element) {
			elemClassName = attr(element, 'class');
			if (elemClassName) {
				if (elemClassName.indexOf(className) !== -1) {
					return true;
				} else if (elemClassName.indexOf(PREFIX + 'container') !== -1) {
					return false;
				}
			}
			element = element.parentNode;
		}		
	},

	onTrackerMouseOut: function (e) {
		var series = this.chart.hoverSeries;
		if (series && !series.options.stickyTracking && !this.inClass(e.toElement || e.relatedTarget, PREFIX + 'tooltip')) {
			series.onMouseOut();
		}
	},

	onContainerClick: function (e) {
		var chart = this.chart,
			hoverPoint = chart.hoverPoint, 
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			inverted = chart.inverted,
			chartPosition,
			plotX,
			plotY;
		
		e = this.normalize(e);
		e.cancelBubble = true; // IE specific

		if (!chart.cancelClick) {
			
			// On tracker click, fire the series and point events. #783, #1583
			if (hoverPoint && this.inClass(e.target, PREFIX + 'tracker')) {
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
				if (chart.hoverPoint) { // it may be destroyed (#1844)
					hoverPoint.firePointEvent('click', e);
				}

			// When clicking outside a tracker, fire a chart event
			} else {
				extend(e, this.getCoordinates(e));

				// fire a click event in the chart
				if (chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
					fireEvent(chart, 'click', e);
				}
			}


		}
	},

	onContainerTouchStart: function (e) {
		var chart = this.chart;

		if (e.touches.length === 1) {

			e = this.normalize(e);

			if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {

				// Prevent the click pseudo event from firing unless it is set in the options
				/*if (!chart.runChartClick) {
					e.preventDefault();
				}*/
			
				// Run mouse events and display tooltip etc
				this.runPointActions(e);

				this.pinch(e);

			} else {
				// Hide the tooltip on touching outside the plot area (#1203)
				this.reset();
			}

		} else if (e.touches.length === 2) {
			this.pinch(e);	
		}		
	},

	onContainerTouchMove: function (e) {
		if (e.touches.length === 1 || e.touches.length === 2) {
			this.pinch(e);
		}
	},

	onDocumentTouchEnd: function (e) {
		this.drop(e);
	},

	/**
	 * Set the JS DOM events on the container and document. This method should contain
	 * a one-to-one assignment between methods and their handlers. Any advanced logic should
	 * be moved to the handler reflecting the event's name.
	 */
	setDOMEvents: function () {

		var pointer = this,
			container = pointer.chart.container,
			events;

		this._events = events = [
			[container, 'onmousedown', 'onContainerMouseDown'],
			[container, 'onmousemove', 'onContainerMouseMove'],
			[container, 'onclick', 'onContainerClick'],
			[container, 'mouseleave', 'onContainerMouseLeave'],
			[doc, 'mousemove', 'onDocumentMouseMove'],
			[doc, 'mouseup', 'onDocumentMouseUp']
		];

		if (hasTouch) {
			events.push(
				[container, 'ontouchstart', 'onContainerTouchStart'],
				[container, 'ontouchmove', 'onContainerTouchMove'],
				[doc, 'touchend', 'onDocumentTouchEnd']
			);
		}

		each(events, function (eventConfig) {

			// First, create the callback function that in turn calls the method on Pointer
			pointer['_' + eventConfig[2]] = function (e) {
				pointer[eventConfig[2]](e);
			};

			// Now attach the function, either as a direct property or through addEvent
			if (eventConfig[1].indexOf('on') === 0) {
				eventConfig[0][eventConfig[1]] = pointer['_' + eventConfig[2]];
			} else {
				addEvent(eventConfig[0], eventConfig[1], pointer['_' + eventConfig[2]]);
			}
		});

		
	},

	/**
	 * Destroys the Pointer object and disconnects DOM events.
	 */
	destroy: function () {
		var pointer = this;

		// Release all DOM events
		each(pointer._events, function (eventConfig) {	
			if (eventConfig[1].indexOf('on') === 0) {
				eventConfig[0][eventConfig[1]] = null; // delete breaks oldIE
			} else {		
				removeEvent(eventConfig[0], eventConfig[1], pointer['_' + eventConfig[2]]);
			}
		});
		delete pointer._events;

		// memory and CPU leak
		clearInterval(pointer.tooltipTimeout);
	}
};
