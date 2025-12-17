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

import type CMFIndicator from './CMFIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class CMFPoint extends SMAPoint {
    public series: CMFIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default CMFPoint;
