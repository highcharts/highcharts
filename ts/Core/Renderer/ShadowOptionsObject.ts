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

import type ColorString from '../Color/ColorString';

/* *
 *
 *  Declarations
 *
 * */

/**
 * The shadow options.
 */
export interface ShadowOptionsObject {
    /**
     * The color of the shadow.
     */
    color: ColorString;
    /**
     * The units for the filter effect. Can be `userSpaceOnUse` or `objectBoundingBox`.
     */
    filterUnits?: string;
    /**
     * The horizontal offset of the shadow.
     */
    offsetX: number;
    /**
     * The vertical offset of the shadow.
     */
    offsetY: number;
    /**
     * The opacity of the shadow.
     */
    opacity: number;
    /**
     * The blur radius of the shadow.
     */
    width: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ShadowOptionsObject;
