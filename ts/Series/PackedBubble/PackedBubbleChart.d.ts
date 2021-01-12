/* *
 *
 *  (c) 2010-2021 Grzegorz Blachlinski, Sebastian Bochan
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
import type PackedBubblePoint from './PackedBubblePoint';
import type PackedBubbleSeries from './PackedBubbleSeries';

/* *
 *
 *  Class
 *
 * */

declare class PackedBubbleChart extends Chart {
    allDataPoints: Array<PackedBubbleSeries.Data>;
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
 *  Prototype Properties
 *
 * */

interface PackedBubbleChart extends Highcharts.NetworkgraphChart {
    // nothing here yet
}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleChart;
