/* *
 *
 *  Data Grid Querying Controller class
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

import ChainModifier from '../../Data/Modifiers/ChainModifier.js';
/* *
 *
 *  Imports
 *
 * */

import DataGrid from '../DataGrid.js';
import SortingController from './SortingController.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manage data modification of the visible data in the data grid.
 * It manages the modifiers that are applied to the data table.
 */
class QueryingController {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The data grid instance.
     */
    private dataGrid: DataGrid;

    /**
     * Sorting controller instance
     */
    public sorting: SortingController;

    /**
     * Flag that indicates if the data should be modified.
     */
    private foundSignificantChanges: boolean = false;


    /* *
    *
    *  Constructor
    *
    * */

    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;
        this.sorting = new SortingController(dataGrid);
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Loads all new options and proceeds with the data modification if needed.
     * Should be called after any change in the data grid options if there's a
     * possibility that the significant changes were made for querying.
     */
    public async proceed(): Promise<void> {
        this.loadOptions();
        if (this.foundSignificantChanges) {
            await this.modifyData();
        }
    }

    /**
     * Load all options needed to generate the modifiers.
     */
    private loadOptions(): void {
        this.foundSignificantChanges = this.sorting.loadOptions();
    }

    /**
     * Apply all modifiers to the data table.
     */
    private async modifyData(): Promise<void> {
        const originalDataTable = this.dataGrid.dataTable;
        if (!originalDataTable) {
            return;
        }

        const modifiers = [];

        // TODO: Implement filtering
        // if (this.filtering.modifier) {
        //     modifiers.push(this.filtering.modifier);
        // }

        if (this.sorting.modifier) {
            modifiers.push(this.sorting.modifier);
        }

        if (modifiers.length > 0) {
            const chainModifier = new ChainModifier({}, ...modifiers);
            await chainModifier.modify(originalDataTable);
        } else {
            originalDataTable.modified = originalDataTable;
        }

        this.sorting.after();
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace QueryingController {

}


/* *
 *
 *  Default Export
 *
 * */

export default QueryingController;
