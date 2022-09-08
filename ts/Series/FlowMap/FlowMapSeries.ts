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
import SankeyColumnComposition from '../Sankey/SankeyColumnComposition.js';
import Point from '../../Core/Series/Point.js';
import SVGPath from '../../Core/Renderer/SVG/SVGPath';
import SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
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

    public static defaultOptions: FlowMapSeriesOptions = merge(SankeySeries.defaultOptions, {
        /**
         * DESCRIPTION
         *
         * @declare Highcharts.SeriesFlowMapSeriesDataLabelsOptionsObject
         *
         * @private
         */
        dataLabels: {
            enabled: false
        },

        /**
         * DESCRIPTION
         *
         * @declare Highcharts.SeriesFlowMapSeriesDataLabelsOptionsObject
         *
         * @private
         */
        keys: [
            'from',
            'to',
            'curveFactor',
            'weight',
            'growTowards',
            'markerEnd'
        ]

    } as FlowMapSeriesOptions); // Sankey?

    /* *
     *
     * Properties
     *
     * */

    public data: Array<FlowMapPoint> = void 0 as any;

    public options: FlowMapSeriesOptions = void 0 as any;

    public nodeColumns: Array<SankeyColumnComposition.ArrayComposition<FlowMapPoint>> = void 0 as any;

    public nodes: Array<FlowMapPoint> = void 0 as any;

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
        topCorner:[number, number],
        options: any): SVGPath {

        const width = options.width || 0,
            height = options.height || 0,
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
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
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
            nodeW = 0, // this.nodeWidth;
            pointOptions = point.options,
            markerEndOptions = pointOptions.markerEnd || this.options.markerEnd,
            weights: any = [],
            minWeight,
            maxWeight,
            newWeight;

        const curveFactor = pointOptions.curveFactor || 0,
            weight = pointOptions.weight || 1,
            // TO DO: correct in data array
            growTowards = pointOptions.growTowards,
            offset = markerEndOptions && markerEndOptions.height || 0;

        this.points.forEach((p): void =>
            weights.push(p.options.weight)
        );

        minWeight = Math.min(...weights);
        maxWeight = Math.max(...weights);

        // Get a new rescaled weight
        newWeight = this.scaleWeight(weight, minWeight, maxWeight, 5, 20);

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

        if (chart.inverted) {
            fromY = (chart.plotSizeY as any) - fromY;
            toY = (chart.plotSizeY || 0) - toY;
            nodeW = -nodeW;
            linkHeight = -linkHeight;
        }

        point.shapeType = 'path';
        point.linkBase = [
            fromY,
            fromY + linkHeight,
            toY,
            toY + linkHeight
        ];

        // Links going from `fromPoint` to `toPoint`.
        if (typeof toY === 'number') {
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
            wX *= newWeight * fineTune;
            wY *= newWeight * fineTune;

            // Ccalculate the arc strength.
            let arcPointX = (mX + dX * curveFactor),
                arcPointY = (mY + dY * curveFactor);

            // Calculate edge vectors in the from-point.
            let [fromXToArc, fromYToArc] =
                FlowMapSeries.normalize(arcPointX - fromX, arcPointY - fromY);

            tmp = fromXToArc;
            fromXToArc = fromYToArc;
            fromYToArc = -tmp;

            fromXToArc *= newWeight;
            fromYToArc *= newWeight;


            // Calculate edge vectors in the to-point.
            let [toXToArc, toYToArc] =
                FlowMapSeries.normalize(arcPointX - toX, arcPointY - toY);

            tmp = toXToArc;
            toXToArc = -toYToArc;
            toYToArc = tmp;

            toXToArc *= newWeight;
            toYToArc *= newWeight;

            // Shrink the starting edge and middle thickness to make it grow
            // towards the end.
            if (growTowards) {
                fromXToArc /= newWeight;
                fromYToArc /= newWeight;
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
        }

        // Place data labels in the middle
        point.dlBox = {
            x: fromX + (toX - fromX + nodeW) / 2,
            y: fromY + (toY - fromY) / 2,
            height: linkHeight,
            width: 0
        };

        // And set the tooltip anchor in the middle
        point.tooltipPos = chart.inverted ? [
            (chart.plotSizeY || 0) - point.dlBox.y - linkHeight / 2,
            (chart.plotSizeX || 0) - point.dlBox.x
        ] : [
            point.dlBox.x,
            point.dlBox.y + linkHeight / 2
        ];

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

        // const markerGroup = (
        //     (this as any)[this.specialGroup as any] ||
        //     this.markerGroup
        // );

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

''; // adds doclets above to transpiled file
