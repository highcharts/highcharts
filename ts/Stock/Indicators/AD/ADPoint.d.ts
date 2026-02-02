/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ADIndicator from './ADIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class ADPoint extends SMAPoint {
    public series: ADIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ADPoint;
