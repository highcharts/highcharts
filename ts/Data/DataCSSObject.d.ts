/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
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
import type DataJSON from './DataJSON';
import type CSSObject from './../Core/Renderer/CSSObject';
import type ColorString from './../Core/Color/ColorString';

/* *
 *
 *  Interface
 *
 * */

interface CSSJSONObject extends CSSObject, DataJSON.JSONObject {
    fill?: ColorString;
}
