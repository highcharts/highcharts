/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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
import PiePoint from '../Pie/PiePoint.js';

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

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public haloPath(size: number): SVGPath {
        return this.series.chart.is3d() ? [] : super.haloPath(size);
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Default Export
 *
 * */

export default Pie3DPoint;
