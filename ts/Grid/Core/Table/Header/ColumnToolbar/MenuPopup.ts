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

import type MenuToolbarButton from './Buttons/MenuToolbarButton.js';
import type Grid from '../../../Grid.js';

import ContextMenu from '../../../UI/ContextMenu.js';


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

    public button: MenuToolbarButton;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid, button: MenuToolbarButton) {
        super(grid);
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
        this.addItem('Sort descending');
        this.addItem('Sort ascending');
        this.addDivider();
        this.addItem('Filter', 'filter', true);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default MenuPopup;
