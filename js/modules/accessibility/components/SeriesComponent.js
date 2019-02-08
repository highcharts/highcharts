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
import KeyboardNavigationModule from '../KeyboardNavigationModule.js';


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
        seriesA11yOptions = series.options.accessibility || {};

    return seriesA11yOptions.skipKeyboardNavigation ||
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
 *
 * @param {Highcharts.Series} series
 *
 * @param {number} [xWeight]
 *
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
 * @return {Highcharts.Point|false}
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
 * @return {Highcharts.Point|false}
 */
H.Series.prototype.highlightFirstValidPoint = function () {
    var curPoint = this.chart.highlightedPoint,
        start = (curPoint && curPoint.series) === this ?
            getPointIndex(curPoint) :
            0,
        points = this.points;

    if (points) {
        for (var i = start, len = points.length; i < len; ++i) {
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
 * @return {Highcharts.Point|false}
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
 * @return {Highcharts.Point|false}
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
 * The SeriesComponent class
 *
 * @private
 * @class
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var SeriesComponent = function (chart) {
    this.initBase(chart);
    this.init();
};
SeriesComponent.prototype = new AccessibilityComponent();
H.extend(SeriesComponent.prototype, {

    /**
     * Init the component.
     */
    init: function () {
        // On destroy, we need to clean up the focus border and the state.
        H.addEvent(H.Series, 'destroy', function () {
            var chart = this.chart;

            if (
                chart.highlightedPoint &&
                chart.highlightedPoint.series === this
            ) {
                delete chart.highlightedPoint;
                if (chart.focusElement) {
                    chart.focusElement.removeFocusBorder();
                }
            }
        });
    },


    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {


    },


    /**
     * Get keyboard navigation module for this component.
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

        return new KeyboardNavigationModule(chart, {
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
    }

});

export default SeriesComponent;
