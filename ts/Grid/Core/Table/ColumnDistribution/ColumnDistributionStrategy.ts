/* *
 *
 *  Column Distribution class
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

import type { ColumnDistributionType } from '../../Options';
import type Table from '../Table';
import type Column from '../Column.js';

import U from '../../../../Core/Utilities.js';
const { defined } = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a column distribution strategy.
 */
abstract class ColumnDistributionStrategy {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The type of the column distribution strategy.
     */
    public abstract readonly type: ColumnDistributionType;

    /**
     * The table that the column distribution strategy is applied to.
     */
    public readonly viewport: Table;

    /**
     * The current widths values of the columns.
     */
    public readonly columnWidths: Record<string, number> = {};


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Creates a new column distribution strategy.
     *
     * @param viewport
     * The table that the column distribution strategy is applied to.
     */
    constructor (viewport: Table) {
        this.viewport = viewport;
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Performs important calculations when the column is loaded.
     *
     * @param column
     * The column that is loaded.
     */
    public abstract loadColumn(column: Column): void;

    /**
     * Returns the column's current width in pixels.
     */
    public abstract getColumnWidth(column: Column): number;

    /**
     * Recaulculates the changing dimentions of the table.
     */
    public reflow(): void {
        if (this.type === 'full') {
            return;
        }

        const vp = this.viewport;

        let rowsWidth = 0;
        for (let i = 0, iEnd = vp.columns.length; i < iEnd; ++i) {
            rowsWidth += this.getColumnWidth(vp.columns[i]);
        }

        vp.rowsWidth = rowsWidth;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnDistributionStrategy;
