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

import Point from '../../../Core/Series/Point.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import VBPIndicator from './VBPIndicator';

class VBPPoint extends SMAIndicator.prototype.pointClass {

    // Required for destroying negative part of volume
    public destroy(): void {
        // @todo: this.negativeGraphic doesn't seem to be used anywhere
        if (this.negativeGraphic) {
            this.negativeGraphic = (this.negativeGraphic as any).destroy();
        }
        return Point.prototype.destroy.apply(this, arguments);
    }
}
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
