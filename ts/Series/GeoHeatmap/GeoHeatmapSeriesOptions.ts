/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *
 *  Authors: Magdalena Gut, Piotr Madej
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type MapSeriesOptions from '../Map/MapSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface InterpolationObject {
    enabled: boolean,
    blur: number;
}

interface GeoHeatmapSeriesOptions extends MapSeriesOptions {
    colsize?: number;
    rowsize?: number;
    interpolation: boolean|InterpolationObject;
}

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapSeriesOptions;
