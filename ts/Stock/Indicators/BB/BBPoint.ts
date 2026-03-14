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

import type BBIndicator from './BBIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class BBPoint extends SMAPoint {
    public middle?: number;
    public series: BBIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default BBPoint;
