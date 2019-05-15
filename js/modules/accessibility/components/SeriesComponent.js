/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for series and points.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';

var merge = H.merge,
    pick = H.pick;


/*
 * Set for which series types it makes sense to move to the closest point with
 * up/down arrows, and which series types should just move to next series.
 */
H.Series.prototype.keyboardMoveVertical = true;
['column', 'pie'].forEach(function (type) {
    if (H.seriesTypes[type]) {
        H.seriesTypes[type].prototype.keyboardMoveVertical = false;
    }
});


/**
 * Keep track of forcing markers.
 * @private
 */
H.addEvent(H.Series, 'render', function () {
    var series = this,
        chart = series.chart,
        options = series.options,
        a11yOptions = chart.options.accessibility || {},
        points = series.points || [],
        dataLength = points.length,
        resetMarkerOptions = series.resetA11yMarkerOptions,
        // We need markers for a11y
        forceMarkers = a11yOptions.enabled &&
            (
                options.accessibility &&
                options.accessibility.enabled
            ) !== false &&
            (
                dataLength < a11yOptions.pointDescriptionThreshold ||
                a11yOptions.pointDescriptionThreshold === false
            );

    if (forceMarkers) {
        // If markers are explicitly disabled on series, replace with markers
        // that have zero opacity.
        if (options.marker && options.marker.enabled === false) {
            series.a11yMarkersForced = true;
            merge(true, series.options, {
                marker: {
                    enabled: true,
                    states: {
                        normal: {
                            opacity: 0
                        }
                    }
                }
            });
        }

        // If we have point markers, we need to handle them
        if (series._hasPointMarkers && series.points && series.points.length) {
            var i = dataLength,
                pointOptions;
            while (i--) {
                pointOptions = points[i].options;
                if (pointOptions.marker) {
                    if (pointOptions.marker.enabled) {
                        // Make sure opacity is overridden to show enabled
                        // markers
                        merge(true, pointOptions.marker, {
                            states: {
                                normal: {
                                    opacity: pointOptions.marker.states &&
                                        pointOptions.marker.states.normal &&
                                        pointOptions.marker.states.normal
                                            .opacity || 1
                                }
                            }
                        });
                    } else {
                        // Make sure hidden markers are enabled instead, and
                        // opacity is out.
                        merge(true, pointOptions.marker, {
                            enabled: true,
                            states: {
                                normal: {
                                    opacity: 0
                                }
                            }
                        });
                    }
                }
            }
        }

    } else if (series.a11yMarkersForced && resetMarkerOptions) {
        // Series markers should not be forced, and we should reset to old
        // options.
        delete series.a11yMarkersForced;
        merge(true, series.options, {
            marker: {
                enabled: resetMarkerOptions.enabled,
                states: {
                    normal: {
                        opacity: resetMarkerOptions.states &&
                            resetMarkerOptions.states.normal &&
                            resetMarkerOptions.states.normal.opacity
                    }
                }
            }
        });
    }
});


/**
 * Keep track of options to reset markers to if no longer forced.
 * @private
 */
H.addEvent(H.Series, 'afterSetOptions', function (e) {
    this.resetA11yMarkerOptions = merge(
        e.options.marker || {}, this.userOptions.marker || {}
    );
});


/**
 * Get the index of a point in a series. This is needed when using e.g. data
 * grouping.
 *
 * @private
 * @function getPointIndex
 *
 * @param {Highcharts.Point} point
 *        The point to find index of.
 *
 * @return {number}
 *         The index in the series.points array of the point.
 */
function getPointIndex(point) {
    var index = point.index,
        points = point.series.points,
        i = points.length;

    if (points[index] !== point) {
        while (i--) {
            if (points[i] === point) {
                return i;
            }
        }
    } else {
        return index;
    }
}


/**
 * Determine if a series should be skipped
 *
 * @private
 * @function isSkipSeries
 *
 * @param {Highcharts.Series} series
 *
 * @return {boolean}
 */
function isSkipSeries(series) {
    var a11yOptions = series.chart.options.accessibility,
        seriesA11yOptions = series.options.accessibility || {},
        seriesKbdNavOptions = seriesA11yOptions.keyboardNavigation;

    return seriesKbdNavOptions && seriesKbdNavOptions.enabled === false ||
        seriesA11yOptions.enabled === false ||
        series.options.enableMouseTracking === false || // #8440
        !series.visible ||
        // Skip all points in a series where pointDescriptionThreshold is
        // reached
        (a11yOptions.pointDescriptionThreshold &&
        a11yOptions.pointDescriptionThreshold <= series.points.length);
}


