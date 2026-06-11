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

import type PositionObject from './PositionObject';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Object containing properties for the 3D position of an element.
 */
export interface Position3DObject extends PositionObject {
    /**
     * The Z position.
     */
    z: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default Position3DObject;
