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

// Extend interfaces so pointAttrToOptions' stroke-width can be 'lineWidth'.

declare module '../../Core/Series/PointBase' {
    interface PointBase {
        lineWidth?: number;
    }
}
declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        lineWidth?: number;
    }
}
declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        lineWidth?: number;
    }
}

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
