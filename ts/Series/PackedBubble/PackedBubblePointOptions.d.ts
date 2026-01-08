/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachlinski, Sebastian Bochan
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
