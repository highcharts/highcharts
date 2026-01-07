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
