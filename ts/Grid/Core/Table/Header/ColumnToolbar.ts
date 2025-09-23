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
import FilterToolbarButton from './ColumnToolbarButtons/FilterToolbarButton.js';
import MenuToolbarButton from './ColumnToolbarButtons/MenuToolbarButton.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

class HeaderCellToolbar implements Toolbar {

    static MINIMIZED_COLUMN_WIDTH: number = 120;

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

    private isMinimized?: boolean;

    private columnResizeObserver?: ResizeObserver;


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
    private renderFull(): void {
        const columnOptions = this.column.options;

        if (columnOptions.sorting?.sortable) {
            new SortToolbarButton().add(this);
        }

        if (
            columnOptions.filtering?.enabled &&
            !columnOptions.filtering.inline
        ) {
            new FilterToolbarButton().add(this);
        }
    }

    private renderMinimized(): void {
        new MenuToolbarButton().add(this);
    }

    /**
     * Render the toolbar.
     */
    public add(): void {
        const headerCell = this.column.header;
        if (!headerCell?.container) {
            return;
        }

        if (this.columnResizeObserver) {
            this.columnResizeObserver.disconnect();
            delete this.columnResizeObserver;
        }

        this.columnResizeObserver = new ResizeObserver(
            (): void => this.reflow()
        );
        this.columnResizeObserver.observe(headerCell.container);

        const container = this.container = makeHTMLElement('div', {
            className: Globals.getClassName('headerCellIcons')
        });

        headerCell.container.appendChild(container);
    }

    public clearButtons(): void {
        while (this.buttons.length > 0) {
            this.buttons[this.buttons.length - 1].destroy();
        }
    }

    /**
     * Reflows the toolbar. It is called when the column is resized.
     */
    public reflow(): void {
        const width = this.column.getWidth();
        const shouldBeMinimized =
            width <= HeaderCellToolbar.MINIMIZED_COLUMN_WIDTH;

        if (this.isMinimized !== shouldBeMinimized) {
            this.isMinimized = shouldBeMinimized;

            this.clearButtons();
            if (shouldBeMinimized) {
                this.renderMinimized();
            } else {
                this.renderFull();
            }
        }
    }

    /**
     * Destroy the toolbar.
     */
    public destroy(): void {
        this.columnResizeObserver?.disconnect();
        delete this.columnResizeObserver;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderCellToolbar;
