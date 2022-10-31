/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson, Piotr Madej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *  Imports
 *
 * */

import type FlowMapSeriesOptions from './FlowMapSeriesOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import FlowMapPoint from './FlowMapPoint.js';
import MapSeries from '../Map/MapSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    series: {
        prototype: {
            pointClass: Point
        }
    },
    seriesTypes: {
        column: ColumnSeries,
        mapline: MapLineSeries
    }
} = SeriesRegistry;
import { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import U from '../../Core/Utilities.js';
const {
    defined,
    extend,
    merge,
    pick,
    addEvent,
    arrayMax,
    arrayMin
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {

    }
}

/**
 * The flowmap series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.flowmap
 *
 * @augments Highcharts.Series
 */
class FlowMapSeries extends MapLineSeries {

    /* *
     *
     *  Static properties
     *
     * */

    /**
     * A flowmap series is a series laid out on top of a map series allowing to
     * display route paths (e.g. flights or ships routes) or flows on a map. It
     * is drawing a link between two mappoints.
     *
     * @extends      plotOptions.mapline
     * @product      highmaps
     * @requires     modules/flowmap
     * @optionparent plotOptions.flowmap
     */
    public static defaultOptions: FlowMapSeriesOptions = merge(MapLineSeries.defaultOptions, {
        /**
         * Always disabled, excluded from API.
         *
         * @declare Highcharts.SeriesFlowMapSeriesDataLabelsOptionsObject
         *
         * @private
         */
        dataLabels: {
            enabled: false
        },

        /**
         * Minimum flow map links weight. It will automatically
         * size between the minWeight and maxWeight.
         *
         * @declare Highcharts.SeriesFlowMapSeriesOptionsObject
         * @type    {number}
         * @default 5
         * @product highcharts
         * @apioption series.flowmap.minWeight
         */
        minWeight: 5,

        /**
         * Maximum flow map links weight. It will automatically
         * size between the minWeight and maxWeight.
         *
         * @declare Highcharts.SeriesFlowMapSeriesOptionsObject
         * @type    {number}
         * @default 25
         * @product highcharts
         * @apioption series.flowmap.minWeight
         */
        maxWeight: 25,

        /**
         *
         * @extends series.mappoint.keys
         * @default ['from', 'to', 'weight']
         * @private
         */
        keys: ['from', 'to', 'weight'],

        tooltip: {
            /**
             * A callback for defining the format for in the chart's
             * tooltip for flowmap links.
             *
             * @type      {Highcharts.FormatterCallbackFunction}
             * @since     recent
             * @apioption plotOptions.flowmap.tooltip
             */

            /**
             * Whether the tooltip should follow the pointer or stay fixed on
             * the item.
             */

            headerFormat:
            '<span style="font-size: 10px">{series.name}</span><br/>',
            pointFormat: '{point.options.from} \u2192 {point.options.to}: <b>{point.weight}</b><br/>'
        },

        /**
         * The weight of the link determines how thick it will be compared to
         * other weights.
         *
         * @declare     Highcharts.SeriesFlowMapSeriesOptionsObject
         * @type        {number}
         * @product     highcharts
         * @apioption   series.flowmap.weight
         */
        weight: void 0,

        /**
         * The arrow type and size properties.
         *
         * @declare Highcharts.SeriesFlowMapSeriesOptionsObject
         * @type    {number}
         * @default {enabled: true, height: '40%', width: '40%'
        }
         * @product highcharts
         * @apioption series.flowmap.markerEnd
         */
        markerEnd: {
            enabled: true,
            height: '40%',
            width: '40%'
        }

    } as FlowMapSeriesOptions);

    /* *
     *
     *  Static Function
     *
     * */

    /**
     * Get vector length.
     * @private
     */
    public static getLength(x: number, y: number): number {
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Return a normalized vector.
     * @private
     */
    public static normalize(x: number, y: number): Array<number> {
        const length = FlowMapSeries.getLength(x, y);
        return [x / length, y / length];
    }

    /**
     * Return an SVGPath for markerEnd.
     * @private
     */
    public static markerEndPath(
        lCorner: [number, number],
        rCorner: [number, number],
        topCorner: [number, number],
        options: MarkerEndOptions
    ): SVGPath {
        let width = options.width || 0;
        const type = options.markerType || 'arrow',
            [edgeX, edgeY] = this.normalize(
                rCorner[0] - lCorner[0],
                rCorner[1] - lCorner[1]
            );

        if (typeof width === 'string') {
            const percentage = parseInt(width, 10);
            width = this.getLength(
                rCorner[0] - lCorner[0],
                rCorner[1] - lCorner[1]) * percentage / 100;
        }

        let path: SVGPath = [];

        // For arrow head calculation
        if (type === 'arrow') {

            // Left side of arrow head
            let [x, y] = lCorner;
            x -= edgeX * width;
            y -= edgeY * width;
            path.push(['L', x, y]);

            path.push(['L', topCorner[0], topCorner[1]]); // Tip of arrow head

            // Right side of arrow head
            [x, y] = rCorner;
            x += edgeX * width;
            y += edgeY * width;
            path.push(['L', x, y]);
        }

        // For mushroom head calculation
        if (type === 'mushroom') {
            let [xLeft, yLeft] = lCorner,
                [xRight, yRight] = rCorner;
            const [xTop, yTop] = topCorner,
                xMid = (xRight - xLeft) / 2 + xLeft,
                yMid = (yRight - yLeft) / 2 + yLeft,
                xControl = (xTop - xMid) * 2 + xMid, // control point for curve
                yControl = (yTop - yMid) * 2 + yMid;

            // Left side of arrow head
            xLeft -= edgeX * width;
            yLeft -= edgeY * width;
            path.push(['L', xLeft, yLeft]);

            // Right side of arrow head
            xRight += edgeX * width;
            yRight += edgeY * width;

            // Curve from left to right
            path.push(['Q', xControl, yControl, xRight, yRight]);
        }

        return path;
    }

    /* *
     *
     * Properties
     *
     * */

    public data: Array<FlowMapPoint> = void 0 as any;

    public options: FlowMapSeriesOptions = void 0 as any;

    public points: Array<FlowMapPoint> = void 0 as any;

    public smallestWeight?: number = void 0 as any;

    public greatestWeight?: number = void 0 as any;

    /**
     *
     *  Functions
     *
     */

    /**
     *
     * @private
     */
    public generatePoints(): void {
        super.generatePoints.call(this);

        let weights: Array<number|undefined> = [];

        this.points.forEach((p): void => {
            if (p.options.weight || this.options.weight) {
                weights.push(p.options.weight || this.options.weight);
            }
        });

        this.smallestWeight = arrayMin(weights);
        this.greatestWeight = arrayMax(weights);
    }

    /**
     * Get a scaled weight.
     * @private
     */
    public scaleWeight(point: FlowMapPoint): number {
        const weight = point.options.weight || this.options.weight,
            smallestWeight = this.smallestWeight,
            greatestWeight = this.greatestWeight;

        if (!defined(weight) || !smallestWeight || !greatestWeight) {
            return 0;
        }

        const minWeightLimit = this.options.minWeight,
            maxWeightLimit = this.options.maxWeight;

        return (weight - smallestWeight) * (maxWeightLimit - minWeightLimit) /
            ((greatestWeight - smallestWeight) || 1) + minWeightLimit;
    }

    public pointAttribs(
        point: FlowMapPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const attrs =
            MapSeries.prototype.pointAttribs.call(this, point, state);

        attrs.fill = point.options.fillColor || this.options.fillColor;
        attrs['fill-opacity'] = point.options.fillOpacity;

        attrs.opacity = (point.options as any).opacity;

        return attrs;
    }

    /**
     * Run translation operations for one link.
     * @private
     */
    public drawPoints(): void {
        this.points.forEach((point): void => {
            const chart = this.chart,
                fromPoint = chart.get(point.options.from || ''),
                toPoint = chart.get(point.options.to || '');

            // Connect to the linked parent point (in mappoint) to trigger
            // series redraw for the linked point (in flow)
            if (
                !(fromPoint instanceof Point) ||
                !(toPoint instanceof Point) ||
                // Don't draw point if weight is not valid
                !this.scaleWeight(point)
            ) {
                return;
            }

            function dirtySeries(): void {
                point.series.isDirty = true;
            }

            // We have from and to & before the proceed
            if (toPoint !== point.oldToPoint || !point.oldToPoint) {
                if (point.removeEventForToPoint) {
                    point.removeEventForToPoint();
                }

                point.removeEventForToPoint = addEvent(
                    toPoint, 'update', dirtySeries
                );
            }

            if (fromPoint !== point.oldFromPoint || !point.oldFromPoint) {
                if (point.removeEventForFromPoint) {
                    point.removeEventForFromPoint();
                }

                point.removeEventForFromPoint = addEvent(
                    fromPoint, 'update', dirtySeries
                );
            }

            // Save original point location.
            point.oldFromPoint = fromPoint;
            point.oldToPoint = toPoint;

            // Calculate point shape
            point.shapeType = 'path';
            point.shapeArgs = this.getPointShapeArgs(point);

            // plotX and plotY need to be defined for dataLabels. (#15863)
            point.y = point.plotY = 1;
            point.x = point.plotX = 1;

            if (!point.color) {
                point.color = fromPoint.color;
            }
        });

        // Draw the points
        ColumnSeries.prototype.drawPoints.apply(this);
    }

    public getPointShapeArgs(point: FlowMapPoint): SVGAttributes {
        const fromPoint = point.oldFromPoint,
            toPoint = point.oldToPoint,
            // Get a new rescaled weight
            scaledWeight = this.scaleWeight(point);

        if (!fromPoint || !toPoint) {
            return {};
        }

        const pointOptions = point.options,
            markerEndOptions = pick(
                pointOptions.markerEnd,
                this.options.markerEnd
            ),
            curveFactor = pointOptions.curveFactor || 0,
            growTowards = pick(
                pointOptions.growTowards,
                this.options.growTowards
            ),
            fromX = fromPoint.plotX || 0,
            fromY = fromPoint.plotY || 0;

        let toX = toPoint.plotX || 0,
            toY = toPoint.plotY || 0,
            offset = markerEndOptions &&
            markerEndOptions.enabled && markerEndOptions.height || 0;

        // An offset makes room for arrows if they are specified.
        if (offset) {
            // Prepare offset if it's a percentage by converting to number.
            if (typeof offset === 'string') {
                const percentage = parseInt(offset, 10);

                offset = scaledWeight * percentage * 4 / 100;
            }

            let dX = toX - fromX,
                dY = toY - fromY;

            dX *= 0.5;
            dY *= 0.5;

            let mX = fromX + dX,
                mY = fromY + dY;

            let tmp = dX;

            dX = dY;
            dY = -tmp;

            // Calculate the arc strength.
            const arcPointX = (mX + dX * curveFactor),
                arcPointY = (mY + dY * curveFactor);

            let [offsetX, offsetY] =
                FlowMapSeries.normalize(arcPointX - toX, arcPointY - toY);

            offsetX *= offset;
            offsetY *= offset;

            toX += offsetX;
            toY += offsetY;
        }

        // Vector between the points.
        let dX = toX - fromX,
            dY = toY - fromY;

        // Vector is halved.
        dX *= 0.5;
        dY *= 0.5;

        // Vector points exactly between the points.
        let mX = fromX + dX,
            mY = fromY + dY;

        // Rotating the halfway distance by 90 anti-clockwise.
        // We can then use this to create an arc.
        let tmp = dX;
        dX = dY;
        dY = -tmp;

        // Weight vector calculation for the middle of the curve.
        let [wX, wY] = FlowMapSeries.normalize(dX, dY);

        // The `fineTune` prevents an obvious mismatch along the curve.
        const fineTune = 1 + Math.sqrt(curveFactor * curveFactor) * 0.25;
        wX *= scaledWeight * fineTune;
        wY *= scaledWeight * fineTune;

        // Ccalculate the arc strength.
        let arcPointX = (mX + dX * curveFactor),
            arcPointY = (mY + dY * curveFactor);

        // Calculate edge vectors in the from-point.
        let [fromXToArc, fromYToArc] =
            FlowMapSeries.normalize(
                arcPointX - fromX,
                arcPointY - fromY
            );

        tmp = fromXToArc;
        fromXToArc = fromYToArc;
        fromYToArc = -tmp;

        fromXToArc *= scaledWeight;
        fromYToArc *= scaledWeight;


        // Calculate edge vectors in the to-point.
        let [toXToArc, toYToArc] =
            FlowMapSeries.normalize(
                arcPointX - toX,
                arcPointY - toY
            );

        tmp = toXToArc;
        toXToArc = -toYToArc;
        toYToArc = tmp;

        toXToArc *= scaledWeight;
        toYToArc *= scaledWeight;

        // Shrink the starting edge and middle thickness to make it grow
        // towards the end.
        if (growTowards) {
            fromXToArc /= scaledWeight;
            fromYToArc /= scaledWeight;
            wX /= 4;
            wY /= 4;
        }

        const shapeArgs: SVGAttributes = {
            d: [
                [
                    'M',
                    fromX - fromXToArc,
                    fromY - fromYToArc
                ],
                [
                    'Q',
                    arcPointX - wX,
                    arcPointY - wY,
                    toX - toXToArc,
                    toY - toYToArc
                ],
                // This is where markerEnd will be spliced to.
                [
                    'L',
                    toX + toXToArc,
                    toY + toYToArc
                ],
                [
                    'Q',
                    arcPointX + wX,
                    arcPointY + wY,
                    fromX + fromXToArc,
                    fromY + fromYToArc
                ],
                ['Z']
            ]
        };

        if (markerEndOptions && markerEndOptions.enabled && shapeArgs.d) {
            const marker: SVGPath = FlowMapSeries.markerEndPath(
                [toX - toXToArc, toY - toYToArc],
                [toX + toXToArc, toY + toYToArc],
                [toPoint.plotX as number, toPoint.plotY as number],
                markerEndOptions
            );

            (shapeArgs.d as SVGPath).splice(2, 0,
                ...marker
            );
        }

        return shapeArgs;
    }
}

/* *
 *
 *  Prototype properties
 *
 * */

interface FlowMapSeries {
    pointClass: typeof FlowMapPoint;
}

// TODO: This is a  triplicate of MarkerEndOptions in FlowMapPointOptions
interface MarkerEndOptions {
    markerType?: string,
    enabled?: boolean,
    width: number | string,
    height: number | string,
}

extend(FlowMapSeries.prototype, {
    pointClass: FlowMapPoint,
    // Make it work on zoom or pan
    useMapGeometry: true
});

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        flowmap: typeof FlowMapSeries;
    }
}

