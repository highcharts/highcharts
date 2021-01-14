/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2021 Torstein Honsi
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

import type OrganizationPointOptions from './OrganizationPointOptions';
import type OrganizationSeries from './OrganizationSeries';
import type { OrganizationSeriesNodeOptions } from './OrganizationSeriesOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sankey: {
            prototype: {
                pointClass: SankeyPoint
            }
        }
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class OrganizationPoint extends SankeyPoint {

    /* *
     *
     *  Properties
     *
     * */

    public fromNode: OrganizationPoint = void 0 as any;

    public image?: OrganizationSeriesNodeOptions['image'];

    public linksFrom: Array<OrganizationPoint> = void 0 as any;

    public linksTo: Array<OrganizationPoint> = void 0 as any;

    public nodeHeight?: number;

    public options: OrganizationPointOptions = void 0 as any;

    public series: OrganizationSeries = void 0 as any;

    public toNode: OrganizationPoint = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * All nodes in an org chart are equal width.
     * @private
     */
    public getSum(): number {
        return 1;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationPoint;
