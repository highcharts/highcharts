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
import PPOIndicator from './PPOIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class PPOPoint extends EMAPoint {
    public series: PPOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default PPOPoint;
