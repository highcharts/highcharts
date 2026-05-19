/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  3D pie series
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
