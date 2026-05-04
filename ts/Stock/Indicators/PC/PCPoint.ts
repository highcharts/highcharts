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

import PCIndicator from './PCIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class PCPoint extends SMAPoint {
    public middle?: number;
    public series: PCIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default PCPoint;