SeriesRegistry.registerSeriesType('flowmap', FlowMapSeries);

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeries;

/* *
 *
 *  API options
 *
 * */

/**
 * A `flowmap` series. If the [type](#series.flowmap.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.flowmap
 * @excluding allAreas, allowPointSelect, boostBlending, boostThreshold,
 * borderColor, borderWidth, dashStyle, dataLabels, dragDrop, joinBy, mapData,
 * negativeColor, onPoint, shadow, showCheckbox
 * @product   highmaps
 * @apioption series.flowmap
 */

/**
 * An array of data points for the series. For the `flowmap` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 6 values. In this case, the values correspond
 *     to `from, to, weight`. Example:
 *     ```js
 *     data: [
 *         ["Point 1", "Point 2", 4],
 *     ]
 *     ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 *     few settings, see the complete options set below.
 *
 *     ```js
 *         data: [{
 *             from: "Point 1",
 *             to: "Point 2",
 *             curveFactor: 0.4,
 *             weight: 5,
 *             growTowards: true,
 *             markerEnd: {
 *                 enabled: true,
 *                 height: 15,
 *                 width: 8
 *             }
 *         }]
 *     ```
 *
 * @type      {Array<number|null|*>}
 * @excluding labelrank, outgoing
 * @product   highmaps
 * @apioption series.flowmap.data
 */

