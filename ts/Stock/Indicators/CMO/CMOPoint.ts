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

import type CMOIndicator from './CMOIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class CMOPoint extends SMAPoint {
    public series: CMOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default CMOPoint;
