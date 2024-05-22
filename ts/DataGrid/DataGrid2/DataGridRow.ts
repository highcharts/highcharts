/* *
 *
 *  Data Grid class
 *
 *  (c) 2020-2024 Highsoft AS
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

import DataGridCell from './DataGridCell.js';
import DataGridTable from './DataGridTable.js';
import DataTable from '../../Data/DataTable.js';
import Globals from './Globals.js';
import Utils from './Utils.js';

const { makeHTMLElement } = Utils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid.
 */
class DataGridRow {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The default height of the row. To be changed in the future, has to be
     * taken from the user options or preferably from the CSS.
     */
    public static defaultHeight = 41;

    /**
     * The cells of the row.
     */
    public cells: DataGridCell[] = [];

    /**
     * The HTML element of the row.
     */
    public htmlElement: HTMLTableRowElement;

    /**
     * The data for the viewport.
     */
    public dataTable: DataTable;

    /**
     * The index of the row in the data table.
     */
    public index: number;

    /**
     * Whether the row is destroyed.
     */
    public destroyed: boolean = false;

    /**
     * The viewport the row belongs to.
     */
    public viewport?: DataGridTable;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a row in the data grid.
     *
     * @param dataTable The data for the viewport.
     * @param index The index of the row in the data table.
     */
    constructor(dataTable: DataTable, index: number) {
        this.dataTable = dataTable;
        this.index = index;

        this.htmlElement = makeHTMLElement('tr', {
            style: {
                height: DataGridRow.defaultHeight + 'px',
                transform: `translateY(${index * DataGridRow.defaultHeight}px)`
            }
        });

        this.htmlElement.setAttribute('row-index', index);
        this.htmlElement.setAttribute('aria-rowindex', index);
        this.htmlElement.setAttribute('row-id', index);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the row's content. It does not attach the row element to the
     * viewport nor pushes the rows to the viewport.rows array.
     *
     * @param viewport The viewport of the data grid.
     */
    public render(viewport: DataGridTable): void {
        const columns = viewport.columns;

        this.viewport = viewport;

        for (let j = 0, jEnd = columns.length; j < jEnd; ++j) {
            const cell = new DataGridCell(columns[j], this);
            cell.render();
        }

        this.reflow();
    }

    /**
     * Reflows the row's content dimensions.
     */
    public reflow(): void {
        for (let j = 0, jEnd = this.cells.length; j < jEnd; ++j) {
            this.cells[j].reflow();
        }
    }

    /**
     * Destroys the row.
     */
    public destroy(): void {
        if (!this.htmlElement) {
            return;
        }

        this.htmlElement.remove();
        this.destroyed = true;
    }

    /**
     * Registers a cell in the row.
     */
    public registerCell(cell: DataGridCell): void {
        this.cells.push(cell);
    }

    /**
     * Sets the row hover state.
     *
     * @param hovered Whether the row should be hovered.
     */
    public setHovered(hovered: boolean): void {
        this.htmlElement.classList[hovered ? 'add' : 'remove'](
            Globals.classNames.hoveredRow
        );
    }


    /* *
    *
    *  Static Methods
    *
    * */

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridRow {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridRow;
