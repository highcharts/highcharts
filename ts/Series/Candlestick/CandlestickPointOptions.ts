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

import type ColorType from '../../Core/Color/ColorType';
import type OHLCPointOptions from '../OHLC/OHLCPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface CandlestickPointOptions extends OHLCPointOptions {
    lineColor?: ColorType;
    upLineColor?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default CandlestickPointOptions;
