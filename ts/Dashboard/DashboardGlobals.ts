'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GUIElement from './Layout/GUIElement';

/* *
 *
 *  Namespace
 *
 * */

namespace DashboardGlobals {

    /* *
     *
     *  Constants
     *
     * */

    /**
     *
     * Prefix of a GUIElement HTML class name.
     *
     */
    export const classNamePrefix = 'hd-';

    export const classNames = {
        layout: classNamePrefix + 'layout',
        cell: classNamePrefix + 'cell',
        row: classNamePrefix + 'row',
        layoutsWrapper: classNamePrefix + 'layouts-wrapper'
    };

    export const guiElementType: Record<string, GUIElement.GUIElementType> = {
        row: 'row',
        cell: 'cell',
        layout: 'layout'
    };

    export const respoBreakpoints: Record<string, string> = {
        small: 'small',
        medium: 'medium',
        large: 'large'
    };

    export const win = window;

}

/* *
 *
 *  Default Export
 *
 * */

export default DashboardGlobals;
