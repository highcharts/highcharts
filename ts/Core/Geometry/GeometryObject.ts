/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import type PositionObject from '../Renderer/PositionObject';

/* *
 *
 *  Declarations
 *
 * */

export interface GeometryObject extends PositionObject {
    angle?: number;
    r?: number;
    indexes?: [number, number];
}

/* *
 *
 *  Default Export
 *
 * */

export default GeometryObject;
