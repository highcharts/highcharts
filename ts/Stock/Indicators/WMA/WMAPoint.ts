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

import type WMAIndicator from './WMAIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class WMAPoint extends SMAPoint {
    public series: WMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default WMAPoint;
