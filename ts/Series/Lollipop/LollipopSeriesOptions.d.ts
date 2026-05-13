/* *
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

import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface LollipopSeriesOptions extends ScatterSeriesOptions {
    connectorColor?: ColorString;
    connectorWidth?: number;
    groupPadding?: number;
    /** @deprecated */
    lowColor?: ColorType;
    pointPadding?: number;
    states?: SeriesStatesOptions<LollipopSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default LollipopSeriesOptions;
