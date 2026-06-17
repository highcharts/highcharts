/* *
 *
 *  Resizing Mode abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
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

import { clamp, defined, getStyle } from '../../../../Shared/Utilities.js';


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
            return ResizingMode.fitWidth(column, freeWidth / freeColumns);
        }

        if (this.columnWidthUnits[column.id] === 0) {
            // If px:
            return ResizingMode.fitWidth(column, widthValue);
        }

        // If %:
        return ResizingMode.fitWidth(
            column,
            vp.getWidthFromRatio(widthValue / 100)
        );
    }

    /**
     * Performs important calculations when the column is loaded.
     *
     * @param column
     * The column that is loaded.
     */
    public loadColumn(column: Column): void {
        const rawWidth = column.options.width;
        if (!defined(rawWidth) || rawWidth === 'auto') {
            delete this.columnWidths[column.id];
            delete this.columnWidthUnits[column.id];
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
     * Recalculates the changing dimensions of the table.
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
        const minWidth = ResizingMode.getOptionWidth(
            column,
            column.options.minWidth
        );

        const getElPaddings = (el: HTMLElement): number => (
            (getStyle(el, 'padding-left', true) || 0) +
            (getStyle(el, 'padding-right', true) || 0) +
            (getStyle(el, 'border-left', true) || 0) +
            (getStyle(el, 'border-right', true) || 0)
        );

        let result = Math.max(ResizingMode.MIN_COLUMN_WIDTH, minWidth ?? 0);
        if (tableColumnEl) {
            result = Math.max(result, getElPaddings(tableColumnEl));
        }
        if (headerColumnEl) {
            result = Math.max(result, getElPaddings(headerColumnEl));
        }
        return result;
    }

    /**
     * Returns the configured width option in pixels.
     *
     * @param column
     * The column to resolve the width for.
     *
     * @param width
     * The width option to resolve.
     *
     * @returns
     * The width in pixels.
     */
    protected static getOptionWidth(
        column: Column,
        width?: number | string
    ): number | undefined {
        if (!defined(width)) {
            return;
        }

        if (typeof width === 'number') {
            return width;
        }

        const value = parseFloat(width);

        if (width.endsWith('%')) {
            return column.viewport.getWidthFromRatio(value / 100);
        }

        return value;
    }

    /**
     * Returns the maximum width of the column.
     *
     * @param column
     * The column to get the maximum width for.
     *
     * @returns
     * The maximum width in pixels.
     */
    protected static getMaxWidth(column: Column): number | undefined {
        const maxWidth = ResizingMode.getOptionWidth(
            column,
            column.options.maxWidth
        );

        if (!defined(maxWidth)) {
            return;
        }

        return Math.max(maxWidth, ResizingMode.getMinWidth(column));
    }

    /**
     * Clamps the width to the column width constraints.
     *
     * @param column
     * The column to clamp the width for.
     *
     * @param width
     * The width in pixels.
     *
     * @returns
     * The clamped width in pixels.
     */
    protected static fitWidth(column: Column, width: number): number {
        const minWidth = ResizingMode.getMinWidth(column);
        const maxWidth = ResizingMode.getMaxWidth(column);

        return clamp(width, minWidth, maxWidth ?? Number.POSITIVE_INFINITY);
    }

    /**
     * Calculates defined (px and %) widths of all columns with non-undefined
     * widths in the grid. Total in px.
     */
    private calculateOccupiedWidth(): number {
        const vp = this.viewport;
        let occupiedWidth = 0;
        let unit: number, width: number | undefined;

        for (let i = 0, iEnd = vp.columns.length; i < iEnd; ++i) {
            const column = vp.columns[i];
            width = this.columnWidths[column.id];

            if (!defined(width)) {
                continue;
            }

            unit = this.columnWidthUnits[column.id];

            if (unit === 0) {
                occupiedWidth += ResizingMode.fitWidth(column, width);
                continue;
            }

            occupiedWidth += ResizingMode.fitWidth(
                column,
                vp.getWidthFromRatio(width / 100)
            );
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
