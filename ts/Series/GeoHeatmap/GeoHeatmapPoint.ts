/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Authors: Magdalena Gut, Piotr Madej
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

import GeoHeatmapPointOptions from '../GeoHeatmap/GeoHeatmapPointOptions.js';
import GeoHeatmapSeries from '../GeoHeatmap/GeoHeatmapSeries.js';
import { PointShortOptions } from '../../Core/Series/PointOptions.js';
import U from '../../Core/Utilities.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    map: {
        prototype: {
            pointClass: MapPoint
        }
    }
} = SeriesRegistry.seriesTypes;

const {
    isNumber
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/KDPointSearchObjectBase' {
    interface KDPointSearchObjectBase {
        lat?: number;
        lon?: number;
    }
}

declare module '../../Core/Series/PointBase' {
    interface PointBase {
        lat?: number;
        lon?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

class GeoHeatmapPoint extends MapPoint {

    /* *
     *
     *  Properties
     *
     * */

    public lat!: number;

    public lon!: number;

    public options!: GeoHeatmapPointOptions;

    public series!: GeoHeatmapSeries;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public applyOptions(
        options: (GeoHeatmapPointOptions | PointShortOptions),
        x?: number
    ): GeoHeatmapPoint {
        const point = super.applyOptions.call(
                this, options, x
            ) as GeoHeatmapPoint,
            { lat, lon } = point.options;


        if (isNumber(lon) && isNumber(lat)) {
            const { colsize = 1, rowsize = 1 } = this.series.options,
                x1 = lon - colsize / 2,
                y1 = lat - rowsize / 2;

            point.geometry = point.options.geometry = {
                type: 'Polygon',
                // A rectangle centered in lon/lat
                coordinates: [
                    [
                        [x1, y1],
                        [x1 + colsize, y1],
                        [x1 + colsize, y1 + rowsize],
                        [x1, y1 + rowsize],
                        [x1, y1]
                    ]
                ]
            };
        }

        return point;

        /* eslint-enable valid-jsdoc */

    }
}

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapPoint;
