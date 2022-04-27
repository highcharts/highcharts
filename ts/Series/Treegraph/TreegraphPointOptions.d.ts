/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type TreemapPointOptions from '../Treemap/TreemapPointOptions';
import type { LinkOptions } from '../Organization/OrganizationSeriesOptions';
import type { CollapseButtonOptions } from './TreegraphSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface TreegraphPointOptions extends TreemapPointOptions {
    collapseButton?: CollapseButtonOptions;
    borderRadius?: number;
    link?: LinkOptions;
}

export default TreegraphPointOptions;
