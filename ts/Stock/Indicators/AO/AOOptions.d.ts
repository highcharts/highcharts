/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AOIndicator from './AOIndicator';
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
    states?: SeriesStatesOptions<AOIndicator>;
    threshold?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AOOptions;
