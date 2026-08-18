/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Authors: Magdalena Gut, Piotr Madej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
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
