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
import type PackedBubbleLayout from './PackedBubbleLayout';
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
    layoutAlgorithm?: PackedBubbleLayout.Options;
    minSize?: (number|string);
    states?: SeriesStatesOptions<PackedBubbleSeries>;
    useSimulation?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleSeriesOptions;
