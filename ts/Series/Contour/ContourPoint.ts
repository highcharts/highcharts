/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';

const {
    scatter: { prototype: { pointClass: ScatterPoint } }
} = SeriesRegistry.seriesTypes;
const {
    extend
} = U;


/* *
 *
 *  Class
 *
 * */

class ContourPoint extends ScatterPoint {

    public value!: (number|null);

    public x!: number;

    public y!: number;


}


/* *
 *
 *  Registration
 *
 * */

extend(ContourPoint.prototype, {
    dataLabelOnNull: true,
    ttBelow: false
});


/* *
 *
 *  Default Export
 *
 * */

export default ContourPoint;
