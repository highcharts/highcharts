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
 * Imports
 *
 * */

import type PointOptions from '../../Core/Series/PointOptions.js';
import type TreegraphSeries from './TreegraphSeries';
import type { LinkOptions } from '../Organization/OrganizationSeriesOptions.js';
import Point from '../../Core/Series/Point.js';
import TreegraphPoint from './TreegraphPoint.js';
import TreegraphPointOptions from './TreegraphPointOptions.js';
import U from '../../Core/Utilities.js';
const { pick, extend } = U;

export interface LinkPointOptions extends TreegraphPointOptions {
    link?: LinkOptions
}
interface LinkPoint {
    options: LinkPointOptions;
    fromNode: TreegraphPoint;
    toNode: TreegraphPoint;
}
class LinkPoint extends Point {
    isLink = true;
    node = {};
    formatPrefix = 'link';
    dataLabelOnNull = true;

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

export default LinkPoint;
