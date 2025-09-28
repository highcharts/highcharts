/* *
 *
 *  Grid Menu Popup class
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

import type MenuToolbarButton from './ToolbarButtons/MenuToolbarButton.js';
import type Grid from '../../../Grid.js';

import ContextMenu from '../../../UI/ContextMenu.js';
import FilterMenuButton from './MenuButtons/FilterMenuButton.js';
import SortMenuButton from './MenuButtons/SortMenuButton.js';


/* *
 *
 *  Class
 *
 * */

/**
 * The column filtering popup.
 */
class MenuPopup extends ContextMenu {

    /* *
     *
     *  Properties
     *
     * */

    public override button: MenuToolbarButton;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid, button: MenuToolbarButton) {
        super(grid, button);
        this.button = button;
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override renderContent(): void {
        this.addHeader(
            this.button.toolbar?.column.header?.value || '',
            'Column'
        );
        new SortMenuButton('desc').add(this);
        new SortMenuButton('asc').add(this);
        this.addDivider();
        new FilterMenuButton().add(this);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default MenuPopup;
