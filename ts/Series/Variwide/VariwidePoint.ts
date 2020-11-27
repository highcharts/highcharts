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
import VariwideSeries from './VariwideSeries.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 * Class
 *
 * */
/* *
 *
 * VariwidePoint class
 *
 * */
class VariwidePoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     * Properites
     *
     * */
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
 * Prototype properties
 *
 * */
interface VariwidePoint {
    crosshairWidth: number;
    isValid: () => boolean;
}


/* *
 *
 * Export
 *
 * */
export default VariwidePoint;
