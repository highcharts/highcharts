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
import DataGridTable from './DataGridTable.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a column in the data grid.
 */
class DataGridColumn {

    /* *
    *
    *  Properties
    *
    * */

    public viewport: DataGridTable;
    public widthRatio: number = 1;
    public cells: DataGridCell[] = [];
    public name: string;
    public data?: DataTable.Column;
    public type?: DataGridColumn.Type;
    public headElement?: HTMLElement;


    /* *
    *
    *  Constructor
    *
    * */

    constructor(viewport: DataGridTable, name: string) {
        this.name = name;
        this.viewport = viewport;
        this.data = viewport.dataTable.getColumn(name);
    }


    /* *
    *
    *  Methods
    *
    * */

    public registerCell(cell: DataGridCell): void {
        this.cells.push(cell);
    }

    public getWidth(): number {
        const { viewport } = this;
        return (
            viewport.tbodyElement.clientWidth / viewport.columns.length
        ) * this.widthRatio;
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

namespace DataGridColumn {
    export type Type = 'number'|'date'|'string'|'boolean';
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridColumn;
