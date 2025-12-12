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

import MFIIndicator from './MFIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class MFIPoint extends SMAPoint {
    public series: MFIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default MFIPoint;
