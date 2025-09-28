/* *
 *
 *  Grid Menu Toolbar Button class
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

import type ColumnToolbar from '../ColumnToolbar.js';

import ToolbarButton from '../../../../UI/ToolbarButton.js';
import MenuPopup from '../MenuPopup.js';


/* *
 *
 *  Class
 *
 * */

class MenuToolbarButton extends ToolbarButton {


    /* *
     *
     *  Properties
     *
     * */

    public override toolbar?: ColumnToolbar;

    public override popup?: MenuPopup;


    /* *
     *
     *  Constructor
     *
     * */

    constructor() {
        super({
            icon: 'menu',
            classNameKey: 'headerCellMenuIcon'
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override clickHandler(event: MouseEvent): void {
        super.clickHandler(event);

        const grid = this.toolbar?.column.viewport.grid;
        if (!grid) {
            return;
        }

        if (!this.popup) {
            this.popup = new MenuPopup(grid, this);
        }

        this.popup.toggle(this.wrapper);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default MenuToolbarButton;
