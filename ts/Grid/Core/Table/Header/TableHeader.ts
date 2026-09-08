/* *
 *
 *  Grid TableHeader class
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
 *  - Sebastian Bochan
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { GroupedHeaderOptions } from '../../Options';
import Column from '../Column.js';
import Table from '../Table.js';
import HeaderRow from './HeaderRow.js';
import FilterRow from '../Actions/ColumnFiltering/FilterRow.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table header row containing the cells (headers) with
 * column names.
 */
class TableHeader {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The visible columns of the table.
     */
    public columns: Column[] = [];

    /**
     * The container of the table head.
     */
    public rows: HeaderRow[] = [];

    /**
     * The viewport (table) the table head belongs to.
     */
    public viewport: Table;

    /**
     * Amount of levels in the header, that is used in creating correct rows.
     * Excludes any extra levels, like filtering row.
     */
    public levels: number = 1;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new table head.
     *
     * @param viewport
     * The viewport (table) the table head belongs to.
     */
    constructor(viewport: Table) {
        this.viewport = viewport;
        this.columns = viewport.getRenderedColumns();

        if (viewport.grid.options?.header) {
            this.levels = this.getRowLevels(
                viewport.grid.options?.header
            );
        }
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the table head content.
     */
    public async render(): Promise<void> {
        const vp = this.viewport;

        if (!vp.grid.enabledColumns) {
            return;
        }

        // Render regular, multiple level rows.
        for (let i = 0, iEnd = this.levels; i < iEnd; i++) {
            const row = new HeaderRow(vp, i + 1); // Avoid indexing from 0
            await Promise.resolve(row.renderContent(i));
            this.rows.push(row);
        }

        // Render an extra row for inline filtering.
        if (vp.columns.some((column): boolean =>
            vp.grid.columnPolicy.isColumnInlineFilteringEnabled(column.id)
        )) {
            const row = new FilterRow(vp);
            await row.renderContent();
            this.rows.push(row);
        }
    }

    /**
     * Synchronizes header rows with the currently rendered columns.
     */
    public async syncRenderedColumns(): Promise<void> {
        const vp = this.viewport;

        if (!vp.grid.enabledColumns) {
            return;
        }

        this.columns = vp.getRenderedColumns();

        for (let i = 0, iEnd = this.levels; i < iEnd; i++) {
            let row = this.rows[i];

            if (!row) {
                row = new HeaderRow(vp, i + 1);
                this.rows[i] = row;
            }

            await row.renderContent(i);
        }

        if (this.hasInlineFiltering()) {
            let row = this.rows[this.levels] as FilterRow | undefined;

            if (!row) {
                row = new FilterRow(vp);
                this.rows[this.levels] = row;
            }

            await row.renderContent();
        } else {
            const row = this.rows[this.levels];

            if (row) {
                row.destroy();
                this.rows.splice(this.levels, 1);
            }
        }
    }

    /**
     * Reflows the table head's content dimensions.
     */
    public reflow(): void {
        const vp = this.viewport;

        if (!vp.theadElement) {
            return;
        }

        const { clientWidth, offsetWidth } = vp.tbodyElement;
        const rows = this.rows;
        const bordersWidth = offsetWidth - clientWidth;

        for (const row of rows) {
            row.reflow();
        }

        if (vp.virtualColumns) {
            const rowSpans: Array<{
                height: number;
                rowIndex: number;
                rowSpan: number;
            }> = [];
            const rowHeights: number[] = [];

            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                const cells = rows[i].cells;

                for (let j = 0, jEnd = cells.length; j < jEnd; ++j) {
                    const cellElement = cells[j].htmlElement;
                    const rowSpan = Math.max(1, cellElement.rowSpan || 1);

                    if (rowSpan > 1) {
                        rowSpans.push({
                            height: cellElement.offsetHeight,
                            rowIndex: i,
                            rowSpan
                        });
                        cellElement.style.position = 'absolute';
                    }
                }

                rowHeights[i] = rows[i].htmlElement.offsetHeight;
            }

            for (let i = 0, iEnd = rowSpans.length; i < iEnd; ++i) {
                const { height, rowIndex, rowSpan } = rowSpans[i];
                const end = Math.min(rows.length, rowIndex + rowSpan);
                const spannedRows = end - rowIndex;
                let spanHeight = 0;

                for (let j = rowIndex; j < end; ++j) {
                    spanHeight += rowHeights[j] || 0;
                }

                if (height > spanHeight && spannedRows > 0) {
                    const extraHeight = (height - spanHeight) / spannedRows;

                    for (let j = rowIndex; j < end; ++j) {
                        rowHeights[j] = (rowHeights[j] || 0) + extraHeight;
                    }
                }
            }

            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                rows[i].applyVirtualColumnLayout(rowHeights, i);
            }
        }

        if (vp.rowsWidth) {
            vp.theadElement.style.width =
                Math.max(vp.rowsWidth, clientWidth) + bordersWidth + 'px';
        }
    }

    /**
     * Returns amount of rows for the current cell in header tree.
     *
     * @param scope
     * Structure of header
     *
     * @returns
     */
    private getRowLevels(
        scope: Array<GroupedHeaderOptions | string>
    ): number {
        let maxDepth = 0;

        for (const item of scope) {
            if (typeof item !== 'string' && item.columns) {
                const depth = this.getRowLevels(item.columns);
                if (depth > maxDepth) {
                    maxDepth = depth;
                }
            }
        }

        return maxDepth + 1;
    }

    /**
     * Returns whether inline filtering row should be rendered.
     */
    private hasInlineFiltering(): boolean {
        const vp = this.viewport;

        return vp.columns.some((column): boolean =>
            vp.grid.columnPolicy.isColumnInlineFilteringEnabled(column.id)
        );
    }

    /**
     * Scrolls the table head horizontally, only when the virtualization
     * is enabled.
     *
     * @param scrollLeft
     * The left scroll position.
     */
    public scrollHorizontally(scrollLeft: number): void {
        const el = this.viewport.theadElement;
        if (!el) {
            return;
        }

        el.style.transform = `translateX(${-scrollLeft}px)`;
    }

    /**
     * Destroys the table header and all its associated components.
     */
    public destroy(): void {
        for (const row of this.rows) {
            row.destroy();
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default TableHeader;
