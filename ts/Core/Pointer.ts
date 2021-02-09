/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Axis from './Axis/Axis';
import type Chart from './Chart/Chart';
import type { DOMElementType } from './Renderer/DOMElementType';
import type Point from './Series/Point';
import type PointerEvent from './PointerEvent';
import type Series from './Series/Series';
import type SVGElement from './Renderer/SVG/SVGElement';
import Color from './Color/Color.js';
const { parse: color } = Color;
import H from './Globals.js';
const {
    charts,
    noop
} = H;
import palette from '../Core/Color/Palette.js';
import Tooltip from './Tooltip.js';
import U from './Utilities.js';
const {
    addEvent,
    attr,
    css,
    defined,
    extend,
    find,
    fireEvent,
    isNumber,
    isObject,
    objectEach,
    offset,
    pick,
    splat
} = U;

declare module './Chart/ChartLike'{
    interface ChartLike {
        cancelClick?: boolean;
        hoverPoint?: Point;
        hoverPoints?: Array<Point>;
        hoverSeries?: Series;
        mouseDownX?: number;
        mouseDownY?: number;
        mouseIsDown?: (boolean|string);
        tooltip?: Tooltip;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
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
        interface PointerEventArgsObject {
            chartX?: number;
            chartY?: number;
            filter?: Function;
            hoverPoint?: Point;
            shared?: boolean;
        }
        interface PointerHoverDataObject {
            hoverPoint?: Point;
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
        interface ChartPositionObject {
            left: number;
            scaleX: number;
            scaleY: number;
            top: number;
        }
        let Pointer: PointerClass;
        let chartCount: number;
        let hoverChartIndex: (number|undefined);
        let unbindDocumentMouseUp: (Function|undefined);
        let unbindDocumentTouchEnd: (Function|undefined);
    }
    interface TouchList {
        changedTouches: Array<Touch>;
    }
}
type PointerClass = typeof Pointer;

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

/**
 * Chart position and scale.
 *
 * @interface Highcharts.ChartPositionObject
 *//**
 * @name Highcharts.ChartPositionObject#left
 * @type {number}
 *//**
 * @name Highcharts.ChartPositionObject#scaleX
 * @type {number}
 *//**
 * @name Highcharts.ChartPositionObject#scaleY
 * @type {number}
 *//**
 * @name Highcharts.ChartPositionObject#top
 * @type {number}
 */

''; // detach doclets above

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
 * The chart instance.
 *
 * @param {Highcharts.Options} options
 * The root options object. The pointer uses options from the chart and
 * tooltip structures.
 */
class Pointer {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(chart: Chart, options: Highcharts.Options) {
        this.chart = chart;
        this.hasDragged = false;
        this.options = options;
        this.unbindContainerMouseLeave = function (): void {};
        this.unbindContainerMouseEnter = function (): void {};
        this.init(chart, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart: Chart;

    public chartPosition?: Highcharts.ChartPositionObject;

    public followTouchMove?: boolean;

    public hasDragged: (false|number);

    public hasPinched?: boolean;

    public hasZoom?: boolean;

    public hoverX?: (Point|Array<Point>);

    public initiated?: boolean;

    public isDirectTouch?: boolean;

    public lastValidTouch: object = {};

    public mouseDownX?: number;

    public mouseDownY?: number;

    public options: Highcharts.Options;

    public pinchDown: Array<any> = [];

    public res?: boolean;

    public runChartClick: boolean = false;

    public selectionMarker?: SVGElement;

    public tooltipTimeout?: number;

    public unbindContainerMouseLeave: Function;

    public unbindContainerMouseEnter: Function;

    public unDocMouseMove?: Function;

    public zoomHor?: boolean;

    public zoomVert?: boolean;

    public zoomX?: boolean;

    public zoomY?: boolean;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Set inactive state to all series that are not currently hovered,
     * or, if `inactiveOtherPoints` is set to true, set inactive state to
     * all points within that series.
     *
     * @private
     * @function Highcharts.Pointer#applyInactiveState
     * @param {Array<Highcharts.Point>} points
     * Currently hovered points
     */
    public applyInactiveState(points: Array<Point>): void {
        var activeSeries = [] as Array<Series>,
            series: Series;

        // Get all active series from the hovered points
        (points || []).forEach(function (item): void {
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
        this.chart.series.forEach(function (inactiveSeries): void {
            if (activeSeries.indexOf(inactiveSeries) === -1) {
                // Inactive series
                inactiveSeries.setState('inactive', true);
            } else if (inactiveSeries.options.inactiveOtherPoints) {
                // Active series, but other points should be inactivated
                inactiveSeries.setAllPointsToState('inactive');
            }
        });
    }

    /**
     * Destroys the Pointer object and disconnects DOM events.
     *
     * @function Highcharts.Pointer#destroy
     */
    public destroy(): void {
        var pointer = this;

        if (typeof pointer.unDocMouseMove !== 'undefined') {
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

        objectEach(pointer, function (_val, prop): void {
            pointer[prop] = void 0 as any;
        });
    }

    /**
     * Perform a drag operation in response to a mousemove event while the mouse
     * is down.
     *
     * @private
     * @function Highcharts.Pointer#drag
     */
    public drag(e: PointerEvent): void {

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
            mouseDownX = (this.mouseDownX || 0),
            mouseDownY = (this.mouseDownY || 0),
            panningEnabled = isObject(chartOptions.panning) ?
                chartOptions.panning && chartOptions.panning.enabled :
                chartOptions.panning,
            panKey = (
                chartOptions.panKey && (e as any)[chartOptions.panKey + 'Key']
            );

        // If the device supports both touch and mouse (like IE11), and we are
        // touch-dragging inside the plot area, don't handle the mouse event.
        // #4339.
        if (selectionMarker && (selectionMarker as any).touch) {
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
                                color(palette.highlightColor80)
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
            if (clickedInside &&
                !selectionMarker &&
                panningEnabled
            ) {
                (chart.pan as any)(e, chartOptions.panning);
            }
        }
    }

    /**
     * Start a drag operation.
     *
     * @private
     * @function Highcharts.Pointer#dragStart
     */
    public dragStart(e: PointerEvent): void {
        var chart = this.chart;

        // Record the start position
        chart.mouseIsDown = e.type;
        chart.cancelClick = false;
        chart.mouseDownX = this.mouseDownX = e.chartX;
        chart.mouseDownY = this.mouseDownY = e.chartY;
    }

    /**
     * On mouse up or touch end across the entire document, drop the selection.
     *
     * @private
     * @function Highcharts.Pointer#drop
     *
     * @param {global.Event} e
     */
    public drop(e: Event): void {
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
                chart.axes.forEach(function (axis: Axis): void {
                    if (
                        axis.zoomEnabled &&
                        defined(axis.min) &&
                        (
                            hasPinched ||
                            pointer[({
                                xAxis: 'zoomX',
                                yAxis: 'zoomY'
                            } as Record<string, (
                                'zoomX'|
                                'zoomY'
                            )>)[axis.coll]]
                        ) &&
                        isNumber(selectionLeft) &&
                        isNumber(selectionTop)
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
    }

    /**
     * Finds the closest point to a set of coordinates, using the k-d-tree
     * algorithm.
     *
     * @function Highcharts.Pointer#findNearestKDPoint
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
    public findNearestKDPoint(
        series: Array<Series>,
        shared: (boolean|undefined),
        e: PointerEvent
    ): (Point|undefined) {

        const chart = this.chart;
        const hoverPoint = chart.hoverPoint;
        const tooltip = chart.tooltip;

        if (
            hoverPoint &&
            tooltip &&
            tooltip.isStickyOnContact()
        ) {
            return hoverPoint;
        }

        let closest: (Point|undefined);

        /** @private */
        function sort(
            p1: Point,
            p2: Point
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
        }

        series.forEach(function (s): void {
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
                isObject(point, true) && point.series &&
                // Use the new point if it is closer.
                (!isObject(closest, true) ||
                (sort(closest as any, point as any) > 0))
            ) {
                closest = point;
            }
        });
        return closest;
    }

    /**
     * @private
     * @function Highcharts.Pointer#getChartCoordinatesFromPoint
     * @param {Highcharts.Point} point
     * @param {boolean} [inverted]
     * @return {Highcharts.PointerCoordinatesObject|undefined}
     */
    public getChartCoordinatesFromPoint(
        point: Point,
        inverted?: boolean
    ): (Highcharts.PointerCoordinatesObject|undefined) {
        var series = point.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            plotX = pick<number|undefined, number>(
                point.clientX, point.plotX as any
            ),
            shapeArgs = point.shapeArgs;

        if (xAxis && yAxis) {
            return inverted ? {
                chartX: xAxis.len + xAxis.pos - plotX,
                chartY: yAxis.len + yAxis.pos - (point.plotY as any)
            } : {
                chartX: plotX + xAxis.pos,
                chartY: (point.plotY as any) + yAxis.pos
            };
        }

        if (shapeArgs && shapeArgs.x && shapeArgs.y) {
            // E.g. pies do not have axes
            return {
                chartX: shapeArgs.x,
                chartY: shapeArgs.y
            };
        }
    }

    /**
     * Return the cached chartPosition if it is available on the Pointer,
     * otherwise find it. Running offset is quite expensive, so it should be
     * avoided when we know the chart hasn't moved.
     *
     * @function Highcharts.Pointer#getChartPosition
     *
     * @return {Highcharts.ChartPositionObject}
     *         The offset of the chart container within the page
     */
    public getChartPosition(): Highcharts.ChartPositionObject {
        if (this.chartPosition) {
            return this.chartPosition;
        }

        const { container } = this.chart;
        const pos = offset(container);
        this.chartPosition = {
            left: pos.left,
            top: pos.top,
            scaleX: 1,
            scaleY: 1
        };

        const offsetWidth = container.offsetWidth;
        const offsetHeight = container.offsetHeight;

        // #13342 - tooltip was not visible in Chrome, when chart
        // updates height.
        if (
            offsetWidth > 2 && // #13342
            offsetHeight > 2 // #13342
        ) {
            this.chartPosition.scaleX = pos.width / offsetWidth;
            this.chartPosition.scaleY = pos.height / offsetHeight;
        }

        return this.chartPosition;
    }

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
    public getCoordinates(e: PointerEvent): Highcharts.PointerAxisCoordinatesObject {

        var coordinates = {
            xAxis: [],
            yAxis: []
        } as Highcharts.PointerAxisCoordinatesObject;

        this.chart.axes.forEach(function (axis: Axis): void {
            (coordinates as any)[axis.isXAxis ? 'xAxis' : 'yAxis'].push({
                axis: axis,
                value: axis.toValue(e[axis.horiz ? 'chartX' : 'chartY'])
            });
        });

        return coordinates;
    }

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
    public getHoverData(
        existingHoverPoint: (Point|undefined),
        existingHoverSeries: (Series|undefined),
        series: Array<Series>,
        isDirectTouch?: boolean,
        shared?: boolean,
        e?: PointerEvent
    ): Highcharts.PointerHoverDataObject {
        var hoverPoint: Point,
            hoverPoints = [] as Array<Point>,
            hoverSeries = existingHoverSeries,
            useExisting = !!(isDirectTouch && existingHoverPoint),
            notSticky = hoverSeries && !hoverSeries.stickyTracking,
            // Which series to look in for the hover point
            searchSeries,
            // Parameters needed for beforeGetHoverData event.
            eventArgs: Highcharts.PointerEventArgsObject = {
                chartX: e ? e.chartX : void 0,
                chartY: e ? e.chartY : void 0,
                shared: shared
            },
            filter = function (s: Series): boolean {
                return (
                    s.visible &&
                    !(!shared && s.directTouch) && // #3821
                    pick(s.options.enableMouseTracking, true)
                );
            };

        // Find chart.hoverPane and update filter method in polar.
        fireEvent(this, 'beforeGetHoverData', eventArgs);

        searchSeries = notSticky ?
            // Only search on hovered series if it has stickyTracking false
            [hoverSeries as any] :
            // Filter what series to look in.
            series.filter(function (s): boolean {
                return eventArgs.filter ? eventArgs.filter(s) : filter(s) &&
                    s.stickyTracking;
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
                searchSeries = series.filter(function (s): boolean {
                    return eventArgs.filter ?
                        eventArgs.filter(s) : filter(s) && !s.noSharedTooltip;
                });

                // Get all points with the same x value as the hoverPoint
                searchSeries.forEach(function (s): any {
                    var point = find(s.points, function (p: Point): boolean {
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
                        hoverPoints.push(point as Point);
                    }
                });
            } else {
                hoverPoints.push(hoverPoint);
            }
        }

        // Check whether the hoverPoint is inside pane we are hovering over.
        eventArgs = { hoverPoint: hoverPoint };
        fireEvent(this, 'afterGetHoverData', eventArgs);

        return {
            hoverPoint: eventArgs.hoverPoint,
            hoverSeries: hoverSeries,
            hoverPoints: hoverPoints
        };
    }

    /**
     * @private
     * @function Highcharts.Pointer#getPointFromEvent
     *
     * @param {global.Event} e
     *
     * @return {Highcharts.Point|undefined}
     */
    public getPointFromEvent(e: Event): (Point|undefined) {
        var target = e.target,
            point;

        while (target && !point) {
            point = (target as any).point;
            target = (target as any).parentNode;
        }
        return point;
    }

    /**
     * @private
     * @function Highcharts.Pointer#onTrackerMouseOut
     */
    public onTrackerMouseOut(e: PointerEvent): void {
        const chart = this.chart;
        const relatedTarget = e.relatedTarget || e.toElement;
        const series = chart.hoverSeries;

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
    }

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
    public inClass(
        element: DOMElementType,
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
    }

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
    public init(chart: Chart, options: Highcharts.Options): void {

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
    }

    /**
     * Takes a browser event object and extends it with custom Highcharts
     * properties `chartX` and `chartY` in order to work on the internal
     * coordinate system.
     *
     * @function Highcharts.Pointer#normalize
     *
     * @param {global.MouseEvent|global.PointerEvent|global.TouchEvent} e
     *        Event object in standard browsers.
     *
     * @param {Highcharts.OffsetObject} [chartPosition]
     *        Additional chart offset.
     *
     * @return {Highcharts.PointerEventObject}
     *         A browser event with extended properties `chartX` and `chartY`.
     */
    public normalize<T extends PointerEvent>(
        e: (T|MouseEvent|PointerEvent|TouchEvent),
        chartPosition?: Highcharts.ChartPositionObject
    ): T {
        const touches = (e as TouchEvent).touches;

        // iOS (#2757)
        const ePos = (
            touches ?
                touches.length ?
                    touches.item(0) as Touch :
                    (pick( // #13534
                        touches.changedTouches,
                        (e as TouchEvent).changedTouches)
                    )[0] :
                e as unknown as PointerEvent
        );

        // Get mouse position
        if (!chartPosition) {
            chartPosition = this.getChartPosition();
        }

        let chartX = ePos.pageX - chartPosition.left,
            chartY = ePos.pageY - chartPosition.top;

        // #11329 - when there is scaling on a parent element, we need to take
        // this into account
        chartX /= chartPosition.scaleX;
        chartY /= chartPosition.scaleY;

        return extend(e, {
            chartX: Math.round(chartX),
            chartY: Math.round(chartY)
        }) as any;
    }

    /**
     * @private
     * @function Highcharts.Pointer#onContainerClick
     */
    public onContainerClick(e: MouseEvent): void {
        const chart = this.chart;
        const hoverPoint = chart.hoverPoint;
        const pEvt = this.normalize(e);
        const plotLeft = chart.plotLeft;
        const plotTop = chart.plotTop;

        if (!chart.cancelClick) {

            // On tracker click, fire the series and point events. #783, #1583
            if (hoverPoint &&
                this.inClass(pEvt.target as any, 'highcharts-tracker')
            ) {

                // the series click event
                fireEvent(hoverPoint.series, 'click', extend(pEvt, {
                    point: hoverPoint
                }));

                // the point click event
                if (chart.hoverPoint) { // it may be destroyed (#1844)
                    hoverPoint.firePointEvent('click', pEvt);
                }

            // When clicking outside a tracker, fire a chart event
            } else {
                extend(pEvt, this.getCoordinates(pEvt));

                // fire a click event in the chart
                if (chart.isInsidePlot((pEvt.chartX - plotLeft), (pEvt.chartY - plotTop))) {
                    fireEvent(chart, 'click', pEvt);
                }
            }


        }
    }

    /**
     * @private
     * @function Highcharts.Pointer#onContainerMouseDown
     *
     * @param {global.MouseEvent} e
     */
    public onContainerMouseDown(e: MouseEvent): void {
        const isPrimaryButton = ((e.buttons || e.button) & 1) === 1;

        // Normalize before the 'if' for the legacy IE (#7850)
        e = this.normalize(e);

        // #11635, Firefox does not reliable fire move event after click scroll
        if (
            H.isFirefox &&
            e.button !== 0
        ) {
            this.onContainerMouseMove(e);
        }

        // #11635, limiting to primary button (incl. IE 8 support)
        if (
            typeof e.button === 'undefined' ||
            isPrimaryButton
        ) {
            this.zoomOption(e);

            // #295, #13737 solve conflict between container drag and chart zoom
            if (
                isPrimaryButton &&
                e.preventDefault
            ) {
                e.preventDefault();
            }

            this.dragStart(e as PointerEvent);
        }
    }

    /**
     * When mouse leaves the container, hide the tooltip.
     *
     * @private
     * @function Highcharts.Pointer#onContainerMouseLeave
     *
     * @param {global.MouseEvent} e
     *
     * @return {void}
     */
    public onContainerMouseLeave(e: MouseEvent): void {
        const chart = charts[pick(H.hoverChartIndex, -1)];
        const tooltip = this.chart.tooltip;

        e = this.normalize(e);

        // #4886, MS Touch end fires mouseleave but with no related target
        if (
            chart &&
            (e.relatedTarget || (e as PointerEvent).toElement)
        ) {
            chart.pointer.reset();
            // Also reset the chart position, used in #149 fix
            chart.pointer.chartPosition = void 0;
        }

        if ( // #11635, Firefox wheel scroll does not fire out events consistently
            tooltip &&
            !tooltip.isHidden
        ) {
            this.reset();
        }
    }

    /**
     * When mouse enters the container, delete pointer's chartPosition.
     *
     * @private
     * @function Highcharts.Pointer#onContainerMouseEnter
     *
     * @param {global.MouseEvent} e
     *
     * @return {void}
     */
    public onContainerMouseEnter(e: MouseEvent): void {
        delete this.chartPosition;
    }

    /**
     * The mousemove, touchmove and touchstart event handler
     *
     * @private
     * @function Highcharts.Pointer#onContainerMouseMove
     *
     * @param {global.MouseEvent} e
     *
     * @return {void}
     */
    public onContainerMouseMove(e: MouseEvent): void {
        const chart = this.chart;
        const pEvt = this.normalize(e);

        this.setHoverChartIndex();

        // In IE8 we apparently need this returnValue set to false in order to
        // avoid text being selected. But in Chrome, e.returnValue is prevented,
        // plus we don't need to run e.preventDefault to prevent selected text
        // in modern browsers. So we set it conditionally. Remove it when IE8 is
        // no longer needed. #2251, #3224.
        if (!pEvt.preventDefault) {
            pEvt.returnValue = false;
        }

        if (chart.mouseIsDown === 'mousedown' || this.touchSelect(pEvt)) {
            this.drag(pEvt);
        }

        // Show the tooltip and run mouse over events (#977)
        if (
            !chart.openMenu &&
            (
                this.inClass(pEvt.target as any, 'highcharts-tracker') ||
                chart.isInsidePlot(
                    (pEvt.chartX - chart.plotLeft),
                    (pEvt.chartY - chart.plotTop)
                )
            )
        ) {
            this.runPointActions(pEvt);
        }
    }

    /**
     * @private
     * @function Highcharts.Pointer#onDocumentTouchEnd
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    public onDocumentTouchEnd(e: PointerEvent): void {
        if (charts[H.hoverChartIndex as any]) {
            (charts[H.hoverChartIndex as any] as any).pointer.drop(e);
        }
    }

    /**
     * @private
     * @function Highcharts.Pointer#onContainerTouchMove
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    public onContainerTouchMove(e: PointerEvent): void {
        if (this.touchSelect(e)) {
            this.onContainerMouseMove(e);
        } else {
            this.touch(e);
        }
    }

    /**
     * @private
     * @function Highcharts.Pointer#onContainerTouchStart
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    public onContainerTouchStart(e: PointerEvent): void {
        if (this.touchSelect(e)) {
            this.onContainerMouseDown(e);
        } else {
            this.zoomOption(e);
            this.touch(e, true);
        }
    }

    /**
     * Special handler for mouse move that will hide the tooltip when the mouse
     * leaves the plotarea. Issue #149 workaround. The mouseleave event does not
     * always fire.
     *
     * @private
     * @function Highcharts.Pointer#onDocumentMouseMove
     *
     * @param {global.MouseEvent} e
     *
     * @return {void}
     */
    public onDocumentMouseMove(e: MouseEvent): void {
        const chart = this.chart;
        const chartPosition = this.chartPosition;
        const pEvt = this.normalize(e, chartPosition);
        const tooltip = chart.tooltip;

        // If we're outside, hide the tooltip
        if (
            chartPosition &&
            (
                !tooltip ||
                !tooltip.isStickyOnContact()
            ) &&
            !chart.isInsidePlot(
                pEvt.chartX - chart.plotLeft,
                pEvt.chartY - chart.plotTop
            ) &&
            !this.inClass(pEvt.target as any, 'highcharts-tracker')
        ) {
            this.reset();
        }
    }

    /**
     * @private
     * @function Highcharts.Pointer#onDocumentMouseUp
     *
     * @param {global.MouseEvent} e
     *
     * @return {void}
     */
    public onDocumentMouseUp(e: MouseEvent): void {
        const chart = charts[pick(H.hoverChartIndex, -1)];
        if (chart) {
            chart.pointer.drop(e);
        }
    }

    /**
     * Handle touch events with two touches
     *
     * @private
     * @function Highcharts.Pointer#pinch
     *
     * @param {Highcharts.PointerEventObject} e
     *
     * @return {void}
     */
    public pinch(e: PointerEvent): void {

        var self = this,
            chart = self.chart,
            pinchDown = self.pinchDown,
            touches: (Array<PointerEvent>|Array<Touch>) = (e.touches || []),
            touchesLength = touches.length,
            lastValidTouch = self.lastValidTouch as any,
            hasZoom = self.hasZoom,
            selectionMarker = self.selectionMarker,
            transform: Highcharts.SeriesPlotBoxObject = {} as any,
            fireClickEvent = touchesLength === 1 && (
                (
                    self.inClass(e.target as any, 'highcharts-tracker') &&
                    chart.runTrackerClick
                ) ||
                self.runChartClick
            ),
            clip = {};

        // Don't initiate panning until the user has pinched. This prevents us
        // from blocking page scrolling as users scroll down a long page
        // (#4210).
        if (touchesLength > 1) {
            self.initiated = true;
        }

        // On touch devices, only proceed to trigger click if a handler is
        // defined
        if (hasZoom && self.initiated && !fireClickEvent && e.cancelable !== false) {
            e.preventDefault();
        }

        // Normalize each touch
        [].map.call(touches, function (e): PointerEvent {
            return self.normalize(e);
        });

        // Register the touch start position
        if (e.type === 'touchstart') {
            [].forEach.call(touches, function (
                e: PointerEvent,
                i: number
            ): void {
                pinchDown[i] = { chartX: e.chartX, chartY: e.chartY };
            });
            lastValidTouch.x = [pinchDown[0].chartX, pinchDown[1] &&
                pinchDown[1].chartX];
            lastValidTouch.y = [pinchDown[0].chartY, pinchDown[1] &&
                pinchDown[1].chartY];

            // Identify the data bounds in pixels
            chart.axes.forEach(function (axis: Axis): void {
                if (axis.zoomEnabled) {
                    var bounds = chart.bounds[axis.horiz ? 'h' : 'v'],
                        minPixelPadding = axis.minPixelPadding,
                        min = axis.toPixels(
                            Math.min(
                                pick(axis.options.min, axis.dataMin as any),
                                axis.dataMin as any
                            )
                        ),
                        max = axis.toPixels(
                            Math.max(
                                pick(axis.options.max, axis.dataMax as any),
                                axis.dataMax as any
                            )
                        ),
                        absMin = Math.min(min, max),
                        absMax = Math.max(min, max);

                    // Store the bounds for use in the touchmove handler
                    bounds.min = Math.min(
                        axis.pos,
                        absMin - minPixelPadding
                    );
                    bounds.max = Math.max(
                        axis.pos + axis.len,
                        absMax + minPixelPadding
                    );
                }
            });
            self.res = true; // reset on next move

        // Optionally move the tooltip on touchmove
        } else if (self.followTouchMove && touchesLength === 1) {
            this.runPointActions(self.normalize(e));

        // Event type is touchmove, handle panning and pinching
        } else if (pinchDown.length) { // can be 0 when releasing, if touchend
            // fires first


            // Set the marker
            if (!selectionMarker) {
                self.selectionMarker = selectionMarker = extend({
                    destroy: noop,
                    touch: true
                }, chart.plotBox) as any;
            }

            self.pinchTranslate(
                pinchDown,
                touches as any,
                transform,
                selectionMarker,
                clip,
                lastValidTouch
            );

            self.hasPinched = hasZoom;

            // Scale and translate the groups to provide visual feedback during
            // pinching
            self.scaleGroups(transform, clip as any);

            if (self.res) {
                self.res = false;
                this.reset(false, 0);
            }
        }
    }

    /**
     * Run translation operations
     *
     * @private
     * @function Highcharts.Pointer#pinchTranslate
     *
     * @param {Array<*>} pinchDown
     *
     * @param {Array<Highcharts.PointerEventObject>} touches
     *
     * @param {*} transform
     *
     * @param {*} selectionMarker
     *
     * @param {*} clip
     *
     * @param {*} lastValidTouch
     *
     * @return {void}
     */
    public pinchTranslate(
        pinchDown: Array<any>,
        touches: Array<PointerEvent>,
        transform: any,
        selectionMarker: any,
        clip: any,
        lastValidTouch: any
    ): void {
        if (this.zoomHor) {
            this.pinchTranslateDirection(
                true,
                pinchDown,
                touches,
                transform,
                selectionMarker,
                clip,
                lastValidTouch
            );
        }
        if (this.zoomVert) {
            this.pinchTranslateDirection(
                false,
                pinchDown,
                touches,
                transform,
                selectionMarker,
                clip,
                lastValidTouch
            );
        }
    }

    /**
     * Run translation operations for each direction (horizontal and vertical)
     * independently.
     *
     * @private
     * @function Highcharts.Pointer#pinchTranslateDirection
     *
     * @param {boolean} horiz
     *
     * @param {Array<*>} pinchDown
     *
     * @param {Array<Highcharts.PointerEventObject>} touches
     *
     * @param {*} transform
     *
     * @param {*} selectionMarker
     *
     * @param {*} clip
     *
     * @param {*} lastValidTouch
     *
     * @param {number|undefined} [forcedScale=1]
     *
     * @return {void}
     */
    public pinchTranslateDirection(
        horiz: boolean,
        pinchDown: Array<any>,
        touches: Array<PointerEvent>,
        transform: any,
        selectionMarker: any,
        clip: any,
        lastValidTouch: any,
        forcedScale?: number
    ): void {
        var chart = this.chart,
            xy: ('x'|'y') = horiz ? 'x' : 'y',
            XY: ('X'|'Y') = horiz ? 'X' : 'Y',
            sChartXY: ('chartX'|'chartY') = ('chart' + XY) as any,
            wh = horiz ? 'width' : 'height',
            plotLeftTop = (chart as any)['plot' + (horiz ? 'Left' : 'Top')],
            selectionWH: any,
            selectionXY,
            clipXY: any,
            scale = forcedScale || 1,
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
            setScale = function (): void {
                // Don't zoom if fingers are too close on this axis
                if (
                    typeof touch1Now === 'number' &&
                    Math.abs(touch0Start - touch1Start) > 20
                ) {
                    scale = forcedScale ||
                        Math.abs(touch0Now - touch1Now) /
                        Math.abs(touch0Start - touch1Start);
                }

                clipXY = ((plotLeftTop - touch0Now) / scale) + touch0Start;
                selectionWH = (chart as any)[
                    'plot' + (horiz ? 'Width' : 'Height')
                ] / scale;
            };

        // Set the scale, first pass
        setScale();

        // The clip position (x or y) is altered if out of bounds, the selection
        // position is not
        selectionXY = clipXY;

        // Out of bounds
        if (selectionXY < bounds.min) {
            selectionXY = bounds.min;
            outOfBounds = true;
        } else if (selectionXY + selectionWH > bounds.max) {
            selectionXY = bounds.max - selectionWH;
            outOfBounds = true;
        }

        // Is the chart dragged off its bounds, determined by dataMin and
        // dataMax?
        if (outOfBounds) {

            // Modify the touchNow position in order to create an elastic drag
            // movement. This indicates to the user that the chart is responsive
            // but can't be dragged further.
            touch0Now -= 0.8 * (touch0Now - lastValidTouch[xy][0]);
            if (typeof touch1Now === 'number') {
                touch1Now -= 0.8 * (touch1Now - lastValidTouch[xy][1]);
            }

            // Set the scale, second pass to adapt to the modified touchNow
            // positions
            setScale();

        } else {
            lastValidTouch[xy] = [touch0Now, touch1Now];
        }

        // Set geometry for clipping, selection and transformation
        if (!inverted) {
            clip[xy] = clipXY - plotLeftTop;
            clip[wh] = selectionWH;
        }
        scaleKey = inverted ? (horiz ? 'scaleY' : 'scaleX') : 'scale' + XY;
        transformScale = inverted ? 1 / scale : scale;

        selectionMarker[wh] = selectionWH;
        selectionMarker[xy] = selectionXY;
        transform[scaleKey] = scale;
        transform['translate' + XY] = (transformScale * plotLeftTop) +
            (touch0Now - (transformScale * touch0Start));
    }

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
    public reset(allowMove?: boolean, delay?: number): void {
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
            splat(tooltipPoints).forEach(function (point: Point): void {
                if (
                    point.series.isCartesian &&
                    typeof point.plotX === 'undefined'
                ) {
                    allowMove = false;
                }
            });
        }

        // Just move the tooltip, #349
        if (allowMove) {
            if (tooltip && tooltipPoints && splat(tooltipPoints).length) {
                tooltip.refresh(tooltipPoints);
                if (tooltip.shared && hoverPoints) { // #8284
                    hoverPoints.forEach(function (point: Point): void {
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
                    chart.axes.forEach(function (axis: Axis): void {
                        if (
                            axis.crosshair &&
                            (hoverPoint as any).series[axis.coll] === axis
                        ) {
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
                hoverPoints.forEach(function (point: Point): void {
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
            chart.axes.forEach(function (axis): void {
                axis.hideCrosshair();
            });

            pointer.hoverX = chart.hoverPoints = chart.hoverPoint = null as any;
        }
    }

    /**
     * With line type charts with a single tracker, get the point closest to the
     * mouse. Run Point.onMouseOver and display tooltip for the point or points.
     *
     * @private
     * @function Highcharts.Pointer#runPointActions
     *
     * @fires Highcharts.Point#event:mouseOut
     * @fires Highcharts.Point#event:mouseOver
     */
    public runPointActions(e: PointerEvent, p?: Point): void {
        var pointer = this,
            chart = pointer.chart,
            series = chart.series,
            tooltip = (
                chart.tooltip && chart.tooltip.options.enabled ?
                    chart.tooltip :
                    void 0
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
            points: Array<Point>;

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
            (chart.hoverPoints || []).forEach(function (p: Point): void {
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
            (points || []).forEach(function (p: Point): void {
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

            /**
             * Hover state should not be lost when axis is updated (#12569)
             * Axis.update runs pointer.reset which uses chart.hoverPoint.state
             * to apply state which does not exist in hoverPoint yet.
             * The mouseOver event should be triggered when hoverPoint
             * is correct.
             */
            hoverPoint.firePointEvent('mouseOver');

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
        chart.axes.forEach(function drawAxisCrosshair(axis): void {
            const snap = pick((axis.crosshair || {}).snap, true);

            let point: Point|undefined;
            if (snap) {
                point = chart.hoverPoint; // #13002
                if (!point || (point.series as any)[axis.coll] !== axis) {
                    point = find(points, (p: Point): boolean =>
                        (p.series as any)[axis.coll] === axis
                    );
                }
            }

            // Axis has snapping crosshairs, and one of the hover points belongs
            // to axis. Always call drawCrosshair when it is not snap.
            if (point || !snap) {
                axis.drawCrosshair(e, point);
            // Axis has snapping crosshairs, but no hover point belongs to axis
            } else {
                axis.hideCrosshair();
            }
        });
    }

    /**
     * Scale series groups to a certain scale and translation.
     *
     * @private
     * @function Highcharts.Pointer#scaleGroups
     */
    public scaleGroups(attribs?: Highcharts.SeriesPlotBoxObject, clip?: boolean): void {

        var chart = this.chart,
            seriesAttribs;

        // Scale each series
        chart.series.forEach(function (series): void {
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
    }

    /**
     * Set the JS DOM events on the container and document. This method should
     * contain a one-to-one assignment between methods and their handlers. Any
     * advanced logic should be moved to the handler reflecting the event's
     * name.
     *
     * @private
     * @function Highcharts.Pointer#setDOMEvents
     */
    public setDOMEvents(): void {

        var container = this.chart.container,
            ownerDoc = container.ownerDocument;

        container.onmousedown = this.onContainerMouseDown.bind(this);
        container.onmousemove = this.onContainerMouseMove.bind(this);
        container.onclick = this.onContainerClick.bind(this);
        this.unbindContainerMouseEnter = addEvent(
            container,
            'mouseenter',
            this.onContainerMouseEnter.bind(this)
        );
        this.unbindContainerMouseLeave = addEvent(
            container,
            'mouseleave',
            this.onContainerMouseLeave.bind(this)
        );
        if (!H.unbindDocumentMouseUp) {
            H.unbindDocumentMouseUp = addEvent(
                ownerDoc,
                'mouseup',
                this.onDocumentMouseUp.bind(this)
            );
        }

        // In case we are dealing with overflow, reset the chart position when
        // scrolling parent elements
        let parent = this.chart.renderTo.parentElement;
        while (parent && parent.tagName !== 'BODY') {
            addEvent(parent, 'scroll', (): void => {
                delete this.chartPosition;
            });
            parent = parent.parentElement;
        }

        if (H.hasTouch) {
            addEvent(
                container,
                'touchstart',
                this.onContainerTouchStart.bind(this),
                { passive: false }
            );
            addEvent(
                container,
                'touchmove',
                this.onContainerTouchMove.bind(this),
                { passive: false }
            );
            if (!H.unbindDocumentTouchEnd) {
                H.unbindDocumentTouchEnd = addEvent(
                    ownerDoc,
                    'touchend',
                    this.onDocumentTouchEnd.bind(this),
                    { passive: false }
                );
            }
        }
    }

    /**
     * Sets the index of the hovered chart and leaves the previous hovered
     * chart, to reset states like tooltip.
     *
     * @private
     * @function Highcharts.Pointer#setHoverChartIndex
     */
    public setHoverChartIndex(): void {
        const chart = this.chart;
        const hoverChart = H.charts[pick(H.hoverChartIndex, -1)];

        if (
            hoverChart &&
            hoverChart !== chart
        ) {
            hoverChart.pointer.onContainerMouseLeave({ relatedTarget: true } as any);
        }

        if (
            !hoverChart ||
            !hoverChart.mouseIsDown
        ) {
            H.hoverChartIndex = chart.index;
        }
    }

    /**
     * General touch handler shared by touchstart and touchmove.
     *
     * @private
     * @function Highcharts.Pointer#touch
     */
    public touch(e: PointerEvent, start?: boolean): void {
        var chart = this.chart,
            hasMoved,
            pinchDown,
            isInside;

        this.setHoverChartIndex();

        if ((e as any).touches.length === 1) {

            e = this.normalize(e);

            isInside = chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            );
            if (isInside && !chart.openMenu) {

                // Run mouse events and display tooltip etc
                if (start) {
                    this.runPointActions(e);
                }

                // Android fires touchmove events after the touchstart even if
                // the finger hasn't moved, or moved only a pixel or two. In iOS
                // however, the touchmove doesn't fire unless the finger moves
                // more than ~4px. So we emulate this behaviour in Android by
                // checking how much it moved, and cancelling on small
                // distances. #3450.
                if (e.type === 'touchmove') {
                    pinchDown = this.pinchDown;
                    hasMoved = pinchDown[0] ? Math.sqrt( // #5266
                        Math.pow(pinchDown[0].chartX - e.chartX, 2) +
                        Math.pow(pinchDown[0].chartY - e.chartY, 2)
                    ) >= 4 : false;
                }

                if (pick(hasMoved, true)) {
                    this.pinch(e);
                }

            } else if (start) {
                // Hide the tooltip on touching outside the plot area (#1203)
                this.reset();
            }

        } else if ((e as any).touches.length === 2) {
            this.pinch(e);
        }
    }

    /**
     * Returns true if the chart is set up for zooming by single touch and the
     * event is capable
     * @param {PointEvent} e
     *        Event object
     */
    private touchSelect(e: PointerEvent): boolean {
        return Boolean(
            (this.chart.options.chart as any).zoomBySingleTouch &&
            e.touches &&
            e.touches.length === 1
        );
    }

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
    public zoomOption(e: Event): void {
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
    }
}

H.Pointer = Pointer;

export default Pointer;
