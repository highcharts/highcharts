/* *
 *
 *  Wind barb series module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Import
 *
 * */

import type WindbarbPointOptions from './WindbarbPointOptions';

import ColumnSeries from '../Column/ColumnSeries.js';
import WindbarbSeries from './WindbarbSeries.js';
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  Class
 *
 * */

class WindbarbPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public beaufort!: string;
    public beaufortLevel!: number;
    public direction!: number;
    public options!: WindbarbPointOptions;
    public series!: WindbarbSeries;
    public value!: number;

    /* *
     *
     *  Functions
     *
     * */

    public isValid(): boolean {
        return isNumber(this.value) && this.value >= 0;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default WindbarbPoint;
