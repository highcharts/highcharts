/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Fus
 *
 *  A commercial license may be required depending on use,
 *  see www.highcharts.com/license
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
