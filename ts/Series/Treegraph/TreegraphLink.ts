/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
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

export interface TreegraphLinkOptions extends OrganizationLinkOptions {}

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
    *  Class properties
    *
    * */
    isLink = true;
    node = {};
    formatPrefix = 'link';
    dataLabelOnNull = true;

    /* *
     *
     *  Functions
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
