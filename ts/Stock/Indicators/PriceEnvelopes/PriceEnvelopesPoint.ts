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

declare class PriceEnvelopesPoint extends SMAPoint {
    /** @internal */
    public bottom: number;
    /** @internal */
    public middle: number;
    /** @internal */
    public plotBottom: number;
    /** @internal */
    public plotTop: number;
    /** @internal */
    public series: PriceEnvelopesIndicator;
    /** @internal */
    public top: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PriceEnvelopesPoint;
