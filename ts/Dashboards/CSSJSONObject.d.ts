/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
