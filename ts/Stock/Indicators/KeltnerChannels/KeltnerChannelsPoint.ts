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

declare class KeltnerChannelsPoint extends SMAPoint {
    /** @internal */
    public middle?: number;
    /** @internal */
    public series: KeltnerChannelsIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default KeltnerChannelsPoint;
