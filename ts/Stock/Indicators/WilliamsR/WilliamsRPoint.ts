/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type WilliamsRIndicator from './WilliamsRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class WilliamsRPoint extends SMAPoint {
    public series: WilliamsRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default WilliamsRPoint;
