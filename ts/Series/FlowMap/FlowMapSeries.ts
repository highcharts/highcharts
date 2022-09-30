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
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sankey: SankeySeries
    }
} = SeriesRegistry;

import U from '../../Core/Utilities.js';
import FlowMapPoint from './FlowMapPoint';
import Point from '../../Core/Series/Point.js';
import SVGPath from '../../Core/Renderer/SVG/SVGPath';
const {
    extend,
    merge,
    addEvent
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
class FlowMapSeries extends SankeySeries {

    /* *
     *
     * Static properties
     *
     * */

    /**
     * A flowmap series is a series laid out on top of a map series allowing to
     * display route paths (e.g. flights or ships routes) or flows on a map. It
     * is drawing a link between two mappoints.
     *
     * @extends      plotOptions.column
     * @product      highmaps
     * @optionparent plotOptions.flowmap
     */
    public static defaultOptions: FlowMapSeriesOptions = merge(SankeySeries.defaultOptions, {
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
         * @declare Highcharts.SeriesFlowMapSeriesDataLabelsOptionsObject
         *
         * @extends series.mappoint.keys
         * @default ['from', 'to', 'weight']
         * @private
         */
        keys: ['from', 'to', 'weight']

    } as FlowMapSeriesOptions); // Sankey?

    /* *
     *
     * Properties
     *
     * */

    public data: Array<FlowMapPoint> = void 0 as any;

    public options: FlowMapSeriesOptions = void 0 as any;

    public points: Array<FlowMapPoint> = void 0 as any;

    /**
     *
     *  Functions
     *
     */

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
        options: FlowMapSeriesOptions
    ): SVGPath {
        const width = options.width || 0,
            type = options.type || 'arrow',
            [edgeX, edgeY] = this.normalize(
                rCorner[0] - lCorner[0], rCorner[1] - lCorner[1]
            );

        let path: SVGPath = [];

        // For arrow head calculation
        if (type === 'arrow') {
            let [x, y] = lCorner;
            x -= edgeX * width;
            y -= edgeY * width;
            path.push(['L', x, y]); // Left side of arrow head

            path.push(['L', topCorner[0], topCorner[1]]); // Tip of arrow head

            [x, y] = rCorner;
            x += edgeX * width;
            y += edgeY * width;
            path.push(['L', x, y]); // Right side of arrow head
        }

        // For mushroom head calculation
        if (type === 'mushroom') {
            const [xl, yl] = lCorner,
                [xr, yr] = rCorner,
                [xp, yp] = topCorner,
                xv = (xr - xl) / 2 + xl,
                yv = (yr - yl) / 2 + yl,
                xd = (xp - xv) * 2 + xv, // control point for curve
                yd = (yp - yv) * 2 + yv;

            let [x, y] = lCorner;
            x -= edgeX * width;
            y -= edgeY * width;
            path.push(['L', x, y]); // Left side of arrow head

            [x, y] = rCorner; // Right side of arrow head
            x += edgeX * width;
            y += edgeY * width;

            path.push(['Q', xd, yd, x, y]); // Curve to right side
        }

        return path;
    }

    /**
     * Return a scaled weight.
     * @private
     */
    public scaleWeight(
        number: number,
        inMin: number,
        inMax: number,
        outMin: number,
        outMax: number
    ): number {
        if (number === inMin) { // Prevent 0 division.
            return outMin;
        }

        if (number === inMax) { // Prevent 0 division.
            return outMax;
        }

        return (number - inMin) * (outMax - outMin) /
            (inMax - inMin) + outMin; // TODO: Handle 0 division here
    }

    /**
     * Run translation operations for one link.
     * @private
     */
    public translateLink(point: FlowMapPoint): void {

        let chart = this.chart,
            fromPoint = chart.get(point.options.from || ''),
            toPoint = chart.get(point.options.to || ''),
            linkHeight = 0, // 10,
            pointOptions = point.options,
            markerEndOptions = pointOptions.markerEnd || this.options.markerEnd,
            weights: number[] = [],
            currentMinWeight,
            currentMaxWeight,
            minWeight =
                (pointOptions.minWeight ||
                this.options.minWeight) || 5,
            maxWeight =
                (pointOptions.maxWeight ||
                this.options.maxWeight) || 20,
            scaledWeight;

        const curveFactor = pointOptions.curveFactor || 0,
            weight = pointOptions.weight || 1,
            growTowards = this.options.growTowards || pointOptions.growTowards,
            offset = markerEndOptions && markerEndOptions.height || 0;

        this.points.forEach((p): void => {
            weights.push(p.options.weight);
        });

        currentMinWeight = Math.min(...weights);
        currentMaxWeight = Math.max(...weights);

        // Get a new rescaled weight
        scaledWeight = this.scaleWeight(
            weight,
            currentMinWeight,
            currentMaxWeight,
            minWeight,
            maxWeight
        );

        // Connect to the linked parent point (in mappoint) to trigger
        // series redraw for the linked point (in flow)
        if (!(fromPoint instanceof Point) || !(toPoint instanceof Point)) {
            return;
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

        function dirtySeries(): void {
            point.series.isDirty = true;
        }

        // Save original point location for later in case there is an offset.
        point.oldFromPoint = fromPoint;
        point.oldToPoint = toPoint;

        let fromY = fromPoint.plotY || 0,
            toY = toPoint.plotY || 0,
            fromX = fromPoint.plotX || 0,
            toX = toPoint.plotX || 0;

        point.shapeType = 'path';
        point.linkBase = [
            fromY,
            fromY + linkHeight,
            toY,
            toY + linkHeight
        ];

        // Links going from `fromPoint` to `toPoint`.
        if (offset) { // Calculate ending point for the curve with offset.
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
            let arcPointX = (mX + dX * curveFactor),
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
            FlowMapSeries.normalize(arcPointX - fromX, arcPointY - fromY);

        tmp = fromXToArc;
        fromXToArc = fromYToArc;
        fromYToArc = -tmp;

        fromXToArc *= scaledWeight;
        fromYToArc *= scaledWeight;


        // Calculate edge vectors in the to-point.
        let [toXToArc, toYToArc] =
            FlowMapSeries.normalize(arcPointX - toX, arcPointY - toY);

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

        point.shapeArgs = {
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

        if (markerEndOptions && markerEndOptions.enabled &&
            point.shapeArgs.d) {

            const marker: SVGPath = FlowMapSeries.markerEndPath(
                [toX - toXToArc, toY - toYToArc],
                [toX + toXToArc, toY + toYToArc],
                [toPoint.plotX as number, toPoint.plotY as number],
                markerEndOptions
            );

            (point.shapeArgs.d as SVGPath).splice(2, 0,
                ...marker
            );
        }

        // Pass test in drawPoints. plotX/Y needs to be defined for dataLabels.
        // #15863
        point.y = point.plotY = 1;
        point.x = point.plotX = 1;

        if (!point.color) {
            point.color = fromPoint.color;
        }
    }

    public drawPoints(): void {
        // Draw flow graphics
        super.drawPoints.call(this);

        // Draw markers
        this.points.forEach((point): void => {
            if ((point as any).options.markerEnd2) { // if should draw marker

                // Render graphic
                const marker = this.chart.renderer.rect(100, 100, 1000, 100, 5)
                    .add(this.group); // add to the series group

                (marker.element as any).point = point; // mouse tracking

                const pointAttribs = this.pointAttribs(
                    point,
                    point.selected ? 'select' : void 0
                );

                // Simple PoC (at this moment) without animation
                marker.attr(pointAttribs);

                marker.addClass(point.getClassName(), true);
            }
        });
    }

    public translateNode(): void {
        return;
    }
}

/* *
 *
 *  Prototype properties
 *
 * */

interface FlowMapSeries {

}

extend(FlowMapSeries.prototype, {
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
 * @requires  modules/sankey
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
 * @extends   series.sankey.data
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
 * The pixel height of the marker-end symbol.
 *
 * @type      {number}
 * @product   highmaps
 * @apioption series.flowmap.data.markerEnd.height
 */

/**
 * The pixel width of the marker-end symbol.
 *
 * @type      {number}
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

''; // adds doclets above to transpiled file
