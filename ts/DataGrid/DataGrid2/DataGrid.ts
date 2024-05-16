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
import DataGridUtils from '../DataGridUtils.js';
import Globals from '../Globals.js';

const { makeDiv } = DataGridUtils;
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


    /* *
    *
    *  Constructor
    *
    * */

    constructor(renderTo: string|HTMLElement) {
        this.container = DataGrid.initContainer(renderTo);

        this.dataTable = new DataTable({
            columns: {
                product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                weight: [100, 40, 0.5, 200],
                price: [1.5, 2.53, 5, 4.5],
                metaData: ['a', 'b', 'c', 'd'],
                icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
            }
        });
    }

    /* *
    *
    *  Methods
    *
    * */

    public test(): void {
        // eslint-disable-next-line no-console
        console.log('test method');
    }


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
