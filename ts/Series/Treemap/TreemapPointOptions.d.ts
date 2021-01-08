/* *
 *
 *  (c) 2014-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard / Oystein Moseng
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

import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface TreemapPointOptions extends ScatterPointOptions {
    name?: string;
    parent?: string;
    value?: (number|null);
    width?: number;
}

export default TreemapPointOptions;
