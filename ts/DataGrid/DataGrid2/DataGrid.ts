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

    constructor(renderTo: string|HTMLElement) {
        this.container = DataGrid.initContainer(renderTo);

        this.dataTable = new DataTable({
            columns: {
                a: Array.from({ length: 10e4 }, (_, i): string => `A${i}`),
                b: Array.from({ length: 10e4 }, (_, i): string => `B${i}`),
                c: Array.from({ length: 10e4 }, (_, i): string => `C${i}`),
                d: Array.from({ length: 10e4 }, (_, i): string => `D${i}`),
                e: Array.from({ length: 10e4 }, (_, i): string => `E${i}`),
                f: Array.from({ length: 10e4 }, (_, i): string => `F${i}`)
            }
        });

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
