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

import type CCIIndicator from './CCIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class CCIPoint extends SMAPoint {
    public series: CCIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default CCIPoint;
