/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Chart.js';
import './Options.js';
import './Legend.js';
import './Point.js';
import './Series.js';
var addEvent = H.addEvent,
	Chart = H.Chart,
	createElement = H.createElement,
	css = H.css,
	defaultOptions = H.defaultOptions,
	defaultPlotOptions = H.defaultPlotOptions,
	each = H.each,
	extend = H.extend,
	fireEvent = H.fireEvent,
	hasTouch = H.hasTouch,
	inArray = H.inArray,
	isObject = H.isObject,
	Legend = H.Legend,
	merge = H.merge,
	pick = H.pick,
	Point = H.Point,
	Series = H.Series,
	seriesTypes = H.seriesTypes,
	svg = H.svg,
	TrackerMixin;

/**
 * TrackerMixin for points and graphs.
 *
 * @mixin
 */
TrackerMixin = H.TrackerMixin = {

	/**
	 * Draw the tracker for a point.
	 */
	drawTrackerPoint: function () {
		var series = this,
			chart = series.chart,
			pointer = chart.pointer,
			onMouseOver = function (e) {
				var target = e.target,
					point;

				while (target && !point) {
					point = target.point;
					target = target.parentNode;
				}

				if (point !== undefined && point !== chart.hoverPoint) { // undefined on graph in scatterchart
					point.onMouseOver(e);
				}
			};

		// Add reference to the point
		each(series.points, function (point) {
			if (point.graphic) {
				point.graphic.element.point = point;
			}
			if (point.dataLabel) {
				if (point.dataLabel.div) {
					point.dataLabel.div.point = point;
				} else {
					point.dataLabel.element.point = point;
				}
			}
		});

		// Add the event listeners, we need to do this only once
		if (!series._hasTracking) {
			each(series.trackerGroups, function (key) {
				if (series[key]) { // we don't always have dataLabelsGroup
					series[key]
						.addClass('highcharts-tracker')
						.on('mouseover', onMouseOver)
						.on('mouseout', function (e) {
							pointer.onTrackerMouseOut(e);
						});
					if (hasTouch) {
						series[key].on('touchstart', onMouseOver);
					}

					/*= if (build.classic) { =*/
					if (series.options.cursor) {
						series[key]
							.css(css)
							.css({ cursor: series.options.cursor });
					}
					/*= } =*/
				}
			});
			series._hasTracking = true;
		}
	},

	/**
	 * Draw the tracker object that sits above all data labels and markers to
	 * track mouse events on the graph or points. For the line type charts
	 * the tracker uses the same graphPath, but with a greater stroke width
	 * for better control.
	 */
	drawTrackerGraph: function () {
		var series = this,
			options = series.options,
			trackByArea = options.trackByArea,
			trackerPath = [].concat(trackByArea ? series.areaPath : series.graphPath),
			trackerPathLength = trackerPath.length,
			chart = series.chart,
			pointer = chart.pointer,
			renderer = chart.renderer,
			snap = chart.options.tooltip.snap,
			tracker = series.tracker,
			i,
			onMouseOver = function () {
				if (chart.hoverSeries !== series) {
					series.onMouseOver();
				}
			},
			/*
			 * Empirical lowest possible opacities for TRACKER_FILL for an element to stay invisible but clickable
			 * IE6: 0.002
			 * IE7: 0.002
			 * IE8: 0.002
			 * IE9: 0.00000000001 (unlimited)
			 * IE10: 0.0001 (exporting only)
			 * FF: 0.00000000001 (unlimited)
			 * Chrome: 0.000001
			 * Safari: 0.000001
			 * Opera: 0.00000000001 (unlimited)
			 */
			TRACKER_FILL = 'rgba(192,192,192,' + (svg ? 0.0001 : 0.002) + ')';

		// Extend end points. A better way would be to use round linecaps,
		// but those are not clickable in VML.
		if (trackerPathLength && !trackByArea) {
			i = trackerPathLength + 1;
			while (i--) {
				if (trackerPath[i] === 'M') { // extend left side
					trackerPath.splice(i + 1, 0, trackerPath[i + 1] - snap, trackerPath[i + 2], 'L');
				}
				if ((i && trackerPath[i] === 'M') || i === trackerPathLength) { // extend right side
					trackerPath.splice(i, 0, 'L', trackerPath[i - 2] + snap, trackerPath[i - 1]);
				}
			}
		}

		// handle single points
		/*for (i = 0; i < singlePoints.length; i++) {
			singlePoint = singlePoints[i];
			trackerPath.push(M, singlePoint.plotX - snap, singlePoint.plotY,
			L, singlePoint.plotX + snap, singlePoint.plotY);
		}*/

		// draw the tracker
		if (tracker) {
			tracker.attr({ d: trackerPath });
		} else if (series.graph) { // create

			series.tracker = renderer.path(trackerPath)
			.attr({
				'stroke-linejoin': 'round', // #1225
				visibility: series.visible ? 'visible' : 'hidden',
				stroke: TRACKER_FILL,
				fill: trackByArea ? TRACKER_FILL : 'none',
				'stroke-width': series.graph.strokeWidth() + (trackByArea ? 0 : 2 * snap),
				zIndex: 2
			})
			.add(series.group);

			// The tracker is added to the series group, which is clipped, but is covered
			// by the marker group. So the marker group also needs to capture events.
			each([series.tracker, series.markerGroup], function (tracker) {
				tracker.addClass('highcharts-tracker')
					.on('mouseover', onMouseOver)
					.on('mouseout', function (e) {
						pointer.onTrackerMouseOut(e);
					});

				/*= if (build.classic) { =*/
				if (options.cursor) {
					tracker.css({ cursor: options.cursor });
				}
				/*= } =*/

				if (hasTouch) {
					tracker.on('touchstart', onMouseOver);
				}
			});
		}
	}
};
/* End TrackerMixin */


