/* *
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

import type DMIIndicator from './DMIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class DMIPoint extends SMAPoint {
    public minusDI?: number;
    public plusDI?: number;
    public series: DMIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DMIPoint;
