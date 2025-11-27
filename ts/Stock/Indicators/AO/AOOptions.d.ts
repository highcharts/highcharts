/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorString from '../../../Core/Color/ColorString';
import type { SeriesStatesOptions } from '../../../Core/Series/SeriesOptions';
import type {
    SMAOptions
} from '../SMA/SMAOptions';

/* *
*
*  Declarations
*
* */

export interface AOOptions extends SMAOptions {
    greaterBarColor?: ColorString;
    groupPadding?: number;
    lowerBarColor?: ColorString;
    pointPadding?: number;
    states?: SeriesStatesOptions<AOOptions>;
    threshold?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AOOptions;
