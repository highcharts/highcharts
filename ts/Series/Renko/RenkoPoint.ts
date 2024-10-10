/* *
 *
 *  (c) 2010-2024 Pawel Lysy
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
}

/* *
 *
 *  Class Prototype
 *
 * */

interface RenkoPoint {
    series: RenkoSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default RenkoPoint;
