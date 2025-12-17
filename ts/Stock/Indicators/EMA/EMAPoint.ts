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

import type EMAIndicator from './EMAIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class EMAPoint extends SMAPoint {
    public series: EMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default EMAPoint;
