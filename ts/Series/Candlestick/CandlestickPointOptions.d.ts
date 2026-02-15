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
