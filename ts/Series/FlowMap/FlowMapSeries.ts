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
import type { MarkerEndOptions } from './FlowMapPointOptions';
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
     * @excluding    allAreas, allowPointSelect, boostBlending, boostThreshold,
     * borderColor, borderWidth, dashStyle, dataLabels, dragDrop, joinBy,
     * mapData, negativeColor, onPoint, shadow, showCheckbox
     * @product      highmaps
     * @requires     modules/flowmap
     * @optionparent plotOptions.flowmap
     */
    public static defaultOptions: FlowMapSeriesOptions = merge(MapLineSeries.defaultOptions, {
        /**
         * The `curveFactor` for all links if not specified.
         * A `curveFactor` with a higher value than 0 will curve the link clockwise.
         * A negative value will curve the link counter clockwise.
         * If the value is 0 the link will be straight.
         *
         * @type      {number}
         */
        curveFactor: void 0,

        dataLabels: {
            enabled: false
        },

        /**
         * The opacity of the color fill for all links.
         *
         * @type      {number}
         * @default   0.5
         */
        fillOpacity: 0.5,

        /**
         * An array specifying which option maps to which key in the data point
         * array. This makes it convenient to work with unstructured data
         * arrays from different sources.
         *
         * @default ['from', 'to', 'weight']
         */
        keys: ['from', 'to', 'weight'],

        /**
         * A `markerEnd` creates an arrow symbol
         * indicating the direction of flow at the destination. Specifying a
         * `markerEnd` here will create one for each link.
         *
         * @declare Highcharts.SeriesFlowMapSeriesOptionsObject
         * @since   next
         */
        markerEnd: {
            /**
             * Enable or disable the `markerEnd`.
             *
             * @since next
             * @type  {boolean}
             */
            enabled: true,
            /**
             * Height of the `markerEnd`. Can be a number in pixels
             * or a percentage based on the weight of the link.
             *
             * @since next
             * @type  {number|string}
             */
            height: '40%',
            /**
             * Width of the `markerEnd`. Can be a number in pixels
             * or a percentage based on the weight of the link.
             *
             * @since next
             * @type  {number|string}
             */
            width: '40%',
            /**
             * Change the shape of the `markerEnd`.
             * Can be `arrow` or `mushroom`.
             *
             * @type      {string}
             * @default arrow
             */
            markerType: 'arrow'
        },

        /**
         * Maximum weight of a link. The weight of a link is mapped between
         * `maxWeight` and `minWeight`.
         *
         * @since   next
         */
        maxWeight: 25,

        /**
         * Minimum weight of a link. The weight of a link is mapped between
         * `maxWeight` and `minWeight`.
         *
         * @declare Highcharts.SeriesFlowMapSeriesOptionsObject
         * @since   next
         */
        minWeight: 5,

        tooltip: {
            /**
             * The HTML of the flowmaps's route description in the tooltip.
             * It consists of the `headerFormat` and `pointFormat`, which can be
             * edited. Variables are enclosed by curly brackets. Available
             * variables are `series.name`, `point.options.from`,
             * `point.options.to`, `point.weight` and other properties on the
             * same form.
             */
            headerFormat: '<span style="font-size: 10px">{series.name}</span><br/>',
            pointFormat: '{point.options.from} \u2192 {point.options.to}: <b>{point.weight}</b><br/>'
        },

        /**
         * The weight of the link determines how thick it will be compared to
         * other weights.
         *
         * @type    {number}
         * @since   next
         */
        weight: void 0

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
        const length = this.getLength(x, y);
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

        // For arrow head calculation.
        if (type === 'arrow') {
            // Left side of arrow head.
            let [x, y] = lCorner;
            x -= edgeX * width;
            y -= edgeY * width;
            path.push(['L', x, y]);

            path.push(['L', topCorner[0], topCorner[1]]); // Tip of arrow head.

            // Right side of arrow head.
            [x, y] = rCorner;
            x += edgeX * width;
            y += edgeY * width;
            path.push(['L', x, y]);
        }

        // For mushroom head calculation.
        if (type === 'mushroom') {
            let [xLeft, yLeft] = lCorner,
                [xRight, yRight] = rCorner;
            const [xTop, yTop] = topCorner,
                xMid = (xRight - xLeft) / 2 + xLeft,
                yMid = (yRight - yLeft) / 2 + yLeft,
                xControl = (xTop - xMid) * 2 + xMid, // control point for curve.
                yControl = (yTop - yMid) * 2 + yMid;

            // Left side of arrow head.
            xLeft -= edgeX * width;
            yLeft -= edgeY * width;
            path.push(['L', xLeft, yLeft]);

            // Right side of arrow head.
            xRight += edgeX * width;
            yRight += edgeY * width;

            // Curve from left to right.
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

    public centerOfPoints?: object = void 0 as any;

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
            /* TODO:
                1) const from = this.chart.get(p.options.from || '');
                averageX += from.x
                averageY += from.y

                ...
                2) After this loop:
                store the divided result in this.centerOfPoints{x, y}
                3) use it in autoCurve() params.
            */
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

    /**
     * Automatically calculate the optimal curve based on a reference point.
     * @private
     */
    public autoCurve(
        fromX: number, fromY: number,
        toX: number, toY: number,
        centerX: number, centerY:number): number {

        const linkV = { // Direction of flow link
                x: (toX - fromX),
                y: (toY - fromY)
            },
            half = { // Point halfway along the link
                x: (toX - fromX) / 2 + fromX,
                y: (toY - fromY) / 2 + fromY
            },
            centerV = { // Vecter from center to halfway
                x: half.x - centerX,
                y: half.y - centerY
            };

        // Dot product and determinant
        const dot = linkV.x * centerV.x + linkV.y * centerV.y,
            det = linkV.x * centerV.y - linkV.y * centerV.x;

        // Calculate the angle and base the curveFactor on it.
        let angle = Math.atan2(det, dot),
            angleDeg = angle * 180 / Math.PI;

        if (angleDeg < 0) {
            angleDeg = 360 + angleDeg;
        }

        angle = angleDeg * Math.PI / 180;

        return -Math.sin(angle) * 0.7; // Gives a more subtle result.
    }

    /**
     * Get point attributes.
     * @private
     */
    public pointAttribs(
        point: FlowMapPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const attrs =
            MapSeries.prototype.pointAttribs.call(this, point, state);

        attrs.fill = pick(
            point.options.fillColor,
            point.options.color,
            this.options.fillColor === 'none' ? null : this.options.fillColor,
            this.color
        );

        attrs['fill-opacity'] = pick(
            point.options.fillOpacity,
            this.options.fillOpacity
        );

        if (point.options.opacity) {
            attrs.opacity = point.options.opacity;
        }

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
            // series redraw for the linked point (in flow).
            if (
                !(fromPoint instanceof Point) ||
                !(toPoint instanceof Point) ||
                // Don't draw point if weight is not valid.
                !this.scaleWeight(point)
            ) {
                return;
            }

            function dirtySeries(): void {
                point.series.isDirty = true;
            }

            // We have from and to & before the proceed.
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

            // When updating point from null to normal value, set a real color
            // (don't keep nullColor).
            point.color = pick(
                point.options.color,
                point.series.color
            );
        });

        // Draw the points.
        ColumnSeries.prototype.drawPoints.apply(this);
    }

    public getPointShapeArgs(point: FlowMapPoint): SVGAttributes {
        const fromPoint = point.oldFromPoint,
            toPoint = point.oldToPoint,
            // Get a new rescaled weight.
            scaledWeight = this.scaleWeight(point);

        if (!fromPoint || !toPoint) {
            return {};
        }

        const pointOptions = point.options,
            markerEndOptions = merge(
                this.options.markerEnd,
                pointOptions.markerEnd
            ),
            growTowards = pick(
                pointOptions.growTowards,
                this.options.growTowards
            ),
            fromX = fromPoint.plotX || 0,
            fromY = fromPoint.plotY || 0;

        let toX = toPoint.plotX || 0,
            toY = toPoint.plotY || 0,
            curveFactor = pick(
                pointOptions.curveFactor,
                this.options.curveFactor
            ),
            offset = markerEndOptions &&
            markerEndOptions.enabled && markerEndOptions.height || 0;

        if (!defined(curveFactor)) { // Automate the curveFactor value.
            curveFactor = this.autoCurve(
                fromX, fromY, toX, toY,
                this.chart.plotWidth / 2, this.chart.plotHeight / 2
            );
        }

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

        // Calculate the arc strength.
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
            d: [[
                'M',
                fromX - fromXToArc,
                fromY - fromYToArc
            ], [
                'Q',
                arcPointX - wX,
                arcPointY - wY,
                toX - toXToArc,
                toY - toYToArc
            ], [ // The markerEnd will be spliced between these arrays.
                'L',
                toX + toXToArc,
                toY + toYToArc
            ], [
                'Q',
                arcPointX + wX,
                arcPointY + wY,
                fromX + fromXToArc,
                fromY + fromYToArc
            ], [
                'Z'
            ]]
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

extend(FlowMapSeries.prototype, {
    pointClass: FlowMapPoint,
    // Make it work on zoom or pan.
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
 * 1.  An array of arrays with options as values. In this case,
 *     the values correspond to `from, to, weight`. Example:
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
 * @apioption series.flowmap.data
 */

/**
 * A `curveFactor` with a higher value than 0 will curve the link clockwise.
 * A negative value will curve the link counter clockwise.
 * If the value is 0 the link will be straight.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {number}
 * @apioption series.flowmap.data.curveFactor
 */

/**
 * The fill color of an individual link.
 *
 *
 * @type      {string}
 * @apioption series.flowmap.data.fillColor
 */

/**
 * ID referencing a map point holding coordinates of the link origin.
 *
 *
 * @type      {string}
 * @apioption series.flowmap.data.from
 */

/**
 * ID referencing a map point holding coordinates of the link destination.
 *
 *
 * @type      {string}
 * @apioption series.flowmap.data.to
 */

/**
 * The opacity of the link color fill.
 *
 * @type      {number}
 * @apioption series.flowmap.data.fillOpacity
 */

/**
 * If set to `true`, the line will grow towards its end.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {boolean}
 * @apioption series.flowmap.data.growTowards
 */

/**
 * Specifying a `markerEnd` here will create an arrow symbol
 * indicating the direction of flow at the destination of one individual link.
 * If one has been previously speficied at the higher level option it will be
 * overridden for the current link.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {*|null}
 * @apioption series.flowmap.data.markerEnd
 */

/**
 * Enable or disable the `markerEnd`.
 *
 * @type      {boolean}
 * @apioption series.flowmap.data.markerEnd.enabled
 */

/**
 * Height of the `markerEnd`. Can be a number in pixels
 * or a percentage based on the weight of the link.
 *
 * @type      {number|string}
 * @apioption series.flowmap.data.markerEnd.height
 */

/**
 * Width of the `markerEnd`. Can be a number in pixels
 * or a percentage based on the weight of the link.
 *
 * @type      {number|string}
 * @apioption series.flowmap.data.markerEnd.width
 */

/**
 * Change the shape of the `markerEnd`. Can be `arrow` or `mushroom`.
 *
 * @type      {string}
 * @apioption series.flowmap.data.markerEnd.markerType
 */

/**
 * The opacity of an individual link.
 *
 * @type      {number}
 * @apioption series.flowmap.data.opacity
 */

/**
 * The weight of a link determines its thickness compared to
 * other links.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {number}
 * @apioption series.flowmap.data.weight
 */

/**
 * The fill color of all the links
 *
 *
 * @type      {string}
 * @apioption series.flowmap.fillColor
 */

/**
 * The [id](#series.id) of another series to link to. Additionally,
 * the value can be ":previous" to link to the previous series. When
 * two series are linked, only the first one appears in the legend.
 * Toggling the visibility of this also toggles the linked series,
 * which is necessary for operations such as zoom or updates on the
 * flowmap series.
 *
 * @type      {string}
 * @apioption series.flowmap.linkedTo
 */

/**
 * The opacity of all the links.
 *
 *
 * @type      {number}
 * @apioption series.flowmap.opacity
 */

/**
 * The weight for all links with unspecified weights.
 * The weight of a link determines its thickness compared to
 * other links.
 *
 * @sample {highmaps} maps/demo/flowmap-ship-route/
 *         Example ship route
 *
 * @type      {number}
 * @apioption series.flowmap.weight
 */

''; // adds doclets above to transpiled file
