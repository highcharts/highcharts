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

import DEMAIndicator from './DEMAIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class DEMAPoint extends EMAPoint {
    public series: DEMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DEMAPoint;
