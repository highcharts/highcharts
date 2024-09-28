/* *
 *
 *  (c) 2010-2024 Grzegorz Blachlinski, Sebastian Bochan
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

import type BubblePointOptions from '../Bubble/BubblePointOptions';
import type NetworkgraphPointOptions from '../Networkgraph/NetworkgraphPointOptions';
import type PackedBubbleDataLabelOptions from './PackedBubbleDataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PackedBubblePointOptions
    extends BubblePointOptions, NetworkgraphPointOptions {

    /**
     * @type {Highcharts.SeriesPackedBubbleDataLabelsOptionsObject|Array<Highcharts.SeriesPackedBubbleDataLabelsOptionsObject>}
     *
     * @product highcharts
     */
    dataLabels?: (PackedBubbleDataLabelOptions|Array<PackedBubbleDataLabelOptions>);

    mass?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubblePointOptions;
