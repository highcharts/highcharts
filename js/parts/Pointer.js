/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Tooltip.js';
import './Color.js';
var addEvent = H.addEvent,
	attr = H.attr,
	charts = H.charts,
	color = H.color,
	css = H.css,
	defined = H.defined,
	doc = H.doc,
	each = H.each,
	extend = H.extend,
	fireEvent = H.fireEvent,
	offset = H.offset,
	pick = H.pick,
	removeEvent = H.removeEvent,
	splat = H.splat,
	Tooltip = H.Tooltip,
	win = H.win;

/**
 * The mouse tracker object. All methods starting with "on" are primary DOM
 * event handlers. Subsequent methods should be named differently from what they
 * are doing.
 *
 * @constructor Pointer
 * @param {Object} chart The Chart instance
 * @param {Object} options The root options object
 */
H.Pointer = function (chart, options) {
	this.init(chart, options);
};

H.Pointer.prototype = {
	/**
	 * Initialize Pointer
	 */
	init: function (chart, options) {

		// Store references
		this.options = options;
		this.chart = chart;

		// Do we need to handle click on a touch device?
		this.runChartClick = options.chart.events && !!options.chart.events.click;

		this.pinchDown = [];
		this.lastValidTouch = {};

		if (Tooltip && options.tooltip.enabled) {
			chart.tooltip = new Tooltip(chart, options.tooltip);
			this.followTouchMove = pick(options.tooltip.followTouchMove, true);
		}

		this.setDOMEvents();
	},

	/**
	 * Resolve the zoomType option, this is reset on all touch start and mouse
	 * down events.
	 */
	zoomOption: function (e) {
		var chart = this.chart,
			options = chart.options.chart,
			zoomType = options.zoomType || '',
			inverted = chart.inverted,
			zoomX,
			zoomY;

		// Look for the pinchType option
		if (/touch/.test(e.type)) {
			zoomType = pick(options.pinchType, zoomType);
		}

		this.zoomX = zoomX = /x/.test(zoomType);
		this.zoomY = zoomY = /y/.test(zoomType);
		this.zoomHor = (zoomX && !inverted) || (zoomY && inverted);
		this.zoomVert = (zoomY && !inverted) || (zoomX && inverted);
		this.hasZoom = zoomX || zoomY;
	},

	/**
	 * @typedef  {Object} PointerEvent
	 *           A native browser mouse or touch event, extended with position
	 *           information relative to the {@link Chart.container}.
	 * @property {Number} chartX
	 *           The X coordinate of the pointer interaction relative to the
	 *           chart.
	 * @property {Number} chartY
	 *           The Y coordinate of the pointer interaction relative to the 
	 *           chart.
	 * 
	 */
	/**
	 * Add crossbrowser support for chartX and chartY.
	 * 
	 * @param  {Object} e
	 *         The event object in standard browsers.
	 *
	 * @return {PointerEvent}
	 *         A browser event with extended properties `chartX` and `chartY`
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
		if (ePos.pageX === undefined) { // IE < 9. #886.
			chartX = Math.max(e.x, e.clientX - chartPosition.left); // #2005, #2129: the second case is 
				// for IE10 quirks mode within framesets
			chartY = e.y;
		} else {
			chartX = ePos.pageX - chartPosition.left;
			chartY = ePos.pageY - chartPosition.top;
		}

		return extend(e, {
			chartX: Math.round(chartX),
			chartY: Math.round(chartY)
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
	 * Collects the points closest to a mouseEvent
	 * @param  {Array} series Array of series to gather points from
	 * @param  {Boolean} shared True if shared tooltip, otherwise false
	 * @param  {Object} e Mouse event which possess a position to compare against
	 * @return {Array} KDPoints sorted by distance
	 */
	getKDPoints: function (series, shared, e) {
		var kdpoints = [],
			noSharedTooltip,
			directTouch,
			kdpointT,
			i;

		// Find nearest points on all series
		each(series, function (s) {
			// Skip hidden series
			noSharedTooltip = s.noSharedTooltip && shared;
			directTouch = !shared && s.directTouch;
			if (s.visible && !directTouch && pick(s.options.enableMouseTracking, true)) { // #3821
				// #3828
				kdpointT = s.searchPoint(
					e,
					!noSharedTooltip && s.options.findNearestPointBy.indexOf('y') < 0
				);
				if (kdpointT && kdpointT.series) { // Point.series becomes null when reset and before redraw (#5197)
					kdpoints.push(kdpointT);
				}
			}
		});

		// Sort kdpoints by distance to mouse pointer
		kdpoints.sort(function (p1, p2) {
			var isCloserX = p1.distX - p2.distX,
				isCloser = p1.dist - p2.dist,
				isAbove =
					(p2.series.group && p2.series.group.zIndex) -
					(p1.series.group && p1.series.group.zIndex),
				result;

			// We have two points which are not in the same place on xAxis and shared tooltip:
			if (isCloserX !== 0 && shared) { // #5721
				result = isCloserX;
			// Points are not exactly in the same place on x/yAxis:
			} else if (isCloser !== 0) {
				result = isCloser;
			// The same xAxis and yAxis position, sort by z-index:
			} else if (isAbove !== 0) {
				result = isAbove;
			// The same zIndex, sort by array index:
			} else {
				result = p1.series.index > p2.series.index ? -1 : 1;
			}
			return result;
		});

		// Remove points with different x-positions, required for shared tooltip and crosshairs (#4645):
		if (shared && kdpoints[0] && !kdpoints[0].series.noSharedTooltip) {
			i = kdpoints.length;
			while (i--) {
				if (kdpoints[i].x !== kdpoints[0].x || kdpoints[i].series.noSharedTooltip) {
					kdpoints.splice(i, 1);
				}
			}
		}
		return kdpoints;
	},
	getPointFromEvent: function (e) {
		var target = e.target,
			point;

		while (target && !point) {
			point = target.point;
			target = target.parentNode;
		}
		return point;
	},
	
	getChartCoordinatesFromPoint: function (point, inverted) {
		var series = point.series,
			xAxis = series.xAxis,
			yAxis = series.yAxis;
		return inverted ? {
			chartX: xAxis.len + xAxis.pos - point.clientX,
			chartY: yAxis.len + yAxis.pos - point.plotY
		} : {
			chartX: point.clientX + xAxis.pos,
			chartY: point.plotY + yAxis.pos
		};
	},

	/**
	 * getHoverData - Calculates what is the current hovered point/points and series.
	 *
	 * @param  {undefined|object} existingHoverPoint The point currrently beeing hovered.
	 * @param  {undefined|object} existingHoverSeries The series currently beeing hovered.
	 * @param  {Array} series All the series in the chart.
	 * @param  {boolean} isDirectTouch Is the pointer directly hovering the point.
	 * @param  {boolean} shared Wether it is a shared tooltip or not.
	 * @param  {object} coordinates Chart coordinates of the pointer.
	 * @param  {number} coordinates.chartX
	 * @param  {number} coordinates.chartY
	 * @return {object} Object containing resulting hover data.
	 */
	getHoverData: function (existingHoverPoint, existingHoverSeries, series, isDirectTouch, shared, coordinates) {
		var hoverPoint = existingHoverPoint,
			hoverSeries = existingHoverSeries,
			searchSeries = shared ? series : [hoverSeries],
			notSticky = hoverSeries && !hoverSeries.stickyTracking,
			isHoverPoint = function (point, i) {
				return i === 0;
			},
			hoverPoints;

		// If there is a hoverPoint and its series requires direct touch (like columns, #3899), or we're on
		// a noSharedTooltip series among shared tooltip series (#4546), use the existing hoverPoint.
		if  (isDirectTouch && existingHoverPoint) {
			isHoverPoint = function (p) {
				return p === existingHoverPoint;
			};
		} else if (notSticky) {
			isHoverPoint = function (p) {
				return p.series === hoverSeries;
			};
		} else {
			// Avoid series with stickyTracking false
			searchSeries = H.grep(series, function (s) {
				return s.stickyTracking;
			});
		}
		hoverPoints = this.getKDPoints(searchSeries, shared, coordinates);
		hoverPoint = H.find(hoverPoints, isHoverPoint);
		hoverSeries = hoverPoint && hoverPoint.series;

		/* In this case we could only look for the hoverPoint in series with
		 * stickyTracking, but we should still include all series in the shared tooltip */
		if (!isDirectTouch && !notSticky && shared) {
			hoverPoints = this.getKDPoints(series, shared, coordinates);
		}
		// Keep the order of series in tooltip
		// Must be done after assigning of hoverPoint
		hoverPoints.sort(function (p1, p2) {
			return p1.series.index - p2.series.index;
		});

		return {
			hoverPoint: hoverPoint,
			hoverSeries: hoverSeries,
			hoverPoints: hoverPoints
		};
	},
	/**
	 * With line type charts with a single tracker, get the point closest to the mouse.
	 * Run Point.onMouseOver and display tooltip for the point or points.
	 */
	runPointActions: function (e, p) {
		var pointer = this,
			chart = pointer.chart,
			series = chart.series,
			tooltip = chart.tooltip,
			shared = tooltip ? tooltip.shared : false,
			hoverPoint = p || chart.hoverPoint,
			hoverSeries = hoverPoint && hoverPoint.series || chart.hoverSeries,
			// onMouseOver or already hovering a series with directTouch
			isDirectTouch = !!p || (hoverSeries && hoverSeries.directTouch),
			hoverData = this.getHoverData(hoverPoint, hoverSeries, series, isDirectTouch, shared, e),
			useSharedTooltip,
			followPointer,
			anchor,
			points;
		
		// Update variables from hoverData.
		hoverPoint = hoverData.hoverPoint;
		hoverSeries = hoverData.hoverSeries;
		followPointer = hoverSeries && hoverSeries.tooltipOptions.followPointer;
		useSharedTooltip = shared && hoverPoint && !hoverPoint.series.noSharedTooltip;
		points = (useSharedTooltip ? 
			hoverData.hoverPoints : 
			(hoverPoint ? [hoverPoint] : [])
		);
		// Refresh tooltip for kdpoint if new hover point or tooltip was hidden // #3926, #4200
		if (
			hoverPoint &&
			// !(hoverSeries && hoverSeries.directTouch) &&
			(hoverPoint !== chart.hoverPoint || (tooltip && tooltip.isHidden))
		) {
			each(chart.hoverPoints || [], function (p) {
				if (H.inArray(p, points) === -1) {
					p.setState();
				}
			});
			// Do mouseover on all points (#3919, #3985, #4410, #5622)
			each(points || [], function (p) {
				p.setState('hover');
			});
			// set normal state to previous series
			if (chart.hoverSeries !== hoverSeries) {
				hoverSeries.onMouseOver();
			}

			// If tracking is on series in stead of on each point, 
			// fire mouseOver on hover point. 
			if (hoverSeries && !hoverSeries.directTouch) { // #4448
				if (chart.hoverPoint) {
					chart.hoverPoint.firePointEvent('mouseOut');
				}
				hoverPoint.firePointEvent('mouseOver');
			}
			chart.hoverPoints = points;
			chart.hoverPoint = hoverPoint;
			// Draw tooltip if necessary
			if (tooltip) {
				tooltip.refresh(useSharedTooltip ? points : hoverPoint, e);
			}
		// Update positions (regardless of kdpoint or hoverPoint)
		} else if (followPointer && tooltip && !tooltip.isHidden) {
			anchor = tooltip.getAnchor([{}], e);
			tooltip.updatePosition({ plotX: anchor[0], plotY: anchor[1] });
		}

		// Start the event listener to pick up the tooltip and crosshairs
		if (!pointer.unDocMouseMove) {
			pointer.unDocMouseMove = addEvent(doc, 'mousemove', function (e) {
				var chart = charts[H.hoverChartIndex];
				if (chart) {
					chart.pointer.onDocumentMouseMove(e);
				}
			});
		}

		// Issues related to crosshair #4927, #5269 #5066, #5658
		each(chart.axes, function drawAxisCrosshair(axis) {
			var snap = pick(axis.crosshair.snap, true);
			if (!snap) {
				axis.drawCrosshair(e);
			// axis has snapping crosshairs, and one of the hover points is belongs to axis
			} else if (H.find(points, function (p) {
				return p.series[axis.coll] === axis;
			})) {
				axis.drawCrosshair(e, hoverPoint);
			// axis has snapping crosshairs, but no hover point is not belonging to axis
			} else {
				axis.hideCrosshair();
			}
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

			if (pointer.unDocMouseMove) {
				pointer.unDocMouseMove = pointer.unDocMouseMove();
			}

			// Remove crosshairs
			each(chart.axes, function (axis) {
				axis.hideCrosshair();
			});

			pointer.hoverX = chart.hoverPoints = chart.hoverPoint = null;
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
			if (series.xAxis && series.xAxis.zoomEnabled && series.group) {
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
						/*= if (build.classic) { =*/
						fill: chartOptions.selectionMarkerFill || color('${palette.highlightColor80}').setOpacity(0.25).get(),
						/*= } =*/
						'class': 'highcharts-selection-marker',						
						'zIndex': 7
					})
					.add();
				}
			}

			// adjust the width of the selection marker
			if (selectionMarker && zoomHor) {
				size = chartX - mouseDownX;
				selectionMarker.attr({
					width: Math.abs(size),
					x: (size > 0 ? 0 : size) + mouseDownX
				});
			}
			// adjust the height of the selection marker
			if (selectionMarker && zoomVert) {
				size = chartY - mouseDownY;
				selectionMarker.attr({
					height: Math.abs(size),
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
							min: Math.min(selectionMin, selectionMax), // for reversed axes
							max: Math.max(selectionMin, selectionMax)
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

		this.zoomOption(e);

		// issue #295, dragging not always working in Firefox
		if (e.preventDefault) {
			e.preventDefault();
		}

		this.dragStart(e);
	},



	onDocumentMouseUp: function (e) {
		if (charts[H.hoverChartIndex]) {
			charts[H.hoverChartIndex].pointer.drop(e);
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
		var chart = charts[H.hoverChartIndex];
		if (chart && (e.relatedTarget || e.toElement)) { // #4886, MS Touch end fires mouseleave but with no related target
			chart.pointer.reset();
			chart.pointer.chartPosition = null; // also reset the chart position, used in #149 fix
		}
	},

	// The mousemove, touchmove and touchstart event handler
	onContainerMouseMove: function (e) {

		var chart = this.chart;

		if (!defined(H.hoverChartIndex) || !charts[H.hoverChartIndex] || !charts[H.hoverChartIndex].mouseIsDown) {
			H.hoverChartIndex = chart.index;
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
				if (elemClassName.indexOf('highcharts-container') !== -1) {
					return false;
				}
			}
			element = element.parentNode;
		}
	},

	onTrackerMouseOut: function (e) {
		var series = this.chart.hoverSeries,
			relatedTarget = e.relatedTarget || e.toElement;

		if (series && relatedTarget && !series.stickyTracking && 
				!this.inClass(relatedTarget, 'highcharts-tooltip') &&
					(
						!this.inClass(relatedTarget, 'highcharts-series-' + series.index) || // #2499, #4465
						!this.inClass(relatedTarget, 'highcharts-tracker') // #5553
					)
				) {
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
			if (hoverPoint && this.inClass(e.target, 'highcharts-tracker')) {

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
		if (H.chartCount === 1) {
			addEvent(doc, 'mouseup', pointer.onDocumentMouseUp);
		}
		if (H.hasTouch) {
			container.ontouchstart = function (e) {
				pointer.onContainerTouchStart(e);
			};
			container.ontouchmove = function (e) {
				pointer.onContainerTouchMove(e);
			};
			if (H.chartCount === 1) {
				addEvent(doc, 'touchend', pointer.onDocumentTouchEnd);
			}
		}

	},

	/**
	 * Destroys the Pointer object and disconnects DOM events.
	 */
	destroy: function () {
		var pointer = this;

		if (pointer.unDocMouseMove) {
			pointer.unDocMouseMove();
		}

		removeEvent(
			pointer.chart.container,
			'mouseleave',
			pointer.onContainerMouseLeave
		);
		if (!H.chartCount) {
			removeEvent(doc, 'mouseup', pointer.onDocumentMouseUp);
			removeEvent(doc, 'touchend', pointer.onDocumentTouchEnd);
		}

		// memory and CPU leak
		clearInterval(pointer.tooltipTimeout);

		H.objectEach(pointer, function (val, prop) {
			pointer[prop] = null;
		});
	}
};
