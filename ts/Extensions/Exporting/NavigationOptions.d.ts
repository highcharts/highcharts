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
        navigation?: NavigationOptions;
    }
}

export interface NavigationOptions {
    bindingsClassName?: string;
    buttonOptions?: ExportingButtonOptions;
    menuItemHoverStyle?: CSSObject;
    menuItemStyle?: CSSObject;
    menuStyle?: CSSObject;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigationOptions;
