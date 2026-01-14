/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  3D pie series
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

    public series!: Pie3DSeries;

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
