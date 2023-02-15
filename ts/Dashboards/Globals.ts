/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
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
 *  - Pawel Lysy
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GUIElement from './Layout/GUIElement';
import type Board from './Board';

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
        cellHover: classNamePrefix + 'cell-state-hover',
        cellActive: classNamePrefix + 'cell-state-active',
        row: classNamePrefix + 'row',
        layoutsWrapper: classNamePrefix + 'layouts-wrapper',
        boardContainer: classNamePrefix + 'dashboards-wrapper'
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

    export const boards: Array<Board|undefined> = [];

    export const win = window;

}

/* *
 *
 *  Default Export
 *
 * */

export default Globals;
