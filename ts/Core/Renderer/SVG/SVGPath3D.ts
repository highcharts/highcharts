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

/* *
 *
 *  Default Export
 *
 * */

export default SVGPath3D;
