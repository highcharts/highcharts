/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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

export interface MapLinePointOptions extends MapPointOptions {

    /**
     * Pixel width of the mapline line.
     *
     * @since 10.3.3
     *
     * @product highmaps
     */
    lineWidth?: number;

}

export default MapLinePointOptions;
