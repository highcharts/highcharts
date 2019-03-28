/**
 * (c) 2010-2019 Torstein Honsi
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
    extend = H.extend,
    fireEvent = H.fireEvent,
    hasTouch = H.hasTouch,
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
 * @private
 * @mixin Highcharts.TrackerMixin
 */
TrackerMixin = H.TrackerMixin = {

    /**
     * Draw the tracker for a point.
     *
     * @private
     * @function Highcharts.TrackerMixin.drawTrackerPoint
     *
     * @fires Highcharts.Series#event:afterDrawTracker
     */
    drawTrackerPoint: function () {
        var series = this,
            chart = series.chart,
            pointer = chart.pointer,
            onMouseOver = function (e) {
                var point = pointer.getPointFromEvent(e);

                // undefined on graph in scatterchart
                if (point !== undefined) {
                    pointer.isDirectTouch = true;
                    point.onMouseOver(e);
                }
            };

        // Add reference to the point
        series.points.forEach(function (point) {
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
            series.trackerGroups.forEach(function (key) {
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

                    if (!chart.styledMode && series.options.cursor) {
                        series[key]
                            .css(css)
                            .css({ cursor: series.options.cursor });
                    }
                }
            });
            series._hasTracking = true;
        }

        fireEvent(this, 'afterDrawTracker');
    },

    /**
     * Draw the tracker object that sits above all data labels and markers to
     * track mouse events on the graph or points. For the line type charts
     * the tracker uses the same graphPath, but with a greater stroke width
     * for better control.
     *
     * @private
     * @function Highcharts.TrackerMixin.drawTrackerGraph
     *
     * @fires Highcharts.Series#event:afterDrawTracker
     */
    drawTrackerGraph: function () {
        var series = this,
            options = series.options,
            trackByArea = options.trackByArea,
            trackerPath = [].concat(
                trackByArea ? series.areaPath : series.graphPath
            ),
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
             * Empirical lowest possible opacities for TRACKER_FILL for an
             * element to stay invisible but clickable
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
                    trackerPath.splice(
                        i + 1, 0,
                        trackerPath[i + 1] - snap,
                        trackerPath[i + 2],
                        'L'
                    );
                }
                if (
                    (i && trackerPath[i] === 'M') ||
                    i === trackerPathLength
                ) { // extend right side
                    trackerPath.splice(
                        i,
                        0,
                        'L',
                        trackerPath[i - 2] + snap,
                        trackerPath[i - 1]
                    );
                }
            }
        }

        // draw the tracker
        if (tracker) {
            tracker.attr({ d: trackerPath });
        } else if (series.graph) { // create

            series.tracker = renderer.path(trackerPath)
                .attr({
                    visibility: series.visible ? 'visible' : 'hidden',
                    zIndex: 2
                })
                .addClass(
                    trackByArea ?
                        'highcharts-tracker-area' :
                        'highcharts-tracker-line'
                )
                .add(series.group);

            if (!chart.styledMode) {
                series.tracker.attr({
                    'stroke-linejoin': 'round', // #1225
                    stroke: TRACKER_FILL,
                    fill: trackByArea ? TRACKER_FILL : 'none',
                    'stroke-width': series.graph.strokeWidth() +
                        (trackByArea ? 0 : 2 * snap)
                });
            }

            // The tracker is added to the series group, which is clipped, but
            // is covered by the marker group. So the marker group also needs to
            // capture events.
            [series.tracker, series.markerGroup].forEach(function (tracker) {
                tracker.addClass('highcharts-tracker')
                    .on('mouseover', onMouseOver)
                    .on('mouseout', function (e) {
                        pointer.onTrackerMouseOut(e);
                    });

                if (options.cursor && !chart.styledMode) {
                    tracker.css({ cursor: options.cursor });
                }

                if (hasTouch) {
                    tracker.on('touchstart', onMouseOver);
                }
            });
        }
        fireEvent(this, 'afterDrawTracker');
    }
};
/* End TrackerMixin */


