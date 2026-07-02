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

import type KeltnerChannelsIndicator from './KeltnerChannelsIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class KeltnerChannelsPoint extends SMAPoint {
    public middle?: number;
    public series: KeltnerChannelsIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default KeltnerChannelsPoint;
