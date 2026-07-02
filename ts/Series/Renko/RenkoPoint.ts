/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Lysy
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

import type RenkoSeries from './RenkoSeries';
import type RenkoPointOptions from './RenkoPointOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: {
        prototype: { pointClass: ColumnPoint }
    }
} = SeriesRegistry.seriesTypes;

/* *
 *
 *  Class
 *
 * */

class RenkoPoint extends ColumnPoint {
    public options!: RenkoPointOptions;
    public upTrend!: boolean;
    public series!: RenkoSeries;
    public getClassName(): string {
        return (
            super.getClassName.call(this) +
            (this.upTrend ? ' highcharts-point-up' : ' highcharts-point-down')
        );
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default RenkoPoint;
