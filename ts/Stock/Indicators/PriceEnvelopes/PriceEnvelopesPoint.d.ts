/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type PriceEnvelopesIndicator from './PriceEnvelopesIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class PriceEnvelopesPoint extends SMAPoint {
    public bottom: number;
    public middle: number;
    public plotBottom: number;
    public plotTop: number;
    public series: PriceEnvelopesIndicator;
    public top: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PriceEnvelopesPoint;
