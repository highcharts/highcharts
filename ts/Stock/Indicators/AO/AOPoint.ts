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

import type AOIndicator from './AOIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class AOPoint extends SMAPoint {
    public series: AOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default AOPoint;
