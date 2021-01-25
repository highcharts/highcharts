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

import type NetworkgraphSeries from '../Networkgraph/Networkgraph';
import type PackedBubblePoint from './PackedBubblePoint';
import type PackedBubbleSeriesOptions from './PackedBubbleSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface NetworkgraphLayout {
            beforeStep?(): void;
        }
    }
}

export interface PackedBubbleLayout extends Highcharts.NetworkgraphLayout {
    enableSimulation: boolean;
    nodes: Array<PackedBubblePoint>;
    options: PackedBubbleLayoutAlgorithmOptions;
    series: Array<NetworkgraphSeries>;
}

export interface PackedBubbleLayoutAlgorithmOptions extends Highcharts.NetworkgraphLayoutAlgorithmOptions {
    bubblePadding?: number;
    dragBetweenSeries?: boolean;
    enableSimulation?: boolean;
    friction?: number;
    gravitationalConstant?: number;
    initialPositionRadius?: number;
    marker?: PackedBubbleSeriesOptions['marker'];
    maxIterations?: number;
    maxSpeed?: number;
    parentNodeLimit?: boolean;
    parentNodeOptions?: PackedBubbleLayoutAlgorithmOptions;
    seriesInteraction?: boolean;
    splitSeries?: boolean;
}

export default PackedBubbleLayout;