/**
 * Higher numbers makes the links more curved. A `curveFactor` of 0 makes the
 * lines straight.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {number}
 * @product   highmaps
 * @apioption series.flowmap.data.curveFactor
 */

/**
 * If set to `true`, the line will grow towards its end.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {boolean}
 * @product   highmaps
 * @apioption series.flowmap.data.growTowards
 */

/**
 * The marker-end defines the arrowhead that will be drawn at the final vertex
 * of the given path.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {*|null}
 * @product   highmaps
 * @apioption series.flowmap.data.markerEnd
 */

/**
 * Enable or disable the marker-end on the series.
 *
 * @type      {boolean}
 * @product   highmaps
 * @apioption series.flowmap.data.markerEnd.enabled
 */

/**
 * The width of the marker-end symbol in pixels or percentage.
 *
 * @type      {number | string}
 * @product   highmaps
 * @apioption series.flowmap.data.markerEnd.height
 */

/**
 * The width of the marker-end symbol in pixels or percentage.
 *
 * @type      {number | string}
 * @product   highmaps
 * @apioption series.flowmap.data.markerEnd.width
 */

/**
 * The weight of the link.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {number}
 * @product   highmaps
 * @apioption series.flowmap.data.weight
 */

/**
 * The weight of the link determines how thick it will be compared to
 * other weights.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {number}
 * @product   highmaps
 * @apioption series.flowmap.weight
 */

''; // adds doclets above to transpiled file
