/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Lysy
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

import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface HLCPointOptions extends ColumnPointOptions {

    /**
     * The closing value of each data point.
     *
     * @product highstock
     */
    close?: number;

}

export default HLCPointOptions;