/**
 * Add tracking event listener to the series group, so the point graphics
 * themselves act as trackers
 */

if (seriesTypes.column) {
	seriesTypes.column.prototype.drawTracker = TrackerMixin.drawTrackerPoint;	
}

if (seriesTypes.pie) {
	seriesTypes.pie.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
}

if (seriesTypes.scatter) {
	seriesTypes.scatter.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
}

/*
 * Extend Legend for item events
 */
extend(Legend.prototype, {

	setItemEvents: function (item, legendItem, useHTML) {
		var legend = this,
			chart = legend.chart,
			activeClass = 'highcharts-legend-' + (item.series ? 'point' : 'series') + '-active';

		// Set the events on the item group, or in case of useHTML, the item itself (#1249)
		(useHTML ? legendItem : item.legendGroup).on('mouseover', function () {
			item.setState('hover');
			
			// A CSS class to dim or hide other than the hovered series
			chart.seriesGroup.addClass(activeClass);
			
			/*= if (build.classic) { =*/
			legendItem.css(legend.options.itemHoverStyle);
			/*= } =*/
		})
		.on('mouseout', function () {
			/*= if (build.classic) { =*/
			legendItem.css(item.visible ? legend.itemStyle : legend.itemHiddenStyle);
			/*= } =*/

			// A CSS class to dim or hide other than the hovered series
			chart.seriesGroup.removeClass(activeClass);
			
			item.setState();
		})
		.on('click', function (event) {
			var strLegendItemClick = 'legendItemClick',
				fnLegendItemClick = function () {
					if (item.setVisible) {
						item.setVisible();
					}
				};

			// Pass over the click/touch event. #4.
			event = {
				browserEvent: event
			};

			// click the name or symbol
			if (item.firePointEvent) { // point
				item.firePointEvent(strLegendItemClick, event, fnLegendItemClick);
			} else {
				fireEvent(item, strLegendItemClick, event, fnLegendItemClick);
			}
		});
	},

	createCheckboxForItem: function (item) {
		var legend = this;

		item.checkbox = createElement('input', {
			type: 'checkbox',
			checked: item.selected,
			defaultChecked: item.selected // required by IE7
		}, legend.options.itemCheckboxStyle, legend.chart.container);

		addEvent(item.checkbox, 'click', function (event) {
			var target = event.target;
			fireEvent(
				item.series || item, 
				'checkboxClick', 
				{ // #3712
					checked: target.checked,
					item: item
				},
				function () {
					item.select();
				}
			);
		});
	}
});


/*= if (build.classic) { =*/
// Add pointer cursor to legend itemstyle in defaultOptions
defaultOptions.legend.itemStyle.cursor = 'pointer';
/*= } =*/


/*
 * Extend the Chart object with interaction
 */

