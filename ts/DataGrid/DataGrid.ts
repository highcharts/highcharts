/* *
 *
 *  Data Grid
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataGridOptions from './DataGridOptions';
import H from '../Core/Globals.js';
const {
    doc
} = H;
import U from '../Core/Utilities.js';
const {
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

class DataGrid {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: DataGridOptions = {
        // nothing here yet
    };

    constructor(container: (string|HTMLElement), options: DeepPartial<DataGridOptions>) {
        if (typeof container === 'string') {
            container = doc.getElementById(container) || doc.createElement('div');
        }
        this.container = container;
        this.options = merge(DataGrid.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public container: HTMLElement;

    public options: DataGridOptions;

    /* *
     *
     *  Functions
     *
     * */

}

export default DataGrid;
