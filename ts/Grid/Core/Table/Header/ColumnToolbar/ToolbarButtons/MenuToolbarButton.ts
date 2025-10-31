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
import StateHelpers from '../StateHelpers.js';
import MenuPopup from '../MenuPopup.js';
import U from '../../../../../../Core/Utilities.js';

const { addEvent } = U;


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

    protected override refreshState(): void {
        const column = this.toolbar?.column;
        if (!column) {
            return;
        }

        this.setActive(
            StateHelpers.isSorted(column) ||
            StateHelpers.isFiltered(column)
        );
    }

    protected override addEventListeners(): void {
        super.addEventListeners();
        const column = this.toolbar?.column;
        if (!column) {
            return;
        }

        this.eventListenerDestroyers.push(
            addEvent(column.viewport.grid, 'afterSort', (): void => {
                this.refreshState();
            }),
            addEvent(column, 'afterFilter', (): void => {
                this.refreshState();
            })
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default MenuToolbarButton;
