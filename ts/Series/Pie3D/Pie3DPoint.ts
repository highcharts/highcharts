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
    seriesTypes: {
        pie: {
            prototype: {
                pointClass: PiePoint
            }
        }
    }
} = SeriesRegistry;

/* *
 *
 *  Constants
 *
 * */

const superHaloPath = PiePoint.prototype.haloPath;

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
    public haloPath(): SVGPath {
        return this.series.chart.is3d() ? [] : superHaloPath.apply(this, arguments);
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Default Export
 *
 * */

export default Pie3DPoint;
