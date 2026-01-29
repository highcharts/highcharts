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

import type SupertrendIndicator from './SupertrendIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class SupertrendPoint extends SMAPoint {
    public series: SupertrendIndicator;
    public y: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SupertrendPoint;
