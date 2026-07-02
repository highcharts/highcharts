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
