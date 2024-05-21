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
import DataTable from '../../Data/DataTable.js';
import Utils from './Utils.js';
import DataGridTable from './DataGridTable.js';

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

    public static defaultHeight = 41;

    public cells: DataGridCell[] = [];
    public htmlElement: HTMLTableRowElement;
    public dataTable: DataTable;
    public index: number;
    public destroyed: boolean = false;
    public viewport?: DataGridTable;


    /* *
    *
    *  Constructor
    *
    * */

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

    public render(viewport: DataGridTable): void {
        const columns = viewport.columns;

        this.viewport = viewport;

        for (let j = 0, jEnd = columns.length; j < jEnd; ++j) {
            const cell = new DataGridCell(columns[j], this);
            cell.render();
        }

        this.reflow();
    }

    public reflow(): void {
        for (let j = 0, jEnd = this.cells.length; j < jEnd; ++j) {
            this.cells[j].reflow();
        }
    }

    public destroy(): void {
        if (!this.htmlElement) {
            return;
        }

        this.htmlElement.remove();
        this.destroyed = true;
    }

    public registerCell(cell: DataGridCell): void {
        this.cells.push(cell);
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
