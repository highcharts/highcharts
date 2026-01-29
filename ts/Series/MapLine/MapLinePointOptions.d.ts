/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
