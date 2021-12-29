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
import type TreegraphSeriesOptions from './TreegraphSeriesOptions.js';
import OrganizationSeries from '../Organization/OrganizationSeries.js';
import SankeySeries from '../Sankey/SankeySeries.js';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: { prototype: colProto },
        organization: { prototype: orgProto },
        sankey: { prototype: sankeyProto }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
import { Palette } from '../../Core/Color/Palettes';
const { extend, merge, pick } = U;

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
     * @exclude       linkColor, linkLineWidth, linkRadius
     * @product      highcharts
     * @requires     modules/sankey
     * @requires     modules/organization
     * @requires     modules/treegraph
     * @optionparent plotOptions.treegraph
     */
    public static defaultOptions: TreegraphSeriesOptions = merge(
        OrganizationSeries.defaultOptions,
        {
            radius: 10,
            alignNodes: 'right',
            minLinkWidth: 1,
            borderWidth: 1,
            link: {
                type: 'straight',
                width: 1,
                color: Palette.neutralColor80
            }
        }
    );

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
    public static pointsToPath(from: any, to: any, factor: number): SVGPath {
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

    public data: Array<TreegraphPoint> = void 0 as any;

    public options: TreegraphSeriesOptions = void 0 as any;

    public points: Array<TreegraphPoint> = void 0 as any;
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

        if (point.isNode) {
            attribs.r =
                point.options.radius || series.options.radius || attribs.r;
        }

        return attribs;
    }

    public translateLink(point: TreegraphPoint): void {
        const fromNode = point.fromNode,
            toNode = point.toNode,
            crisp = (Math.round(this.options.linkLineWidth as any) % 2) / 2,
            hangingIndent: number = this.options.hangingIndent as any,
            toOffset = toNode.options.offset,
            percentOffset =
                /%$/.test(toOffset as any) && parseInt(toOffset as any, 10),
            inverted = this.chart.inverted;

        /* if (inverted) {
              x1 -= fromNode.shapeArgs.width;
              x2 += toNode.shapeArgs.width;
            } */

        let x1 = Math.floor((fromNode.shapeArgs as any).x) + crisp,
            x2 = Math.floor((toNode.shapeArgs as any).x) + crisp,
            y1 = Math.floor((fromNode.shapeArgs as any).y) + crisp,
            y2 = Math.floor((toNode.shapeArgs as any).y) + crisp,
            xMiddle =
                Math.floor(
                    x2 +
                        ((inverted ? 1 : -1) *
                            (this.colDistance - this.nodeWidth)) /
                            2
                ) + crisp;
        // Put the link on the side of the node when an offset is given. HR
        // node in the main demo.
        if (percentOffset && (percentOffset >= 50 || percentOffset <= -50)) {
            xMiddle = x2 =
                Math.floor(
                    x2 +
                        (inverted ? -0.5 : 0.5) *
                            (toNode.shapeArgs as any).width
                ) + crisp;
            y2 = (toNode.shapeArgs as any).y;
            if (percentOffset > 0) {
                //
                y2 += (toNode.shapeArgs as any).height;
            }
        }
        if (toNode.hangsFrom === fromNode) {
            if (this.chart.inverted) {
                y1 =
                    Math.floor(
                        (fromNode.shapeArgs as any).y +
                            (fromNode.shapeArgs as any).height -
                            hangingIndent / 2
                    ) + crisp;
                y2 =
                    (toNode.shapeArgs as any).y +
                    (toNode.shapeArgs as any).height;
            } else {
                y1 =
                    Math.floor(
                        (fromNode.shapeArgs as any).y + hangingIndent / 2
                    ) + crisp;
            }
            xMiddle = x2 =
                Math.floor(
                    (toNode.shapeArgs as any).x +
                        (toNode.shapeArgs as any).width / 2
                ) + crisp;
        }
        point.plotY = 1;
        point.shapeType = 'path';

        if (this.options.link && this.options.link.type === 'straight') {
            point.shapeArgs = {
                d: TreegraphSeries.curvedPath([
                    ['M', x1, y1],
                    ['L', x2, y2]
                ])
            };
        } else if (this.options.link.type === 'curved') {
            point.shapeArgs = {
                d: TreegraphSeries.pointsToPath(
                    {
                        x: x1,
                        y: y1
                    },
                    {
                        x: x2,
                        y: y2
                    },
                    0.1
                )
            };
        } else {
            point.shapeArgs = {
                d: TreegraphSeries.curvedPath(
                    [
                        ['M', x1, y1],
                        ['L', xMiddle, y1],
                        ['L', xMiddle, y2],
                        ['L', x2, y2]
                    ],
                    this.options.linkRadius as number
                )
            };
        }
    }

    /**
     * Run translation operations for one node.
     * @private
     */
    public translateNode(node: any, column: TreegraphSeries.ColumnArray): void {
        const translationFactor = this.translationFactor,
            chart = this.chart,
            options = this.options,
            crisp = (Math.round(options.borderWidth) % 2) / 2,
            nodeRadius = pick(node.options.radius, options.radius),
            nodeOffset = column.offset(node, translationFactor) as any,
            plotSizeY = chart.plotSizeY as number,
            plotSizeX = chart.plotSizeX as number,
            fromNodeTop =
                Math.floor(
                    pick(
                        nodeOffset.absoluteTop,
                        column.top(translationFactor) + nodeOffset.relativeTop
                    )
                ) + crisp,
            nodeWidth = nodeRadius * 2;

        const maxRadius = (column as any).maxRadius;
        const previousColumn = (this as any).nodeColumns[node.column - 1];
        const emptySpaceWidth = (this as any).emptySpaceWidth;

        const xOffset = previousColumn ?
            previousColumn.xOffset +
                previousColumn.maxRadius * 2 +
                emptySpaceWidth :
            0;

        const nodeLeft = chart.inverted ?
            (plotSizeX as number) - xOffset :
            xOffset;
        node.sum = 1;

        // Draw the node
        node.shapeType = 'circle';
        node.nodeX = nodeLeft;
        node.nodeY = fromNodeTop;
        (column as any).xOffset = xOffset;

        if (!chart.inverted) {
            let xPosition = nodeLeft;

            if (options.alignNodes === 'right') {
                xPosition += (maxRadius * 2) - (nodeWidth / 2);
            } else if (options.alignNodes === 'left') {
                xPosition += (nodeWidth / 2);
            } else {
                xPosition += maxRadius;
            }

            node.shapeArgs = {
                x: xPosition,
                y: fromNodeTop + nodeWidth / 2,
                r: node.options.radius || options.borderRadius
            };
        } else {
            let yPosition = nodeLeft;
            if (options.alignNodes === 'right') {
                yPosition -= (maxRadius * 2) - (nodeWidth / 2);
            } else if (options.alignNodes === 'left') {
                yPosition -= (nodeWidth / 2);
            } else {
                yPosition -= maxRadius;
            }

            node.shapeArgs = {
                x: yPosition,
                y: plotSizeY - fromNodeTop - nodeWidth,
                r: node.options.radius || options.borderRadius,
                width: node.options.height || options.height || nodeWidth,
                height: node.options.height || options.height || nodeWidth
            };
        }
        node.shapeArgs.display = node.hasShape() ? '' : 'none';
        // Calculate data label options for the point
        node.dlOptions = TreegraphSeries.getDLOptions({
            level: (this.mapOptionsToLevel as any)[node.level],
            optionsPoint: node.options
        });
        // Pass test in drawPoints
        node.plotY = 1;
        // Set the anchor position for tooltips
        node.tooltipPos = chart.inverted ?
            [plotSizeY - node.shapeArgs.y, plotSizeX - node.shapeArgs.x] :
            [node.shapeArgs.x, node.shapeArgs.y];
    }
    public alignDataLabel(): void {
        sankeyProto.alignDataLabel.apply(this, arguments);
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
