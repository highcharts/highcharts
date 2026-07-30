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

import type PieDataLabelOptions from '../Pie/PieDataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface FunnelDataLabelOptions extends PieDataLabelOptions {

    /**
     * Whether to render the data label inside the funnel item instead of
     * outside, connected by a connector line.
     *
     * @default false
     */
    inside?: boolean;

}

/* *
 *
 *  Default Export
 *
 * */

export default FunnelDataLabelOptions;
