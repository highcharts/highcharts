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

import type Scatter3DSeriesOptions from './Scatter3DSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

import Math3D from '../../Core/Math3D.js';
const { pointCameraDistance } = Math3D;
import Scatter3DPoint from './Scatter3DPoint.js';
import Scatter3DSeriesDefaults from './Scatter3DSeriesDefaults.js';
import ScatterSeries from '../Scatter/ScatterSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.scatter3d
 *
 * @augments Highcharts.Series
 */
class Scatter3DSeries extends ScatterSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: Scatter3DSeriesOptions = merge(
        ScatterSeries.defaultOptions,
        Scatter3DSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<Scatter3DPoint> = void 0 as any;

    public options: Scatter3DSeriesOptions = void 0 as any;

    public points: Array<Scatter3DPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public pointAttribs(point: Scatter3DPoint): SVGAttributes {
        const attribs = super.pointAttribs.apply(this, arguments);

        if (this.chart.is3d() && point) {
            attribs.zIndex =
                pointCameraDistance(point as any, this.chart);
        }

        return attribs;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface Scatter3DSeries {
    pointClass: typeof Scatter3DPoint;
}

extend(Scatter3DSeries.prototype, {

    axisTypes: ['xAxis', 'yAxis', 'zAxis'],

    // Require direct touch rather than using the k-d-tree, because the
    // k-d-tree currently doesn't take the xyz coordinate system into
    // account (#4552)
    directTouch: true,

    parallelArrays: ['x', 'y', 'z'],

    pointArrayMap: ['x', 'y', 'z'],

    pointClass: Scatter3DPoint

});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        scatter3d: typeof Scatter3DSeries;
    }
}

SeriesRegistry.registerSeriesType('scatter3d', Scatter3DSeries);

/* *
 *
 *  Default Export
 *
 * */

export default Scatter3DSeries;
