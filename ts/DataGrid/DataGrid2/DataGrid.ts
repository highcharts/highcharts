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

import type DataGridOptions from '../DataGridOptions';

import DataTable from '../../Data/DataTable.js';
import Utils from './Utils.js';
import Globals from './Globals.js';
import DataGridTable from './DataGridTable.js';

const { makeDiv } = Utils;
const { win } = Globals;


/* *
 *
 *  Class
 *
 * */

/**
 * Creates a scrollable grid structure (table).
 */
class DataGrid {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The container of the data grid.
     */
    public container: HTMLElement;

    /**
     * The data source of the data grid.
     */
    public dataTable: DataTable;

    /**
     * The table (viewport) element of the data grid.
     */
    public viewport: DataGridTable;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new data grid.
     *
     * @param renderTo The render target (container) of the data grid.
     * @param options The options of the data grid.
     */
    constructor(renderTo: string|HTMLElement, options: DataGridOptions) {
        this.container = DataGrid.initContainer(renderTo);
        this.dataTable = options.dataTable ?? new DataTable();
        this.viewport = new DataGridTable(this.dataTable, this.container);
    }

    /* *
    *
    *  Methods
    *
    * */


    /* *
    *
    *  Static Methods
    *
    * */

    /**
     * Initializes the container of the data grid.
     *
     * @param renderTo The render target (html element or id) of the data grid.
     * @returns The container element of the data grid.
     */
    private static initContainer(renderTo: string|HTMLElement): HTMLElement {
        if (typeof renderTo === 'string') {
            const existingContainer = win.document.getElementById(renderTo);
            if (existingContainer) {
                existingContainer.classList.add(Globals.classNames.container);
                return existingContainer;
            }
            return makeDiv(Globals.classNames.container, renderTo);
        }
        renderTo.classList.add(Globals.classNames.container);
        return renderTo;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGrid {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGrid;
