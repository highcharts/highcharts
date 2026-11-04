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

declare class IKHPoint extends SMAPoint {
    /** @internal */
    public series: IKHIndicator;
    /** @internal */
    public tenkanSen: number;
    /** @internal */
    public kijunSen: number;
    /** @internal */
    public chikouSpan: number;
    /** @internal */
    public senkouSpanA: number;
    /** @internal */
    public senkouSpanB: number;
    /** @internal */
    public plotX: number;
    /** @internal */
    public plotY: number;
    /** @internal */
    public isNull: boolean;
    /** @internal */
    public intersectPoint?: boolean;
}


/* *
 *
 *  Default Export
 *
 * */

export default IKHPoint;
