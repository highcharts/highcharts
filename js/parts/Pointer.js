
var hoverChartIndex;

// Global flag for touch support
hasTouch = doc && doc.documentElement.ontouchstart !== UNDEFINED;

/**
 * The mouse tracker object. All methods starting with "on" are primary DOM event handlers.
 * Subsequent methods should be named differently from what they are doing.
 * @param {Object} chart The Chart instance
 * @param {Object} options The root options object
 */
var Pointer = Highcharts.Pointer = function (chart, options) {
	this.init(chart, options);
};

Pointer.prototype = {
	/**
	 * Initialize Pointer
	 */
	init: function (chart, options) {

		var chartOptions = options.chart,
			chartEvents = chartOptions.events,
			zoomType = useCanVG ? '' : chartOptions.zoomType,
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
		this.hasZoom = zoomX || zoomY;

		// Do we need to handle click on a touch device?
		this.runChartClick = chartEvents && !!chartEvents.click;

		this.pinchDown = [];
		this.lastValidTouch = {};

		if (Highcharts.Tooltip && options.tooltip.enabled) {
			chart.tooltip = new Tooltip(chart, options.tooltip);
			this.followTouchMove = pick(options.tooltip.followTouchMove, true);
		}

		this.setDOMEvents();
	},

	/**
	 * Add crossbrowser support for chartX and chartY
	 * @param {Object} e The event object in standard browsers
	 */
	normalize: function (e, chartPosition) {
		var chartX,
			chartY,
			ePos;

		// IE normalizing
		e = e || win.event;
		if (!e.target) {
			e.target = e.srcElement;
		}

		// iOS (#2757)
		ePos = e.touches ?  (e.touches.length ? e.touches.item(0) : e.changedTouches[0]) : e;

		// Get mouse position
		if (!chartPosition) {
			this.chartPosition = chartPosition = offset(this.chart.container);
		}

		// chartX and chartY
		if (ePos.pageX === UNDEFINED) { // IE < 9. #886.
			chartX = mathMax(e.x, e.clientX - chartPosition.left); // #2005, #2129: the second case is
				// for IE10 quirks mode within framesets
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
	 * With line type charts with a single tracker, get the point closest to the mouse.
	 * Run Point.onMouseOver and display tooltip for the point or points.
	 */
	runPointActions: function (e) {

		var pointer = this,
			chart = pointer.chart,
			series = chart.series,
			tooltip = chart.tooltip,
			shared = tooltip ? tooltip.shared : false,
			followPointer,
			updatePosition = true,
			hoverPoint = chart.hoverPoint,
			hoverSeries = chart.hoverSeries,
			i,
			anchor,
			noSharedTooltip,
			stickToHoverSeries,
			directTouch,
			kdpoints = [],
			kdpointT;

		// For hovering over the empty parts of the plot area (hoverSeries is undefined).
		// If there is one series with point tracking (combo chart), don't go to nearest neighbour.
		if (!shared && !hoverSeries) {
			for (i = 0; i < series.length; i++) {
				if (series[i].directTouch || !series[i].options.stickyTracking) {
					series = [];
				}
			}
		}

		// If it has a hoverPoint and that series requires direct touch (like columns, #3899), or we're on
		// a noSharedTooltip series among shared tooltip series (#4546), use the hoverPoint . Otherwise,
		// search the k-d tree.
		stickToHoverSeries = hoverSeries && (shared ? hoverSeries.noSharedTooltip : hoverSeries.directTouch);
		if (stickToHoverSeries && hoverPoint) {
			kdpoints = [hoverPoint];

		// Handle shared tooltip or cases where a series is not yet hovered
		} else {
			// When we have non-shared tooltip and sticky tracking is disabled,
			// search for the closest point only on hovered series: #5533, #5476
			if (!shared && hoverSeries && !hoverSeries.options.stickyTracking) {
				series = [hoverSeries];
			}
			// Find nearest points on all series
			each(series, function (s) {
				// Skip hidden series
				noSharedTooltip = s.noSharedTooltip && shared;
				directTouch = !shared && s.directTouch;
				if (s.visible && !noSharedTooltip && !directTouch && pick(s.options.enableMouseTracking, true)) { // #3821
					kdpointT = s.searchPoint(e, !noSharedTooltip && s.kdDimensions === 1); // #3828
					if (kdpointT && kdpointT.series) { // Point.series becomes null when reset and before redraw (#5197)
						kdpoints.push(kdpointT);
					}
				}
			});

			// Sort kdpoints by distance to mouse pointer
			kdpoints.sort(function (p1, p2) {
				var isCloserX = p1.distX - p2.distX,
					isCloser = p1.dist - p2.dist,
					isAbove = p1.series.group.zIndex > p2.series.group.zIndex ? -1 : 1;
				// We have two points which are not in the same place on xAxis and shared tooltip:
				if (isCloserX !== 0) {
					return isCloserX;
				}
				// Points are not exactly in the same place on x/yAxis:
				if (isCloser !== 0) {
					return isCloser;
				}
				// The same xAxis and yAxis position, sort by z-index:
				return isAbove;
			});
		}

		// Remove points with different x-positions, required for shared tooltip and crosshairs (#4645):
		if (shared) {
			i = kdpoints.length;
			while (i--) {
				if (kdpoints[i].clientX !== kdpoints[0].clientX || kdpoints[i].series.noSharedTooltip) {
					kdpoints.splice(i, 1);
				}
			}
		}

		// Refresh tooltip for kdpoint if new hover point or tooltip was hidden // #3926, #4200
		if (kdpoints[0] && (kdpoints[0] !== pointer.hoverPoint || (tooltip && tooltip.isHidden))) {
			// Draw tooltip if necessary
			if (shared && !kdpoints[0].series.noSharedTooltip) {
				// Do mouseover on all points (#3919, #3985, #4410)
				for (i = 0; i >= 0; i--) {
					kdpoints[i].onMouseOver(e, kdpoints[i] !== ((hoverSeries && hoverSeries.directTouch && hoverPoint) || kdpoints[0]));
				}
				// Make sure that the hoverPoint and hoverSeries are stored for events (e.g. click), #5622
				if (hoverSeries && hoverSeries.directTouch && hoverPoint && hoverPoint !== kdpoints[0]) {
					hoverPoint.onMouseOver(e, false);
				}
				if (kdpoints.length && tooltip) {
					// Keep the order of series in tooltip:
					tooltip.refresh(kdpoints.sort(function (p1, p2) {
						return p1.series.index - p2.series.index;
					}), e);
				}
			} else {
				if (tooltip) {
					tooltip.refresh(kdpoints[0], e);
				}
				if (!hoverSeries || !hoverSeries.directTouch) { // #4448
					kdpoints[0].onMouseOver(e);
				}
			}
			pointer.prevKDPoint = kdpoints[0];
			updatePosition = false;
		}
		// Update positions (regardless of kdpoint or hoverPoint)
		if (updatePosition) {
			followPointer = hoverSeries && hoverSeries.tooltipOptions.followPointer;
			if (tooltip && followPointer && !tooltip.isHidden) {
				anchor = tooltip.getAnchor([{}], e);
				tooltip.updatePosition({ plotX: anchor[0], plotY: anchor[1] });
			}
		}

		// Start the event listener to pick up the tooltip and crosshairs
		if (!pointer._onDocumentMouseMove) {
			pointer._onDocumentMouseMove = function (e) {
				if (charts[hoverChartIndex]) {
					charts[hoverChartIndex].pointer.onDocumentMouseMove(e);
				}
			};
			addEvent(doc, 'mousemove', pointer._onDocumentMouseMove);
		}

		// Crosshair. For each hover point, loop over axes and draw cross if that point
		// belongs to the axis (#4927).
		each(shared ? kdpoints : [pick(hoverPoint, kdpoints[0])], function drawPointCrosshair(point) { // #5269
			each(chart.axes, function drawAxisCrosshair(axis) {
				// In case of snap = false, point is undefined, and we draw the crosshair anyway (#5066)
				if (!point || point.series && point.series[axis.coll] === axis) { // #5658
					axis.drawCrosshair(e, point);
				}
			});
		});
	},

	/**
	 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
	 *
	 * @param allowMove {Boolean} Instead of destroying the tooltip altogether, allow moving it if possible
	 */
	reset: function (allowMove, delay) {
		var pointer = this,
			chart = pointer.chart,
			hoverSeries = chart.hoverSeries,
			hoverPoint = chart.hoverPoint,
			hoverPoints = chart.hoverPoints,
			tooltip = chart.tooltip,
			tooltipPoints = tooltip && tooltip.shared ? hoverPoints : hoverPoint;

		// Check if the points have moved outside the plot area (#1003, #4736, #5101)
		if (allowMove && tooltipPoints) {
			each(splat(tooltipPoints), function (point) {
				if (point.series.isCartesian && point.plotX === undefined) {
					allowMove = false;
				}
			});
		}
		
		// Just move the tooltip, #349
		if (allowMove) {
			if (tooltip && tooltipPoints) {
				tooltip.refresh(tooltipPoints);
				if (hoverPoint) { // #2500
					hoverPoint.setState(hoverPoint.state, true);
					each(chart.axes, function (axis) {
						if (axis.crosshair) {
							axis.drawCrosshair(null, hoverPoint);
						}
					});
				}
			}

		// Full reset
		} else {

			if (hoverPoint) {
				hoverPoint.onMouseOut();
			}

			if (hoverPoints) {
				each(hoverPoints, function (point) {
					point.setState();
				});
			}

			if (hoverSeries) {
				hoverSeries.onMouseOut();
			}

			if (tooltip) {
				tooltip.hide(delay);
			}

			if (pointer._onDocumentMouseMove) {
				removeEvent(doc, 'mousemove', pointer._onDocumentMouseMove);
				pointer._onDocumentMouseMove = null;
			}

			// Remove crosshairs
			each(chart.axes, function (axis) {
				axis.hideCrosshair();
			});

			pointer.hoverX = pointer.prevKDPoint = chart.hoverPoints = chart.hoverPoint = null;
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
				series.group.attr(seriesAttribs);
				if (series.markerGroup) {
					series.markerGroup.attr(seriesAttribs);
					series.markerGroup.clip(clip ? chart.clipRect : null);
				}
				if (series.dataLabelsGroup) {
					series.dataLabelsGroup.attr(seriesAttribs);
				}
			}
		});

		// Clip
		chart.clipRect.attr(clip || chart.clipBox);
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
		chart.mouseDownY = this.mouseDownY = e.chartY;
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
			selectionMarker = this.selectionMarker,
			mouseDownX = this.mouseDownX,
			mouseDownY = this.mouseDownY,
			panKey = chartOptions.panKey && e[chartOptions.panKey + 'Key'];

		// If the device supports both touch and mouse (like IE11), and we are touch-dragging
		// inside the plot area, don't handle the mouse event. #4339.
		if (selectionMarker && selectionMarker.touch) {
			return;
		}

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
			if (chart.hasCartesianSeries && (this.zoomX || this.zoomY) && clickedInside && !panKey) {
				if (!selectionMarker) {
					this.selectionMarker = selectionMarker = chart.renderer.rect(
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
			if (selectionMarker && zoomHor) {
				size = chartX - mouseDownX;
				selectionMarker.attr({
					width: mathAbs(size),
					x: (size > 0 ? 0 : size) + mouseDownX
				});
			}
			// adjust the height of the selection marker
			if (selectionMarker && zoomVert) {
				size = chartY - mouseDownY;
				selectionMarker.attr({
					height: mathAbs(size),
					y: (size > 0 ? 0 : size) + mouseDownY
				});
			}

			// panning
			if (clickedInside && !selectionMarker && chartOptions.panning) {
				chart.pan(e, chartOptions.panning);
			}
		}
	},

	/**
	 * On mouse up or touch end across the entire document, drop the selection.
	 */
	drop: function (e) {
		var pointer = this,
			chart = this.chart,
			hasPinched = this.hasPinched;

		if (this.selectionMarker) {
			var selectionData = {
					originalEvent: e, // #4890
					xAxis: [],
					yAxis: []
				},
				selectionBox = this.selectionMarker,
				selectionLeft = selectionBox.attr ? selectionBox.attr('x') : selectionBox.x,
				selectionTop = selectionBox.attr ? selectionBox.attr('y') : selectionBox.y,
				selectionWidth = selectionBox.attr ? selectionBox.attr('width') : selectionBox.width,
				selectionHeight = selectionBox.attr ? selectionBox.attr('height') : selectionBox.height,
				runZoom;

			// a selection has been made
			if (this.hasDragged || hasPinched) {

				// record each axis' min and max
				each(chart.axes, function (axis) {
					if (axis.zoomEnabled && defined(axis.min) && (hasPinched || pointer[{ xAxis: 'zoomX', yAxis: 'zoomY' }[axis.coll]])) { // #859, #3569
						var horiz = axis.horiz,
							minPixelPadding = e.type === 'touchend' ? axis.minPixelPadding : 0, // #1207, #3075
							selectionMin = axis.toValue((horiz ? selectionLeft : selectionTop) + minPixelPadding),
							selectionMax = axis.toValue((horiz ? selectionLeft + selectionWidth : selectionTop + selectionHeight) - minPixelPadding);

						selectionData[axis.coll].push({
							axis: axis,
							min: mathMin(selectionMin, selectionMax), // for reversed axes
							max: mathMax(selectionMin, selectionMax)
						});
						runZoom = true;
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
		if (charts[hoverChartIndex]) {
			charts[hoverChartIndex].pointer.drop(e);
		}
	},

	/**
	 * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
	 * Issue #149 workaround. The mouseleave event does not always fire.
	 */
	onDocumentMouseMove: function (e) {
		var chart = this.chart,
			chartPosition = this.chartPosition;

		e = this.normalize(e, chartPosition);

		// If we're outside, hide the tooltip
		if (chartPosition && !this.inClass(e.target, 'highcharts-tracker') &&
				!chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
			this.reset();
		}
	},

	/**
	 * When mouse leaves the container, hide the tooltip.
	 */
	onContainerMouseLeave: function (e) {
		var chart = charts[hoverChartIndex];
		if (chart && (e.relatedTarget || e.toElement)) { // #4886, MS Touch end fires mouseleave but with no related target
			chart.pointer.reset();
			chart.pointer.chartPosition = null; // also reset the chart position, used in #149 fix
		}
	},

	// The mousemove, touchmove and touchstart event handler
	onContainerMouseMove: function (e) {

		var chart = this.chart;

		if (!defined(hoverChartIndex) || !charts[hoverChartIndex] || !charts[hoverChartIndex].mouseIsDown) {
			hoverChartIndex = chart.index;
		}

		e = this.normalize(e);
		e.returnValue = false; // #2251, #3224

		if (chart.mouseIsDown === 'mousedown') {
			this.drag(e);
		}

		// Show the tooltip and run mouse over events (#977)
		if ((this.inClass(e.target, 'highcharts-tracker') ||
				chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) && !chart.openMenu) {
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
				}
				if (elemClassName.indexOf(PREFIX + 'container') !== -1) {
					return false;
				}
			}
			element = element.parentNode;
		}
	},

	onTrackerMouseOut: function (e) {
		var series = this.chart.hoverSeries,
			relatedTarget = e.relatedTarget || e.toElement;

		if (series && relatedTarget && !series.options.stickyTracking && // #4886
				!this.inClass(relatedTarget, PREFIX + 'tooltip') &&
				!this.inClass(relatedTarget, PREFIX + 'series-' + series.index)) { // #2499, #4465
			series.onMouseOut();
		}
	},

	onContainerClick: function (e) {
		var chart = this.chart,
			hoverPoint = chart.hoverPoint,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop;

		e = this.normalize(e);

		if (!chart.cancelClick) {

			// On tracker click, fire the series and point events. #783, #1583
			if (hoverPoint && this.inClass(e.target, PREFIX + 'tracker')) {

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

	/**
	 * Set the JS DOM events on the container and document. This method should contain
	 * a one-to-one assignment between methods and their handlers. Any advanced logic should
	 * be moved to the handler reflecting the event's name.
	 */
	setDOMEvents: function () {

		var pointer = this,
			container = pointer.chart.container;

		container.onmousedown = function (e) {
			pointer.onContainerMouseDown(e);
		};
		container.onmousemove = function (e) {
			pointer.onContainerMouseMove(e);
		};
		container.onclick = function (e) {
			pointer.onContainerClick(e);
		};
		addEvent(container, 'mouseleave', pointer.onContainerMouseLeave);
		if (chartCount === 1) {
			addEvent(doc, 'mouseup', pointer.onDocumentMouseUp);
		}
		if (hasTouch) {
			container.ontouchstart = function (e) {
				pointer.onContainerTouchStart(e);
			};
			container.ontouchmove = function (e) {
				pointer.onContainerTouchMove(e);
			};
			if (chartCount === 1) {
				addEvent(doc, 'touchend', pointer.onDocumentTouchEnd);
			}
		}

	},

	/**
	 * Destroys the Pointer object and disconnects DOM events.
	 */
	destroy: function () {
		var prop;

		removeEvent(this.chart.container, 'mouseleave', this.onContainerMouseLeave);
		if (!chartCount) {
			removeEvent(doc, 'mouseup', this.onDocumentMouseUp);
			removeEvent(doc, 'touchend', this.onDocumentTouchEnd);
		}

		// memory and CPU leak
		clearInterval(this.tooltipTimeout);

		for (prop in this) {
			this[prop] = null;
		}
	}
};


