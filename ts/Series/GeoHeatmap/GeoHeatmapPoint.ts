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

import HeatmapPoint from '../Heatmap/HeatmapPoint.js';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';


const {
    seriesTypes: {
        map: {
            prototype: {
                pointClass: {
                    prototype: mapPointProto
                }
            }
        }
    }
} = SeriesRegistry;

const {
    extend
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

    public getCellAttributes(): HeatmapPoint.CellAttributes {
        const point = this;
        return {
            x1: (point.plotX || 0) - 20,

            x2: (point.plotX || 0) + 20,

            y1: (point.plotY || 0) - 20,

            y2: (point.plotY || 0) + 20
        };
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface GeoHeatmapPoint {
    getProjectedBounds: typeof mapPointProto.getProjectedBounds;
}

extend(GeoHeatmapPoint.prototype, {
    applyOptions: mapPointProto.applyOptions as any,
    getProjectedBounds: mapPointProto.getProjectedBounds
});

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapPoint;
