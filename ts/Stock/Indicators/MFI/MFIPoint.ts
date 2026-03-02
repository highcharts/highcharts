/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import MFIIndicator from './MFIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class MFIPoint extends SMAPoint {
    public series: MFIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default MFIPoint;
