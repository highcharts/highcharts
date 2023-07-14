/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import VBPIndicator from './VBPIndicator';

/* *
 *
 *  Class
 *
 * */

class VBPPoint extends SMAPoint {

    // Required for destroying negative part of volume
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

interface VBPPoint {
    barX: number;
    negativeGraphic: unknown;
    pointWidth: number;
    series: VBPIndicator;
    volumeAll: number;
    volumeNeg: number;
    volumePos: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default VBPPoint;
