/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DisparityIndexIndicator from './DisparityIndexIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class DisparityIndexPoint extends SMAPoint {
    public series: DisparityIndexIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default DisparityIndexPoint;
