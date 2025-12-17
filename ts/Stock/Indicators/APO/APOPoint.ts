/* *
 *
 *  License: www.highcharts.com/license
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

declare class APOPoint extends EMAPoint {
    public series: APOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default APOPoint;
