/* *
 *
 *  Imports
 *
 * */

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @optionparent series.funnel3d.data
 */
export interface Funnel3DPointOptions extends ColumnPointOptions {

    dlBox?: BBoxObject;

    /**
     * By default sides fill is set to a gradient through this option being
     * set to `true`. Set to `false` to get solid color for the sides.
     *
     * @type {boolean}
     *
     * @product highcharts
     *
     * @apioption series.funnel3d.data.gradientForSides
     */
    gradientForSides?: boolean;

    y?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default Funnel3DPointOptions;
