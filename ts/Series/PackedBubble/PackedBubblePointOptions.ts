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

import type BubblePointOptions from '../Bubble/BubblePointOptions.js';
import type NetworkgraphPointOptions from '../Networkgraph/NetworkgraphPointOptions.js';
import type PackedBubbleDataLabelOptions from './PackedBubbleDataLabelOptions.js';
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel.js';

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
    dataLabels?: (
        PackedBubblePointDataLabelOptions |
        Array<PackedBubblePointDataLabelOptions>
    );

    mass?: number;

}

export type PackedBubblePointDataLabelOptions =
    PackedBubbleDataLabelOptions & PointDataLabelOptionsModifier;

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubblePointOptions;