extend(Chart.prototype, /** @lends Chart.prototype */ {
	/**
	 * Display the zoom button
	 */
	showResetZoom: function () {
		var chart = this,
			lang = defaultOptions.lang,
			btnOptions = chart.options.chart.resetZoomButton,
			theme = btnOptions.theme,
			states = theme.states,
			alignTo = btnOptions.relativeTo === 'chart' ? null : 'plotBox';

		function zoomOut() {
			chart.zoomOut();
		}

		this.resetZoomButton = chart.renderer.button(lang.resetZoom, null, null, zoomOut, theme, states && states.hover)
			.attr({
				align: btnOptions.position.align,
				title: lang.resetZoomTitle
			})
			.addClass('highcharts-reset-zoom')
			.add()
			.align(btnOptions.position, false, alignTo);

	},

	/**
	 * Zoom out to 1:1
	 */
	zoomOut: function () {
		var chart = this;
		fireEvent(chart, 'selection', { resetSelection: true }, function () {
			chart.zoom();
		});
	},

	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom: function (event) {
		var chart = this,
			hasZoomed,
			pointer = chart.pointer,
			displayButton = false,
			resetZoomButton;

		// If zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(chart.axes, function (axis) {
				hasZoomed = axis.zoom();
			});
		} else { // else, zoom in on all axes
			each(event.xAxis.concat(event.yAxis), function (axisData) {
				var axis = axisData.axis,
					isXAxis = axis.isXAxis;

				// don't zoom more than minRange
				if (pointer[isXAxis ? 'zoomX' : 'zoomY']) {
					hasZoomed = axis.zoom(axisData.min, axisData.max);
					if (axis.displayBtn) {
						displayButton = true;
					}
				}
			});
		}

		// Show or hide the Reset zoom button
		resetZoomButton = chart.resetZoomButton;
		if (displayButton && !resetZoomButton) {
			chart.showResetZoom();
		} else if (!displayButton && isObject(resetZoomButton)) {
			chart.resetZoomButton = resetZoomButton.destroy();
		}


		// Redraw
		if (hasZoomed) {
			chart.redraw(
				pick(chart.options.chart.animation, event && event.animation, chart.pointCount < 100) // animation
			);
		}
	},

	/**
	 * Pan the chart by dragging the mouse across the pane. This function is called
	 * on mouse move, and the distance to pan is computed from chartX compared to
	 * the first chartX position in the dragging operation.
	 */
	pan: function (e, panning) {

		var chart = this,
			hoverPoints = chart.hoverPoints,
			doRedraw;

		// remove active points for shared tooltip
		if (hoverPoints) {
			each(hoverPoints, function (point) {
				point.setState();
			});
		}

		each(panning === 'xy' ? [1, 0] : [1], function (isX) { // xy is used in maps
			var axis = chart[isX ? 'xAxis' : 'yAxis'][0],
				horiz = axis.horiz,
				mousePos = e[horiz ? 'chartX' : 'chartY'],
				mouseDown = horiz ? 'mouseDownX' : 'mouseDownY',
				startPos = chart[mouseDown],
				halfPointRange = (axis.pointRange || 0) / 2,
				extremes = axis.getExtremes(),
				panMin = axis.toValue(startPos - mousePos, true) +
					halfPointRange,
				panMax = axis.toValue(startPos + axis.len - mousePos, true) -
					halfPointRange,
				flipped = panMax < panMin,
				newMin = flipped ? panMax : panMin,
				newMax = flipped ? panMin : panMax,
				distMin = Math.min(extremes.dataMin, extremes.min) - newMin,
				distMax = newMax - Math.max(extremes.dataMax, extremes.max);

			// Negative distMin and distMax means that we're still inside the
			// data range.
			if (axis.series.length && distMin < 0 && distMax < 0) {
				axis.setExtremes(
					newMin,
					newMax,
					false,
					false,
					{ trigger: 'pan' }
				);
				doRedraw = true;
			}

			chart[mouseDown] = mousePos; // set new reference for next run
		});

		if (doRedraw) {
			chart.redraw(false);
		}
		css(chart.container, { cursor: 'move' });
	}
});

/*
 * Extend the Point object with interaction
 */
