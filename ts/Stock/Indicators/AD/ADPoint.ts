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

import type ADIndicator from './ADIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class ADPoint extends SMAPoint {
    public series: ADIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ADPoint;
