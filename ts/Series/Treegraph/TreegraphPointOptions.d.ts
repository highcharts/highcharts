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
