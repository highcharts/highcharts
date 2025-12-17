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

import DEMAIndicator from './DEMAIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class DEMAPoint extends EMAPoint {
    public series: DEMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default DEMAPoint;
