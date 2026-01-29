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
