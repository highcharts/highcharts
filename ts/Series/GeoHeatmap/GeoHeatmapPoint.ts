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
 *  Class
 *
 * */
class GeoHeatmapPoint extends MapPoint {

    public options: GeoHeatmapPointOptions = void 0 as any;
    public series: GeoHeatmapSeries = void 0 as any;

    public applyOptions(
        options: (GeoHeatmapPointOptions|PointShortOptions),
        x?: number
    ): GeoHeatmapPoint {
        const point = super.applyOptions.call(this, options, x),
            lat = point.options.lat,
            lon = point.options.lon;

        if (isNumber(lon) && isNumber(lat)) {
            const colsize = this.series.options.colsize || 1,
                rowsize = this.series.options.rowsize || 1,
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
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapPoint;
