/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type PointOptions from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        keys?: Array<string>;
    }
    interface PointStateHoverOptions {
        radius?: number;
        radiusPlus?: number;
    }
}

export interface LinePointOptions extends PointOptions {
    // nothing here yet
}

/* *
 *
 *  Default Export
 *
 * */

export default LinePointOptions;
