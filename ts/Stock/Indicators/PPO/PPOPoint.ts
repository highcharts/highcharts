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
import PPOIndicator from './PPOIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class PPOPoint extends EMAPoint {
    public series: PPOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default PPOPoint;
