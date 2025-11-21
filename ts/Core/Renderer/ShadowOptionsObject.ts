/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
