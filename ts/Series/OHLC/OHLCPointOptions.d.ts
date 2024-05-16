/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