extend(Point.prototype, /** @lends Point.prototype */ {
	/**
	 * Toggle the selection status of a point
	 * @param {Boolean} selected Whether to select or unselect the point.
	 * @param {Boolean} accumulate Whether to add to the previous selection. By default,
	 *		 this happens if the control key (Cmd on Mac) was pressed during clicking.
	 */
	select: function (selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart;

		selected = pick(selected, !point.selected);

		// fire the event with the default handler
		point.firePointEvent(selected ? 'select' : 'unselect', { accumulate: accumulate }, function () {
			point.selected = point.options.selected = selected;
			series.options.data[inArray(point, series.data)] = point.options;

			point.setState(selected && 'select');

			// unselect all other points unless Ctrl or Cmd + click
			if (!accumulate) {
				each(chart.getSelectedPoints(), function (loopPoint) {
					if (loopPoint.selected && loopPoint !== point) {
						loopPoint.selected = loopPoint.options.selected = false;
						series.options.data[inArray(loopPoint, series.data)] = loopPoint.options;
						loopPoint.setState('');
						loopPoint.firePointEvent('unselect');
					}
				});
			}
		});
	},

	/**
	 * Runs on mouse over the point
	 *
	 * @param {Object} e The event arguments
	 * @param {Boolean} byProximity Falsy for kd points that are closest to the mouse, or to
	 *        actually hovered points. True for other points in shared tooltip.
	 */
	onMouseOver: function (e, byProximity) {
		var point = this,
			series = point.series,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		if (point.series) { // It may have been destroyed, #4130
			// In shared tooltip, call mouse over when point/series is actually hovered: (#5766)
			if (!byProximity) {
				// set normal state to previous series
				if (hoverPoint && hoverPoint !== point) {
					hoverPoint.onMouseOut();
				}
				if (chart.hoverSeries !== series) {
					series.onMouseOver();
				}
				chart.hoverPoint = point;
			}

			// update the tooltip
			if (tooltip && (!tooltip.shared || series.noSharedTooltip)) {
				// hover point only for non shared points: (#5766)
				point.setState('hover');
				tooltip.refresh(point, e);
			} else if (!tooltip) {
				point.setState('hover');
			}

			// trigger the event
			point.firePointEvent('mouseOver');
		}
	},

	/**
	 * Runs on mouse out from the point
	 */
	onMouseOut: function () {
		var chart = this.series.chart,
			hoverPoints = chart.hoverPoints;

		this.firePointEvent('mouseOut');

		if (!hoverPoints || inArray(this, hoverPoints) === -1) { // #887, #2240
			this.setState();
			chart.hoverPoint = null;
		}
	},

	/**
	 * Import events from the series' and point's options. Only do it on
	 * demand, to save processing time on hovering.
	 */
	importEvents: function () {
		if (!this.hasImportedEvents) {
			var point = this,
				options = merge(point.series.options.point, point.options),
				events = options.events,
				eventType;

			point.events = events;

			for (eventType in events) {
				addEvent(point, eventType, events[eventType]);
			}
			this.hasImportedEvents = true;

		}
	},

	/**
	 * Set the point's state
	 * @param {String} state
	 */
	setState: function (state, move) {
		var point = this,
			plotX = Math.floor(point.plotX), // #4586
			plotY = point.plotY,
			series = point.series,
			stateOptions = series.options.states[state] || {},
			markerOptions = defaultPlotOptions[series.type].marker &&
				series.options.marker,
			normalDisabled = markerOptions && markerOptions.enabled === false,
			markerStateOptions = (markerOptions && markerOptions.states &&
				markerOptions.states[state]) || {},
			stateDisabled = markerStateOptions.enabled === false,
			stateMarkerGraphic = series.stateMarkerGraphic,
			pointMarker = point.marker || {},
			chart = series.chart,
			halo = series.halo,
			haloOptions,
			markerAttribs,
			hasMarkers = markerOptions && series.markerAttribs,
			newSymbol;

		state = state || ''; // empty string

		if (
				// already has this state
				(state === point.state && !move) ||
				// selected points don't respond to hover
				(point.selected && state !== 'select') ||
				// series' state options is disabled
				(stateOptions.enabled === false) ||
				// general point marker's state options is disabled
				(state && (stateDisabled || (normalDisabled && markerStateOptions.enabled === false))) ||
				// individual point marker's state options is disabled
				(state && pointMarker.states && pointMarker.states[state] && pointMarker.states[state].enabled === false) // #1610

			) {
			return;
		}

		if (hasMarkers) {
			markerAttribs = series.markerAttribs(point, state);
		}

		// Apply hover styles to the existing point
		if (point.graphic) {

			if (point.state) {
				point.graphic.removeClass('highcharts-point-' + point.state);
			}
			if (state) {
				point.graphic.addClass('highcharts-point-' + state);
			}

			/*attribs = radius ? { // new symbol attributes (#507, #612)
				x: plotX - radius,
				y: plotY - radius,
				width: 2 * radius,
				height: 2 * radius
			} : {};*/

			/*= if (build.classic) { =*/
			//attribs = merge(series.pointAttribs(point, state), attribs);
			point.graphic.attr(series.pointAttribs(point, state));
			/*= } =*/

			if (markerAttribs) {
				point.graphic.animate(
					markerAttribs,
					pick(
						chart.options.chart.animation, // Turn off globally
						markerStateOptions.animation,
						markerOptions.animation
					)
				);
			}

			// Zooming in from a range with no markers to a range with markers
			if (stateMarkerGraphic) {
				stateMarkerGraphic.hide();
			}
		} else {
			// if a graphic is not applied to each point in the normal state, create a shared
			// graphic for the hover state
			if (state && markerStateOptions) {
				newSymbol = pointMarker.symbol || series.symbol;

				// If the point has another symbol than the previous one, throw away the
				// state marker graphic and force a new one (#1459)
				if (stateMarkerGraphic && stateMarkerGraphic.currentSymbol !== newSymbol) {
					stateMarkerGraphic = stateMarkerGraphic.destroy();
				}

				// Add a new state marker graphic
				if (!stateMarkerGraphic) {
					if (newSymbol) {
						series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.symbol(
							newSymbol,
							markerAttribs.x,
							markerAttribs.y,
							markerAttribs.width,
							markerAttribs.height
						)
						.add(series.markerGroup);
						stateMarkerGraphic.currentSymbol = newSymbol;
					}

				// Move the existing graphic
				} else {
					stateMarkerGraphic[move ? 'animate' : 'attr']({ // #1054
						x: markerAttribs.x,
						y: markerAttribs.y
					});
				}
				/*= if (build.classic) { =*/
				if (stateMarkerGraphic) {
					stateMarkerGraphic.attr(series.pointAttribs(point, state));
				}
				/*= } =*/
			}

			if (stateMarkerGraphic) {
				stateMarkerGraphic[state && chart.isInsidePlot(plotX, plotY, chart.inverted) ? 'show' : 'hide'](); // #2450
				stateMarkerGraphic.element.point = point; // #4310
			}
		}

		// Show me your halo
		haloOptions = stateOptions.halo;
		if (haloOptions && haloOptions.size) {
			if (!halo) {
				series.halo = halo = chart.renderer.path()
					// #5818, #5903
					.add(hasMarkers ? series.markerGroup : series.group);
			}
			halo[move ? 'animate' : 'attr']({
				d: point.haloPath(haloOptions.size)
			});
			halo.attr({
				'class': 'highcharts-halo highcharts-color-' +
					pick(point.colorIndex, series.colorIndex) 
			});
			halo.point = point; // #6055

			/*= if (build.classic) { =*/
			halo.attr(extend({
				'fill': point.color || series.color,
				'fill-opacity': haloOptions.opacity,
				'zIndex': -1 // #4929, IE8 added halo above everything
			}, haloOptions.attributes));
			/*= } =*/

		} else if (halo && halo.point && halo.point.haloPath) {
			// Animate back to 0 on the current halo point (#6055)
			halo.animate({ d: halo.point.haloPath(0) });
		}

		point.state = state;
	},

	/**
	 * Get the circular path definition for the halo
	 * @param  {Number} size The radius of the circular halo.
	 * @returns {Array} The path definition
	 */
	haloPath: function (size) {
		var series = this.series,
			chart = series.chart;

		return chart.renderer.symbols.circle(
			Math.floor(this.plotX) - size,
			this.plotY - size,
			size * 2, 
			size * 2
		);
	}
});

