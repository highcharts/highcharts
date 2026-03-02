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

import DPOIndicator from './DPOIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class DPOPoint extends SMAPoint {
    public series: DPOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DPOPoint;
