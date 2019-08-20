/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import Highcharts from './Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            cancelClick?: boolean;
            hoverPoint?: PointerHoverDataObject['hoverPoint'];
            hoverPoints?: PointerHoverDataObject['hoverPoints'];
            hoverSeries?: PointerHoverDataObject['hoverSeries'];
            mouseDownX?: number;
            mouseDownY?: number;
            mouseIsDown?: (boolean|string);
            tooltip?: Tooltip;
        }
        interface PointerAxisCoordinateObject {
            axis: Axis;
            value: number;
        }
        interface PointerAxisCoordinatesObject {
            xAxis: Array<PointerAxisCoordinateObject>;
            yAxis: Array<PointerAxisCoordinateObject>;
        }
        interface PointerCoordinatesObject {
            chartX: number;
            chartY: number;
        }
        interface PointerEventObject extends PointerEvent {
            chartX: number;
            chartY: number;
        }
        interface PointerHoverDataObject {
            hoverPoint: Point;
            hoverPoints: Array<Point>;
            hoverSeries: Series;
        }
        interface SelectDataObject {
            axis: Axis;
            max: number;
            min: number;
        }
        interface SelectEventObject {
            originalEvent: Event;
            xAxis: Array<SelectDataObject>;
            yAxis: Array<SelectDataObject>;
        }
        class Pointer {
            public constructor(chart: Chart, options: Options);
            [key: string]: any;
            public chart: Chart;
            public followTouchMove?: boolean;
            public hoverX?: unknown;
            public lastValidTouch: object;
            public options: Options;
            public pinchDown: Array<any>;
            public runChartClick: boolean;
            public applyInactiveState(points: Array<Point>): void;
            public destroy(): void;
            public drag(e: PointerEventObject): void;
            public dragStart(e: PointerEventObject): void;
            public drop(e: Event): void;
            public findNearestKDPoint(
                series: Array<Series>,
                shared: (boolean|undefined),
                e: PointerEventObject
            ): (Point|undefined);
            public getChartCoordinatesFromPoint(
                point: Point,
                inverted?: boolean
            ): (PointerCoordinatesObject|undefined)
            public getCoordinates(
                e: PointerEventObject
            ): PointerAxisCoordinatesObject;
            public getHoverData(
                existingHoverPoint: (Point|undefined),
                existingHoverSeries: (Series|undefined),
                series: Array<Series>,
                isDirectTouch: boolean,
                shared: (boolean|undefined),
                e?: PointerEventObject
            ): PointerHoverDataObject;
            public getPointFromEvent(e: Event): (Point|undefined)
            public inClass(
                element: (SVGDOMElement|HTMLDOMElement),
                className: string
            ): (boolean|undefined);
            public init(chart: Chart, options: Options): void;
            public normalize<T extends PointerEventObject>(
                e: (T|PointerEvent),
                chartPosition?: OffsetObject
            ): T;
            public onContainerClick(e: PointerEventObject): void
            public onContainerMouseDown(e: PointerEventObject): void;
            public onContainerMouseLeave(e: PointerEventObject): void;
            public onContainerMouseMove(e: PointerEventObject): void;
            public onDocumentMouseMove(e: PointerEventObject): void;
            public onDocumentMouseUp(e: PointerEventObject): void;
            public onTrackerMouseOut(e: PointerEventObject): void;
            public reset(allowMove?: boolean, delay?: number): void;
            public runPointActions(e?: PointerEventObject, p?: Point): void;
            public scaleGroups(
                attribs?: SeriesPlotBoxObject,
                clip?: boolean
            ): void;
            public setDOMEvents(): void;
            public zoomOption(e: Event): void;
        }
        let chartCount: number;
        let hoverChartIndex: (number|undefined);
        let unbindDocumentMouseUp: (Function|undefined);
        let unbindDocumentTouchEnd: (Function|undefined);
    }
}

/**
 * One position in relation to an axis.
 *
 * @interface Highcharts.PointerAxisCoordinateObject
 *//**
 * Related axis.
 *
 * @name Highcharts.PointerAxisCoordinateObject#axis
 * @type {Highcharts.Axis}
 *//**
 * Axis value.
 *
 * @name Highcharts.PointerAxisCoordinateObject#value
 * @type {number}
 */

/**
 * Positions in terms of axis values.
 *
 * @interface Highcharts.PointerAxisCoordinatesObject
 *//**
 * Positions on the x-axis.
 * @name Highcharts.PointerAxisCoordinatesObject#xAxis
 * @type {Array<Highcharts.PointerAxisCoordinateObject>}
 *//**
 * Positions on the y-axis.
 * @name Highcharts.PointerAxisCoordinatesObject#yAxis
 * @type {Array<Highcharts.PointerAxisCoordinateObject>}
 */

/**
 * Pointer coordinates.
 *
 * @interface Highcharts.PointerCoordinatesObject
 *//**
 * @name Highcharts.PointerCoordinatesObject#chartX
 * @type {number}
 *//**
 * @name Highcharts.PointerCoordinatesObject#chartY
 * @type {number}
 */

