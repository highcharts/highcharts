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

import type NATRIndicator from './NATRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class NATRPoint extends SMAPoint {
    public series: NATRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default NATRPoint;
