/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Handle keyboard navigation for series.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Point from '../../../Core/Series/Point.js';
import Series from '../../../Core/Series/Series.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var seriesTypes = SeriesRegistry.seriesTypes;
import H from '../../../Core/Globals.js';
var doc = H.doc;
import U from '../../../Core/Utilities.js';
var defined = U.defined, fireEvent = U.fireEvent;
import KeyboardNavigationHandler from '../../KeyboardNavigationHandler.js';
import EventProvider from '../../Utils/EventProvider.js';
import ChartUtilities from '../../Utils/ChartUtilities.js';
var getPointFromXY = ChartUtilities.getPointFromXY, getSeriesFromName = ChartUtilities.getSeriesFromName, scrollToPoint = ChartUtilities.scrollToPoint;
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * Get the index of a point in a series. This is needed when using e.g. data
 * grouping.
 *
 * @private
 * @function getPointIndex
 * @param {Highcharts.AccessibilityPoint} point
 * The point to find index of.
 * @return {number|undefined}
 * The index in the series.points array of the point.
 */
function getPointIndex(point) {
    var index = point.index, points = point.series.points;
    var i = points.length;
    if (points[index] !== point) {
        while (i--) {
            if (points[i] === point) {
                return i;
            }
        }
    }
    else {
        return index;
    }
}
/**
 * Determine if series navigation should be skipped
 * @private
 */
function isSkipSeries(series) {
    var a11yOptions = series.chart.options.accessibility, seriesNavOptions = a11yOptions.keyboardNavigation.seriesNavigation, seriesA11yOptions = series.options.accessibility || {}, seriesKbdNavOptions = seriesA11yOptions.keyboardNavigation;
    return seriesKbdNavOptions && seriesKbdNavOptions.enabled === false ||
        seriesA11yOptions.enabled === false ||
        series.options.enableMouseTracking === false || // #8440
        !series.visible ||
        // Skip all points in a series where pointNavigationEnabledThreshold is
        // reached
        (seriesNavOptions.pointNavigationEnabledThreshold &&
            seriesNavOptions.pointNavigationEnabledThreshold <=
                series.points.length);
}
/**
 * Determine if navigation for a point should be skipped
 * @private
 */
function isSkipPoint(point) {
    var a11yOptions = point.series.chart.options.accessibility;
    var pointA11yDisabled = (point.options.accessibility &&
        point.options.accessibility.enabled === false);
    return point.isNull &&
        a11yOptions.keyboardNavigation.seriesNavigation.skipNullPoints ||
        point.visible === false ||
        point.isInside === false ||
        pointA11yDisabled ||
        isSkipSeries(point.series);
}
/**
 * Get the first point that is not a skip point in this series.
 * @private
 */
function getFirstValidPointInSeries(series) {
    var points = series.points || [], len = points.length;
    for (var i = 0; i < len; ++i) {
        if (!isSkipPoint(points[i])) {
            return points[i];
        }
    }
    return null;
}
/**
 * Get the first point that is not a skip point in this chart.
 * @private
 */
function getFirstValidPointInChart(chart) {
    var series = chart.series || [], len = series.length;
    for (var i = 0; i < len; ++i) {
        if (!isSkipSeries(series[i])) {
            var point = getFirstValidPointInSeries(series[i]);
            if (point) {
                return point;
            }
        }
    }
    return null;
}
/**
 * @private
 */
function highlightLastValidPointInChart(chart) {
    var numSeries = chart.series.length;
    var i = numSeries, res = false;
    while (i--) {
        chart.highlightedPoint = chart.series[i].points[chart.series[i].points.length - 1];
        // Highlight first valid point in the series will also
        // look backwards. It always starts from currently
        // highlighted point.
        res = chart.series[i].highlightNextValidPoint();
        if (res) {
            break;
        }
    }
    return res;
}
/**
 * After drilling down/up, we need to set focus to the first point for
 * screen readers and keyboard nav.
 * @private
 */
