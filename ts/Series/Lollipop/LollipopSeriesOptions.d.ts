/* *
 *
 *  (c) 2010-2026 Highsoft AS
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
