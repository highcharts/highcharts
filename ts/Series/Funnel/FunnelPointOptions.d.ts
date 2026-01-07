/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
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

import type FunnelDataLabelOptions from './FunnelDataLabelOptions';
import type PiePointOptions from '../Pie/PiePointOptions';
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel';

/* *
 *
 *  Declarations
 *
 * */

export interface FunnelPointOptions extends PiePointOptions {
    dataLabels?: (
        FunnelPointDataLabelOptions |
        Array<FunnelPointDataLabelOptions>
    );
}

export type FunnelPointDataLabelOptions =
    FunnelDataLabelOptions & PointDataLabelOptionsModifier;

/* *
 *
 *  Default Export
 *
 * */

export default FunnelPointOptions;
