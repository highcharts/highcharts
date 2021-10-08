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

/* *
 *
 *  Imports
 *
 * */

import type Accessibility from '../../Accessibility';

import Chart from '../../../Core/Chart/Chart.js';
import Point from '../../../Core/Series/Point.js';
import Series from '../../../Core/Series/Series.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const { seriesTypes } = SeriesRegistry;
import H from '../../../Core/Globals.js';
const {
    doc
} = H;
import U from '../../../Core/Utilities.js';
const {
    defined,
    extend,
    fireEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../../Core/Chart/ChartLike'{
    interface ChartLike {
        highlightedPoint?: Point;
        /** @requires modules/accessibility */
        highlightAdjacentPoint(next: boolean): (boolean|Point);
        /** @requires modules/accessibility */
        highlightAdjacentPointVertical(down: boolean): (boolean|Point);
        /** @requires modules/accessibility */
        highlightAdjacentSeries(down: boolean): (boolean|Point);
    }
}

declare module '../../../Core/Series/PointLike' {
    interface PointLike {
        /** @requires modules/accessibility */
        highlight(): Point;
    }
}

declare module '../../../Core/Series/SeriesLike' {
    interface SeriesLike {
        /** @requires modules/accessibility */
        keyboardMoveVertical: boolean;
        /** @requires modules/accessibility */
        highlightFirstValidPoint(): (boolean|Point);
    }
}

import KeyboardNavigationHandler from '../../KeyboardNavigationHandler.js';
import EventProvider from '../../Utils/EventProvider.js';
import ChartUtilities from '../../Utils/ChartUtilities.js';
const {
    getPointFromXY,
    getSeriesFromName,
    scrollToPoint
} = ChartUtilities;

/* eslint-disable valid-jsdoc */

/*
 * Set for which series types it makes sense to move to the closest point with
 * up/down arrows, and which series types should just move to next series.
 */
Series.prototype.keyboardMoveVertical = true;
(['column', 'pie'] as Array<('column'|'pie')>).forEach(function (type): void {
    if (seriesTypes[type]) {
        seriesTypes[type].prototype.keyboardMoveVertical = false;
    }
});


/**
 * Get the index of a point in a series. This is needed when using e.g. data
 * grouping.
 *
 * @private
 * @function getPointIndex
 *
 * @param {Highcharts.AccessibilityPoint} point
 *        The point to find index of.
 *
 * @return {number|undefined}
 *         The index in the series.points array of the point.
 */
