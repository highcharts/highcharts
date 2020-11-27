/* *
 *
 *  Highcharts variwide module
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 * Imports
 *
 * */
import type VariwidePointOptions from './VariwidePointOptions';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = BaseSeries;
import VariwideSeries from './VariwideSeries.js';
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        crosshairWidth?: VariwidePoint['crosshairWidth'];
    }
}

/* *
 *
 * Class
 *
 * */
class VariwidePoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     * Properites
     *
     * */
    public crosshairWidth: number = void 0 as any;
    public options: VariwidePointOptions = void 0 as any;
    public series: VariwideSeries = void 0 as any;

    /* *
     *
     * Functions
     *
     * */
    public isValid(): boolean {
        return isNumber(this.y) && isNumber(this.z);
    }

}

/* *
 *
 * Export
 *
 * */
export default VariwidePoint;
