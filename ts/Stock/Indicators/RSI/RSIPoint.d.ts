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

import type RSIIndicator from './RSIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class RSIPoint extends SMAPoint {
    public series: RSIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default RSIPoint;
