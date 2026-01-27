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
