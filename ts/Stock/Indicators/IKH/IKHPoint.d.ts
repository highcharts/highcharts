/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  imports
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

export default IKHPoint;
