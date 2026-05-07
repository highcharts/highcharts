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

import type KlingerIndicator from './KlingerIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class KlingerPoint extends SMAPoint {
    public series: KlingerIndicator;
    public signal?: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default KlingerPoint;
