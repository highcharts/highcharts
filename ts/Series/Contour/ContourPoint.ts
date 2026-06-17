/* *
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