function getPointIndex(point: Point): (number|undefined) {
    const index = point.index,
        points = point.series.points;
    let i = points.length;

    if (points[index as any] !== point) {
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
 * Determine if series navigation should be skipped
 *
 * @private
 * @function isSkipSeries
 *
 * @param {Highcharts.Series} series
 *
 * @return {boolean|number|undefined}
 */
function isSkipSeries(
    series: Accessibility.SeriesComposition
): (boolean|number|undefined) {
    const a11yOptions = series.chart.options.accessibility,
        seriesNavOptions = a11yOptions.keyboardNavigation.seriesNavigation,
        seriesA11yOptions = series.options.accessibility || {},
        seriesKbdNavOptions = seriesA11yOptions.keyboardNavigation;

    return seriesKbdNavOptions && seriesKbdNavOptions.enabled === false ||
        seriesA11yOptions.enabled === false ||
        series.options.enableMouseTracking === false || // #8440
        !series.visible ||
        // Skip all points in a series where pointNavigationEnabledThreshold is
        // reached
        (
            seriesNavOptions.pointNavigationEnabledThreshold &&
            seriesNavOptions.pointNavigationEnabledThreshold <=
            series.points.length
        );
}


/**
 * Determine if navigation for a point should be skipped
 *
 * @private
 * @function isSkipPoint
 *
 * @param {Highcharts.Point} point
 *
 * @return {boolean|number|undefined}
 */
function isSkipPoint(
    point: Accessibility.PointComposition
): (boolean|number|undefined) {
    const a11yOptions = point.series.chart.options.accessibility;
    const pointA11yDisabled = (
        point.options.accessibility &&
        point.options.accessibility.enabled === false
    );

    return point.isNull &&
        a11yOptions.keyboardNavigation.seriesNavigation.skipNullPoints ||
        point.visible === false ||
        point.isInside === false ||
        pointA11yDisabled ||
        isSkipSeries(point.series);
}


/**
 * Get the point in a series that is closest (in pixel distance) to a reference
 * point. Optionally supply weight factors for x and y directions.
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
function getClosestPoint(
    point: Accessibility.PointComposition,
    series: Accessibility.SeriesComposition,
    xWeight?: number,
    yWeight?: number
): (Point|undefined) {
    let minDistance = Infinity,
        dPoint: Point,
        minIx: (number|undefined),
        distance: number,
        i = series.points.length;
    const hasUndefinedPosition = function (point: Point): boolean {
        return !(defined(point.plotX) && defined(point.plotY));
    };

    if (hasUndefinedPosition(point)) {
        return;
    }

    while (i--) {
        dPoint = series.points[i];

        if (hasUndefinedPosition(dPoint)) {
            continue;
        }

        distance = ((point.plotX as any) - (dPoint.plotX as any)) *
                ((point.plotX as any) - (dPoint.plotX as any)) *
                (xWeight || 1) +
                ((point.plotY as any) - (dPoint.plotY as any)) *
                ((point.plotY as any) - (dPoint.plotY as any)) *
                (yWeight || 1);

        if (distance < minDistance) {
            minDistance = distance;
            minIx = i;
        }
    }

    return defined(minIx) ? series.points[minIx] : void 0;
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
Point.prototype.highlight = function (): Point {
    const chart = this.series.chart;

    if (!this.isNull) {
        this.onMouseOver(); // Show the hover marker and tooltip
    } else {
        if (chart.tooltip) {
            chart.tooltip.hide(0);
        }
        // Don't call blur on the element, as it messes up the chart div's focus
    }

    scrollToPoint(this);

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
Chart.prototype.highlightAdjacentPoint = function (
    this: Accessibility.ChartComposition,
    next: boolean
): (boolean|Point) {
    const chart = this,
        series = chart.series,
        curPoint = chart.highlightedPoint,
        curPointIndex = curPoint && getPointIndex(curPoint) || 0,
        curPoints: Array<Accessibility.PointComposition> =
        (curPoint && curPoint.series.points) as any,
        lastSeries = chart.series && chart.series[chart.series.length - 1],
        lastPoint = lastSeries && lastSeries.points &&
                    lastSeries.points[lastSeries.points.length - 1];
    let newSeries,
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
        newSeries = series[(curPoint.series.index as any) + (next ? 1 : -1)];
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
 * @return {boolean|Highcharts.Point}
 */
Series.prototype.highlightFirstValidPoint = function (
    this: Accessibility.SeriesComposition
): (boolean|Point) {
    const curPoint = this.chart.highlightedPoint,
        start: number = (curPoint && curPoint.series) === this ?
            getPointIndex(curPoint as any) as any :
            0,
        points = this.points,
        len = points.length;

    if (points && len) {
        for (let i = start; i < len; ++i) {
            if (!isSkipPoint(points[i])) {
                return points[i].highlight();
            }
        }
        for (let j = start; j >= 0; --j) {
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
Chart.prototype.highlightAdjacentSeries = function (
    this: Accessibility.ChartComposition,
    down: boolean
): (boolean|Point) {
    const chart = this,
        curPoint: Accessibility.PointComposition = chart.highlightedPoint as any,
        lastSeries = chart.series && chart.series[chart.series.length - 1],
        lastPoint = lastSeries && lastSeries.points &&
                    lastSeries.points[lastSeries.points.length - 1];
    let newSeries,
        newPoint,
        adjacentNewPoint;

    // If no point is highlighted, highlight the first/last point
    if (!chart.highlightedPoint) {
        newSeries = down ? (chart.series && chart.series[0]) : lastSeries;
        newPoint = down ?
            (newSeries && newSeries.points && newSeries.points[0]) : lastPoint;
        return newPoint ? newPoint.highlight() : false;
    }

    newSeries = chart.series[(curPoint.series.index as any) + (down ? -1 : 1)];

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
Chart.prototype.highlightAdjacentPointVertical = function (
    this: Accessibility.ChartComposition,
    down: boolean
): (boolean|Point) {
    const curPoint: Accessibility.PointComposition = this.highlightedPoint as any;
    let minDistance = Infinity,
        bestPoint: (Point|undefined);

    if (!defined(curPoint.plotX) || !defined(curPoint.plotY)) {
        return false;
    }

    this.series.forEach((series): void => {
        if (isSkipSeries(series)) {
            return;
        }

        series.points.forEach((point): void => {
            if (!defined(point.plotY) || !defined(point.plotX) ||
                point === curPoint) {
                return;
            }

            let yDistance = point.plotY - (curPoint.plotY as any);
            const width = Math.abs(point.plotX - (curPoint.plotX as any)),
                distance = Math.abs(yDistance) * Math.abs(yDistance) +
                    width * width * 4; // Weigh horizontal distance highly

            // Reverse distance number if axis is reversed
            if (series.yAxis && series.yAxis.reversed) {
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
 * @private
 * @param {Highcharts.Chart} chart
 * @return {Highcharts.Point|boolean}
 */
function highlightFirstValidPointInChart(
    chart: Chart
): (boolean|Point) {
    let res: (boolean|Point) = false;

    delete chart.highlightedPoint;

    res = chart.series.reduce(function (
        acc: (boolean|Point),
        cur: Series
    ): (boolean|Point) {
        return acc || cur.highlightFirstValidPoint();
    }, false);

    return res;
}


/**
 * @private
 * @param {Highcharts.Chart} chart
 * @return {Highcharts.Point|boolean}
 */
function highlightLastValidPointInChart(
    chart: Chart
): (boolean|Point) {
    const numSeries = chart.series.length;
    let i = numSeries,
        res: (boolean|Point) = false;

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

    return res;
}


/**
 * @private
 * @param {Highcharts.Chart} chart
 */
function updateChartFocusAfterDrilling(chart: Chart): void {
    highlightFirstValidPointInChart(chart);

    if (chart.focusElement) {
        chart.focusElement.removeFocusBorder();
    }
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
class SeriesKeyboardNavigation {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: Accessibility.ChartComposition,
        keyCodes: Record<string, number>
    ) {
        this.keyCodes = keyCodes;
        this.chart = chart;
    }


    /* *
     *
     *  Properties
     *
     * */

    public chart: Accessibility.ChartComposition;
    public eventProvider?: EventProvider;
    public keyCodes: Record<string, number>;
    public lastDrilledDownPoint?: SeriesKeyboardNavigation.DrilldownObject;


    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Init the keyboard navigation
     */
    public init(): void {
        const keyboardNavigation = this,
            chart = this.chart,
            e = this.eventProvider = new EventProvider();

        e.addEvent(Series, 'destroy', function (): void {
            return keyboardNavigation.onSeriesDestroy(this);
        });

        e.addEvent(chart, 'afterDrilldown', function (): void {
            updateChartFocusAfterDrilling(this);
        });

        e.addEvent(chart, 'drilldown', function (
            e: { point: Point }
        ): void {
            const point = e.point,
                series = point.series;

            keyboardNavigation.lastDrilledDownPoint = {
                x: point.x,
                y: point.y,
                seriesName: series ? series.name : ''
            };
        });

        e.addEvent(chart, 'drillupall', function (): void {
            setTimeout(function (): void {
                keyboardNavigation.onDrillupAll();
            }, 10);
        });

        // Heatmaps et al. alter z-index in setState, causing elements
        // to lose focus
        e.addEvent(Point, 'afterSetState', function (): void {
            const point = this;
            const pointEl = point.graphic && point.graphic.element;
            const focusedElement = doc.activeElement;
            // VO brings focus with it to container, causing series nav to run.
            // If then navigating with virtual cursor, it is possible to leave
            // keyboard nav module state on the data points and still activate
            // proxy buttons.
            const focusedElClassName = focusedElement && focusedElement.getAttribute('class');
            const isProxyFocused = focusedElClassName &&
                focusedElClassName.indexOf('highcharts-a11y-proxy-button') > -1;

            if (
                chart.highlightedPoint === point &&
                focusedElement !== pointEl &&
                !isProxyFocused &&
                pointEl &&
                pointEl.focus
            ) {
                pointEl.focus();
            }
        });
    }


    /**
     * @private
     */
    public onDrillupAll(): void {
        // After drillup we want to find the point that was drilled down to and
        // highlight it.
        const last = this.lastDrilledDownPoint,
            chart = this.chart,
            series = last && getSeriesFromName(chart, last.seriesName);
        let point;

        if (last && series && defined(last.x) && defined(last.y)) {
            point = getPointFromXY(series, last.x, last.y);
        }

        // Container focus can be lost on drillup due to deleted elements.
        if (chart.container) {
            chart.container.focus();
        }

        if (point && point.highlight) {
            point.highlight();
        }

        if (chart.focusElement) {
            chart.focusElement.removeFocusBorder();
        }
    }


    /**
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    public getKeyboardNavigationHandler(): KeyboardNavigationHandler {
        const keyboardNavigation = this,
            keys = this.keyCodes,
            chart = this.chart,
            inverted = chart.inverted;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [inverted ? [keys.up, keys.down] : [keys.left, keys.right],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        return keyboardNavigation.onKbdSideways(this, keyCode);
                    }],

                [inverted ? [keys.left, keys.right] : [keys.up, keys.down],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        return keyboardNavigation.onKbdVertical(this, keyCode);
                    }],

                [[keys.enter, keys.space],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number,
                        event: KeyboardEvent
                    ): number {
                        const point = chart.highlightedPoint;
                        if (point) {
                            (event as any).point = point;
                            fireEvent(point.series, 'click', event);
                            point.firePointEvent('click');
                        }
                        return this.response.success;
                    }],

                [[keys.home],
                    function (this: KeyboardNavigationHandler): number {
                        highlightFirstValidPointInChart(chart);
                        return this.response.success;
                    }],

                [[keys.end],
                    function (this: KeyboardNavigationHandler): number {
                        highlightLastValidPointInChart(chart);
                        return this.response.success;
                    }],

                [[keys.pageDown, keys.pageUp],
                    function (
                        this: KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        chart.highlightAdjacentSeries(keyCode === keys.pageDown);
                        return this.response.success;
                    }]
            ],

            init: function (
                this: KeyboardNavigationHandler
            ): number {
                highlightFirstValidPointInChart(chart);
                return this.response.success;
            },

            terminate: function (): void {
                return keyboardNavigation.onHandlerTerminate();
            }
        });
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} handler
     * @param {number} keyCode
     * @return {number}
     * response
     */
    public onKbdSideways(
        handler: KeyboardNavigationHandler,
        keyCode: number
    ): number {
        const keys = this.keyCodes,
            isNext = keyCode === keys.right || keyCode === keys.down;

        return this.attemptHighlightAdjacentPoint(handler, isNext);
    }


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} handler
     * @param {number} keyCode
     * @return {number}
     * response
     */
    public onKbdVertical(
        handler: KeyboardNavigationHandler,
        keyCode: number
    ): number {
        const chart = this.chart,
            keys = this.keyCodes,
            isNext = keyCode === keys.down || keyCode === keys.right,
            navOptions: (
                Highcharts
                    .AccessibilityKeyboardNavigationSeriesNavigationOptions
            ) = (chart.options.accessibility as any).keyboardNavigation
                .seriesNavigation;

        // Handle serialized mode, act like left/right
        if (navOptions.mode && navOptions.mode === 'serialize') {
            return this.attemptHighlightAdjacentPoint(handler, isNext);
        }

        // Normal mode, move between series
        const highlightMethod: (
            'highlightAdjacentPointVertical'|'highlightAdjacentSeries'
        ) = (
            chart.highlightedPoint &&
            chart.highlightedPoint.series.keyboardMoveVertical
        ) ?
            'highlightAdjacentPointVertical' :
            'highlightAdjacentSeries';

        chart[highlightMethod](isNext);

        return handler.response.success;
    }


    /**
     * @private
     */
    public onHandlerTerminate(): void {
        const chart = this.chart;

        if (chart.tooltip) {
            chart.tooltip.hide(0);
        }

        const hoverSeries = chart.highlightedPoint && chart.highlightedPoint.series;
        if (hoverSeries && hoverSeries.onMouseOut) {
            hoverSeries.onMouseOut();
        }

        if (chart.highlightedPoint && chart.highlightedPoint.onMouseOut) {
            chart.highlightedPoint.onMouseOut();
        }

        delete chart.highlightedPoint;
    }


    /**
     * Function that attempts to highlight next/prev point. Handles wrap around.
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} handler
     * @param {boolean} directionIsNext
     * @return {number}
     * response
     */
    public attemptHighlightAdjacentPoint(
        handler: KeyboardNavigationHandler,
        directionIsNext: boolean
    ): number {
        const chart = this.chart,
            wrapAround = (chart.options.accessibility as any).keyboardNavigation
                .wrapAround,
            highlightSuccessful = chart.highlightAdjacentPoint(directionIsNext);

        if (!highlightSuccessful) {
            if (wrapAround) {
                return handler.init(directionIsNext ? 1 : -1);
            }
            return handler.response[directionIsNext ? 'next' : 'prev'];
        }

        return handler.response.success;
    }


    /**
     * @private
     */
    public onSeriesDestroy(
        series: Series
    ): void {
        const chart = this.chart,
            currentHighlightedPointDestroyed = chart.highlightedPoint &&
                chart.highlightedPoint.series === series;

        if (currentHighlightedPointDestroyed) {
            delete chart.highlightedPoint;
            if (chart.focusElement) {
                chart.focusElement.removeFocusBorder();
            }
        }
    }


    /**
     * @private
     */
    public destroy(): void {
        (this.eventProvider as any).removeAddedEvents();
    }

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace SeriesKeyboardNavigation {

    /* *
     *
     *  Declarations
     *
     * */

    export interface DrilldownObject {
        x: (number|null);
        y: (number|null|undefined);
        seriesName: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesKeyboardNavigation;
