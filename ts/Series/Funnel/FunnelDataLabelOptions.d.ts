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
     * Whether to render the data labels inside the funnel or pyramid shape.
     * By default, the labels are rendered outside the shape.
     *
     * @since 3.0.10
     *
     * @product highcharts
     */
    inside?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default FunnelDataLabelOptions;