function updateChartFocusAfterDrilling(chart) {
    var point = getFirstValidPointInChart(chart);
    if (point) {
        point.highlight(false); // Do not visually highlight
    }
}
/**
 * Highlight the first point in chart that is not a skip point
 * @private
 */
function highlightFirstValidPointInChart(chart) {
    delete chart.highlightedPoint;
    var point = getFirstValidPointInChart(chart);
    return point ? point.highlight() : false;
}
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.SeriesKeyboardNavigation
 */
var SeriesKeyboardNavigation = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function SeriesKeyboardNavigation(chart, keyCodes) {
        this.keyCodes = keyCodes;
        this.chart = chart;
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Init the keyboard navigation
     */
    SeriesKeyboardNavigation.prototype.init = function () {
        var keyboardNavigation = this, chart = this.chart, e = this.eventProvider = new EventProvider();
        e.addEvent(Series, 'destroy', function () {
            return keyboardNavigation.onSeriesDestroy(this);
        });
        e.addEvent(chart, 'afterApplyDrilldown', function () {
            updateChartFocusAfterDrilling(this);
        });
        e.addEvent(chart, 'drilldown', function (e) {
            var point = e.point, series = point.series;
            keyboardNavigation.lastDrilledDownPoint = {
                x: point.x,
                y: point.y,
                seriesName: series ? series.name : ''
            };
        });
        e.addEvent(chart, 'drillupall', function () {
            setTimeout(function () {
                keyboardNavigation.onDrillupAll();
            }, 10);
        });
        // Heatmaps et al. alter z-index in setState, causing elements
        // to lose focus
        e.addEvent(Point, 'afterSetState', function () {
            var point = this;
            var pointEl = point.graphic && point.graphic.element;
            var focusedElement = doc.activeElement;
            // VO brings focus with it to container, causing series nav to run.
            // If then navigating with virtual cursor, it is possible to leave
            // keyboard nav module state on the data points and still activate
            // proxy buttons.
            var focusedElClassName = (focusedElement && focusedElement.getAttribute('class'));
            var isProxyFocused = focusedElClassName &&
                focusedElClassName.indexOf('highcharts-a11y-proxy-button') > -1;
            if (chart.highlightedPoint === point &&
                focusedElement !== pointEl &&
                !isProxyFocused &&
                pointEl &&
                pointEl.focus) {
                pointEl.focus();
            }
        });
    };
    /**
     * After drillup we want to find the point that was drilled down to and
     * highlight it.
     * @private
     */
    SeriesKeyboardNavigation.prototype.onDrillupAll = function () {
        var last = this.lastDrilledDownPoint, chart = this.chart, series = last && getSeriesFromName(chart, last.seriesName);
        var point;
        if (last && series && defined(last.x) && defined(last.y)) {
            point = getPointFromXY(series, last.x, last.y);
        }
        point = point || getFirstValidPointInChart(chart);
        // Container focus can be lost on drillup due to deleted elements.
        if (chart.container) {
            chart.container.focus();
        }
        if (point && point.highlight) {
            point.highlight(false); // Do not visually highlight
        }
    };
    /**
     * @private
     */
    SeriesKeyboardNavigation.prototype.getKeyboardNavigationHandler = function () {
        var keyboardNavigation = this, keys = this.keyCodes, chart = this.chart, inverted = chart.inverted;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [inverted ? [keys.up, keys.down] : [keys.left, keys.right], function (keyCode) {
                        return keyboardNavigation.onKbdSideways(this, keyCode);
                    }],
                [inverted ? [keys.left, keys.right] : [keys.up, keys.down], function (keyCode) {
                        return keyboardNavigation.onKbdVertical(this, keyCode);
                    }],
                [[keys.enter, keys.space], function (keyCode, event) {
                        var point = chart.highlightedPoint;
                        if (point) {
                            event.point = point;
                            fireEvent(point.series, 'click', event);
                            point.firePointEvent('click');
                        }
                        return this.response.success;
                    }],
                [[keys.home], function () {
                        highlightFirstValidPointInChart(chart);
                        return this.response.success;
                    }],
                [[keys.end], function () {
                        highlightLastValidPointInChart(chart);
                        return this.response.success;
                    }],
                [[keys.pageDown, keys.pageUp], function (keyCode) {
                        chart.highlightAdjacentSeries(keyCode === keys.pageDown);
                        return this.response.success;
                    }]
            ],
            init: function () {
                highlightFirstValidPointInChart(chart);
                return this.response.success;
            },
            validate: function () {
                return !!getFirstValidPointInChart(chart);
            },
            terminate: function () {
                return keyboardNavigation.onHandlerTerminate();
            }
        });
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} handler
     * @param {number} keyCode
     * @return {number}
     * response
     */
    SeriesKeyboardNavigation.prototype.onKbdSideways = function (handler, keyCode) {
        var keys = this.keyCodes, isNext = keyCode === keys.right || keyCode === keys.down;
        return this.attemptHighlightAdjacentPoint(handler, isNext);
    };
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} handler
     * @param {number} keyCode
     * @return {number}
     * response
     */
    SeriesKeyboardNavigation.prototype.onKbdVertical = function (handler, keyCode) {
        var chart = this.chart, keys = this.keyCodes, isNext = keyCode === keys.down || keyCode === keys.right, navOptions = chart.options.accessibility.keyboardNavigation
            .seriesNavigation;
        // Handle serialized mode, act like left/right
        if (navOptions.mode && navOptions.mode === 'serialize') {
            return this.attemptHighlightAdjacentPoint(handler, isNext);
        }
        // Normal mode, move between series
        var highlightMethod = (chart.highlightedPoint &&
            chart.highlightedPoint.series.keyboardMoveVertical) ?
            'highlightAdjacentPointVertical' :
            'highlightAdjacentSeries';
        chart[highlightMethod](isNext);
        return handler.response.success;
    };
    /**
     * @private
     */
    SeriesKeyboardNavigation.prototype.onHandlerTerminate = function () {
        var chart = this.chart;
        if (chart.tooltip) {
            chart.tooltip.hide(0);
        }
        var hoverSeries = (chart.highlightedPoint && chart.highlightedPoint.series);
        if (hoverSeries && hoverSeries.onMouseOut) {
            hoverSeries.onMouseOut();
        }
        if (chart.highlightedPoint && chart.highlightedPoint.onMouseOut) {
            chart.highlightedPoint.onMouseOut();
        }
        delete chart.highlightedPoint;
    };
    /**
     * Function that attempts to highlight next/prev point. Handles wrap around.
     * @private
     */
    SeriesKeyboardNavigation.prototype.attemptHighlightAdjacentPoint = function (handler, directionIsNext) {
        var chart = this.chart, wrapAround = chart.options.accessibility.keyboardNavigation
            .wrapAround, highlightSuccessful = chart.highlightAdjacentPoint(directionIsNext);
        if (!highlightSuccessful) {
            if (wrapAround && (directionIsNext ?
                highlightFirstValidPointInChart(chart) :
                highlightLastValidPointInChart(chart))) {
                return handler.response.success;
            }
            return handler.response[directionIsNext ? 'next' : 'prev'];
        }
        return handler.response.success;
    };
    /**
     * @private
     */
    SeriesKeyboardNavigation.prototype.onSeriesDestroy = function (series) {
        var chart = this.chart, currentHighlightedPointDestroyed = chart.highlightedPoint &&
            chart.highlightedPoint.series === series;
        if (currentHighlightedPointDestroyed) {
            delete chart.highlightedPoint;
            if (chart.focusElement) {
                chart.focusElement.removeFocusBorder();
            }
        }
    };
    /**
     * @private
     */
    SeriesKeyboardNavigation.prototype.destroy = function () {
        this.eventProvider.removeAddedEvents();
    };
    return SeriesKeyboardNavigation;
}());
/* *
 *
 *  Class Namespace
 *
 * */
