/* *
 *
 *  (c) 2020 - 2021 Highsoft AS
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

/**
 * Global Dashboard namespace in classic `<scripts>`-based implementations.
 *
 * @namespace Dashboard
 */
namespace Globals {

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

export default Globals;
