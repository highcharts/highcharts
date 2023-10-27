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

export interface Funnel3DPointOptions extends ColumnPointOptions {
    gradientForSides?: boolean;
    dlBox?: BBoxObject;
    y?: number;
}

export default Funnel3DPointOptions;
