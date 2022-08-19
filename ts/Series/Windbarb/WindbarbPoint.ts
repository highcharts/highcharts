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

'use strict';

/* *
 *
 *  Import
 *
 * */

import type ColumnPointType from '../Column/ColumnPoint';
import type WindbarbPointOptions from './WindbarbPointOptions';
import type WindbarbSeries from './WindbarbSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const ColumnPoint: typeof ColumnPointType =
    SeriesRegistry.seriesTypes.column.prototype.pointClass;
import U from '../../Core/Utilities.js';
const { isNumber } = U;
import ColumnSeries from '../Column/ColumnSeries.js';

/* *
 *
 *  Class
 *
 * */

class WindbarbPoint extends ColumnPoint {

    /* *
     *
     *  Properties
     *
     * */

    public beaufort: string = void 0 as any;
    public beaufortLevel: number = void 0 as any;
    public direction: number = void 0 as any;
    public options: WindbarbPointOptions = void 0 as any;
    public series: WindbarbSeries = void 0 as any;

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
 *  Class Prototype
 *
 * */

interface WindbarbPoint {
    value: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default WindbarbPoint;
