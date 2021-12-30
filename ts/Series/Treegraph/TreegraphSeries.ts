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
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
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

        let nodePositionX = nodeLeft;
        let multiply = chart.inverted ? -1 : 1;
        let nodePositionY = chart.inverted ?
            plotSizeY - fromNodeTop - nodeWidth :
            fromNodeTop + nodeWidth / 2;

        if (options.alignNodes === 'right') {
            nodePositionX += ((maxRadius * 2) - (nodeWidth / 2)) * multiply;
        } else if (options.alignNodes === 'left') {
            nodePositionX += (nodeWidth / 2) * multiply;
        } else {
            nodePositionX += maxRadius * multiply;
        }


        // shapeArgs width and height set to 0 to align dataLabels correctly
        // in inverted chart
        node.shapeArgs = {
            x: nodePositionX,
            y: nodePositionY,
            r: node.options.radius || options.borderRadius,
            width: 0,
            height: 0
        };
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
