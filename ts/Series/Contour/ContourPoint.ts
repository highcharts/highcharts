/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    scatter: { prototype: { pointClass: ScatterPoint } }
} = SeriesRegistry.seriesTypes;


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
 *  Default Export
 *
 * */

export default ContourPoint;