/**
 * Determine if a point should be skipped
 *
 * @private
 * @function isSkipPoint
 *
 * @param {Highcharts.Point} point
 *
 * @return {boolean}
 */
function isSkipPoint(point) {
    var a11yOptions = point.series.chart.options.accessibility;

    return point.isNull && a11yOptions.keyboardNavigation.skipNullPoints ||
        point.visible === false ||
        isSkipSeries(point.series);
}


/**
 * Get the point in a series that is closest (in distance) to a reference point.
 * Optionally supply weight factors for x and y directions.
 *
 * @private
 * @function getClosestPoint
 *
 * @param {Highcharts.Point} point
 * @param {Highcharts.Series} series
 * @param {number} [xWeight]
 * @param {number} [yWeight]
 *
 * @return {Highcharts.Point|undefined}
 */
function getClosestPoint(point, series, xWeight, yWeight) {
    var minDistance = Infinity,
        dPoint,
        minIx,
        distance,
        i = series.points.length;

    if (point.plotX === undefined || point.plotY === undefined) {
        return;
    }
    while (i--) {
        dPoint = series.points[i];
        if (dPoint.plotX === undefined || dPoint.plotY === undefined) {
            continue;
        }
        distance = (point.plotX - dPoint.plotX) *
                (point.plotX - dPoint.plotX) * (xWeight || 1) +
                (point.plotY - dPoint.plotY) *
                (point.plotY - dPoint.plotY) * (yWeight || 1);
        if (distance < minDistance) {
            minDistance = distance;
            minIx = i;
        }
    }
    return minIx !== undefined && series.points[minIx];
}


/**
 * Highlights a point (show tooltip and display hover state).
 *
 * @private
 * @function Highcharts.Point#highlight
 *
 * @return {Highcharts.Point}
 *         This highlighted point.
 */
H.Point.prototype.highlight = function () {
    var chart = this.series.chart;

    if (!this.isNull) {
        this.onMouseOver(); // Show the hover marker and tooltip
    } else {
        if (chart.tooltip) {
            chart.tooltip.hide(0);
        }
        // Don't call blur on the element, as it messes up the chart div's focus
    }

    // We focus only after calling onMouseOver because the state change can
    // change z-index and mess up the element.
    if (this.graphic) {
        chart.setFocusToElement(this.graphic);
    }

    chart.highlightedPoint = this;
    return this;
};


/**
 * Function to highlight next/previous point in chart.
 *
 * @private
 * @function Highcharts.Chart#highlightAdjacentPoint
 *
 * @param {boolean} next
 *        Flag for the direction.
 *
 * @return {Highcharts.Point|boolean}
 *         Returns highlighted point on success, false on failure (no adjacent
 *         point to highlight in chosen direction).
 */
H.Chart.prototype.highlightAdjacentPoint = function (next) {
    var chart = this,
        series = chart.series,
        curPoint = chart.highlightedPoint,
        curPointIndex = curPoint && getPointIndex(curPoint) || 0,
        curPoints = curPoint && curPoint.series.points,
        lastSeries = chart.series && chart.series[chart.series.length - 1],
        lastPoint = lastSeries && lastSeries.points &&
                    lastSeries.points[lastSeries.points.length - 1],
        newSeries,
        newPoint;

    // If no points, return false
    if (!series[0] || !series[0].points) {
        return false;
    }

    if (!curPoint) {
        // No point is highlighted yet. Try first/last point depending on move
        // direction
        newPoint = next ? series[0].points[0] : lastPoint;
    } else {
        // We have a highlighted point.
        // Grab next/prev point & series
        newSeries = series[curPoint.series.index + (next ? 1 : -1)];
        newPoint = curPoints[curPointIndex + (next ? 1 : -1)];
        if (!newPoint && newSeries) {
            // Done with this series, try next one
            newPoint = newSeries.points[next ? 0 : newSeries.points.length - 1];
        }

        // If there is no adjacent point, we return false
        if (!newPoint) {
            return false;
        }
    }

    // Recursively skip points
    if (isSkipPoint(newPoint)) {
        // If we skip this whole series, move to the end of the series before we
        // recurse, just to optimize
        newSeries = newPoint.series;
        if (isSkipSeries(newSeries)) {
            chart.highlightedPoint = next ?
                newSeries.points[newSeries.points.length - 1] :
                newSeries.points[0];
        } else {
            // Otherwise, just move one point
            chart.highlightedPoint = newPoint;
        }
        // Retry
        return chart.highlightAdjacentPoint(next);
    }

    // There is an adjacent point, highlight it
    return newPoint.highlight();
};


