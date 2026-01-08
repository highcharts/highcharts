/* *
 *
 *  Resizing Mode abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { ColumnResizingMode } from './ColumnResizing';
import type Table from '../Table';
import type Column from '../Column.js';
import type ColumnsResizer from '../Actions/ColumnsResizer';

import U from '../../../../Core/Utilities.js';
const {
    getStyle,
    defined
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a column distribution strategy.
 */
abstract class ResizingMode {

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
    public abstract readonly type: ColumnResizingMode;

    /**
     * The table that the column distribution strategy is applied to.
     */
    public readonly viewport: Table;

    /**
     * The current widths values of the columns.
     */
    public columnWidths: Record<string, number> = {};

    /**
     * Array of units for each column width value. Codified as:
     * - `0` - px
     * - `1` - %
     */
    public columnWidthUnits: Record<string, number> = {};

    /**
     * Whether the column distribution strategy is invalidated. This flag is
     * used to determine whether the column distribution strategy metadata
     * should be maintained when the table is destroyed and recreated.
     */
    public invalidated?: boolean;

    /**
     * Whether the column distribution strategy is dirty. This flag is used to
     * determine whether the column widths should be re-loaded.
     */
    public isDirty?: boolean;


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
     * Returns the column's current width in pixels.
     *
     * @param column
     * The column to get the width for.
     *
     * @returns
     * The column's current width in pixels.
     */
    public getColumnWidth(column: Column): number {
        const vp = this.viewport;
        const widthValue = this.columnWidths[column.id];
        const minWidth = ResizingMode.getMinWidth(column);

        if (!defined(widthValue)) {
            const tbody = vp.tbodyElement;
            const freeWidth =
                tbody.getBoundingClientRect().width -
                this.calculateOccupiedWidth() -
                tbody.offsetWidth + tbody.clientWidth;
            const freeColumns =
                (vp.grid.enabledColumns?.length || 0) -
                Object.keys(this.columnWidths).length;

            // If undefined width:
            return Math.max(freeWidth / freeColumns, minWidth);
        }

        if (this.columnWidthUnits[column.id] === 0) {
            // If px:
            return widthValue;
        }

        // If %:
        return Math.max(vp.getWidthFromRatio(widthValue / 100), minWidth);
    }

    /**
     * Performs important calculations when the column is loaded.
     *
     * @param column
     * The column that is loaded.
     */
    public loadColumn(column: Column): void {
        const rawWidth = column.options.width;
        if (!rawWidth) {
            return;
        }

        let value: number;
        let unitCode: number = 0;

        if (typeof rawWidth === 'number') {
            value = rawWidth;
            unitCode = 0;
        } else {
            value = parseFloat(rawWidth);
            unitCode = rawWidth.charAt(rawWidth.length - 1) === '%' ? 1 : 0;
        }

        this.columnWidthUnits[column.id] = unitCode;
        this.columnWidths[column.id] = value;
    }

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

        let result = ResizingMode.MIN_COLUMN_WIDTH;
        if (tableColumnEl) {
            result = Math.max(result, getElPaddings(tableColumnEl));
        }
        if (headerColumnEl) {
            result = Math.max(result, getElPaddings(headerColumnEl));
        }
        return result;
    }

    /**
     * Calculates defined (px and %) widths of all columns with non-undefined
     * widths in the grid. Total in px.
     */
    private calculateOccupiedWidth(): number {
        const vp = this.viewport;
        let occupiedWidth = 0;
        let unit: number, width: number;

        const columnIds = Object.keys(this.columnWidths);
        let columnId: string;
        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            columnId = columnIds[i];
            unit = this.columnWidthUnits[columnId];

            if (unit === 0) {
                occupiedWidth += this.columnWidths[columnId];
                continue;
            }

            width = this.columnWidths[columnId];
            occupiedWidth += vp.getWidthFromRatio(width / 100);
        }

        return occupiedWidth;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ResizingMode;
