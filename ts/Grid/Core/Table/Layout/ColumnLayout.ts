/* *
 *
 *  Grid Column Layout class
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

import type Column from '../Column';
import type Table from '../Table';

import { clamp, defined } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

interface ColumnLayoutRange {
    from: number;
    to: number;
}


/* *
 *
 *  Class
 *
 * */

/**
 * Stores the horizontal grid layout used by rendering, resizing and
 * virtualization.
 */
class ColumnLayout {

    /* *
    *
    *  Static Properties
    *
    * */

    /**
     * The minimum width of a strict column.
     */
    private static readonly MIN_COLUMN_WIDTH = 20;

    /**
     * The fallback width for strict column sizing.
     */
    private static readonly STRICT_COLUMN_WIDTH = 100;


    /* *
    *
    *  Properties
    *
    * */

    /**
     * The table that owns the layout.
     */
    public readonly viewport: Table;

    /**
     * Column widths in pixels, indexed by the column's global index.
     */
    private widths: number[] = [];

    /**
     * Column left offsets in pixels, indexed by the column's global index.
     */
    private offsets: number[] = [];

    /**
     * Total width of all columns.
     */
    public totalWidth: number = 0;

    /**
     * Single column width used when strict column widths are enabled.
     */
    private strictColumnWidth?: number;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Recalculates column widths and prefix offsets.
     */
    public reflow(): void {
        const { columns, columnResizing } = this.viewport;
        const widths = this.widths;
        const offsets = this.offsets;

        if (this.viewport.grid.options?.rendering?.columns?.strictWidths) {
            const width = this.strictColumnWidth =
                this.getStrictColumnWidth();

            widths.length = 0;
            offsets.length = 0;
            this.totalWidth = columns.length * width;
            return;
        }

        delete this.strictColumnWidth;
        if (!columnResizing) {
            return;
        }

        widths.length = columns.length;
        offsets.length = columns.length;

        let left = 0;
        for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
            const width = columnResizing.getColumnWidth(columns[i]);

            offsets[i] = left;
            widths[i] = width;
            left += width;
        }

        this.totalWidth = left;
    }

    /**
     * Returns the column width in pixels.
     *
     * @param column
     * The column to query.
     */
    public getColumnWidth(column: Column): number {
        if (defined(this.strictColumnWidth)) {
            return this.strictColumnWidth;
        }

        if (this.viewport.grid.options?.rendering?.columns?.strictWidths) {
            return this.getStrictColumnWidth();
        }

        return this.widths[column.index] ??
            this.viewport.columnResizing?.getColumnWidth(column) ??
            0;
    }

    /**
     * Returns the column left offset in pixels.
     *
     * @param columnIndex
     * The global column index.
     */
    public getColumnLeft(columnIndex: number): number {
        if (defined(this.strictColumnWidth)) {
            return columnIndex * this.strictColumnWidth;
        }

        return this.offsets[columnIndex] ?? 0;
    }

    /**
     * Returns the column right offset in pixels.
     *
     * @param columnIndex
     * The global column index.
     */
    public getColumnRight(columnIndex: number): number {
        if (defined(this.strictColumnWidth)) {
            return (columnIndex + 1) * this.strictColumnWidth;
        }

        return this.getColumnLeft(columnIndex) +
            (this.widths[columnIndex] || 0);
    }

    /**
     * Returns the visible column range for a horizontal viewport.
     *
     * @param scrollLeft
     * The horizontal scroll position.
     *
     * @param viewportWidth
     * The visible viewport width.
     */
    public getVisibleRange(
        scrollLeft: number,
        viewportWidth: number
    ): ColumnLayoutRange {
        const { columns } = this.viewport;
        const columnCount = columns.length;

        if (!columnCount) {
            return { from: 0, to: -1 };
        }

        const visibleLeft = Math.max(scrollLeft, 0);
        const visibleRight = visibleLeft + Math.max(viewportWidth, 0);

        if (defined(this.strictColumnWidth)) {
            const columnWidth = this.strictColumnWidth;
            const from = Math.max(
                0,
                Math.min(
                    Math.floor(visibleLeft / columnWidth),
                    columnCount - 1
                )
            );
            const to = Math.max(
                from,
                Math.min(
                    Math.floor(visibleRight / columnWidth),
                    columnCount - 1
                )
            );

            return { from, to };
        }

        const from = Math.max(
            0,
            Math.min(this.findColumnAt(visibleLeft), columnCount - 1)
        );
        const to = Math.max(
            from,
            Math.min(this.findColumnAt(visibleRight), columnCount - 1)
        );

        return { from, to };
    }

    /**
     * Returns the fixed strict column width without DOM measurement.
     */
    public getStrictColumnWidth(): number {
        const columnDefaults = this.viewport.grid.options?.columnDefaults;
        const width = ColumnLayout.getViewportOptionWidth(
            this.viewport,
            columnDefaults?.width
        ) ?? ColumnLayout.STRICT_COLUMN_WIDTH;

        return ColumnLayout.fitStrictWidth(
            this.viewport,
            width,
            columnDefaults?.minWidth,
            columnDefaults?.maxWidth
        );
    }

    /**
     * Finds the column at the provided horizontal offset.
     *
     * @param position
     * The horizontal offset in pixels.
     */
    private findColumnAt(position: number): number {
        const offsets = this.offsets;
        let low = 0;
        let high = offsets.length - 1;
        let result = 0;

        while (low <= high) {
            const mid = (low + high) >> 1;

            if (offsets[mid] <= position) {
                result = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return result;
    }

    /**
     * Clamps the width to option-based strict column width constraints.
     *
     * @param viewport
     * The table that the column layout is applied to.
     *
     * @param width
     * The width in pixels.
     *
     * @param minWidth
     * The minimum width option to resolve.
     *
     * @param maxWidth
     * The maximum width option to resolve.
     *
     * @returns
     * The clamped width in pixels.
     */
    private static fitStrictWidth(
        viewport: Table,
        width: number,
        minWidth?: number | string,
        maxWidth?: number | string
    ): number {
        const min = Math.max(
            ColumnLayout.MIN_COLUMN_WIDTH,
            ColumnLayout.getViewportOptionWidth(viewport, minWidth) ?? 0
        );
        const max = ColumnLayout.getViewportOptionWidth(viewport, maxWidth);

        return clamp(width, min, max ?? Number.POSITIVE_INFINITY);
    }

    /**
     * Returns the configured width option in pixels.
     *
     * @param viewport
     * The table that the column layout is applied to.
     *
     * @param width
     * The width option to resolve.
     *
     * @returns
     * The width in pixels.
     */
    private static getViewportOptionWidth(
        viewport: Table,
        width?: number | string
    ): number | undefined {
        if (!defined(width) || width === 'auto') {
            return;
        }

        if (typeof width === 'number') {
            return width;
        }

        const value = parseFloat(width);

        if (width.endsWith('%')) {
            return viewport.getWidthFromRatio(value / 100);
        }

        return value;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnLayout;
