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

import type SVGPath from './SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface SVGPath3D {
    back?: SVGPath;
    bottom?: SVGPath;
    front?: SVGPath;
    side?: SVGPath;
    top?: SVGPath;
    zIndexes?: Record<string, number>;
}

export default SVGPath3D;