/**
 * Highlight first valid point in a series. Returns the point if successfully
 * highlighted, otherwise false. If there is a highlighted point in the series,
 * use that as starting point.
 *
 * @private
 * @function Highcharts.Series#highlightFirstValidPoint
 *
 * @return {Highcharts.Point|boolean}
 */
H.Series.prototype.highlightFirstValidPoint = function () {
    var curPoint = this.chart.highlightedPoint,
        start = (curPoint && curPoint.series) === this ?
            getPointIndex(curPoint) :
            0,
        points = this.points,
        len = points.length;

    if (points && len) {
        for (var i = start; i < len; ++i) {
            if (!isSkipPoint(points[i])) {
                return points[i].highlight();
            }
        }
        for (var j = start; j >= 0; --j) {
            if (!isSkipPoint(points[j])) {
                return points[j].highlight();
            }
        }
    }
    return false;
};


/**
 * Highlight next/previous series in chart. Returns false if no adjacent series
 * in the direction, otherwise returns new highlighted point.
 *
 * @private
 * @function Highcharts.Chart#highlightAdjacentSeries
 *
 * @param {boolean} down
 *
 * @return {Highcharts.Point|boolean}
 */
H.Chart.prototype.highlightAdjacentSeries = function (down) {
    var chart = this,
        newSeries,
        newPoint,
        adjacentNewPoint,
        curPoint = chart.highlightedPoint,
        lastSeries = chart.series && chart.series[chart.series.length - 1],
        lastPoint = lastSeries && lastSeries.points &&
                    lastSeries.points[lastSeries.points.length - 1];

    // If no point is highlighted, highlight the first/last point
    if (!chart.highlightedPoint) {
        newSeries = down ? (chart.series && chart.series[0]) : lastSeries;
        newPoint = down ?
            (newSeries && newSeries.points && newSeries.points[0]) : lastPoint;
        return newPoint ? newPoint.highlight() : false;
    }

    newSeries = chart.series[curPoint.series.index + (down ? -1 : 1)];

    if (!newSeries) {
        return false;
    }

    // We have a new series in this direction, find the right point
    // Weigh xDistance as counting much higher than Y distance
    newPoint = getClosestPoint(curPoint, newSeries, 4);

    if (!newPoint) {
        return false;
    }

    // New series and point exists, but we might want to skip it
    if (isSkipSeries(newSeries)) {
        // Skip the series
        newPoint.highlight();
        adjacentNewPoint = chart.highlightAdjacentSeries(down); // Try recurse
        if (!adjacentNewPoint) {
            // Recurse failed
            curPoint.highlight();
            return false;
        }
        // Recurse succeeded
        return adjacentNewPoint;
    }

    // Highlight the new point or any first valid point back or forwards from it
    newPoint.highlight();
    return newPoint.series.highlightFirstValidPoint();
};


/**
 * Highlight the closest point vertically.
 *
 * @private
 * @function Highcharts.Chart#highlightAdjacentPointVertical
 *
 * @param {boolean} down
 *
 * @return {Highcharts.Point|boolean}
 */
H.Chart.prototype.highlightAdjacentPointVertical = function (down) {
    var curPoint = this.highlightedPoint,
        minDistance = Infinity,
        bestPoint;

    if (curPoint.plotX === undefined || curPoint.plotY === undefined) {
        return false;
    }
    this.series.forEach(function (series) {
        if (series === curPoint.series || isSkipSeries(series)) {
            return;
        }
        series.points.forEach(function (point) {
            if (point.plotY === undefined || point.plotX === undefined ||
                point === curPoint) {
                return;
            }
            var yDistance = point.plotY - curPoint.plotY,
                width = Math.abs(point.plotX - curPoint.plotX),
                distance = Math.abs(yDistance) * Math.abs(yDistance) +
                    width * width * 4; // Weigh horizontal distance highly

            // Reverse distance number if axis is reversed
            if (series.yAxis.reversed) {
                yDistance *= -1;
            }

            if (
                yDistance <= 0 && down || yDistance >= 0 && !down || // Chk dir
                distance < 5 || // Points in same spot => infinite loop
                isSkipPoint(point)
            ) {
                return;
            }

            if (distance < minDistance) {
                minDistance = distance;
                bestPoint = point;
            }
        });
    });

    return bestPoint ? bestPoint.highlight() : false;
};


