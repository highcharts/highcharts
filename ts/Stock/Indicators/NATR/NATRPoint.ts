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

import type NATRIndicator from './NATRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class NATRPoint extends SMAPoint {
    public series: NATRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default NATRPoint;
