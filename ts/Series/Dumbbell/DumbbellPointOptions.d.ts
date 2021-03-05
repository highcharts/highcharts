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

import type AreaRangePointOptions from '../AreaRange/AreaRangePointOptions';
import type ColorType from '../../Core/Color/ColorType';
import DashStyleValue from '../../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */
interface DumbbellPointOptions extends AreaRangePointOptions {
    connectorColor?: ColorType;
    connectorWidth?: number;
    dashStyle?: DashStyleValue;
    lowColor?: ColorType;
}

/* *
 *
 *  Default export
 *
 * */

export default DumbbellPointOptions;
