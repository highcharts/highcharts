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
     * Constructs fitering controller for a dedicated column.
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
     * Filters the rows by checking if the column contains the given string
     * in the cell values.
     *
     * @param contains
     * The string to check for in the cell values. If not provided, filter for
     * this column will be cleared.
     */
    public async filterContaining(contains?: string): Promise<void> {
        const viewport = this.column.viewport;
        const querying = viewport.grid.querying;
        const filteringController = querying.filtering;

        filteringController.addSimpleCondition(this.column.id, contains);
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
