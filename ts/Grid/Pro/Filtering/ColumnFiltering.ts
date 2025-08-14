/* *
 *
 *  Grid ColumnFiltering class
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

import Column from '../../Core/Table/Column.js';
import U from '../../../Core/Utilities.js';
import { FilteringOptions } from '../../Core/Options.js';

const { fireEvent } = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages filtering for a dedicated column.
 */
class ColumnFiltering {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The filtered column of the table.
     */
    public column: Column;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs filtering controller for a dedicated column.
     *
     * @param column
     * The filtered column.
     */
    constructor(column: Column) {
        this.column = column;
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Applies the filtering to the column.
     *
     * @param options
     * The filtering options.
     */
    public async applyFilter(options: FilteringOptions): Promise<void> {
        const viewport = this.column.viewport;
        const querying = viewport.grid.querying;
        const filteringController = querying.filtering;

        filteringController.addFilterCondition(this.column.id, options);
        await querying.proceed();

        viewport.loadPresentationData();

        fireEvent(this.column, 'afterFiltering', {
            target: this.column
        });
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnFiltering;
