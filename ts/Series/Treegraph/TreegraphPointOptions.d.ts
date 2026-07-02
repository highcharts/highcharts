/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Authors: Paweł Lysy, Grzegorz Blachliński
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
