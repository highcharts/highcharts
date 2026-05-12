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
