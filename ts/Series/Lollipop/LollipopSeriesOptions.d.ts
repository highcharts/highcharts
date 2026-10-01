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

import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions.js';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions.js';
import type ColorString from '../../Core/Color/ColorString.js';
import type ColorType from '../../Core/Color/ColorType.js';

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
