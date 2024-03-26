/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type PositionObject from './PositionObject';
import type SizeObject from './SizeObject';

/* *
 *
 *  Declarations
 *
 * */

export interface BBoxObject extends PositionObject, SizeObject {
    height: number;
    width: number;
    x: number;
    y: number;
    polygon?: [number, number][]
}

/* *
 *
 *  Default Export
 *
 * */

export default BBoxObject;
