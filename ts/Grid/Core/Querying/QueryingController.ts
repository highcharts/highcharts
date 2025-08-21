/* *
 *
 *  Grid Querying Controller class
 *
 *  (c) 2020-2025 Highsoft AS
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

import ChainModifier from '../../../Data/Modifiers/ChainModifier.js';
import DataModifier from '../../../Data/Modifiers/DataModifier.js';
import Grid from '../Grid.js';
import SortingController from './SortingController.js';
import PaginationController from './PaginationController.js';

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
    public grid: Grid;

    /**
     * Sorting controller instance
     */
    public sorting: SortingController;

    /**
     * This flag should be set to `true` if the modifiers should reapply to the
     * data table due to some data change or other important reason.
     */
    public shouldBeUpdated: boolean = false;

    /**
     * Pagination controller instance
     */
    public pagination: PaginationController;


    /* *
    *
    *  Constructor
    *
    * */

    constructor(grid: Grid) {
        this.grid = grid;
        this.sorting = new SortingController(this);
        this.pagination = new PaginationController(this);
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
        if (force || this.shouldBeUpdated) {
            await this.modifyData();
        }
    }

    /**
     * Load all options needed to generate the modifiers.
     */
    public loadOptions(): void {
        this.sorting.loadOptions();
        this.pagination.loadOptions();
    }

    /**
     * Creates a list of modifiers that should be applied to the data table.
     */
    public getModifiers(): DataModifier[] {
        const modifiers: DataModifier[] = [];

        if (this.sorting.modifier) {
            modifiers.push(this.sorting.modifier);
        }

        if (this.pagination.modifier) {
            modifiers.push(this.pagination.modifier);
        }

        return modifiers;
    }

    /**
     * Apply all modifiers to the data table.
     */
    private async modifyData(): Promise<void> {
        const originalDataTable = this.grid.dataTable;
        if (!originalDataTable) {
            return;
        }

        const modifiers = this.getModifiers();

        if (modifiers.length > 0) {
            const chainModifier = new ChainModifier({}, ...modifiers);
            const dataTableCopy = originalDataTable.clone();
            await chainModifier.modify(dataTableCopy.getModified());
            this.grid.presentationTable = dataTableCopy.getModified();
        } else {
            this.grid.presentationTable = originalDataTable.getModified();
        }

        this.shouldBeUpdated = false;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default QueryingController;
