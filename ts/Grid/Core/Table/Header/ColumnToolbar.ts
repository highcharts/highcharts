/* *
 *
 *  Grid Header Cell Toolbar class
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

import type Toolbar from '../../UI/Toolbar';
import type Column from '../Column';

import GridUtils from '../../GridUtils.js';
import Globals from '../../Globals.js';
import ToolbarButton from '../../UI/ToolbarButton.js';
import SortToolbarButton from './ColumnToolbarButtons/SortToolbarButton.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

class HeaderCellToolbar implements Toolbar {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The column that this toolbar belongs to.
     */
    public column: Column;

    public buttons: ToolbarButton[] = [];

    public container?: HTMLDivElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(column: Column) {
        this.column = column;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Initializes the buttons of the toolbar.
     */
    private addButtons(): void {
        const columnOptions = this.column.options;

        if (columnOptions.sorting?.sortable) {
            new SortToolbarButton().add(this);
        }

        if (
            columnOptions.filtering?.enabled &&
            !columnOptions.filtering.inline
        ) {
            new ToolbarButton({
                icon: 'filter',
                classNameKey: 'headerCellFilterIcon'
            }).add(this);
        }
    }

    /**
     * Render the toolbar.
     */
    public render(): void {
        const headerCell = this.column.header;
        if (!headerCell?.container) {
            return;
        }

        const container = this.container = makeHTMLElement('div', {
            className: Globals.getClassName('headerCellIcons')
        });

        this.addButtons();

        headerCell.container.appendChild(container);
    }

    /**
     * Reflows the toolbar. It is called when the column is resized.
     */
    public reflow(): void {
        // TODO: Implement
    }

    /**
     * Hide the toolbar.
     */
    public hideInactiveButtons(): void {
        // TODO: Implement
    }

    /**
     * Show the toolbar.
     */
    public showInactiveButtons(): void {
        // TODO: Implement
    }

    /**
     * Destroy the toolbar.
     */
    public destroy(): void {
        // TODO: Implement
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderCellToolbar;