(function (SeriesKeyboardNavigation) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    var composedClasses = [];
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Function to highlight next/previous point in chart.
     *
     * @private
     * @function Highcharts.Chart#highlightAdjacentPoint
     *
     * @param {boolean} next
     * Flag for the direction.
     *
     * @return {Highcharts.Point|boolean}
     * Returns highlighted point on success, false on failure (no adjacent point
     * to highlight in chosen direction).
     */
    function chartHighlightAdjacentPoint(next) {
        var chart = this, series = chart.series, curPoint = chart.highlightedPoint, curPointIndex = curPoint && getPointIndex(curPoint) || 0, curPoints = curPoint && curPoint.series.points || [], lastSeries = chart.series && chart.series[chart.series.length - 1], lastPoint = lastSeries &&
            lastSeries.points &&
            lastSeries.points[lastSeries.points.length - 1];
        var newSeries, newPoint;
        // If no points, return false
        if (!series[0] || !series[0].points) {
            return false;
        }
        if (!curPoint) {
            // No point is highlighted yet. Try first/last point depending on
            // move direction
            newPoint = next ? series[0].points[0] : lastPoint;
        }
        else {
            // We have a highlighted point. Grab next/prev point & series.
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
            // If we skip this whole series, move to the end of the series
            // before we recurse, just to optimize
            newSeries = newPoint.series;
            if (isSkipSeries(newSeries)) {
                chart.highlightedPoint = next ?
                    newSeries.points[newSeries.points.length - 1] :
                    newSeries.points[0];
            }
            else {
                // Otherwise, just move one point
                chart.highlightedPoint = newPoint;
            }
            // Retry
            return chart.highlightAdjacentPoint(next);
        }
        // There is an adjacent point, highlight it
        return newPoint.highlight();
    }
    /**
     * Highlight the closest point vertically.
     * @private
     */
    function chartHighlightAdjacentPointVertical(down) {
        var curPoint = this.highlightedPoint;
        var minDistance = Infinity, bestPoint;
        if (!defined(curPoint.plotX) || !defined(curPoint.plotY)) {
            return false;
        }
        this.series.forEach(function (series) {
            if (isSkipSeries(series)) {
                return;
            }
            series.points.forEach(function (point) {
                if (!defined(point.plotY) || !defined(point.plotX) ||
                    point === curPoint) {
                    return;
                }
                var yDistance = point.plotY - curPoint.plotY;
                var width = Math.abs(point.plotX - curPoint.plotX), distance = Math.abs(yDistance) * Math.abs(yDistance) +
                    width * width * 4; // Weigh horizontal distance highly
                // Reverse distance number if axis is reversed
                if (series.yAxis && series.yAxis.reversed) {
                    yDistance *= -1;
                }
                if (yDistance <= 0 && down || yDistance >= 0 && !down ||
                    distance < 5 || // Points in same spot => infinite loop
                    isSkipPoint(point)) {
                    return;
                }
                if (distance < minDistance) {
                    minDistance = distance;
                    bestPoint = point;
                }
            });
        });
        return bestPoint ? bestPoint.highlight() : false;
    }
    /**
     * Highlight next/previous series in chart. Returns false if no adjacent
     * series in the direction, otherwise returns new highlighted point.
     * @private
     */
    function chartHighlightAdjacentSeries(down) {
        var chart = this, curPoint = chart.highlightedPoint, lastSeries = chart.series && chart.series[chart.series.length - 1], lastPoint = lastSeries && lastSeries.points &&
            lastSeries.points[lastSeries.points.length - 1];
        var newSeries, newPoint, adjacentNewPoint;
        // If no point is highlighted, highlight the first/last point
        if (!chart.highlightedPoint) {
            newSeries = down ? (chart.series && chart.series[0]) : lastSeries;
            newPoint = down ?
                (newSeries && newSeries.points && newSeries.points[0]) :
                lastPoint;
            return newPoint ? newPoint.highlight() : false;
        }
        newSeries = (chart.series[curPoint.series.index + (down ? -1 : 1)]);
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
            // Try recurse
            adjacentNewPoint = chart.highlightAdjacentSeries(down);
            if (!adjacentNewPoint) {
                // Recurse failed
                curPoint.highlight();
                return false;
            }
            // Recurse succeeded
            return adjacentNewPoint;
        }
        // Highlight the new point or any first valid point back or forwards
        // from it
        newPoint.highlight();
        return newPoint.series.highlightNextValidPoint();
    }
    /**
     * @private
     */
    function compose(ChartClass, PointClass, SeriesClass) {
        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);
            var chartProto = ChartClass.prototype;
            chartProto.highlightAdjacentPoint = chartHighlightAdjacentPoint;
            chartProto.highlightAdjacentPointVertical = (chartHighlightAdjacentPointVertical);
            chartProto.highlightAdjacentSeries = chartHighlightAdjacentSeries;
        }
        if (composedClasses.indexOf(PointClass) === -1) {
            composedClasses.push(PointClass);
            var pointProto = PointClass.prototype;
            pointProto.highlight = pointHighlight;
        }
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);
            var seriesProto = SeriesClass.prototype;
            /**
             * Set for which series types it makes sense to move to the closest
             * point with up/down arrows, and which series types should just
             * move to next series.
             * @private
             */
            seriesProto.keyboardMoveVertical = true;
            [
                'column',
                'gantt',
                'pie'
            ].forEach(function (type) {
                if (seriesTypes[type]) {
                    seriesTypes[type].prototype.keyboardMoveVertical = false;
                }
            });
            seriesProto.highlightNextValidPoint = (seriesHighlightNextValidPoint);
        }
    }
    SeriesKeyboardNavigation.compose = compose;
    /**
     * Get the point in a series that is closest (in pixel distance) to a
     * reference point. Optionally supply weight factors for x and y directions.
     * @private
     */
    function getClosestPoint(point, series, xWeight, yWeight) {
        var minDistance = Infinity, dPoint, minIx, distance, i = series.points.length;
        var hasUndefinedPosition = function (point) { return (!(defined(point.plotX) && defined(point.plotY))); };
        if (hasUndefinedPosition(point)) {
            return;
        }
        while (i--) {
            dPoint = series.points[i];
            if (hasUndefinedPosition(dPoint)) {
                continue;
            }
            distance = (point.plotX - dPoint.plotX) *
                (point.plotX - dPoint.plotX) *
                (xWeight || 1) +
                (point.plotY - dPoint.plotY) *
                    (point.plotY - dPoint.plotY) *
                    (yWeight || 1);
            if (distance < minDistance) {
                minDistance = distance;
                minIx = i;
            }
        }
        return defined(minIx) ? series.points[minIx] : void 0;
    }
    /**
     * Highlights a point (show tooltip, display hover state, focus element).
     *
     * @private
     * @function Highcharts.Point#highlight
     *
     * @return {Highcharts.Point}
     *         This highlighted point.
     */
    function pointHighlight(highlightVisually) {
        if (highlightVisually === void 0) { highlightVisually = true; }
        var chart = this.series.chart;
        if (!this.isNull && highlightVisually) {
            this.onMouseOver(); // Show the hover marker and tooltip
        }
        else {
            if (chart.tooltip) {
                chart.tooltip.hide(0);
            }
            // Do not call blur on the element, as it messes up the focus of the
            // div element of the chart
        }
        scrollToPoint(this);
        // We focus only after calling onMouseOver because the state change can
        // change z-index and mess up the element.
        if (this.graphic) {
            chart.setFocusToElement(this.graphic);
            if (!highlightVisually && chart.focusElement) {
                chart.focusElement.removeFocusBorder();
            }
        }
        chart.highlightedPoint = this;
        return this;
    }
    /**
     * Highlight first valid point in a series. Returns the point if
     * successfully highlighted, otherwise false. If there is a highlighted
     * point in the series, use that as starting point.
     *
     * @private
     * @function Highcharts.Series#highlightNextValidPoint
     */
    function seriesHighlightNextValidPoint() {
        var curPoint = this.chart.highlightedPoint, start = (curPoint && curPoint.series) === this ?
            getPointIndex(curPoint) :
            0, points = this.points, len = points.length;
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
    }
})(SeriesKeyboardNavigation || (SeriesKeyboardNavigation = {}));
/* *
 *
 *  Default Export
 *
 * */
export default SeriesKeyboardNavigation;
