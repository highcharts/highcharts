/* *
 *
 *  Exporting module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type CSSObject from '../../Core/Renderer/CSSObject';
import type { ExportingButtonOptions } from './ExportingOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * A collection of options for buttons and menus appearing in the
         * exporting module or in Stock Tools.
         *
         * @requires     modules/exporting
         * @optionparent navigation
         */
        navigation?: NavigationOptions;
    }
}

export interface NavigationOptions {
    /**
     * A collection of options for buttons appearing in the exporting
     * module.
     *
     * In styled mode, the buttons are styled with the
     * `.highcharts-contextbutton` and `.highcharts-button-symbol` classes.
     *
     * @requires modules/exporting
     */
    buttonOptions?: ExportingButtonOptions;

    /**
     * CSS styles for the hover state of the individual items within the
     * popup menu appearing by default when the export icon is clicked. The
     * menu items are rendered in HTML.
     *
     * @see In styled mode, the menu items are styled with the
     *      `.highcharts-menu-item` class.
     *
     * @sample highcharts/navigation/menuitemhoverstyle/
     *         Bold text on hover
     *
     * @type    {Highcharts.CSSObject}
     * @default {"background": "#f2f2f2" }
     * @since   2.0
     */
    menuItemHoverStyle?: CSSObject;

    /**
     * CSS styles for the individual items within the popup menu appearing
     * by default when the export icon is clicked. The menu items are
     * rendered in HTML. Font size defaults to `11px` on desktop and `14px`
     * on touch devices.
     *
     * @see In styled mode, the menu items are styled with the
     *      `.highcharts-menu-item` class.
     *
     * @sample {highcharts} highcharts/navigation/menuitemstyle/
     *         Add a grey stripe to the left
     *
     * @type    {Highcharts.CSSObject}
     * @default {"padding": "0.5em", "color": "#333333", "background": "none", "borderRadius": "3px", "fontSize": "0.8em", "transition": "background 250ms, color 250ms"}
     * @since   2.0
     */
    menuItemStyle?: CSSObject;

    /**
     * CSS styles for the popup menu appearing by default when the export
     * icon is clicked. This menu is rendered in HTML.
     *
     * @see In styled mode, the menu is styled with the `.highcharts-menu`
     *      class.
     *
     * @sample highcharts/navigation/menustyle/
     *         Light gray menu background
     *
     * @type    {Highcharts.CSSObject}
     * @default {"background": "#ffffff", "borderRadius": "3px", "padding": "0.5em"}
     * @since   2.0
     */
    menuStyle?: CSSObject;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigationOptions;
