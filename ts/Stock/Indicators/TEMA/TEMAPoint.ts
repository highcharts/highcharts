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

import type TEMAIndicator from './TEMAIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class TEMAPoint extends EMAPoint {
    public series: TEMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default TEMAPoint;
