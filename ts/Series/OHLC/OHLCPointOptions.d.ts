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
