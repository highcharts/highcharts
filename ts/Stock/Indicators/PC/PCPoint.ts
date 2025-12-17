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

import PCIndicator from './PCIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class PCPoint extends SMAPoint {
    public middle?: number;
    public series: PCIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default PCPoint;
