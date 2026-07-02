/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Fus
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

import type { DragNodesChart } from '../DragNodesComposition';
import type ReingoldFruchtermanLayout from './ReingoldFruchtermanLayout.js';

/* *
 *
 *  Declarations
 *
 * */

export interface NetworkgraphChart extends DragNodesChart {
    graphLayoutsLookup: Array<ReingoldFruchtermanLayout>;
    graphLayoutsStorage: Record<string, ReingoldFruchtermanLayout>;
}

/* *
 *
 *  Default Export
 *
 * */

export default NetworkgraphChart;
