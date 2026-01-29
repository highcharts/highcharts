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

import type PSARIndicator from './PSARIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class PSARPoint extends SMAPoint {
    public series: PSARIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default PSARPoint;
