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

import APOIndicator from './APOIndicator';
import type EMAPoint from '../EMA/EMAPoint';


/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class APOPoint extends EMAPoint {
    public series: APOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default APOPoint;
