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

import type LinePoint from '../../../Series/Line/LinePoint';
import type SMAIndicator from './SMAIndicator';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class SMAPoint extends LinePoint {
    public series: SMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SMAPoint;
