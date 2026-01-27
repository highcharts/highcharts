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

import type CMFIndicator from './CMFIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class CMFPoint extends SMAPoint {
    public series: CMFIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default CMFPoint;
