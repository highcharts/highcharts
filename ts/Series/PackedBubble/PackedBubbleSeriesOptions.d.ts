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

import type BubbleSeriesOptions from '../Bubble/BubbleSeriesOptions';
import type PackedBubbleDataLabelOptions from './PackedBubbleDataLabelOptions';
import type { PackedBubbleLayoutAlgorithmOptions } from './PackedBubbleLayout';
import type PackedBubbleSeries from './PackedBubbleSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PackedBubbleParentNodeOptions {
    allowPointSelect?: boolean;
}

export interface PackedBubbleSeriesOptions extends BubbleSeriesOptions {
    parentNode?: PackedBubbleParentNodeOptions;
    dataLabels?: PackedBubbleDataLabelOptions;
    draggable?: boolean;
    layoutAlgorithm?: PackedBubbleLayoutAlgorithmOptions;
    minSize?: (number|string);
    states?: SeriesStatesOptions<PackedBubbleSeries>;
    useSimulation?: boolean;
}

export default PackedBubbleSeriesOptions;
