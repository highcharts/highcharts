/* *
 *
 *  Data Grid Sorting Controller class
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

import type { ColumnSortingOrder } from '../Options.js';

import DataGrid from '../DataGrid.js';
import SortModifier from '../../Data/Modifiers/SortModifier.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages one of the data grid querying types - sorting.
 */
class SortingController {

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
     * The column id that is currently sorted.
     */
    public sortedColumnId?: string;

    /**
     * The sorting order of the currently sorted column.
     */
    public sortingOrder?: ColumnSortingOrder;

    /**
     * The modifier that is applied to the data table.
     */
    public modifier?: SortModifier;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs the SortingController instance.
     *
     * @param dataGrid
     * The data grid instance.
     */
    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Should be called after the viewport is updated due to the data
     * modification.
     */
    public after(): void {

    }

    /**
     * Loads sorting options from the data grid options.
     *
     * @return
     * Returns true if the important sorting options were changed. False, when
     * the sorting options are the same.
     */
    public loadOptions(): boolean {
        const dataGrid = this.dataGrid,
            columnOptionsRecord = dataGrid.options?.columns;

        let optionsChanged = this.sortedColumnId !== void 0;

        if (!columnOptionsRecord) {
            return optionsChanged;
        }

        const columnIDs = Object.keys(columnOptionsRecord);

        let foundOneSortedColumn = false;
        for (let i = 0, iEnd = columnIDs.length; i < iEnd; ++i) {
            const columnId = columnIDs[i];
            const columnOptions = columnOptionsRecord[columnId];
            const order = columnOptions.sorting?.order;

            if (order && columnOptions.enabled !== false) {
                if (foundOneSortedColumn) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        'DataGrid: Only one column can be sorted at a time. ' +
                        'Data will be sorted only by the first found column ' +
                        'with the sorting order defined in the options.'
                    );
                    break;
                }

                optionsChanged =
                    this.sortedColumnId !== columnId ||
                    this.sortingOrder !== order;

                this.sortedColumnId = columnId;
                this.sortingOrder = order;
                foundOneSortedColumn = true;
            }
        }

        if (!foundOneSortedColumn) {
            if (this.sortedColumnId) {
                optionsChanged = true;
            }

            this.sortedColumnId = void 0;
            this.sortingOrder = void 0;
        }

        this.modifier = this.createModifier();

        return optionsChanged;
    }

    /**
     * Returns the sorting modifier based on the loaded sorting options.
     */
    private createModifier(): SortModifier | undefined {
        if (!this.sortedColumnId || !this.sortingOrder) {
            return;
        }

        return new SortModifier({
            orderByColumn: this.sortedColumnId,
            direction: this.sortingOrder
        });
    }

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace SortingController {

}


/* *
 *
 *  Default Export
 *
 * */

export default SortingController;
