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

import type SMAPoint from '../SMA/SMAPoint';
import type TRIXIndicator from './TRIXIndicator';

/* *
 *
 *  Class
 *
 * */

declare class TRIXPoint extends SMAPoint {
    public series: TRIXIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default TRIXPoint;
