/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
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
import type { JSONObject } from './JSON';

/* *
 *
 *  Interface
 *
 * */

export interface CSSJSONObject extends CSSObject, JSONObject {
    fill?: ColorString;
    stroke?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default CSSJSONObject;
