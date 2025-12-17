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

import type DMIIndicator from './DMIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class DMIPoint extends SMAPoint {
    public minusDI?: number;
    public plusDI?: number;
    public series: DMIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default DMIPoint;
