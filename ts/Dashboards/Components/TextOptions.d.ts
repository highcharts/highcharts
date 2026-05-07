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

import type CSSObject from '../../Core/Renderer/CSSObject';

/**
 * Options for configuring a more custom text.
*/
declare interface TextOptions {
    /**
     * The class name which is added to the text element.
    */
    className?: string;
    /**
     * A collection of CSS properties for the text.
    */
    style?: CSSObject;
    /**
     * The text content itself.
    */
    text?: string;
}

export default TextOptions;
