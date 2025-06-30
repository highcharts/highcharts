/* *
 *
 *  Column Distribution Strategy abstract class
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
import type ColumnsResizer from '../Actions/ColumnsResizer';

import U from '../../../../Core/Utilities.js';
const { getStyle } = U;


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
    *  Static Properties
    *
    * */

    /**
     * The minimum width of a column.
     * @internal
     */
    public static readonly MIN_COLUMN_WIDTH = 20;


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
    public columnWidths: Record<string, number> = {};

    /**
     * Whether the column distribution strategy is invalidated. This flag is
     * used to determine whether the column distribution strategy metadata
     * should be maintained when the table is destroyed and recreated.
     */
    public invalidated?: boolean;


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
    constructor(viewport: Table) {
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
    protected abstract loadColumn(column: Column): void;

    /**
     * Returns the column's current width in pixels.
     */
    public abstract getColumnWidth(column: Column): number;

    /**
     * Resizes the column by the given diff of pixels.
     *
     * @param resizer
     * The columns resizer instance that is used to resize the column.
     *
     * @param diff
     * The X position difference in pixels.
     */
    public abstract resize(resizer: ColumnsResizer, diff: number): void;

    /**
     * Loads the column to the distribution strategy. Should be called before
     * the table is rendered.
     */
    public loadColumns(): void {
        const { columns } = this.viewport;
        for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
            this.loadColumn(columns[i]);
        }
    }

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


    /* *
     *
     * Static Methods
     *
     * */

    /**
     * Returns the minimum width of the column.
     *
     * @param column
     * The column to get the minimum width for.
     *
     * @returns
     * The minimum width in pixels.
     */
    protected static getMinWidth(column: Column): number {
        const tableColumnEl = column.cells[0]?.htmlElement;
        const headerColumnEl = column.header?.htmlElement;

        const getElPaddings = (el: HTMLElement): number => (
            (getStyle(el, 'padding-left', true) || 0) +
            (getStyle(el, 'padding-right', true) || 0) +
            (getStyle(el, 'border-left', true) || 0) +
            (getStyle(el, 'border-right', true) || 0)
        );

        let result = ColumnDistributionStrategy.MIN_COLUMN_WIDTH;
        if (tableColumnEl) {
            result = Math.max(result, getElPaddings(tableColumnEl));
        }
        if (headerColumnEl) {
            result = Math.max(result, getElPaddings(headerColumnEl));
        }
        return result;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnDistributionStrategy;
