/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type CSSObject from '../Core/Renderer/CSSObject';
import type ColorString from '../Core/Color/ColorString';
import type JSON from './JSON';

/* *
 *
 *  Interface
 *
 * */

export interface CSSJSONObject extends CSSObject, JSON.Object {
    fill?: ColorString;
    stroke?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default CSSJSONObject;
