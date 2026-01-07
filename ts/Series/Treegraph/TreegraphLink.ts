/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Pawel Lysy Grzegorz Blachlinski
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ColorString from '../../Core/Color/ColorString';
import type PointOptions from '../../Core/Series/PointOptions.js';
import type TreegraphSeries from './TreegraphSeries';
import type { OrganizationLinkOptions } from '../Organization/OrganizationSeriesOptions.js';

import Point from '../../Core/Series/Point.js';
import TreegraphPoint from './TreegraphPoint.js';
import TreegraphPointOptions from './TreegraphPointOptions.js';
import U from '../../Core/Utilities.js';

const {
    pick,
    extend
} = U;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: {
            prototype: {
                pointClass: ColumnPoint
            }
        }
    }
} = SeriesRegistry;

/* *
 *
 *  Declarations
 *
 * */

export interface TreegraphLinkOptions extends OrganizationLinkOptions {

    /**
     * For the orthogonal link type, this defines how far down the link bends.
     * A number defines the pixel offset from the start of the link, and a
     * percentage defines the relative position on the link. For example, a
     * `bendAt` of `50%` means that the link bends in the middle.
     *
     * @since next
     * @default '50%'
     */
    bendAt?: number|string;

    /**
     * Radius for the rounded corners of the links between nodes. Works for
     * `orthogonal` link type.
     */
    radius?: number;

    /**
     * The color of the links between nodes.
     */
    color?: ColorString;

    /**
     * Modifier of the shape of the curved link. Works best for values between 0
     * and 1, where 0 is a straight line, and 1 is a shape close to the default
     * one.
     *
     * @default 0.5
     *
     * @product highcharts
     *
     * @since 10.3.0
     */
    curveFactor?: number;

    /**
     * The line width of the links connecting nodes, in pixels.
     */
    lineWidth?: number;

    /**
     * Type of the link shape.
     *
     * @sample highcharts/series-treegraph/link-types
     *         Different link types
     *
     * @product highcharts
     */
    type?: 'curved' | 'orthogonal' | 'straight';

}

export interface LinkPointOptions extends TreegraphPointOptions {
    link?: TreegraphLinkOptions;
}

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 */
class LinkPoint extends ColumnPoint {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        series: TreegraphSeries,
        options: string | number | PointOptions | (string | number | null)[],
        x?: number,
        point?: TreegraphPoint
    ) {
        super(series, options, x);
        this.formatPrefix = 'link';
        this.dataLabelOnNull = true;

        if (point) {
            this.fromNode = point.node.parentNode.point;
            this.visible = point.visible;
            this.toNode = point;
            this.id = this.toNode.id + '-' + this.fromNode.id;
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    public dataLabelOnNull = true;

    public formatPrefix = 'link';

    public isLink = true;

    public node = {};

    /* *
     *
     *  Functions
     *
     * */

    public update(
        options: TreegraphPointOptions | LinkPointOptions,
        redraw?: boolean,
        animation?: boolean,
        runEvent?: boolean
    ): void {
        const oldOptions: Partial<this> = {
            id: this.id,
            formatPrefix: this.formatPrefix
        } as Partial<this>;

        Point.prototype.update.call(
            this,
            options,
            this.isLink ? false : redraw, // Hold the redraw for nodes
            animation,
            runEvent
        );

        this.visible = this.toNode.visible;
        extend(this, oldOptions);
        if (pick(redraw, true)) {
            this.series.chart.redraw(animation);
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface LinkPoint {
    options: LinkPointOptions;
    fromNode: TreegraphPoint;
    toNode: TreegraphPoint;
}

/* *
 *
 *  Export Default
 *
 * */

export default LinkPoint;
