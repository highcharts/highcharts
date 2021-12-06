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

/* *
 *
 *  Imports
 *
 * */

import type TreegraphPoint from './TreegraphPoint';
import type TreegraphSeriesOptions from './TreegraphSeriesOptions';
import OrganizationSeries from '../Organization/OrganizationSeries.js';
import SankeySeries from '../Sankey/SankeySeries.js';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: {
            prototype: colProto
        },
        organization: {
            prototype: orgProto
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * treegraph series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.treegraph
 *
 * @augments Highcharts.Series
 */
class TreegraphSeries extends OrganizationSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A treegraph series.
     *
     *
     * @extends      plotOptions.treegraph
     * @product      highcharts
     * @optionparent plotOptions.treegraph
     */
    public static defaultOptions: TreegraphSeriesOptions = merge(OrganizationSeries.defaultOptions, {
        // nothing here yet
    });

    /* *
     *
     *  Static Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * General function to apply corner radius to a path - can be lifted to
     * renderer or utilities if we need it elsewhere.
     * @private
     */
    public static pointsToPath(
        from: any,
        to: any,
        factor: number
    ): SVGPath {
        const middleX = (from.x + to.x) / 2,
            middleY = (from.y + to.y) / 2,
            arcPointX1 = (from.x + middleX) / (2 - factor),
            arcPointY1 = (from.y + middleY) / (2 - factor),
            arcPointX2 = (middleX + to.x) / (2 + factor),
            arcPointY2 = (middleY + to.y) / (2 + factor);

        return [
            ['M', from.x, from.y],
            ['Q', arcPointX1, arcPointY1, middleX, middleY],
            ['Q', arcPointX2, arcPointY2, to.x, to.y]
        ];
    }

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public pointAttribs(
        point: TreegraphPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const series = this,
            attribs = orgProto.pointAttribs.call(this, point, state);

        if (point.isNode && series.options.nodeWidth) {
            attribs.r = series.options.nodeWidth / 2 || attribs.r;
        }

        return attribs;
    }

    public translateLink(point: TreegraphPoint): void {
        const fromNode = point.fromNode,
            toNode = point.toNode,
            crisp = Math.round(this.options.linkLineWidth as any) % 2 / 2,
            x1 = Math.floor((fromNode.shapeArgs as any).x) + crisp,
            hangingIndent: number = this.options.hangingIndent as any,
            toOffset = toNode.options.offset,
            percentOffset =
                /%$/.test(toOffset as any) && parseInt(toOffset as any, 10),
            linkOptions = (this.options as any).link,
            inverted = this.chart.inverted;

        let y1 = Math.floor((fromNode.shapeArgs as any).y) + crisp,
            x2 = Math.floor((toNode.shapeArgs as any).x) + crisp,
            y2 = Math.floor((toNode.shapeArgs as any).y) + crisp,
            xMiddle;

        xMiddle = Math.floor(
            x2 +
            (inverted ? 1 : -1) *
            (this.colDistance - this.nodeWidth) / 2
        ) + crisp;

        // Put the link on the side of the node when an offset is given. HR
        // node in the main demo.
        if (
            percentOffset &&
            (percentOffset >= 50 || percentOffset <= -50)
        ) {
            xMiddle = x2 = Math.floor(
                x2 + (inverted ? -0.5 : 0.5) *
                (toNode.shapeArgs as any).width
            ) + crisp;
            y2 = (toNode.shapeArgs as any).y;
            if (percentOffset > 0) {
                y2 += (toNode.shapeArgs as any).height;
            }
        }

        if (toNode.hangsFrom === fromNode) {
            if (this.chart.inverted) {
                y1 = Math.floor(
                    (fromNode.shapeArgs as any).y +
                    (fromNode.shapeArgs as any).height -
                    hangingIndent / 2
                ) + crisp;
                y2 = (
                    (toNode.shapeArgs as any).y +
                    (toNode.shapeArgs as any).height
                );
            } else {
                y1 = Math.floor(
                    (fromNode.shapeArgs as any).y +
                    hangingIndent / 2
                ) + crisp;

            }
            xMiddle = x2 = Math.floor(
                (toNode.shapeArgs as any).x +
                (toNode.shapeArgs as any).width / 2
            ) + crisp;
        }

        point.plotY = 1;
        point.shapeType = 'path';

        if (linkOptions && linkOptions.type === 'straight') {
            point.shapeArgs = {
                d: OrganizationSeries.curvedPath([
                    ['M', x1, y1],
                    ['L', x2, y2]
                ], linkOptions.width as any)
            };
        } else if (linkOptions && linkOptions.type === 'curved') {
            point.shapeArgs = {
                d: TreegraphSeries.pointsToPath({
                    x: x1,
                    y: y1
                }, {
                    x: x2,
                    y: y2
                }, 0.1)
            };
        } else {
            point.shapeArgs = {
                d: OrganizationSeries.curvedPath([
                    ['M', x1, y1],
                    ['L', xMiddle, y1],
                    ['L', xMiddle, y2],
                    ['L', x2, y2]
                ], this.options.linkRadius as any)
            };
        }
    }

    /**
     * Run translation operations for one node.
     * @private
     */
    public translateNode(
        node: any,
        column: TreegraphSeries.ColumnArray
    ): void {
        const translationFactor = this.translationFactor,
            chart = this.chart,
            options = this.options,
            sum = node.getSum(),
            height = Math.max(
                Math.round(sum * translationFactor),
                this.options.minLinkWidth as any
            ),
            crisp = Math.round(options.borderWidth as any) % 2 / 2,
            nodeOffset = column.offset(node, translationFactor),
            fromNodeTop = Math.floor(pick(
                (nodeOffset as any).absoluteTop,
                (
                    column.top(translationFactor) +
                    (nodeOffset as any).relativeTop
                )
            )) + crisp,
            left = Math.floor(
                this.colDistance * (node.column as any) +
                (options.borderWidth as any) / 2
            ) + crisp,
            nodeLeft = chart.inverted ? (chart.plotSizeX as any) - left : left,
            nodeRadius = Math.round(this.nodeWidth) / 2;

        node.sum = sum;
        // If node sum is 0, don't render the rect #12453
        if (sum) {
            // Draw the node
            node.shapeType = 'circle';

            node.nodeX = nodeLeft;
            node.nodeY = fromNodeTop;
            if (!chart.inverted) {
                node.shapeArgs = {
                    x: nodeLeft + nodeRadius,
                    y: fromNodeTop + nodeRadius,
                    r: nodeRadius
                };
            } else {
                node.shapeArgs = {
                    x: nodeLeft - nodeRadius * 2,
                    y: (chart.plotSizeY as any) - fromNodeTop - height,
                    width: node.options.height ||
                        options.height ||
                        nodeRadius * 2,
                    height: node.options.width || options.width || height
                };
            }

            node.shapeArgs.display = node.hasShape() ? '' : 'none';

            // Calculate data label options for the point
            node.dlOptions = SankeySeries.getDLOptions({
                level: (this.mapOptionsToLevel as any)[node.level],
                optionsPoint: node.options
            });

            // Pass test in drawPoints
            node.plotY = 1;

            // Set the anchor position for tooltips
            node.tooltipPos = chart.inverted ? [
                (chart.plotSizeY as any) -
                    node.shapeArgs.y -
                    node.shapeArgs.height / 2,
                (chart.plotSizeX as any) -
                    node.shapeArgs.x -
                    node.shapeArgs.width / 2
            ] : [
                node.shapeArgs.x + node.shapeArgs.width / 2,
                node.shapeArgs.y + node.shapeArgs.height / 2
            ];
        } else {
            node.dlOptions = {
                enabled: false
            };
        }
    }

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface TreegraphSeries {
    inverted?: boolean;
    pointClass: typeof TreegraphPoint;
}

extend(TreegraphSeries.prototype, {
    // alignDataLabel: colProto.alignDataLabel
});

/* *
 *
 *  Class Namespace
 *
 * */

namespace TreegraphSeries {
    export interface ColumnArray extends SankeySeries.ColumnArray {}
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        treegraph: typeof TreegraphSeries;
    }
}
SeriesRegistry.registerSeriesType('treegraph', TreegraphSeries);

/* *
 *
 *  Default Export
 *
 * */

export default TreegraphSeries;

/* *
 *
 *  API Options
 *
 * */

''; // gets doclets above into transpilat