/**
 * A native browser mouse or touch event, extended with position information
 * relative to the {@link Chart.container}.
 *
 * @interface Highcharts.PointerEventObject
 * @extends global.PointerEvent
 *//**
 * The X coordinate of the pointer interaction relative to the chart.
 *
 * @name Highcharts.PointerEventObject#chartX
 * @type {number}
 *//**
 * The Y coordinate of the pointer interaction relative to the chart.
 *
 * @name Highcharts.PointerEventObject#chartY
 * @type {number}
 */

/**
 * Axis-specific data of a selection.
 *
 * @interface Highcharts.SelectDataObject
 *//**
 * @name Highcharts.SelectDataObject#axis
 * @type {Highcharts.Axis}
 *//**
 * @name Highcharts.SelectDataObject#max
 * @type {number}
 *//**
 * @name Highcharts.SelectDataObject#min
 * @type {number}
 */

/**
 * Object for select events.
 *
 * @interface Highcharts.SelectEventObject
 *//**
 * @name Highcharts.SelectEventObject#originalEvent
 * @type {global.Event}
 *//**
 * @name Highcharts.SelectEventObject#xAxis
 * @type {Array<Highcharts.SelectDataObject>}
 *//**
 * @name Highcharts.SelectEventObject#yAxis
 * @type {Array<Highcharts.SelectDataObject>}
 */

import U from './Utilities.js';
const {
    attr,
    defined,
    isNumber,
    isObject,
    objectEach,
    splat
} = U;

import './Tooltip.js';
import './Color.js';

var H = Highcharts,
    addEvent = H.addEvent,
    charts = H.charts,
    color = H.color,
    css = H.css,
    extend = H.extend,
    find = H.find,
    fireEvent = H.fireEvent,
    offset = H.offset,
    pick = H.pick,
    Tooltip = H.Tooltip;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The mouse and touch tracker object. Each {@link Chart} item has one
 * assosiated Pointer item that can be accessed from the  {@link Chart.pointer}
 * property.
 *
 * @class
 * @name Highcharts.Pointer
 *
 * @param {Highcharts.Chart} chart
 *        The Chart instance.
 *
 * @param {Highcharts.Options} options
 *        The root options object. The pointer uses options from the chart and
 *        tooltip structures.
 */
Highcharts.Pointer = function (
    this: Highcharts.Pointer,
    chart: Highcharts.Chart,
    options: Highcharts.Options
): any {
    this.init(chart, options);
} as any;

