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

import type ColorType from '../../Core/Color/ColorType';
import type HLCPointOptions from '../HLC/HLCPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface OHLCPointOptions extends HLCPointOptions {

    /**
     * The closing value of each data point.
     *
     * @product highstock
     */
    close?: number

    /**
     * The opening value of each data point.
     *
     * @product highstock
     */
    open?: number;

    upColor?: ColorType;

}

export default OHLCPointOptions;
