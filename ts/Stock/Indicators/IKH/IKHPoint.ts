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

import type IKHIndicator from './IKHIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 * Class
 *
 * */

/** @internal */
declare class IKHPoint extends SMAPoint {
    public series: IKHIndicator;
    public tenkanSen: number;
    public kijunSen: number;
    public chikouSpan: number;
    public senkouSpanA: number;
    public senkouSpanB: number;
    public plotX: number;
    public plotY: number;
    public isNull: boolean;
    public intersectPoint?: boolean;
}


/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default IKHPoint;