/**
 * Get accessible time description for a point on a datetime axis.
 *
 * @private
 * @function Highcharts.Point#getTimeDescription
 *
 * @return {string}
 *         The description as string.
 */
H.Point.prototype.getA11yTimeDescription = function () {
    var point = this,
        series = point.series,
        chart = series.chart,
        a11yOptions = chart.options.accessibility;
    if (series.xAxis && series.xAxis.isDatetimeAxis) {
        return chart.time.dateFormat(
            a11yOptions.pointDateFormatter &&
            a11yOptions.pointDateFormatter(point) ||
            a11yOptions.pointDateFormat ||
            H.Tooltip.prototype.getXDateFormat.call(
                {
                    getDateFormat: H.Tooltip.prototype.getDateFormat,
                    chart: chart
                },
                point,
                chart.options.tooltip,
                series.xAxis
            ),
            point.x
        );
    }
};


/**
 * The SeriesComponent class
 *
 * @private
 * @class
 * @name Highcharts.SeriesComponent
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var SeriesComponent = function (chart) {
    this.initBase(chart);
    this.init();
};
SeriesComponent.prototype = new AccessibilityComponent();
H.extend(SeriesComponent.prototype, /** @lends Highcharts.SeriesComponent */ {

    /**
     * Init the component.
     */
    init: function () {
        var component = this;

        // On destroy, we need to clean up the focus border and the state.
        this.addEvent(H.Series, 'destroy', function () {
            var chart = this.chart;
            if (
                chart === component.chart &&
                chart.highlightedPoint &&
                chart.highlightedPoint.series === this
            ) {
                delete chart.highlightedPoint;
                if (chart.focusElement) {
                    chart.focusElement.removeFocusBorder();
                }
            }
        });

        // Hide tooltip from screen readers when it is shown
        this.addEvent(H.Tooltip, 'refresh', function () {
            if (
                this.chart === component.chart &&
                this.label &&
                this.label.element
            ) {
                this.label.element.setAttribute('aria-hidden', true);
            }
        });

        // Hide series labels
        this.addEvent(this.chart, 'afterDrawSeriesLabels', function () {
            this.series.forEach(function (series) {
                if (series.labelBySeries) {
                    series.labelBySeries.attr('aria-hidden', true);
                }
            });
        });

        // Set up announcing of new data
        this.initAnnouncer();
    },


    /**
     * Called on chart render. It is necessary to do this for render in case
     * markers change on zoom/pixel density.
     */
    onChartRender: function () {
        var component = this,
            chart = this.chart;
        chart.series.forEach(function (series) {
            component[
                (series.options.accessibility &&
                series.options.accessibility.enabled) !== false ?
                    'addSeriesDescription' : 'hideSeriesFromScreenReader'
            ](series);
        });
    },


    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function () {
        var keys = this.keyCodes,
            chart = this.chart,
            a11yOptions = chart.options.accessibility,
            // Function that attempts to highlight next/prev point, returns
            // the response number. Handles wrap around.
            attemptNextPoint = function (directionIsNext) {
                if (!chart.highlightAdjacentPoint(directionIsNext)) {
                    // Failed to highlight next, wrap to last/first if we
                    // have wrapAround
                    if (a11yOptions.keyboardNavigation.wrapAround) {
                        return this.init(directionIsNext ? 1 : -1);
                    }
                    return this.response[directionIsNext ? 'next' : 'prev'];
                }
                return this.response.success;
            };

        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Arrow sideways
                [[
                    keys.left, keys.right
                ], function (keyCode) {
                    return attemptNextPoint.call(this, keyCode === keys.right);
                }],

                // Arrow vertical
                [[
                    keys.up, keys.down
                ], function (keyCode) {
                    var down = keyCode === keys.down,
                        navOptions = a11yOptions.keyboardNavigation;

                    // Handle serialized mode, act like left/right
                    if (navOptions.mode && navOptions.mode === 'serialize') {
                        return attemptNextPoint.call(
                            this, keyCode === keys.down
                        );
                    }

                    // Normal mode, move between series
                    var highlightMethod = chart.highlightedPoint &&
                            chart.highlightedPoint.series.keyboardMoveVertical ?
                        'highlightAdjacentPointVertical' :
                        'highlightAdjacentSeries';

                    chart[highlightMethod](down);
                    return this.response.success;
                }],

                // Enter/Spacebar
                [[
                    keys.enter, keys.space
                ], function () {
                    if (chart.highlightedPoint) {
                        chart.highlightedPoint.firePointEvent('click');
                    }
                }]
            ],

            // Always start highlighting from scratch when entering this module
            init: function (dir) {
                var numSeries = chart.series.length,
                    i = dir > 0 ? 0 : numSeries,
                    res;

                if (dir > 0) {
                    delete chart.highlightedPoint;
                    // Find first valid point to highlight
                    while (i < numSeries) {
                        res = chart.series[i].highlightFirstValidPoint();
                        if (res) {
                            break;
                        }
                        ++i;
                    }
                } else {
                    // Find last valid point to highlight
                    while (i--) {
                        chart.highlightedPoint = chart.series[i].points[
                            chart.series[i].points.length - 1
                        ];
                        // Highlight first valid point in the series will also
                        // look backwards. It always starts from currently
                        // highlighted point.
                        res = chart.series[i].highlightFirstValidPoint();
                        if (res) {
                            break;
                        }
                    }
                }

                // Nothing to highlight
                return this.response.success;
            },

            // If leaving points, don't show tooltip anymore
            terminate: function () {
                if (chart.tooltip) {
                    chart.tooltip.hide(0);
                }
                delete chart.highlightedPoint;
            }
        });
    },


    /**
     * Returns true if a point should be clickable.
     * @private
     * @param {Highcharts.Point} point The point to test.
     * @return {boolean} True if the point can be clicked.
     */
    isPointClickable: function (point) {
        var seriesOpts = point.series.options || {},
            seriesPointEvents = seriesOpts.point && seriesOpts.point.events;
        return point && point.graphic && point.graphic.element &&
            (
                point.hcEvents && point.hcEvents.click ||
                seriesPointEvents && seriesPointEvents.click ||
                (
                    point.options &&
                    point.options.events &&
                    point.options.events.click
                )
            );
    },


    /**
     * Initialize the new data announcer.
     * @private
     */
    initAnnouncer: function () {
        var chart = this.chart,
            a11yOptions = chart.options.accessibility,
            component = this;
        this.lastAnnouncementTime = 0;
        this.dirty = {
            allSeries: {}
        };

        // Add the live region
        this.announceRegion = this.createElement('div');
        this.announceRegion.setAttribute('aria-hidden', false);
        this.announceRegion.setAttribute(
            'aria-live', a11yOptions.announceNewData.interruptUser ?
                'assertive' : 'polite'
        );
        merge(true, this.announceRegion.style, this.hiddenStyle);
        chart.renderTo.insertBefore(
            this.announceRegion, chart.renderTo.firstChild
        );

        // After drilldown, make sure we reset time counter, and also that we
        // highlight the first series.
        this.addEvent(this.chart, 'afterDrilldown', function () {
            chart.highlightedPoint = null;
            if (chart.options.accessibility.announceNewData.enabled) {
                if (this.series && this.series.length) {
                    var el = component.getSeriesElement(this.series[0]);
                    if (el.focus && el.getAttribute('aria-label')) {
                        el.focus();
                    } else {
                        this.series[0].highlightFirstValidPoint();
                    }
                }
                component.lastAnnouncementTime = 0;
                if (chart.focusElement) {
                    chart.focusElement.removeFocusBorder();
                }
            }
        });
        // On new data in the series, make sure we add it to the dirty list
        this.addEvent(H.Series, 'updatedData', function () {
            if (
                this.chart === chart &&
                this.chart.options.accessibility.announceNewData.enabled
            ) {
                component.dirty.hasDirty = true;
                component.dirty.allSeries[this.name + this.index] = this;
            }
        });
        // New series
        this.addEvent(chart, 'afterAddSeries', function (e) {
            if (this.options.accessibility.announceNewData.enabled) {
                var series = e.series;
                component.dirty.hasDirty = true;
                component.dirty.allSeries[series.name + series.index] = series;
                // Add it to newSeries storage unless we already have one
                component.dirty.newSeries = component.dirty.newSeries ===
                    undefined ? series : null;
            }
        });
        // New point
        this.addEvent(H.Series, 'addPoint', function (e) {
            if (this.chart === chart &&
                this.chart.options.accessibility.announceNewData.enabled) {
                // Add it to newPoint storage unless we already have one
                component.dirty.newPoint = component.dirty.newPoint ===
                    undefined ? e.point : null;
            }
        });
        // On redraw: compile what we know about new data, and build
        // announcement
        this.addEvent(chart, 'redraw', function () {
            if (
                this.options.accessibility.announceNewData &&
                component.dirty.hasDirty
            ) {
                var newPoint = component.dirty.newPoint,
                    newPoints;
                // If we have a single new point, see if we can find it in the
                // data array. Otherwise we can only pass through options to
                // the description builder, and it is a bit sparse in info.
                if (newPoint) {
                    newPoints = newPoint.series.data.filter(function (point) {
                        return point.x === newPoint.x && point.y === newPoint.y;
                    });
                    // We have list of points with the same x and y values. If
                    // this list is one point long, we have our new point.
                    newPoint = newPoints.length === 1 ? newPoints[0] : newPoint;
                }
                // Queue the announcement
                component.announceNewData(
                    Object.keys(component.dirty.allSeries).map(function (ix) {
                        return component.dirty.allSeries[ix];
                    }),
                    component.dirty.newSeries,
                    newPoint
                );
                // Reset
                component.dirty = {
                    allSeries: {}
                };
            }
        });
    },


    /**
     * Handle announcement to user that there is new data.
     * @private
     * @param {Array<Highcharts.Series>} dirtySeries
     *          Array of series with new data.
     * @param {Highcharts.Series} [newSeries]
     *          If a single new series was added, a reference to this series.
     * @param {Highcharts.Point} [newPoint]
     *          If a single point was added, a reference to this point.
     */
    announceNewData: function (dirtySeries, newSeries, newPoint) {
        var chart = this.chart,
            annOptions = chart.options.accessibility.announceNewData;
        if (annOptions.enabled) {
            var component = this,
                now = +new Date(),
                dTime = now - this.lastAnnouncementTime,
                time = Math.max(0, annOptions.minAnnounceInterval - dTime),
                allSeries;

            // Add affected series from existing queued announcement
            if (this.queuedAnnouncement) {
                var uniqueSeries = (this.queuedAnnouncement.series || [])
                    .concat(dirtySeries)
                    .reduce(function (acc, cur) {
                        acc[cur.name + cur.index] = cur;
                        return acc;
                    }, {});
                allSeries = Object.keys(uniqueSeries).map(function (ix) {
                    return uniqueSeries[ix];
                });
            } else {
                allSeries = [].concat(dirtySeries);
            }

            // Build message and announce
            var message = this.buildAnnouncementMessage(
                allSeries, newSeries, newPoint
            );
            if (message) {
                // Is there already one queued?
                if (this.queuedAnnouncement) {
                    clearTimeout(this.queuedAnnouncementTimer);
                }

                // Build the announcement
                this.queuedAnnouncement = {
                    time: now,
                    message: message,
                    series: allSeries
                };

                // Queue the announcement
                component.queuedAnnouncementTimer = setTimeout(function () {
                    if (component && component.announceRegion) {
                        component.lastAnnouncementTime = +new Date();
                        component.announceRegion.innerHTML = component
                            .queuedAnnouncement.message;

                        // Delete contents after a second to avoid user
                        // finding the live region in the DOM.
                        if (component.clearAnnouncementContainerTimer) {
                            clearTimeout(
                                component.clearAnnouncementContainerTimer
                            );
                        }
                        component.clearAnnouncementContainerTimer = setTimeout(
                            function () {
                                component.announceRegion.innerHTML = '';
                                delete
                                component.clearAnnouncementContainerTimer;
                            }, 1000
                        );
                        delete component.queuedAnnouncement;
                        delete component.queuedAnnouncementTimer;
                    }
                }, time);
            }
        }
    },


    /**
     * Handle announcement to user that there is new data.
     * @private
     * @param {Array<Highcharts.Series>} dirtySeries
     *          Array of series with new data.
     * @param {Highcharts.Series} [newSeries]
     *          If a single new series was added, a reference to this series.
     * @param {Highcharts.Point} [newPoint]
     *          If a single point was added, a reference to this point.
     *
     * @return {string} The announcement message to give to user.
     */
    buildAnnouncementMessage: function (dirtySeries, newSeries, newPoint) {
        var chart = this.chart,
            annOptions = chart.options.accessibility.announceNewData;

        // User supplied formatter?
        if (annOptions.announcementFormatter) {
            var formatterRes = annOptions.announcementFormatter(
                dirtySeries, newSeries, newPoint
            );
            if (formatterRes !== false) {
                return formatterRes.length ? formatterRes : null;
            }
        }

        // Default formatter - use lang options
        var multiple = H.charts && H.charts.length > 1 ? 'Multiple' : 'Single',
            langKey = newSeries ? 'newSeriesAnnounce' + multiple :
                newPoint ? 'newPointAnnounce' + multiple : 'newDataAnnounce';
        return chart.langFormat(
            'accessibility.announceNewData.' + langKey, {
                chartTitle: this.stripTags(
                    chart.options.title.text || chart.langFormat(
                        'accessibility.defaultChartTitle', { chart: chart }
                    )
                ),
                seriesDesc: newSeries ?
                    this.defaultSeriesDescriptionFormatter(newSeries) : null,
                pointDesc: newPoint ?
                    this.defaultPointDescriptionFormatter(newPoint) : null,
                point: newPoint,
                series: newSeries
            }
        );
    },


    /**
     * Utility function. Reverses child nodes of a DOM element.
     * @private
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} node
     */
    reverseChildNodes: function (node) {
        var i = node.childNodes.length;
        while (i--) {
            node.appendChild(node.childNodes[i]);
        }
    },


    /**
     * Get the DOM element for the first point in the series.
     * @private
     * @param {Highcharts.Series} series The series to get element for.
     * @return {Highcharts.SVGDOMElement} The DOM element for the point.
     */
    getSeriesFirstPointElement: function (series) {
        return (
            series.points &&
            series.points.length &&
            series.points[0].graphic &&
            series.points[0].graphic.element
        );
    },


    /**
     * Get the DOM element for the series that we put accessibility info on.
     * @private
     * @param {Highcharts.Series} series The series to get element for.
     * @return {Highcharts.SVGDOMElement} The DOM element for the series
     */
    getSeriesElement: function (series) {
        var firstPointEl = this.getSeriesFirstPointElement(series);
        return (
            firstPointEl &&
            firstPointEl.parentNode || series.graph &&
            series.graph.element || series.group &&
            series.group.element
        ); // Could be tracker series depending on series type
    },


    /**
     * Hide series from screen readers.
     * @private
     * @param {Highcharts.Series} series The series to hide
     */
    hideSeriesFromScreenReader: function (series) {
        var seriesEl = this.getSeriesElement(series);
        if (seriesEl) {
            seriesEl.setAttribute('aria-hidden', true);
        }
    },


    /**
     * Put accessible info on series and points of a series.
     * @private
     * @param {Highcharts.Series} series The series to add info on.
     */
    addSeriesDescription: function (series) {
        var component = this,
            chart = series.chart,
            a11yOptions = chart.options.accessibility,
            seriesA11yOptions = series.options.accessibility || {},
            firstPointEl = component.getSeriesFirstPointElement(series),
            seriesEl = component.getSeriesElement(series);

        if (seriesEl) {
            // Unhide series
            this.unhideElementFromScreenReaders(seriesEl);

            // For some series types the order of elements do not match the
            // order of points in series. In that case we have to reverse them
            // in order for AT to read them out in an understandable order
            if (seriesEl.lastChild === firstPointEl) {
                component.reverseChildNodes(seriesEl);
            }

            // Make individual point elements accessible if possible. Note: If
            // markers are disabled there might not be any elements there to
            // make accessible.
            if (
                series.points && (
                    series.points.length <
                        a11yOptions.pointDescriptionThreshold ||
                    a11yOptions.pointDescriptionThreshold === false
                ) &&
                !seriesA11yOptions.exposeAsGroupOnly
            ) {
                series.points.forEach(function (point) {
                    var pointEl = point.graphic && point.graphic.element;
                    if (pointEl) {
                        pointEl.setAttribute('role', 'img');
                        pointEl.setAttribute('tabindex', '-1');
                        pointEl.setAttribute('aria-label',
                            component.stripTags(
                                seriesA11yOptions.pointDescriptionFormatter &&
                                seriesA11yOptions
                                    .pointDescriptionFormatter(point) ||
                                a11yOptions.pointDescriptionFormatter &&
                                a11yOptions.pointDescriptionFormatter(point) ||
                                component
                                    .defaultPointDescriptionFormatter(point)
                            ));
                    }
                });
            }

            // Make series element accessible
            if (chart.series.length > 1 || a11yOptions.describeSingleSeries) {
                // Handle role attribute
                if (seriesA11yOptions.exposeAsGroupOnly) {
                    seriesEl.setAttribute('role', 'img');
                } else if (a11yOptions.landmarkVerbosity === 'all') {
                    seriesEl.setAttribute('role', 'region');
                } /* else do not add role */

                seriesEl.setAttribute('tabindex', '-1');
                seriesEl.setAttribute(
                    'aria-label',
                    component.stripTags(
                        a11yOptions.seriesDescriptionFormatter &&
                        a11yOptions.seriesDescriptionFormatter(series) ||
                        component.defaultSeriesDescriptionFormatter(series)
                    )
                );
            }
        }
    },


    /**
     * Return string with information about series.
     * @private
     * @return {string}
     */
    defaultSeriesDescriptionFormatter: function (series) {
        var chart = series.chart,
            seriesA11yOptions = series.options.accessibility || {},
            desc = seriesA11yOptions.description,
            description = desc && chart.langFormat(
                'accessibility.series.description', {
                    description: desc,
                    series: series
                }
            ),
            xAxisInfo = chart.langFormat(
                'accessibility.series.xAxisDescription',
                {
                    name: series.xAxis && series.xAxis.getDescription(),
                    series: series
                }
            ),
            yAxisInfo = chart.langFormat(
                'accessibility.series.yAxisDescription',
                {
                    name: series.yAxis && series.yAxis.getDescription(),
                    series: series
                }
            ),
            summaryContext = {
                name: series.name || '',
                ix: series.index + 1,
                numSeries: chart.series && chart.series.length,
                numPoints: series.points && series.points.length,
                series: series
            },
            combination = chart.types && chart.types.length > 1 ?
                'Combination' : '',
            summary = chart.langFormat(
                'accessibility.series.summary.' + series.type + combination,
                summaryContext
            ) || chart.langFormat(
                'accessibility.series.summary.default' + combination,
                summaryContext
            );

        return summary + (description ? ' ' + description : '') + (
            chart.yAxis && chart.yAxis.length > 1 && this.yAxis ?
                ' ' + yAxisInfo : ''
        ) + (
            chart.xAxis && chart.xAxis.length > 1 && this.xAxis ?
                ' ' + xAxisInfo : ''
        );
    },


    /**
     * Return string with information about point.
     * @private
     * @return {string}
     */
    defaultPointDescriptionFormatter: function (point) {
        var series = point.series,
            chart = series.chart,
            a11yOptions = chart.options.accessibility,
            tooltipOptions = point.series.tooltipOptions || {},
            valuePrefix = a11yOptions.pointValuePrefix ||
                tooltipOptions.valuePrefix || '',
            valueSuffix = a11yOptions.pointValueSuffix ||
                tooltipOptions.valueSuffix || '',
            description = point.options && point.options.accessibility &&
                point.options.accessibility.description,
            timeDesc = point.getA11yTimeDescription(),
            numberFormat = function (value) {
                if (H.isNumber(value)) {
                    var lang = H.defaultOptions.lang;
                    return H.numberFormat(
                        value,
                        a11yOptions.pointValueDecimals ||
                            tooltipOptions.valueDecimals || -1,
                        lang.decimalPoint,
                        lang.accessibility.thousandsSep ||
                            lang.thousandsSep
                    );
                }
                return value;
            },
            showXDescription = pick(
                series.xAxis &&
                series.xAxis.options.accessibility &&
                series.xAxis.options.accessibility.enabled,
                !chart.angular
            ),
            pointCategory = series.xAxis && series.xAxis.categories &&
                    point.category !== undefined && '' + point.category;

        // Pick and choose properties for a succint label
        var xDesc = point.name || timeDesc ||
            pointCategory && pointCategory.replace('<br/>', ' ') || (
                point.id && point.id.indexOf('highcharts-') < 0 ?
                    point.id : ('x, ' + point.x)
            ),
            valueDesc = point.series.pointArrayMap ?
                point.series.pointArrayMap.reduce(function (desc, key) {
                    return desc + (desc.length ? ', ' : '') + key + ': ' +
                    valuePrefix + numberFormat(
                        pick(point[key], point.options[key])
                    ) + valueSuffix;
                }, '') :
                (
                    point.value !== undefined ?
                        valuePrefix + numberFormat(point.value) + valueSuffix :
                        valuePrefix + numberFormat(point.y) + valueSuffix
                );

        return (point.index !== undefined ? (point.index + 1) + '. ' : '') +
            (showXDescription ? xDesc + ', ' : '') + valueDesc + '.' +
            (description ? ' ' + description : '') +
            (chart.series.length > 1 && series.name ? ' ' + series.name : '');
    }

});

export default SeriesComponent;
