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
import type { CollapseButtonOptions } from './TreegraphSeriesOptions';
import type { TreegraphLinkOptions } from './TreegraphLink';

/* *
 *
 *  Declarations
 *
 * */

export interface TreegraphPointOptions extends TreemapPointOptions {
    collapseButton?: CollapseButtonOptions;
    borderRadius?: number;
    link?: TreegraphLinkOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default TreegraphPointOptions;
