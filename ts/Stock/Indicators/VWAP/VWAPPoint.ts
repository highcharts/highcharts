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

import type VWAPIndicator from './VWAPIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class VWAPPoint extends SMAPoint {
    public series: VWAPIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default VWAPPoint;
