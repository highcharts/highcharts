/* *
 *
 *  (c) 2010-2025 Grzegorz Blachlinski, Sebastian Bochan
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

import type Chart from '../../Core/Chart/Chart';
import type { GraphLayoutType } from '../GraphLayoutComposition';
import type NetworkgraphChart from '../Networkgraph/NetworkgraphChart';
import type PackedBubblePoint from './PackedBubblePoint';

/* *
 *
 *  Class
 *
 * */

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

interface PackedBubbleChart extends NetworkgraphChart {
    graphLayoutsLookup: Array<GraphLayoutType>;
}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleChart;
