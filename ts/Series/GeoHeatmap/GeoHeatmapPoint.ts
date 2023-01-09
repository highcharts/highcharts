/* *
 *
 *  (c) 2010-2023 Highsoft AS
 *  Authors:
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

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type GeoHeatmapPointOptions from './GeoHeatmapPointOptions';
import type GeoHeatmapSeries from './GeoHeatmapSeries';

import ColorAxisComposition from '../../Core/Axis/Color/ColorAxisComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';

const {
    seriesTypes: {
        heatmap: {
            prototype: {
                pointClass: HeatmapPoint
            }
        }
    }
} = SeriesRegistry;

const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

class GeoHeatmapPoint extends HeatmapPoint {

    /* *
     *
     *  Properties
     *
     * */

    /* *
     *
     *  Functions
     *
     * */

}

/* *
 *
 *  Class Prototype
 *
 * */

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapPoint;
