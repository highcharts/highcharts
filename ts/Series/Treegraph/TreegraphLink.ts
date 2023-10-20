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

    public init(
        series: TreegraphSeries,
        options: string | number | PointOptions | (string | number | null)[],
        x?: number,
        point?: TreegraphPoint
    ): LinkPoint {
        const link = super.init.apply(this, arguments) as LinkPoint;
        this.formatPrefix = 'link';
        this.dataLabelOnNull = true;

        if (point) {
            link.fromNode = point.node.parentNode.point;
            link.visible = point.visible;
            link.toNode = point;
            this.id = link.toNode.id + '-' + link.fromNode.id;
        }
        return link;
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
