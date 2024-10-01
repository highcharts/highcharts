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


/* *
 *
 *  Imports
 *
 * */

import ChainModifier from '../../Data/Modifiers/ChainModifier.js';
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


    /* *
    *
    *  Constructor
    *
    * */

    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;
        this.sorting = new SortingController(dataGrid);
        /// this.filtering = new FilteringController(dataGrid);
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Proceeds with the data modification if needed.
     *
     * @param force
     * If the data should be modified even if the significant options are not
     * changed.
     */
    public async proceed(force: boolean = false): Promise<void> {
        if (
            force ||
            this.sorting.shouldBeUpdated // ||
            // this.filtering.shouldBeUpdated
        ) {
            await this.modifyData();
        }
    }

    /**
     * Load all options needed to generate the modifiers.
     */
    public loadOptions(): void {
        this.sorting.loadOptions();
    }

    /**
     * Check if the data table does not need to be modified.
     */
    public willNotModify(): boolean {
        return (
            !this.sorting.modifier
            // && !this.filtering.modifier
        );
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
            const dataTableCopy = originalDataTable.clone();
            await chainModifier.modify(dataTableCopy.modified);
            this.dataGrid.presentationTable = dataTableCopy.modified;
        } else {
            this.dataGrid.presentationTable = originalDataTable.modified;
        }

        this.sorting.shouldBeUpdated = false;
        /// this.filtering.shouldBeUpdated = false;
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
