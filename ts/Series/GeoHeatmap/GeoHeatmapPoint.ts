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


import MapPoint from '../Map/MapPoint.js';
import GeoHeatmapPointOptions from '../GeoHeatmap/GeoHeatmapPointOptions.js';
import GeoHeatmapSeries from '../GeoHeatmap/GeoHeatmapSeries.js';
import { PointShortOptions } from '../../Core/Series/PointOptions.js';

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

        let point: GeoHeatmapPoint =
            super.applyOptions.call(this, options, x) as any,
            lat = point.options.lat || 0,
            lon = point.options.lon || 0,
            colsize = this.series.options.colsize || 1,
            rowsize = this.series.options.rowsize || 1,
            x1 = lon - (colsize as number) / 2,
            y1 = lat - (rowsize as number) / 2;

        point.options.geometry = ({
            type: 'Polygon',
            coordinates: [
                [
                    [x1, y1],
                    [x1 + colsize, y1],
                    [x1 + colsize, y1 + rowsize],
                    [x1, y1 + rowsize]
                ]
            ]
        }) as any;

        return point;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapPoint;
