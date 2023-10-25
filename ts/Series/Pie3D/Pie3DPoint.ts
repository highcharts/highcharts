/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  3D pie series
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

import type Pie3DSeries from './Pie3DSeries';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    pie: { prototype: { pointClass: PiePoint } }
} = SeriesRegistry.seriesTypes;

/* *
 *
 *  Class
 *
 * */

class Pie3DPoint extends PiePoint {

    /* *
     *
     *  Properties
     *
     * */

    public series: Pie3DSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public haloPath(): SVGPath {
        return this.series?.chart.is3d() ?
            [] : super.haloPath.apply(this, arguments);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Pie3DPoint;
