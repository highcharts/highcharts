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

declare class KlingerPoint extends SMAPoint {
    /** @internal */
    public series: KlingerIndicator;
    /** @internal */
    public signal?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default KlingerPoint;
