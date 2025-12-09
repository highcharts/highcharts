/* *
 *
 *  Grid Toolbar interface
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type ToolbarButton from './ToolbarButton.js';

/* *
 *
 *  Interface
 *
 * */

interface Toolbar {
    /**
     * The buttons of the toolbar.
     */
    buttons: ToolbarButton[];

    /**
     * The container element of the toolbar.
     */
    container?: HTMLDivElement;

    /**
     * The index of the focused button in the toolbar.
     */
    focusCursor: number;
}


/* *
 *
 *  Default Export
 *
 * */

export default Toolbar;
