/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson
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

import type FlowMapSeriesOptions from './FlowMapSeriesOptions.js';
import SankeySeries from '../Sankey/SankeySeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

import U from '../../Core/Utilities.js';
import FlowMapPoint from './FlowMapPoint.js';
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

    public static defaultOptions: FlowMapSeriesOptions = SankeySeries.defaultOptions; // Sankey?

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
            curvy = (
                (chart.inverted ? -this.colDistance : this.colDistance) *
                (options.curveFactor as any)
            ),
            nodeW = this.nodeWidth,
            outgoing = point.outgoing;

        if (!(fromPoint instanceof Point) || !(toPoint instanceof Point)) {
            return;
        }

        let fromY = fromPoint.plotY || 0,
            toY = toPoint.plotY || 0,
            nodeLeft = fromPoint.plotX || 0,
            right = toPoint.plotX || 0;

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

        // Links going from left to right
        if (typeof toY === 'number') {
            point.shapeArgs = {
                d: [
                    ['M', nodeLeft + nodeW, fromY],
                    [
                        'C',
                        nodeLeft + nodeW + curvy,
                        fromY,
                        right - curvy,
                        toY,
                        right,
                        toY
                    ],
                    ['L', right + (outgoing ? nodeW : 0), toY + linkHeight / 2],
                    ['L', right, toY + linkHeight],
                    [
                        'C',
                        right - curvy,
                        toY + linkHeight,
                        nodeLeft + nodeW + curvy,
                        fromY + linkHeight,
                        nodeLeft + nodeW, fromY + linkHeight
                    ],
                    ['Z']
                ]
            };
        }

        // Place data labels in the middle
        point.dlBox = {
            x: nodeLeft + (right - nodeLeft + nodeW) / 2,
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
