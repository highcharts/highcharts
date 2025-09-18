/* *
 *
 *  Grid Toolbar interface
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
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
}

export default Toolbar;
