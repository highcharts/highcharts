/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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
