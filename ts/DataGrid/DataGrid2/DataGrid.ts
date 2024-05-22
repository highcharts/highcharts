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
import Globals from '../Globals.js';
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

    public container: HTMLElement;
    public dataTable: DataTable;
    public viewport: DataGridTable;


    /* *
    *
    *  Constructor
    *
    * */

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

    private static initContainer(renderTo: string|HTMLElement): HTMLElement {
        if (typeof renderTo === 'string') {
            const existingContainer = win.document.getElementById(renderTo);
            if (existingContainer) {
                return existingContainer;
            }
            return makeDiv(Globals.classNames.gridContainer, renderTo);
        }
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
