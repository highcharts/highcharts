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

import type ROCIndicator from './ROCIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class ROCPoint extends SMAPoint {
    public series: ROCIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ROCPoint;
