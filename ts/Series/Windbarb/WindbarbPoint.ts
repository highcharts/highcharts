/* *
 *
 *  Wind barb series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
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
import { isNumber } from '../../Shared/Utilities.js';

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

    /** @internal */
    public beaufort!: string;
    /** @internal */
    public beaufortLevel!: number;
    /** @internal */
    public direction!: number;
    public options!: WindbarbPointOptions;
    /** @internal */
    public series!: WindbarbSeries;
    /** @internal */
    public value!: number;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
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
