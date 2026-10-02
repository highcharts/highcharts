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

import ScatterSeries from '../Scatter/ScatterSeries.js';
const { prototype: { pointClass: ScatterPoint } } = ScatterSeries;


/* *
 *
 *  Class
 *
 * */

class ContourPoint extends ScatterPoint {

    /** @internal */
    public value!: (number|null);

    /** @internal */
    public x!: number;

    /** @internal */
    public y!: number;


}

/* *
 *
 *  Default Export
 *
 * */

export default ContourPoint;