/*
 * Add tracking event listener to the series group, so the point graphics
 * themselves act as trackers
 */

if (seriesTypes.column) {
    /**
     * @private
     * @borrows Highcharts.TrackerMixin.drawTrackerPoint as Highcharts.seriesTypes.column#drawTracker
     */
    seriesTypes.column.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
}

if (seriesTypes.pie) {
    /**
     * @private
     * @borrows Highcharts.TrackerMixin.drawTrackerPoint as Highcharts.seriesTypes.pie#drawTracker
     */
    seriesTypes.pie.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
}

if (seriesTypes.scatter) {
    /**
     * @private
     * @borrows Highcharts.TrackerMixin.drawTrackerPoint as Highcharts.seriesTypes.scatter#drawTracker
     */
    seriesTypes.scatter.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
}

// Extend Legend for item events.
extend(Legend.prototype, {

    /**
     * @private
     * @function Highcharts.Legend#setItemEvents
     *
     * @param {Highcharts.Point|Highcharts.Series} item
     *
     * @param {Highcharts.SVGElement} legendItem
     *
     * @param {boolean} [useHTML=false]
     *
     * @fires Highcharts.Point#event:legendItemClick
     * @fires Highcharts.Series#event:legendItemClick
     */
    setItemEvents: function (item, legendItem, useHTML) {
        var legend = this,
            boxWrapper = legend.chart.renderer.boxWrapper,
            isPoint = item instanceof Point,
            activeClass = 'highcharts-legend-' +
                (isPoint ? 'point' : 'series') + '-active',
            styledMode = legend.chart.styledMode;

        // Set the events on the item group, or in case of useHTML, the item
        // itself (#1249)
        (useHTML ? legendItem : item.legendGroup).on('mouseover', function () {

            legend.allItems.forEach(function (inactiveItem) {
                if (item !== inactiveItem) {
                    inactiveItem.setState('inactive', !isPoint);
                }
            });

            item.setState('hover');

            // A CSS class to dim or hide other than the hovered series.
            // Works only if hovered series is visible (#10071).
            if (item.visible) {
                boxWrapper.addClass(activeClass);
            }

            if (!styledMode) {
                legendItem.css(legend.options.itemHoverStyle);
            }
        })
            .on('mouseout', function () {
                if (!legend.styledMode) {
                    legendItem.css(
                        merge(
                            item.visible ?
                                legend.itemStyle :
                                legend.itemHiddenStyle
                        )
                    );
                }

                legend.allItems.forEach(function (inactiveItem) {
                    if (item !== inactiveItem) {
                        inactiveItem.setState('', !isPoint);
                    }
                });

                // A CSS class to dim or hide other than the hovered series
                boxWrapper.removeClass(activeClass);

                item.setState();
            })
            .on('click', function (event) {
                var strLegendItemClick = 'legendItemClick',
                    fnLegendItemClick = function () {
                        if (item.setVisible) {
                            item.setVisible();
                        }
                    };

                // A CSS class to dim or hide other than the hovered series.
                // Event handling in iOS causes the activeClass to be added
                // prior to click in some cases (#7418).
                boxWrapper.removeClass(activeClass);

                // Pass over the click/touch event. #4.
                event = {
                    browserEvent: event
                };

                // click the name or symbol
                if (item.firePointEvent) { // point
                    item.firePointEvent(
                        strLegendItemClick,
                        event,
                        fnLegendItemClick
                    );
                } else {
                    fireEvent(
                        item, strLegendItemClick, event, fnLegendItemClick
                    );
                }
            });
    },

    /**
     * @private
     * @function Highcharts.Legend#createCheckboxForItem
     *
     * @param {Highcharts.Point|Highcharts.Series} item
     *
     * @fires Highcharts.Series#event:checkboxClick
     */
    createCheckboxForItem: function (item) {
        var legend = this;

        item.checkbox = createElement('input', {
            type: 'checkbox',
            className: 'highcharts-legend-checkbox',
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

/*
 * Extend the Chart object with interaction
 */

extend(Chart.prototype, /** @lends Chart.prototype */ {

    /**
     * Display the zoom button.
     *
     * @private
     * @function Highcharts.Chart#showResetZoom
     *
     * @fires Highcharts.Chart#event:beforeShowResetZoom
     */
    showResetZoom: function () {
        var chart = this,
            lang = defaultOptions.lang,
            btnOptions = chart.options.chart.resetZoomButton,
            theme = btnOptions.theme,
            states = theme.states,
            alignTo = (
                btnOptions.relativeTo === 'chart' ||
                btnOptions.relativeTo === 'spaceBox' ?
                    null :
                    'plotBox'
            );

        function zoomOut() {
            chart.zoomOut();
        }

        fireEvent(this, 'beforeShowResetZoom', null, function () {
            chart.resetZoomButton = chart.renderer.button(
                lang.resetZoom,
                null,
                null,
                zoomOut,
                theme,
                states && states.hover
            )
                .attr({
                    align: btnOptions.position.align,
                    title: lang.resetZoomTitle
                })
                .addClass('highcharts-reset-zoom')
                .add()
                .align(btnOptions.position, false, alignTo);
        });

        fireEvent(this, 'afterShowResetZoom');
    },

    /**
     * Zoom the chart out after a user has zoomed in. See also
     * [Axis.setExtremes](/class-reference/Highcharts.Axis#setExtremes).
     *
     * @function Highcharts.Chart#zoomOut
     *
     * @fires Highcharts.Chart#event:selection
     */
    zoomOut: function () {
        fireEvent(this, 'selection', { resetSelection: true }, this.zoom);
    },

    /**
     * Zoom into a given portion of the chart given by axis coordinates.
     *
     * @private
     * @function Highcharts.Chart#zoom
     *
     * @param {Highcharts.SelectEventObject} event
     */
    zoom: function (event) {
        var chart = this,
            hasZoomed,
            pointer = chart.pointer,
            displayButton = false,
            mouseDownPos =
                chart.inverted ? pointer.mouseDownX : pointer.mouseDownY,
            resetZoomButton;

        // If zoom is called with no arguments, reset the axes
        if (!event || event.resetSelection) {
            chart.axes.forEach(function (axis) {
                hasZoomed = axis.zoom();
            });
            pointer.initiated = false; // #6804

        } else { // else, zoom in on all axes
            event.xAxis.concat(event.yAxis).forEach(function (axisData) {
                var axis = axisData.axis,
                    axisStartPos = chart.inverted ? axis.left : axis.top,
                    axisEndPos = chart.inverted ?
                        axisStartPos + axis.width : axisStartPos + axis.height,
                    isXAxis = axis.isXAxis,
                    isWithinPane = false;

                // Check if zoomed area is within the pane (#1289).
                // In case of multiple panes only one pane should be zoomed.
                if (
                    (!isXAxis &&
                    mouseDownPos >= axisStartPos &&
                    mouseDownPos <= axisEndPos) ||
                    isXAxis ||
                    !H.defined(mouseDownPos)
                ) {
                    isWithinPane = true;
                }

                // don't zoom more than minRange
                if (pointer[isXAxis ? 'zoomX' : 'zoomY'] && isWithinPane) {
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
                pick(
                    chart.options.chart.animation,
                    event && event.animation,
                    chart.pointCount < 100
                )
            );
        }
    },

    /**
     * Pan the chart by dragging the mouse across the pane. This function is
     * called on mouse move, and the distance to pan is computed from chartX
     * compared to the first chartX position in the dragging operation.
     *
     * @private
     * @function Highcharts.Chart#pan
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @param {string} panning
     */
    pan: function (e, panning) {

        var chart = this,
            hoverPoints = chart.hoverPoints,
            doRedraw;

        fireEvent(this, 'pan', { originalEvent: e }, function () {

            // remove active points for shared tooltip
            if (hoverPoints) {
                hoverPoints.forEach(function (point) {
                    point.setState();
                });
            }

            // xy is used in maps
            (panning === 'xy' ? [1, 0] : [1]).forEach(function (isX) {
                var axis = chart[isX ? 'xAxis' : 'yAxis'][0],
                    horiz = axis.horiz,
                    mousePos = e[horiz ? 'chartX' : 'chartY'],
                    mouseDown = horiz ? 'mouseDownX' : 'mouseDownY',
                    startPos = chart[mouseDown],
                    halfPointRange = (axis.pointRange || 0) / 2,
                    pointRangeDirection =
                        (axis.reversed && !chart.inverted) ||
                        (!axis.reversed && chart.inverted) ?
                            -1 :
                            1,
                    extremes = axis.getExtremes(),
                    panMin = axis.toValue(startPos - mousePos, true) +
                        halfPointRange * pointRangeDirection,
                    panMax =
                        axis.toValue(
                            startPos + axis.len - mousePos, true
                        ) -
                        halfPointRange * pointRangeDirection,
                    flipped = panMax < panMin,
                    newMin = flipped ? panMax : panMin,
                    newMax = flipped ? panMin : panMax,
                    paddedMin = Math.min(
                        extremes.dataMin,
                        halfPointRange ?
                            extremes.min :
                            axis.toValue(
                                axis.toPixels(extremes.min) -
                                axis.minPixelPadding
                            )
                    ),
                    paddedMax = Math.max(
                        extremes.dataMax,
                        halfPointRange ?
                            extremes.max :
                            axis.toValue(
                                axis.toPixels(extremes.max) +
                                axis.minPixelPadding
                            )
                    ),
                    spill;

                // If the new range spills over, either to the min or max,
                // adjust the new range.
                spill = paddedMin - newMin;
                if (spill > 0) {
                    newMax += spill;
                    newMin = paddedMin;
                }
                spill = newMax - paddedMax;
                if (spill > 0) {
                    newMax = paddedMax;
                    newMin -= spill;
                }

                // Set new extremes if they are actually new
                if (
                    axis.series.length &&
                    newMin !== extremes.min &&
                    newMax !== extremes.max
                ) {
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
        });
    }
});

// Extend the Point object with interaction
extend(Point.prototype, /** @lends Highcharts.Point.prototype */ {

    /**
     * Toggle the selection status of a point.
     *
     * @see Highcharts.Chart#getSelectedPoints
     *
     * @sample highcharts/members/point-select/
     *         Select a point from a button
     * @sample highcharts/chart/events-selection-points/
     *         Select a range of points through a drag selection
     * @sample maps/series/data-id/
     *         Select a point in Highmaps
     *
     * @function Highcharts.Point#select
     *
     * @param {boolean} [selected]
     *        When `true`, the point is selected. When `false`, the point is
     *        unselected. When `null` or `undefined`, the selection state is
     *        toggled.
     *
     * @param {boolean} [accumulate=false]
     *        When `true`, the selection is added to other selected points.
     *        When `false`, other selected points are deselected. Internally in
     *        Highcharts, when
     *        [allowPointSelect](http://api.highcharts.com/highcharts/plotOptions.series.allowPointSelect)
     *        is `true`, selected points are accumulated on Control, Shift or
     *        Cmd clicking the point.
     *
     * @fires Highcharts.Point#event:select
     * @fires Highcharts.Point#event:unselect
     */
    select: function (selected, accumulate) {
        var point = this,
            series = point.series,
            chart = series.chart;

        selected = pick(selected, !point.selected);

        // fire the event with the default handler
        point.firePointEvent(
            selected ? 'select' : 'unselect',
            { accumulate: accumulate },
            function () {

                /**
                 * Whether the point is selected or not.
                 *
                 * @see Point#select
                 * @see Chart#getSelectedPoints
                 *
                 * @name Highcharts.Point#selected
                 * @type {boolean}
                 */
                point.selected = point.options.selected = selected;
                series.options.data[series.data.indexOf(point)] =
                    point.options;

                point.setState(selected && 'select');

                // unselect all other points unless Ctrl or Cmd + click
                if (!accumulate) {
                    chart.getSelectedPoints().forEach(function (loopPoint) {
                        if (loopPoint.selected && loopPoint !== point) {
                            loopPoint.selected = loopPoint.options.selected =
                                false;
                            series.options.data[
                                series.data.indexOf(loopPoint)
                            ] = loopPoint.options;
                            // Programatically selecting a point should restore
                            // normal state, but when click happened on other
                            // point, set inactive state to match other points
                            loopPoint.setState(
                                chart.hoverPoints ? 'inactive' : ''
                            );
                            loopPoint.firePointEvent('unselect');
                        }
                    });
                }
            }
        );
    },

    /**
     * Runs on mouse over the point. Called internally from mouse and touch
     * events.
     *
     * @function Highcharts.Point#onMouseOver
     *
     * @param {Highcharts.PointerEventObject} e
     *        The event arguments.
     */
    onMouseOver: function (e) {
        var point = this,
            series = point.series,
            chart = series.chart,
            pointer = chart.pointer;

        e = e ?
            pointer.normalize(e) :
            // In cases where onMouseOver is called directly without an event
            pointer.getChartCoordinatesFromPoint(point, chart.inverted);
        pointer.runPointActions(e, point);
    },

    /**
     * Runs on mouse out from the point. Called internally from mouse and touch
     * events.
     *
     * @function Highcharts.Point#onMouseOut
     *
     * @fires Highcharts.Point#event:mouseOut
     */
    onMouseOut: function () {
        var point = this,
            chart = point.series.chart;

        point.firePointEvent('mouseOut');

        if (!point.series.options.inactiveOtherPoints) {
            (chart.hoverPoints || []).forEach(function (p) {
                p.setState();
            });
        }

        chart.hoverPoints = chart.hoverPoint = null;
    },

    /**
     * Import events from the series' and point's options. Only do it on
     * demand, to save processing time on hovering.
     *
     * @private
     * @function Highcharts.Point#importEvents
     */
    importEvents: function () {
        if (!this.hasImportedEvents) {
            var point = this,
                options = merge(point.series.options.point, point.options),
                events = options.events;

            point.events = events;

            H.objectEach(events, function (event, eventType) {
                addEvent(point, eventType, event);
            });
            this.hasImportedEvents = true;

        }
    },

    /**
     * Set the point's state.
     *
     * @function Highcharts.Point#setState
     *
     * @param {string} [state]
     *        The new state, can be one of `''` (an empty string), `hover`,
     *        `select` or `inactive`.
     * @param {boolean} [move]
     *        State for animation.
     *
     * @fires Highcharts.Point#event:afterSetState
     */
    setState: function (state, move) {
        var point = this,
            plotX = Math.floor(point.plotX), // #4586
            plotY = point.plotY,
            series = point.series,
            previousState = point.state,
            stateOptions = series.options.states[state || 'normal'] || {},
            markerOptions = defaultPlotOptions[series.type].marker &&
                series.options.marker,
            normalDisabled = markerOptions && markerOptions.enabled === false,
            markerStateOptions = (
                markerOptions &&
                markerOptions.states &&
                markerOptions.states[state || 'normal']
            ) || {},
            stateDisabled = markerStateOptions.enabled === false,
            stateMarkerGraphic = series.stateMarkerGraphic,
            pointMarker = point.marker || {},
            chart = series.chart,
            halo = series.halo,
            haloOptions,
            markerAttribs,
            pointAttribs,
            pointAttribsAnimation,
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
            (state && (
                stateDisabled ||
                (normalDisabled && markerStateOptions.enabled === false)
            )) ||

            // individual point marker's state options is disabled
            (
                state &&
                pointMarker.states &&
                pointMarker.states[state] &&
                pointMarker.states[state].enabled === false
            ) // #1610

        ) {
            return;
        }

        point.state = state;

        if (hasMarkers) {
            markerAttribs = series.markerAttribs(point, state);
        }

        // Apply hover styles to the existing point
        if (point.graphic) {

            if (previousState) {
                point.graphic.removeClass('highcharts-point-' + previousState);
            }
            if (state) {
                point.graphic.addClass('highcharts-point-' + state);
            }

            if (!chart.styledMode) {
                pointAttribs = series.pointAttribs(point, state);
                pointAttribsAnimation = pick(
                    chart.options.chart.animation,
                    stateOptions.animation
                );

                // Some inactive points (e.g. slices in pie) should apply
                // oppacity also for it's labels
                if (series.options.inactiveOtherPoints) {
                    (point.dataLabels || []).forEach(function (label) {
                        if (label) {
                            label.animate(
                                {
                                    opacity: pointAttribs.opacity
                                },
                                pointAttribsAnimation
                            );
                        }
                    });

                    if (point.connector) {
                        point.connector.animate(
                            {
                                opacity: pointAttribs.opacity
                            },
                            pointAttribsAnimation
                        );
                    }
                }

                point.graphic.animate(
                    pointAttribs,
                    pointAttribsAnimation
                );
            }

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
            // if a graphic is not applied to each point in the normal state,
            // create a shared graphic for the hover state
            if (state && markerStateOptions) {
                newSymbol = pointMarker.symbol || series.symbol;

                // If the point has another symbol than the previous one, throw
                // away the state marker graphic and force a new one (#1459)
                if (
                    stateMarkerGraphic &&
                    stateMarkerGraphic.currentSymbol !== newSymbol
                ) {
                    stateMarkerGraphic = stateMarkerGraphic.destroy();
                }

                // Add a new state marker graphic
                if (!stateMarkerGraphic) {
                    if (newSymbol) {
                        series.stateMarkerGraphic = stateMarkerGraphic =
                            chart.renderer.symbol(
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

                if (!chart.styledMode && stateMarkerGraphic) {
                    stateMarkerGraphic.attr(series.pointAttribs(point, state));
                }
            }

            if (stateMarkerGraphic) {
                stateMarkerGraphic[
                    state && chart.isInsidePlot(plotX, plotY, chart.inverted) ?
                        'show' :
                        'hide'
                ](); // #2450
                stateMarkerGraphic.element.point = point; // #4310
            }
        }

        // Show me your halo
        haloOptions = stateOptions.halo;
        if (haloOptions && haloOptions.size) {
            if (!halo) {
                series.halo = halo = chart.renderer.path()
                    // #5818, #5903, #6705
                    .add((point.graphic || stateMarkerGraphic).parentGroup);
            }
            halo.show()[move ? 'animate' : 'attr']({
                d: point.haloPath(haloOptions.size)
            });
            halo.attr({
                'class': 'highcharts-halo highcharts-color-' +
                    pick(point.colorIndex, series.colorIndex) +
                    (point.className ? ' ' + point.className : ''),
                'zIndex': -1 // #4929, #8276
            });
            halo.point = point; // #6055

            if (!chart.styledMode) {
                halo.attr(extend({
                    'fill': point.color || series.color,
                    'fill-opacity': haloOptions.opacity
                }, haloOptions.attributes));
            }

        } else if (halo && halo.point && halo.point.haloPath) {
            // Animate back to 0 on the current halo point (#6055)
            halo.animate(
                { d: halo.point.haloPath(0) },
                null,
                // Hide after unhovering. The `complete` callback runs in the
                // halo's context (#7681).
                halo.hide
            );
        }

        fireEvent(point, 'afterSetState');
    },

    /**
     * Get the path definition for the halo, which is usually a shadow-like
     * circle around the currently hovered point.
     *
     * @function Highcharts.Point#haloPath
     *
     * @param {number} size
     *        The radius of the circular halo.
     *
     * @return {Highcharts.SVGPathArray}
     *         The path definition.
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

// Extend the Series object with interaction
extend(Series.prototype, /** @lends Highcharts.Series.prototype */ {

    /**
     * Runs on mouse over the series graphical items.
     *
     * @function Highcharts.Series#onMouseOver
     *
     * @fires Highcharts.Series#event:mouseOver
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

        /**
         * Contains the original hovered series.
         *
         * @name Highcharts.Chart#hoverSeries
         * @type {Highcharts.Series|null}
         */
        chart.hoverSeries = series;
    },

    /**
     * Runs on mouse out of the series graphical items.
     *
     * @function Highcharts.Series#onMouseOut
     *
     * @fires Highcharts.Series#event:mouseOut
     */
    onMouseOut: function () {
        // trigger the event only if listeners exist
        var series = this,
            options = series.options,
            chart = series.chart,
            tooltip = chart.tooltip,
            hoverPoint = chart.hoverPoint;

        // #182, set to null before the mouseOut event fires
        chart.hoverSeries = null;

        // trigger mouse out on the point, which must be in this series
        if (hoverPoint) {
            hoverPoint.onMouseOut();
        }

        // fire the mouse out event
        if (series && options.events.mouseOut) {
            fireEvent(series, 'mouseOut');
        }


        // hide the tooltip
        if (
            tooltip &&
            !series.stickyTracking &&
            (!tooltip.shared || series.noSharedTooltip)
        ) {
            tooltip.hide();
        }

        // Reset all inactive states
        chart.series.forEach(function (s) {
            s.setState('', true);
        });

    },

    /**
     * Set the state of the series. Called internally on mouse interaction
     * operations, but it can also be called directly to visually
     * highlight a series.
     *
     * @function Highcharts.Series#setState
     *
     * @param {string} [state]
     *        Can be either `hover` or undefined to set to normal state.
     * @param {boolean} [inherit]
     *        Determines if state should be inherited by points too.
     */
    setState: function (state, inherit) {
        var series = this,
            options = series.options,
            graph = series.graph,
            inactiveOtherPoints = options.inactiveOtherPoints,
            stateOptions = options.states,
            lineWidth = options.lineWidth,
            opacity = options.opacity,
            // By default a quick animation to hover/inactive,
            // slower to un-hover
            stateAnimation = pick(
                (
                    stateOptions[state || 'normal'] &&
                    stateOptions[state || 'normal'].animation
                ),
                series.chart.options.chart.animation
            ),
            attribs,
            i = 0;

        state = state || '';

        if (series.state !== state) {

            // Toggle class names
            [
                series.group,
                series.markerGroup,
                series.dataLabelsGroup
            ].forEach(function (group) {
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

            if (!series.chart.styledMode) {

                if (
                    stateOptions[state] &&
                    stateOptions[state].enabled === false
                ) {
                    return;
                }

                if (state) {
                    lineWidth = (
                        stateOptions[state].lineWidth ||
                        lineWidth + (stateOptions[state].lineWidthPlus || 0)
                    ); // #4035
                    opacity = pick(
                        stateOptions[state].opacity,
                        opacity
                    );
                }

                if (graph && !graph.dashstyle) {
                    attribs = {
                        'stroke-width': lineWidth
                    };

                    // Animate the graph stroke-width.
                    graph.animate(
                        attribs,
                        stateAnimation
                    );
                    while (series['zone-graph-' + i]) {
                        series['zone-graph-' + i].attr(attribs);
                        i = i + 1;
                    }
                }

                // For some types (pie, networkgraph, sankey) opacity is
                // resolved on a point level
                if (!inactiveOtherPoints) {
                    [
                        series.group,
                        series.markerGroup,
                        series.dataLabelsGroup,
                        series.labelBySeries
                    ].forEach(
                        function (group) {
                            if (group) {
                                group.animate(
                                    {
                                        opacity: opacity
                                    },
                                    stateAnimation
                                );
                            }
                        }
                    );
                }
            }
        }

        // Don't loop over points on a series that doesn't apply inactive state
        // to siblings markers (e.g. line, column)
        if (inherit && inactiveOtherPoints && series.points) {
            series.points.forEach(function (point) {
                if (point.setState) {
                    point.setState(state);
                }
            });
        }
    },

    /**
     * Show or hide the series.
     *
     * @function Highcharts.Series#setVisible
     *
     * @param {boolean} [visible]
     *        True to show the series, false to hide. If undefined, the
     *        visibility is toggled.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the series is altered. If doing
     *        more operations on the chart, it is a good idea to set redraw to
     *        false and call {@link Chart#redraw|chart.redraw()} after.
     *
     * @fires Highcharts.Series#event:hide
     * @fires Highcharts.Series#event:show
     */
    setVisible: function (vis, redraw) {
        var series = this,
            chart = series.chart,
            legendItem = series.legendItem,
            showOrHide,
            ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries,
            oldVisibility = series.visible;

        // if called without an argument, toggle visibility
        series.visible =
            vis =
            series.options.visible =
            series.userOptions.visible =
            vis === undefined ? !oldVisibility : vis; // #5618
        showOrHide = vis ? 'show' : 'hide';

        // show or hide elements
        [
            'group',
            'dataLabelsGroup',
            'markerGroup',
            'tracker',
            'tt'
        ].forEach(function (key) {
            if (series[key]) {
                series[key][showOrHide]();
            }
        });


        // hide tooltip (#1361)
        if (
            chart.hoverSeries === series ||
            (chart.hoverPoint && chart.hoverPoint.series) === series
        ) {
            series.onMouseOut();
        }


        if (legendItem) {
            chart.legend.colorizeItem(series, vis);
        }


        // rescale or adapt to resized chart
        series.isDirty = true;
        // in a stack, all other series are affected
        if (series.options.stacking) {
            chart.series.forEach(function (otherSeries) {
                if (otherSeries.options.stacking && otherSeries.visible) {
                    otherSeries.isDirty = true;
                }
            });
        }

        // show or hide linked series
        series.linkedSeries.forEach(function (otherSeries) {
            otherSeries.setVisible(vis, false);
        });

        if (ignoreHiddenSeries) {
            chart.isDirtyBox = true;
        }

        fireEvent(series, showOrHide);

        if (redraw !== false) {
            chart.redraw();
        }
    },

    /**
     * Show the series if hidden.
     *
     * @sample highcharts/members/series-hide/
     *         Toggle visibility from a button
     *
     * @function Highcharts.Series#show
     *
     * @fires Highcharts.Series#event:show
     */
    show: function () {
        this.setVisible(true);
    },

    /**
     * Hide the series if visible. If the {@link
     * https://api.highcharts.com/highcharts/chart.ignoreHiddenSeries|
     * chart.ignoreHiddenSeries} option is true, the chart is redrawn without
     * this series.
     *
     * @sample highcharts/members/series-hide/
     *         Toggle visibility from a button
     *
     * @function Highcharts.Series#hide
     *
     * @fires Highcharts.Series#event:hide
     */
    hide: function () {
        this.setVisible(false);
    },


    /**
     * Select or unselect the series. This means its
     * {@link Highcharts.Series.selected|selected}
     * property is set, the checkbox in the legend is toggled and when selected,
     * the series is returned by the
     * {@link Highcharts.Chart#getSelectedSeries}
     * function.
     *
     * @sample highcharts/members/series-select/
     *         Select a series from a button
     *
     * @function Highcharts.Series#select
     *
     * @param {boolean} [selected]
     *        True to select the series, false to unselect. If undefined, the
     *        selection state is toggled.
     *
     * @fires Highcharts.Series#event:select
     * @fires Highcharts.Series#event:unselect
     */
    select: function (selected) {
        var series = this;

        series.selected =
        selected =
        this.options.selected = (
            selected === undefined ?
                !series.selected :
                selected
        );

        if (series.checkbox) {
            series.checkbox.checked = selected;
        }

        fireEvent(series, selected ? 'select' : 'unselect');
    },

    /**
     * @private
     * @borrows Highcharts.TrackerMixin.drawTrackerGraph as Highcharts.Series#drawTracker
     */
    drawTracker: TrackerMixin.drawTrackerGraph
});
