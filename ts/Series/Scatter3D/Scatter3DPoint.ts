/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Scatter 3D series.
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

import type Scatter3DPointOptions from './Scatter3DPointOptions';
import type Scatter3DSeries from './Scatter3DSeries';
import type ScatterPointType from '../Scatter/ScatterPoint';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const ScatterPoint: typeof ScatterPointType =
    SeriesRegistry.seriesTypes.scatter.prototype.pointClass;
import U from '../../Core/Utilities.js';
const { defined } = U;

/* *
 *
 *  Class
 *
 * */

class Scatter3DPoint extends ScatterPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options: Scatter3DPointOptions = void 0 as any;

    public series: Scatter3DSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public applyOptions(): Scatter3DPoint {
        super.applyOptions.apply(this, arguments);
        if (!defined(this.z)) {
            this.z = 0;
        }

        return this;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Scatter3DPoint;
