/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

declare class CMFPoint extends SMAPoint {
    /** @internal */
    public series: CMFIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default CMFPoint;