Highcharts.Pointer.prototype = {
    /**
     * Initialize the Pointer.
     *
     * @private
     * @function Highcharts.Pointer#init
     *
     * @param {Highcharts.Chart} chart
     *        The Chart instance.
     *
     * @param {Highcharts.Options} options
     *        The root options object. The pointer uses options from the chart
     *        and tooltip structures.
     *
     * @return {void}
     */
    init: function (
        this: Highcharts.Pointer,
        chart: Highcharts.Chart,
        options: Highcharts.Options
    ): void {

        // Store references
        this.options = options;
        this.chart = chart;

        // Do we need to handle click on a touch device?
        this.runChartClick =
            (options.chart as any).events &&
            !!(options.chart as any).events.click;

        this.pinchDown = [];
        this.lastValidTouch = {};

        if (Tooltip) {
            /**
             * Tooltip object for points of series.
             *
             * @name Highcharts.Chart#tooltip
             * @type {Highcharts.Tooltip}
             */
            chart.tooltip = new Tooltip(chart, options.tooltip as any);
            this.followTouchMove = pick(
                (options.tooltip as any).followTouchMove, true
            );
        }

        this.setDOMEvents();
    },

    /**
     * Resolve the zoomType option, this is reset on all touch start and mouse
     * down events.
     *
     * @private
     * @function Highcharts.Pointer#zoomOption
     *
     * @param {global.Event} e
     *        Event object.
     *
     * @param {void}
     */
    zoomOption: function (
        this: Highcharts.Pointer,
        e: Event
    ): void {
        var chart = this.chart,
            options = chart.options.chart as Highcharts.ChartOptions,
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
     * Takes a browser event object and extends it with custom Highcharts
     * properties `chartX` and `chartY` in order to work on the internal
     * coordinate system.
     *
     * @function Highcharts.Pointer#normalize
     *
     * @param {PointerEvent|TouchEvent} e
     *        Event object in standard browsers.
     *
     * @param {Highcharts.OffsetObject} [chartPosition]
     *        Additional chart offset.
     *
     * @return {Highcharts.PointerEventObject}
     *         A browser event with extended properties `chartX` and `chartY`.
     */
    normalize: function (
        this: Highcharts.Pointer,
        e: (PointerEvent|TouchEvent),
        chartPosition?: Highcharts.OffsetObject
    ): Highcharts.PointerEventObject {
        var ePos;

        // iOS (#2757)
        ePos = (e as any).touches ?
            ((e as any).touches.length ?
                (e as any).touches.item(0) :
                (e as any).changedTouches[0]) :
            e;

        // Get mouse position
        if (!chartPosition) {
            this.chartPosition = chartPosition = offset(this.chart.container);
        }

        let chartX = ePos.pageX - chartPosition.left,
            chartY = ePos.pageY - chartPosition.top;

        // #11329 - when there is scaling on a parent element, we need to take
        // this into account
        const containerScaling = this.chart.containerScaling;
        if (containerScaling) {
            chartX /= containerScaling.scaleX;
            chartY /= containerScaling.scaleY;
        }

        return extend(e, {
            chartX: Math.round(chartX),
            chartY: Math.round(chartY)
        }) as any;
    },

    /**
     * Get the click position in terms of axis values.
     *
     * @function Highcharts.Pointer#getCoordinates
     *
     * @param {Highcharts.PointerEventObject} e
     *        Pointer event, extended with `chartX` and `chartY` properties.
     *
     * @return {Highcharts.PointerAxisCoordinatesObject}
     */
    getCoordinates: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): Highcharts.PointerAxisCoordinatesObject {

        var coordinates = {
            xAxis: [],
            yAxis: []
        } as Highcharts.PointerAxisCoordinatesObject;

        this.chart.axes.forEach(function (axis: Highcharts.Axis): void {
            (coordinates as any)[axis.isXAxis ? 'xAxis' : 'yAxis'].push({
                axis: axis,
                value: axis.toValue(e[axis.horiz ? 'chartX' : 'chartY'])
            });
        });

        return coordinates;
    },

    /**
     * Finds the closest point to a set of coordinates, using the k-d-tree
     * algorithm.
     *
     * @function Highcharts.Pointer#findNearestKDPoints
     *
     * @param {Array<Highcharts.Series>} series
     *        All the series to search in.
     *
     * @param {boolean|undefined} shared
     *        Whether it is a shared tooltip or not.
     *
     * @param {Highcharts.PointerEventObject} e
     *        The pointer event object, containing chart coordinates of the
     *        pointer.
     *
     * @return {Highcharts.Point|undefined}
     *         The point closest to given coordinates.
     */
    findNearestKDPoint: function (
        this: Highcharts.Pointer,
        series: Array<Highcharts.Series>,
        shared: (boolean|undefined),
        e: Highcharts.PointerEventObject
    ): (Highcharts.Point|undefined) {
        var closest: (Highcharts.Point|undefined),
            sort = function (
                p1: Highcharts.Point,
                p2: Highcharts.Point
            ): number {
                var isCloserX = (p1.distX as any) - (p2.distX as any),
                    isCloser = (p1.dist as any) - (p2.dist as any),
                    isAbove =
                        (p2.series.group && p2.series.group.zIndex) -
                        (p1.series.group && p1.series.group.zIndex),
                    result;

                // We have two points which are not in the same place on xAxis
                // and shared tooltip:
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
                    result =
                        (p1.series.index as any) > (p2.series.index as any) ?
                            -1 :
                            1;
                }
                return result;
            };

        series.forEach(function (s: Highcharts.Series): void {
            var noSharedTooltip = s.noSharedTooltip && shared,
                compareX = (
                    !noSharedTooltip &&
                    (s.options.findNearestPointBy as any).indexOf('y') < 0
                ),
                point = s.searchPoint(
                    e,
                    compareX
                );

            if (// Check that we actually found a point on the series.
                isObject(point, true) &&
                // Use the new point if it is closer.
                (!isObject(closest, true) ||
                (sort(closest as any, point as any) > 0))
            ) {
                closest = point;
            }
        });
        return closest;
    },

    /**
     * @private
     * @function Highcharts.Pointer#getPointFromEvent
     *
     * @param {global.Event} e
     *
     * @return {Highcharts.Point|undefined}
     */
    getPointFromEvent: function (
        this: Highcharts.Pointer,
        e: Event
    ): (Highcharts.Point|undefined) {
        var target = e.target,
            point;

        while (target && !point) {
            point = (target as any).point;
            target = (target as any).parentNode;
        }
        return point;
    },

    /**
     * @private
     * @function Highcharts.Pointer#getChartCoordinatesFromPoint
     * @param {Highcharts.Point} point
     * @param {boolean} [inverted]
     * @return {Highcharts.PointerCoordinatesObject|undefined}
     */
    getChartCoordinatesFromPoint: function (
        this: Highcharts.Pointer,
        point: Highcharts.Point,
        inverted?: boolean
    ): (Highcharts.PointerCoordinatesObject|undefined) {
        var series = point.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            plotX = pick(point.clientX, point.plotX),
            shapeArgs = point.shapeArgs;

        if (xAxis && yAxis) {
            return inverted ? {
                chartX: xAxis.len + (xAxis.pos as any) - plotX,
                chartY: yAxis.len + (yAxis.pos as any) - (point.plotY as any)
            } : {
                chartX: plotX + (xAxis.pos as any),
                chartY: (point.plotY as any) + (yAxis.pos as any)
            };
        }

        if (shapeArgs && shapeArgs.x && shapeArgs.y) {
            // E.g. pies do not have axes
            return {
                chartX: shapeArgs.x,
                chartY: shapeArgs.y
            };
        }
    },

    /**
     * Calculates what is the current hovered point/points and series.
     *
     * @private
     * @function Highcharts.Pointer#getHoverData
     *
     * @param {Highcharts.Point|undefined} existingHoverPoint
     *        The point currrently beeing hovered.
     *
     * @param {Highcharts.Series|undefined} existingHoverSeries
     *        The series currently beeing hovered.
     *
     * @param {Array<Highcharts.Series>} series
     *        All the series in the chart.
     *
     * @param {boolean} isDirectTouch
     *        Is the pointer directly hovering the point.
     *
     * @param {boolean|undefined} shared
     *        Whether it is a shared tooltip or not.
     *
     * @param {Highcharts.PointerEventObject} [e]
     *        The triggering event, containing chart coordinates of the pointer.
     *
     * @return {object}
     *         Object containing resulting hover data: hoverPoint, hoverSeries,
     *         and hoverPoints.
     */
    getHoverData: function (
        this: Highcharts.Pointer,
        existingHoverPoint: (Highcharts.Point|undefined),
        existingHoverSeries: (Highcharts.Series|undefined),
        series: Array<Highcharts.Series>,
        isDirectTouch: boolean,
        shared: (boolean|undefined),
        e?: Highcharts.PointerEventObject
    ): Highcharts.PointerHoverDataObject {
        var hoverPoint: Highcharts.Point,
            hoverPoints = [] as Array<Highcharts.Point>,
            hoverSeries = existingHoverSeries,
            useExisting = !!(isDirectTouch && existingHoverPoint),
            notSticky = hoverSeries && !hoverSeries.stickyTracking,
            filter = function (s: Highcharts.Series): boolean {
                return (
                    s.visible &&
                    !(!shared && s.directTouch) && // #3821
                    pick(s.options.enableMouseTracking, true)
                );
            },
            // Which series to look in for the hover point
            searchSeries = notSticky ?
                // Only search on hovered series if it has stickyTracking false
                [hoverSeries as any] :
                // Filter what series to look in.
                series.filter(function (s: Highcharts.Series): boolean {
                    return filter(s) && s.stickyTracking;
                });

        // Use existing hovered point or find the one closest to coordinates.
        hoverPoint = useExisting || !e ?
            existingHoverPoint :
            this.findNearestKDPoint(searchSeries, shared, e) as any;

        // Assign hover series
        hoverSeries = hoverPoint && hoverPoint.series;

        // If we have a hoverPoint, assign hoverPoints.
        if (hoverPoint) {
            // When tooltip is shared, it displays more than one point
            if (shared && !hoverSeries.noSharedTooltip) {
                searchSeries = series.filter(function (
                    s: Highcharts.Series
                ): boolean {
                    return filter(s) && !s.noSharedTooltip;
                });

                // Get all points with the same x value as the hoverPoint
                searchSeries.forEach(function (
                    s: Highcharts.Series
                ): any {
                    var point = find(s.points, function (
                        p: Highcharts.Point
                    ): boolean {
                        return p.x === hoverPoint.x && !p.isNull;
                    });

                    if (isObject(point)) {
                        /*
                        * Boost returns a minimal point. Convert it to a usable
                        * point for tooltip and states.
                        */
                        if (s.chart.isBoosting) {
                            point = s.getPoint(point);
                        }
                        hoverPoints.push(point as Highcharts.Point);
                    }
                });
            } else {
                hoverPoints.push(hoverPoint);
            }
        }
        return {
            hoverPoint: hoverPoint,
            hoverSeries: hoverSeries,
            hoverPoints: hoverPoints
        };
    },

    /**
     * With line type charts with a single tracker, get the point closest to the
     * mouse. Run Point.onMouseOver and display tooltip for the point or points.
     *
     * @private
     * @function Highcharts.Pointer#runPointActions
     *
     * @param {global.Event} e
     *
     * @param {Highcharts.PointerEventObject} [p]
     *
     * @return {void}
     *
     * @fires Highcharts.Point#event:mouseOut
     * @fires Highcharts.Point#event:mouseOver
     */
    runPointActions: function (
        this: Highcharts.Pointer,
        e?: Highcharts.PointerEventObject,
        p?: Highcharts.Point
    ): void {
        var pointer = this,
            chart = pointer.chart,
            series = chart.series,
            tooltip = (
                chart.tooltip && chart.tooltip.options.enabled ?
                    chart.tooltip :
                    undefined
            ),
            shared = (
                tooltip ?
                    tooltip.shared :
                    false
            ),
            hoverPoint = p || chart.hoverPoint,
            hoverSeries = hoverPoint && hoverPoint.series || chart.hoverSeries,
            // onMouseOver or already hovering a series with directTouch
            isDirectTouch = (!e || e.type !== 'touchmove') && (
                !!p || (
                    (hoverSeries && hoverSeries.directTouch) &&
                    pointer.isDirectTouch
                )
            ),
            hoverData = this.getHoverData(
                hoverPoint,
                hoverSeries,
                series,
                isDirectTouch,
                shared,
                e
            ),
            useSharedTooltip: (boolean|undefined),
            followPointer: (boolean|undefined),
            anchor: Array<number>,
            points: Array<Highcharts.Point>;

        // Update variables from hoverData.
        hoverPoint = hoverData.hoverPoint;
        points = hoverData.hoverPoints;
        hoverSeries = hoverData.hoverSeries;
        followPointer = hoverSeries && hoverSeries.tooltipOptions.followPointer;
        useSharedTooltip = (
            shared &&
            hoverSeries &&
            !hoverSeries.noSharedTooltip
        );

        // Refresh tooltip for kdpoint if new hover point or tooltip was hidden
        // #3926, #4200
        if (
            hoverPoint &&
            // !(hoverSeries && hoverSeries.directTouch) &&
            (hoverPoint !== chart.hoverPoint || (tooltip && tooltip.isHidden))
        ) {
            (chart.hoverPoints || []).forEach(function (
                p: Highcharts.Point
            ): void {
                if (points.indexOf(p) === -1) {
                    p.setState();
                }
            });

            // Set normal state to previous series
            if (chart.hoverSeries !== hoverSeries) {
                hoverSeries.onMouseOver();
            }

            pointer.applyInactiveState(points);

            // Do mouseover on all points (#3919, #3985, #4410, #5622)
            (points || []).forEach(function (p: Highcharts.Point): void {
                p.setState('hover');
            });

            // If tracking is on series in stead of on each point,
            // fire mouseOver on hover point. // #4448
            if (chart.hoverPoint) {
                chart.hoverPoint.firePointEvent('mouseOut');
            }

            // Hover point may have been destroyed in the event handlers (#7127)
            if (!hoverPoint.series) {
                return;
            }

            hoverPoint.firePointEvent('mouseOver');

            /**
             * Contains all hovered points.
             *
             * @name Highcharts.Chart#hoverPoints
             * @type {Array<Highcharts.Point>|null}
             */
            chart.hoverPoints = points;

            /**
             * Contains the original hovered point.
             *
             * @name Highcharts.Chart#hoverPoint
             * @type {Highcharts.Point|null}
             */
            chart.hoverPoint = hoverPoint;

            // Draw tooltip if necessary
            if (tooltip) {
                tooltip.refresh(useSharedTooltip ? points : hoverPoint, e);
            }
        // Update positions (regardless of kdpoint or hoverPoint)
        } else if (followPointer && tooltip && !tooltip.isHidden) {
            anchor = tooltip.getAnchor([{} as any], e);
            tooltip.updatePosition(
                { plotX: anchor[0], plotY: anchor[1] } as any
            );
        }

        // Start the event listener to pick up the tooltip and crosshairs
        if (!pointer.unDocMouseMove) {
            pointer.unDocMouseMove = addEvent(
                chart.container.ownerDocument,
                'mousemove',
                function (e: any): void {
                    var chart = charts[H.hoverChartIndex as any];

                    if (chart) {
                        chart.pointer.onDocumentMouseMove(e);
                    }
                }
            );
        }

        // Issues related to crosshair #4927, #5269 #5066, #5658
        chart.axes.forEach(function drawAxisCrosshair(
            axis: Highcharts.Axis
        ): void {
            var snap = pick((axis.crosshair as any).snap, true),
                point = !snap ?
                    undefined :
                    H.find(points, function (p: Highcharts.Point): boolean {
                        return (p.series as any)[axis.coll] === axis;
                    });

            // Axis has snapping crosshairs, and one of the hover points belongs
            // to axis. Always call drawCrosshair when it is not snap.
            if (point || !snap) {
                axis.drawCrosshair(e, point);
            // Axis has snapping crosshairs, but no hover point belongs to axis
            } else {
                axis.hideCrosshair();
            }
        });
    },

    /**
     * Set inactive state to all series that are not currently hovered,
     * or, if `inactiveOtherPoints` is set to true, set inactive state to
     * all points within that series.
     *
     * @function Highcharts.Pointer#applyInactiveState
     *
     * @private
     *
     * @param {Array<Highcharts.Point>} points
     *        Currently hovered points
     *
     */
    applyInactiveState: function (
        this: Highcharts.Pointer,
        points: Array<Highcharts.Point>
    ): void {
        var activeSeries = [] as Array<Highcharts.Series>,
            series: Highcharts.Series;

        // Get all active series from the hovered points
        (points || []).forEach(function (item: Highcharts.Point): void {
            series = item.series;

            // Include itself
            activeSeries.push(series);

            // Include parent series
            if (series.linkedParent) {
                activeSeries.push(series.linkedParent);
            }

            // Include all child series
            if (series.linkedSeries) {
                activeSeries = activeSeries.concat(
                    series.linkedSeries
                );
            }

            // Include navigator series
            if (series.navigatorSeries) {
                activeSeries.push(series.navigatorSeries);
            }
        });
        // Now loop over all series, filtering out active series
        this.chart.series.forEach(function (
            inactiveSeries: Highcharts.Series
        ): void {
            if (activeSeries.indexOf(inactiveSeries) === -1) {
                // Inactive series
                inactiveSeries.setState('inactive', true);
            } else if (inactiveSeries.options.inactiveOtherPoints) {
                // Active series, but other points should be inactivated
                inactiveSeries.setAllPointsToState('inactive');
            }
        });
    },

    /**
     * Reset the tracking by hiding the tooltip, the hover series state and the
     * hover point
     *
     * @function Highcharts.Pointer#reset
     *
     * @param {boolean} [allowMove]
     *        Instead of destroying the tooltip altogether, allow moving it if
     *        possible.
     *
     * @param {number} [delay]
     *
     * @return {void}
     */
    reset: function (
        this: Highcharts.Pointer,
        allowMove?: boolean,
        delay?: number
    ): void {
        var pointer = this,
            chart = pointer.chart,
            hoverSeries = chart.hoverSeries,
            hoverPoint = chart.hoverPoint,
            hoverPoints = chart.hoverPoints,
            tooltip = chart.tooltip,
            tooltipPoints = tooltip && tooltip.shared ?
                hoverPoints :
                hoverPoint;

        // Check if the points have moved outside the plot area (#1003, #4736,
        // #5101)
        if (allowMove && tooltipPoints) {
            splat(tooltipPoints).forEach(function (
                point: Highcharts.Point
            ): void {
                if (point.series.isCartesian && point.plotX === undefined) {
                    allowMove = false;
                }
            });
        }

        // Just move the tooltip, #349
        if (allowMove) {
            if (tooltip && tooltipPoints && splat(tooltipPoints).length) {
                tooltip.refresh(tooltipPoints);
                if (tooltip.shared && hoverPoints) { // #8284
                    hoverPoints.forEach(function (
                        point: Highcharts.Point
                    ): void {
                        point.setState(point.state, true);
                        if (point.series.isCartesian) {
                            if (point.series.xAxis.crosshair) {
                                point.series.xAxis
                                    .drawCrosshair(null as any, point);
                            }
                            if (point.series.yAxis.crosshair) {
                                point.series.yAxis
                                    .drawCrosshair(null as any, point);
                            }
                        }
                    });
                } else if (hoverPoint) { // #2500
                    hoverPoint.setState(hoverPoint.state, true);
                    chart.axes.forEach(function (axis: Highcharts.Axis): void {
                        if (axis.crosshair) {
                            axis.drawCrosshair(null as any, hoverPoint);
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
                hoverPoints.forEach(function (point: Highcharts.Point): void {
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
            chart.axes.forEach(function (axis: Highcharts.Axis): void {
                axis.hideCrosshair();
            });

            pointer.hoverX = chart.hoverPoints = chart.hoverPoint = null as any;
        }
    },

    /**
     * Scale series groups to a certain scale and translation.
     *
     * @private
     * @function Highcharts.Pointer#scaleGroups
     *
     * @param {Highcharts.SeriesPlotBoxObject} [attribs]
     *
     * @param {boolean} [clip]
     *
     * @return {void}
     */
    scaleGroups: function (
        this: Highcharts.Pointer,
        attribs?: Highcharts.SeriesPlotBoxObject,
        clip?: boolean
    ): void {

        var chart = this.chart,
            seriesAttribs;

        // Scale each series
        chart.series.forEach(function (series: Highcharts.Series): void {
            seriesAttribs = attribs || series.getPlotBox(); // #1701
            if (series.xAxis && series.xAxis.zoomEnabled && series.group) {
                series.group.attr(seriesAttribs);
                if (series.markerGroup) {
                    series.markerGroup.attr(seriesAttribs);
                    series.markerGroup.clip(
                        clip ? (chart.clipRect as any) : (null as any)
                    );
                }
                if (series.dataLabelsGroup) {
                    series.dataLabelsGroup.attr(seriesAttribs);
                }
            }
        });

        // Clip
        (chart.clipRect as any).attr(clip || chart.clipBox);
    },

    /**
     * Start a drag operation.
     *
     * @private
     * @function Highcharts.Pointer#dragStart
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    dragStart: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        var chart = this.chart;

        // Record the start position
        chart.mouseIsDown = e.type;
        chart.cancelClick = false;
        chart.mouseDownX = this.mouseDownX = e.chartX;
        chart.mouseDownY = this.mouseDownY = e.chartY;
    },

    /**
     * Perform a drag operation in response to a mousemove event while the mouse
     * is down.
     *
     * @private
     * @function Highcharts.Pointer#drag
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    drag: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {

        var chart = this.chart,
            chartOptions = chart.options.chart as Highcharts.ChartOptions,
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
            panKey = (
                chartOptions.panKey && (e as any)[chartOptions.panKey + 'Key']
            );

        // If the device supports both touch and mouse (like IE11), and we are
        // touch-dragging inside the plot area, don't handle the mouse event.
        // #4339.
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
            clickedInside = chart.isInsidePlot(
                mouseDownX - plotLeft,
                mouseDownY - plotTop
            );

            // make a selection
            if (
                chart.hasCartesianSeries &&
                (this.zoomX || this.zoomY) &&
                clickedInside &&
                !panKey
            ) {
                if (!selectionMarker) {
                    this.selectionMarker = selectionMarker =
                        chart.renderer.rect(
                            plotLeft,
                            plotTop,
                            zoomHor ? 1 : plotWidth,
                            zoomVert ? 1 : plotHeight,
                            0
                        )
                            .attr({
                                'class': 'highcharts-selection-marker',
                                zIndex: 7
                            })
                            .add();

                    if (!chart.styledMode) {
                        selectionMarker.attr({
                            fill: (
                                chartOptions.selectionMarkerFill ||
                                color('${palette.highlightColor80}')
                                    .setOpacity(0.25).get()
                            )
                        });
                    }
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
                (chart.pan as any)(e, chartOptions.panning);
            }
        }
    },

    /**
     * On mouse up or touch end across the entire document, drop the selection.
     *
     * @private
     * @function Highcharts.Pointer#drop
     *
     * @param {global.Event} e
     *
     * @return {void}
     */
    drop: function (
        this: Highcharts.Pointer,
        e: Event
    ): void {
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
                selectionLeft = selectionBox.attr ?
                    selectionBox.attr('x') :
                    selectionBox.x,
                selectionTop = selectionBox.attr ?
                    selectionBox.attr('y') :
                    selectionBox.y,
                selectionWidth = selectionBox.attr ?
                    selectionBox.attr('width') :
                    selectionBox.width,
                selectionHeight = selectionBox.attr ?
                    selectionBox.attr('height') :
                    selectionBox.height,
                runZoom;

            // a selection has been made
            if (this.hasDragged || hasPinched) {

                // record each axis' min and max
                chart.axes.forEach(function (axis: Highcharts.Axis): void {
                    if (
                        axis.zoomEnabled &&
                        defined(axis.min) &&
                        (
                            hasPinched ||
                            (pointer as any)[({
                                xAxis: 'zoomX',
                                yAxis: 'zoomY'
                            } as any)[axis.coll]]
                        )
                    ) { // #859, #3569
                        var horiz = axis.horiz,
                            minPixelPadding = e.type === 'touchend' ?
                                axis.minPixelPadding :
                                0, // #1207, #3075
                            selectionMin = axis.toValue(
                                (horiz ? selectionLeft : selectionTop) +
                                minPixelPadding
                            ),
                            selectionMax = axis.toValue(
                                (
                                    horiz ?
                                        selectionLeft + selectionWidth :
                                        selectionTop + selectionHeight
                                ) - minPixelPadding
                            );

                        (selectionData as any)[axis.coll].push({
                            axis: axis,
                            // Min/max for reversed axes
                            min: Math.min(selectionMin, selectionMax),
                            max: Math.max(selectionMin, selectionMax)
                        });
                        runZoom = true;
                    }
                });
                if (runZoom) {
                    fireEvent(
                        chart,
                        'selection',
                        selectionData,
                        function (args: object): void {
                            (chart.zoom as any)(
                                extend(
                                    args,
                                    hasPinched ?
                                        { animation: false } :
                                        null as any
                                )
                            );
                        }
                    );
                }

            }

            if (isNumber(chart.index)) {
                this.selectionMarker = this.selectionMarker.destroy();
            }

            // Reset scaling preview
            if (hasPinched) {
                this.scaleGroups();
            }
        }

        // Reset all. Check isNumber because it may be destroyed on mouse up
        // (#877)
        if (chart && isNumber(chart.index)) {
            css(chart.container, { cursor: chart._cursor as any });
            chart.cancelClick = this.hasDragged > 10; // #370
            chart.mouseIsDown = this.hasDragged = this.hasPinched = false;
            this.pinchDown = [];
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onContainerMouseDown
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onContainerMouseDown: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        // Normalize before the 'if' for the legacy IE (#7850)
        e = this.normalize(e);

        if ((e as any).button !== 2) {

            this.zoomOption(e);

            // issue #295, dragging not always working in Firefox
            if (e.preventDefault) {
                e.preventDefault();
            }

            this.dragStart(e);
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onDocumentMouseUp
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onDocumentMouseUp: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        if (charts[H.hoverChartIndex as any]) {
            (charts[H.hoverChartIndex as any] as any).pointer.drop(e);
        }
    },

    /**
     * Special handler for mouse move that will hide the tooltip when the mouse
     * leaves the plotarea. Issue #149 workaround. The mouseleave event does not
     * always fire.
     *
     * @private
     * @function Highcharts.Pointer#onDocumentMouseMove
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onDocumentMouseMove: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        var chart = this.chart,
            chartPosition = this.chartPosition;

        e = this.normalize(e, chartPosition);

        // If we're outside, hide the tooltip
        if (
            chartPosition &&
            !this.inClass(e.target as any, 'highcharts-tracker') &&
            !chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            )
        ) {
            this.reset();
        }
    },

    /**
     * When mouse leaves the container, hide the tooltip.
     *
     * @private
     * @function Highcharts.Pointer#onContainerMouseLeave
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onContainerMouseLeave: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        var chart = charts[H.hoverChartIndex as any];

        // #4886, MS Touch end fires mouseleave but with no related target
        if (chart && (e.relatedTarget || e.toElement)) {
            chart.pointer.reset();
            // Also reset the chart position, used in #149 fix
            chart.pointer.chartPosition = null;
        }
    },

    /**
     * The mousemove, touchmove and touchstart event handler
     *
     * @private
     * @function Highcharts.Pointer#onContainerMouseMove
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onContainerMouseMove: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {

        var chart = this.chart;

        if (
            !defined(H.hoverChartIndex) ||
            !charts[H.hoverChartIndex as any] ||
            !(charts[H.hoverChartIndex as any] as any).mouseIsDown
        ) {
            H.hoverChartIndex = chart.index;
        }

        e = this.normalize(e);

        // In IE8 we apparently need this returnValue set to false in order to
        // avoid text being selected. But in Chrome, e.returnValue is prevented,
        // plus we don't need to run e.preventDefault to prevent selected text
        // in modern browsers. So we set it conditionally. Remove it when IE8 is
        // no longer needed. #2251, #3224.
        if (!e.preventDefault) {
            e.returnValue = false;
        }

        if (chart.mouseIsDown === 'mousedown') {
            this.drag(e);
        }

        // Show the tooltip and run mouse over events (#977)
        if (
            (
                this.inClass(e.target as any, 'highcharts-tracker') ||
                chart.isInsidePlot(
                    e.chartX - chart.plotLeft,
                    e.chartY - chart.plotTop
                )
            ) &&
            !chart.openMenu
        ) {
            this.runPointActions(e);
        }
    },

    /**
     * Utility to detect whether an element has, or has a parent with, a
     * specificclass name. Used on detection of tracker objects and on deciding
     * whether hovering the tooltip should cause the active series to mouse out.
     *
     * @function Highcharts.Pointer#inClass
     *
     * @param {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} element
     *        The element to investigate.
     *
     * @param {string} className
     *        The class name to look for.
     *
     * @return {boolean|undefined}
     *         True if either the element or one of its parents has the given
     *         class name.
     */
    inClass: function (
        this: Highcharts.Pointer,
        element: (Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement),
        className: string
    ): (boolean|undefined) {
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
            element = element.parentNode as any;
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onTrackerMouseOut
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onTrackerMouseOut: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        var series = this.chart.hoverSeries,
            relatedTarget = e.relatedTarget || e.toElement;

        this.isDirectTouch = false;

        if (
            series &&
            relatedTarget &&
            !series.stickyTracking &&
            !this.inClass(relatedTarget as any, 'highcharts-tooltip') &&
            (
                !this.inClass(
                    relatedTarget as any,
                    'highcharts-series-' + series.index
                ) || // #2499, #4465, #5553
                !this.inClass(relatedTarget as any, 'highcharts-tracker')
            )
        ) {
            series.onMouseOut();
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onContainerClick
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    onContainerClick: function (
        this: Highcharts.Pointer,
        e: Highcharts.PointerEventObject
    ): void {
        var chart = this.chart,
            hoverPoint = chart.hoverPoint,
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop;

        e = this.normalize(e);

        if (!chart.cancelClick) {

            // On tracker click, fire the series and point events. #783, #1583
            if (hoverPoint &&
                this.inClass(e.target as any, 'highcharts-tracker')
            ) {

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
                if (
                    chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)
                ) {
                    fireEvent(chart, 'click', e);
                }
            }


        }
    },

    /**
     * Set the JS DOM events on the container and document. This method should
     * contain a one-to-one assignment between methods and their handlers. Any
     * advanced logic should be moved to the handler reflecting the event's
     * name.
     *
     * @private
     * @function Highcharts.Pointer#setDOMEvents
     *
     * @return {void}
     */
    setDOMEvents: function (
        this: Highcharts.Pointer
    ): void {

        var pointer = this,
            container = pointer.chart.container,
            ownerDoc = container.ownerDocument;

        container.onmousedown = function (e: MouseEvent): void {
            pointer.onContainerMouseDown(e as any);
        };
        container.onmousemove = function (e: MouseEvent): void {
            pointer.onContainerMouseMove(e as any);
        };
        container.onclick = function (e: MouseEvent): void {
            pointer.onContainerClick(e as any);
        };
        this.unbindContainerMouseLeave = addEvent(
            container,
            'mouseleave',
            pointer.onContainerMouseLeave as any
        );
        if (!H.unbindDocumentMouseUp) {
            H.unbindDocumentMouseUp = addEvent(
                ownerDoc,
                'mouseup',
                pointer.onDocumentMouseUp as any
            );
        }
        if (H.hasTouch) {
            addEvent(
                container,
                'touchstart',
                function (e: TouchEvent): void {
                    pointer.onContainerTouchStart(e as any);
                }
            );
            addEvent(
                container,
                'touchmove',
                function (e: TouchEvent): void {
                    pointer.onContainerTouchMove(e as any);
                }
            );
            if (!H.unbindDocumentTouchEnd) {
                H.unbindDocumentTouchEnd = addEvent(
                    ownerDoc,
                    'touchend',
                    pointer.onDocumentTouchEnd as any
                );
            }
        }

    },

    /**
     * Destroys the Pointer object and disconnects DOM events.
     *
     * @function Highcharts.Pointer#destroy
     *
     * @return {void}
     */
    destroy: function (): void {
        var pointer = this;

        if (pointer.unDocMouseMove) {
            pointer.unDocMouseMove();
        }

        this.unbindContainerMouseLeave();

        if (!H.chartCount) {
            if (H.unbindDocumentMouseUp) {
                H.unbindDocumentMouseUp = H.unbindDocumentMouseUp();
            }
            if (H.unbindDocumentTouchEnd) {
                H.unbindDocumentTouchEnd = H.unbindDocumentTouchEnd();
            }
        }

        // memory and CPU leak
        clearInterval(pointer.tooltipTimeout);

        objectEach(pointer, function (val: any, prop: string): void {
            pointer[prop] = null;
        });
    }
} as any;
