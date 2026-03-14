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

import type PriceEnvelopesIndicator from './PriceEnvelopesIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
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

/** @internal */
export default PriceEnvelopesPoint;
