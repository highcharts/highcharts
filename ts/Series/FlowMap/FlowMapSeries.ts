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
import SankeySeries from '../Sankey/SankeySeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

import U from '../../Core/Utilities.js';
import FlowMapPoint from './FlowMapPoint';
import SankeyColumnComposition from '../Sankey/SankeyColumnComposition.js';
import Point from '../../Core/Series/Point.js';
const {
    merge,
    extend
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
class FlowMapSeries extends SankeySeries { // Sankey?

    /* *
     *
     * Static properties
     *
     * */

    // public static compose = MapBubbleSeries.compose;

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
        }

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
     * Run translation operations for one link.
     * @private
     */
    public translateLink(point: FlowMapPoint): void {
        let chart = this.chart,
            fromPoint = chart.get(point.options.from || ''),
            toPoint = chart.get(point.options.to || ''),
            linkHeight = 10,
            options = this.options,
            nodeW = this.nodeWidth;
        const curve = point.options.curve || 0,
            weight = point.options.weight || 1;

        if (!(fromPoint instanceof Point) || !(toPoint instanceof Point)) {
            return;
        }

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

            // Weight vectior calculation
            let wX = dX,
                wY = dY,
                lenght = Math.sqrt(wX * wX + wY * wY);

            wX /= lenght;
            wY /= lenght;

            // Bezier curve create varying thickness when stacking in the path.
            // Fine-tune the middle width.

            // This looks reasonable
            const fineTune = 1 + Math.sqrt(curve * curve) * 0.25;
            wX *= weight * fineTune,
                wY *= weight * fineTune;

            // Finally, calculate the arc strength.
            let arcPointX = (mX + dX * curve),
                arcPointY = (mY + dY * curve);

            // First point
            let fromXToArc = arcPointX - fromX,
                fromYToArc = arcPointY - fromY,
                arcLenght = Math.sqrt(
                    fromXToArc * fromXToArc + fromYToArc * fromYToArc
                );

            fromXToArc /= arcLenght;
            fromYToArc /= arcLenght;

            fromXToArc *= weight;
            fromYToArc *= weight;

            tmp = fromXToArc;

            fromXToArc = fromYToArc;
            fromYToArc = -tmp;

            // Second point
            let toXToArc = arcPointX - toX,
                toYToArc = arcPointY - toY;

            toXToArc /= arcLenght;
            toYToArc /= arcLenght;

            toXToArc *= weight;
            toYToArc *= weight;

            tmp = toXToArc;

            toXToArc = toYToArc;
            toYToArc = -tmp;

            point.shapeArgs = {
                d: [
                    [
                        'M',
                        fromX + fromXToArc,
                        fromY + fromYToArc
                    ],
                    [
                        'Q',
                        arcPointX + wX,
                        arcPointY + wY,
                        toX - toXToArc,
                        toY - toYToArc
                    ],
                    [
                        'L',
                        toX + toXToArc,
                        toY + toYToArc
                    ],
                    [
                        'Q',
                        arcPointX - wX,
                        arcPointY - wY,
                        fromX - fromXToArc,
                        fromY - fromYToArc
                    ],
                    ['Z']
                ]
            };
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
            (chart.plotSizeY as any) - point.dlBox.y - linkHeight / 2,
            (chart.plotSizeX as any) - point.dlBox.x
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
