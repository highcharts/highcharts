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

import type ATRIndicator from './ATRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class ATRPoint extends SMAPoint {
    public series: ATRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ATRPoint;
