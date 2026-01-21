/* *
 *
 *  Grid Menu Popup class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
        const lang = this.grid.options?.lang || {};
        const columnOptions = this.button.toolbar?.column.options || {};
        const filteringEnabled = (
            columnOptions.filtering?.enabled &&
            !columnOptions.filtering.inline
        );
        const sortingEnabled = columnOptions.sorting?.enabled ??
            columnOptions.sorting?.sortable;

        this.addHeader(
            this.button.toolbar?.column.header?.value || '',
            lang.column
        );

        if (sortingEnabled) {
            new SortMenuButton(lang, 'desc').add(this);
            new SortMenuButton(lang, 'asc').add(this);

            if (filteringEnabled) {
                this.addDivider();
            }
        }

        if (filteringEnabled) {
            new FilterMenuButton(lang || {}).add(this);
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default MenuPopup;
