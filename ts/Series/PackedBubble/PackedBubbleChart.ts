/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachliński, Sebastian Bochan
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

import type Chart from '../../Core/Chart/Chart';
import type { GraphLayoutType } from '../GraphLayoutComposition';
import type NetworkgraphChart from '../Networkgraph/NetworkgraphChart';
import type PackedBubblePoint from './PackedBubblePoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class PackedBubbleChart extends Chart {
    diffX: number;
    diffY: number;
    hoverPoint: PackedBubblePoint;
    maxRadius: number;
    minRadius: number;
    rawPositions: Array<Array<number>>;
    stages: Array<Array<(number|object|null)>>;
}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface PackedBubbleChart extends NetworkgraphChart {
    graphLayoutsLookup: Array<GraphLayoutType>;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default PackedBubbleChart;
