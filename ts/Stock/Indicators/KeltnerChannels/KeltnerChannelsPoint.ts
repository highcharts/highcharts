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

declare class KeltnerChannelsPoint extends SMAPoint {
    public middle?: number;
    public series: KeltnerChannelsIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default KeltnerChannelsPoint;
