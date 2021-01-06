/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type LinePointOptions from '../Line/LinePointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        borderColor?: ColorType;
    }
}

export interface ColumnPointOptions extends LinePointOptions {
    dashStyle?: DashStyleValue;
    pointWidth?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPointOptions;