/*
 * Extend the Series object with interaction
 */

extend(Series.prototype, /** @lends Series.prototype */ {
	/**
	 * Series mouse over handler
	 */
	onMouseOver: function () {
		var series = this,
			chart = series.chart,
			hoverSeries = chart.hoverSeries;

		// set normal state to previous series
		if (hoverSeries && hoverSeries !== series) {
			hoverSeries.onMouseOut();
		}

		// trigger the event, but to save processing time,
		// only if defined
		if (series.options.events.mouseOver) {
			fireEvent(series, 'mouseOver');
		}

		// hover this
		series.setState('hover');
		chart.hoverSeries = series;
	},

	/**
	 * Series mouse out handler
	 */
	onMouseOut: function () {
		// trigger the event only if listeners exist
		var series = this,
			options = series.options,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		chart.hoverSeries = null; // #182, set to null before the mouseOut event fires

		// trigger mouse out on the point, which must be in this series
		if (hoverPoint) {
			hoverPoint.onMouseOut();
		}

		// fire the mouse out event
		if (series && options.events.mouseOut) {
			fireEvent(series, 'mouseOut');
		}


		// hide the tooltip
		if (tooltip && !options.stickyTracking && (!tooltip.shared || series.noSharedTooltip)) {
			tooltip.hide();
		}

		// set normal state
		series.setState();
	},

	/**
	 * Set the state of the graph
	 */
	setState: function (state) {
		var series = this,
			options = series.options,
			graph = series.graph,
			stateOptions = options.states,
			lineWidth = options.lineWidth,
			attribs,
			i = 0;

		state = state || '';

		if (series.state !== state) {

			// Toggle class names
			each([series.group, series.markerGroup], function (group) {
				if (group) {
					// Old state
					if (series.state) {
						group.removeClass('highcharts-series-' + series.state);	
					}
					// New state
					if (state) {
						group.addClass('highcharts-series-' + state);
					}
				}
			});

			series.state = state;

			/*= if (build.classic) { =*/

			if (stateOptions[state] && stateOptions[state].enabled === false) {
				return;
			}

			if (state) {
				lineWidth = stateOptions[state].lineWidth || lineWidth + (stateOptions[state].lineWidthPlus || 0); // #4035
			}

			if (graph && !graph.dashstyle) { // hover is turned off for dashed lines in VML
				attribs = {
					'stroke-width': lineWidth
				};
				// use attr because animate will cause any other animation on the graph to stop
				graph.attr(attribs);
				while (series['zone-graph-' + i]) {
					series['zone-graph-' + i].attr(attribs);
					i = i + 1;
				}
			}
			/*= } =*/
		}
	},

	/**
	 * Set the visibility of the graph
	 *
	 * @param vis {Boolean} True to show the series, false to hide. If undefined,
	 *				the visibility is toggled.
	 */
	setVisible: function (vis, redraw) {
		var series = this,
			chart = series.chart,
			legendItem = series.legendItem,
			showOrHide,
			ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries,
			oldVisibility = series.visible;

		// if called without an argument, toggle visibility
		series.visible = vis = series.options.visible = series.userOptions.visible = vis === undefined ? !oldVisibility : vis; // #5618
		showOrHide = vis ? 'show' : 'hide';

		// show or hide elements
		each(['group', 'dataLabelsGroup', 'markerGroup', 'tracker', 'tt'], function (key) {
			if (series[key]) {
				series[key][showOrHide]();				
			}
		});


		// hide tooltip (#1361)
		if (chart.hoverSeries === series || (chart.hoverPoint && chart.hoverPoint.series) === series) {
			series.onMouseOut();
		}


		if (legendItem) {
			chart.legend.colorizeItem(series, vis);
		}


		// rescale or adapt to resized chart
		series.isDirty = true;
		// in a stack, all other series are affected
		if (series.options.stacking) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.options.stacking && otherSeries.visible) {
					otherSeries.isDirty = true;
				}
			});
		}

		// show or hide linked series
		each(series.linkedSeries, function (otherSeries) {
			otherSeries.setVisible(vis, false);
		});

		if (ignoreHiddenSeries) {
			chart.isDirtyBox = true;
		}
		if (redraw !== false) {
			chart.redraw();
		}

		fireEvent(series, showOrHide);
	},

	/**
	 * Show the graph
	 */
	show: function () {
		this.setVisible(true);
	},

	/**
	 * Hide the graph
	 */
	hide: function () {
		this.setVisible(false);
	},


	/**
	 * Set the selected state of the graph
	 *
	 * @param selected {Boolean} True to select the series, false to unselect. If
	 *				undefined, the selection state is toggled.
	 */
	select: function (selected) {
		var series = this;
		// if called without an argument, toggle
		series.selected = selected = (selected === undefined) ? !series.selected : selected;

		if (series.checkbox) {
			series.checkbox.checked = selected;
		}

		fireEvent(series, selected ? 'select' : 'unselect');
	},

	drawTracker: TrackerMixin.drawTrackerGraph
});
