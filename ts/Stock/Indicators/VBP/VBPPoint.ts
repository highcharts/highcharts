/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    sma: {
        prototype: {
            pointClass: SMAPoint
        }
    }
} = SeriesRegistry.seriesTypes;
import type VBPIndicator from './VBPIndicator';

/* *
 *
 *  Class
 *
 * */

class VBPPoint extends SMAPoint {

    // Required for destroying negative part of volume
    /** @internal */
    public destroy(): void {
        // @todo: this.negativeGraphic doesn't seem to be used anywhere
        if (this.negativeGraphic) {
            this.negativeGraphic = (this.negativeGraphic as any).destroy();
        }
        super.destroy.apply(this, arguments);
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface VBPPoint {
    /** @internal */
    barX: number;
    /** @internal */
    negativeGraphic: unknown;
    /** @internal */
    pointWidth: number;
    /** @internal */
    series: VBPIndicator;
    /** @internal */
    volumeAll: number;
    /** @internal */
    volumeNeg: number;
    /** @internal */
    volumePos: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default VBPPoint;
