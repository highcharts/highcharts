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

import type MapPointOptions from '../Map/MapPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface GeoHeatmapPointOptions extends MapPointOptions {
    lat?: number;
    lon?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapPointOptions;
