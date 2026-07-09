/* *
 *
 *  Grid HeaderRow class
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
import type Cell from '../Cell';

import Table from '../Table.js';
import Row from '../Row.js';
import HeaderCell from './HeaderCell.js';
import Column from '../Column.js';
import Globals from '../../Globals.js';
import { isString } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

interface HeaderRowSyncResult {
    cell: HeaderCell;
    isNew: boolean;
}


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid header.
 */
class HeaderRow extends Row {
    /* *
    *
    *  Properties
    *
    * */

    /**
     * The level in the header.
     */
    public level: number;

    /**
     * Header cells indexed by a stable render key.
     */
    private headerCellsByKey: Record<string, HeaderCell> = {};


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a row in the data grid.
     *
     * @param viewport
     * The Grid Table instance which the row belongs to.
     *
     * @param level
     * The current level of header that is rendered.
     */
    constructor(viewport: Table, level: number) {
        super(viewport);
        this.level = level;
        this.setRowAttributes();
    }
    /* *
    *
    *  Methods
    *
    * */

    public override createCell(
        column?: Column,
        columnsTree?: GroupedHeaderOptions[]
    ): HeaderCell {
        return new HeaderCell(this, column, columnsTree);
    }

    /**
     * Renders the row's content in the header.
     *
     * @param level
     * The current level in the header tree
     *
     * @internal
     */
    public async renderContent(level: number): Promise<void> {
        const headerOpt = this.viewport.grid.options?.header;
        const vp = this.viewport;
        const renderedColumns = vp.getRenderedColumns();
        const firstRenderedColumn = renderedColumns[0];
        const desiredKeys: Record<string, boolean> = {};
        const orderedCells: HeaderCell[] = [];

        // Render element
        if (!this.htmlElement.parentElement) {
            vp.theadElement?.appendChild(this.htmlElement);
        }
        this.htmlElement.classList.add(Globals.getClassName('headerRow'));
        this.clearPositionClasses();

        if (!headerOpt) {
            await this.syncColumnHeaders(
                renderedColumns,
                desiredKeys,
                orderedCells
            );
        } else {
            const columnsOnLevel = this.getColumnsAtLevel(headerOpt, level);

            for (let i = 0, iEnd = columnsOnLevel.length; i < iEnd; i++) {
                const columnOnLevel = columnsOnLevel[i];
                const colIsString = typeof columnOnLevel === 'string';
                const columnIds = !colIsString && columnOnLevel.columns ?
                    vp.grid.getColumnIds(columnOnLevel.columns, false) :
                    void 0;
                let colSpan = 0;

                if (columnIds) {
                    for (let j = 0, jEnd = columnIds.length; j < jEnd; ++j) {
                        if (vp.isColumnRendered(columnIds[j])) {
                            ++colSpan;
                        }
                    }
                }

                const columnId = colIsString ?
                    columnOnLevel : columnOnLevel.columnId;
                const dataColumn = columnId ?
                    vp.getColumn(columnId || '') : void 0;
                const headerFormat = !colIsString ?
                    columnOnLevel.format : void 0;
                const className = !colIsString ?
                    columnOnLevel.className : void 0;

                // Skip hidden column or header when all columns are hidden.
                if (
                    (columnId && (
                        !dataColumn ||
                        !vp.isColumnRendered(dataColumn.index)
                    )) || (!dataColumn && colSpan === 0)
                ) {
                    continue;
                }

                const key = columnId ?
                    this.getColumnCellKey(columnId) :
                    this.getGroupCellKey(level, i);
                const { cell: headerCell, isNew } = this.syncHeaderCell(
                    key,
                    desiredKeys,
                    orderedCells,
                    dataColumn,
                    !colIsString ? columnOnLevel.columns : void 0
                );

                if (!colIsString) {
                    vp.grid.accessibility?.addHeaderCellDescription(
                        headerCell.htmlElement,
                        columnOnLevel.accessibility?.description
                    );
                }

                if (isString(headerFormat)) {
                    if (!headerCell.superColumnOptions.header) {
                        headerCell.superColumnOptions.header = {};
                    }
                    headerCell.superColumnOptions.header.format = headerFormat;
                }

                if (className) {
                    headerCell.superColumnOptions.className = className;
                }

                // Add class to disable left border on first column
                if (dataColumn === firstRenderedColumn && i === 0) {
                    headerCell.htmlElement.classList.add(
                        Globals.getClassName('columnFirst')
                    );
                }

                if (isNew) {
                    await headerCell.render();
                }

                if (columnId) {
                    headerCell.htmlElement.setAttribute(
                        'rowSpan',
                        (this.viewport.header?.levels || 1) - level
                    );
                    headerCell.htmlElement.removeAttribute('colSpan');
                } else {
                    if (colSpan > 1) {
                        headerCell.htmlElement.setAttribute('colSpan', colSpan);
                    } else {
                        headerCell.htmlElement.removeAttribute('colSpan');
                    }
                    headerCell.htmlElement.removeAttribute('rowSpan');
                }
            }
        }

        this.destroyStaleCells(desiredKeys);
        this.cells = orderedCells;
        this.setLastCellClass();
        this.reflowPosition();
    }

    public override reflow(): void {
        const row = this;
        const vp = row.viewport;
        const columnLayout = vp.columnLayout;
        const renderedColumnOffset = vp.getRenderedColumnOffset();
        let previousCellRight = 0;

        row.htmlElement.style.height = '';
        row.htmlElement.style.position = '';

        for (let i = 0, iEnd = row.cells.length; i < iEnd; i++) {
            const cell = row.cells[i] as HeaderCell;
            const cellElement = cell.htmlElement;
            const cellStyle = cellElement.style;

            cell.reflow();
            cellStyle.height = '';
            cellStyle.left = '';
            cellStyle.position = '';
            cellStyle.top = '';
            cellStyle.zIndex = '';

            if (vp.virtualColumns) {
                const firstColumn = cell.columns[0];
                const lastColumn = cell.columns[cell.columns.length - 1];

                if (firstColumn && lastColumn) {
                    const cellLeft = Math.max(
                        0,
                        columnLayout.getColumnLeft(firstColumn.index) -
                            renderedColumnOffset
                    );
                    const cellRight = Math.max(
                        cellLeft,
                        columnLayout.getColumnRight(lastColumn.index) -
                            renderedColumnOffset
                    );

                    cellElement.style.marginLeft =
                        Math.max(0, cellLeft - previousCellRight) + 'px';
                    previousCellRight = cellRight;
                } else {
                    cellElement.style.marginLeft = '';
                }
            } else {
                cellElement.style.marginLeft = '';
            }
        }

        this.reflowPosition();
    }

    /**
     * Applies absolute cell positions and row-span heights for virtualized
     * columns. This emulates native table layout after rows are measured.
     *
     * @param rowHeights
     * Natural header row heights.
     *
     * @param rowIndex
     * Index of this row in the table header.
     */
    public applyVirtualColumnLayout(
        rowHeights: number[],
        rowIndex: number
    ): void {
        const row = this;
        const vp = row.viewport;
        const columnLayout = vp.columnLayout;
        const rowHeight = rowHeights[rowIndex] || 0;

        row.htmlElement.style.height = rowHeight + 'px';
        row.htmlElement.style.position = 'relative';

        for (let i = 0, iEnd = row.cells.length; i < iEnd; i++) {
            const cell = row.cells[i] as HeaderCell;
            const firstColumn = cell.columns[0];
            const lastColumn = cell.columns[cell.columns.length - 1];

            if (!firstColumn || !lastColumn) {
                continue;
            }

            const cellElement = cell.htmlElement;
            const cellStyle = cellElement.style;
            const rowSpan = Math.max(1, cellElement.rowSpan || 1);
            let cellHeight = 0;

            for (let j = 0; j < rowSpan; ++j) {
                cellHeight += rowHeights[rowIndex + j] || 0;
            }

            cellStyle.height = cellHeight + 'px';
            cellStyle.left = Math.max(
                0,
                columnLayout.getColumnLeft(firstColumn.index)
            ) + 'px';
            cellStyle.marginLeft = '';
            cellStyle.position = 'absolute';
            cellStyle.top = '0';
            cellStyle.zIndex = rowSpan > 1 ? '1' : '';
        }
    }

    /**
     * Sets a specific class to the last cell in the row.
     */
    protected setLastCellClass(): void {
        const lastCell = this.cells[this.cells.length - 1] as HeaderCell;

        if (lastCell?.isLastColumn()) {
            lastCell.htmlElement.classList.add(
                Globals.getClassName('lastHeaderCellInRow')
            );
        }
    }

    /**
     * Synchronizes a row that consists of column header cells only.
     *
     * @param columns
     * The columns to synchronize.
     *
     * @param desiredKeys
     * The keys expected after synchronization.
     *
     * @param orderedCells
     * The cells in the expected DOM order.
     */
    protected async syncColumnHeaders(
        columns: Column[],
        desiredKeys: Record<string, boolean>,
        orderedCells: HeaderCell[]
    ): Promise<void> {
        const firstColumn = columns[0];

        for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
            const column = columns[i];
            const { cell, isNew } = this.syncHeaderCell(
                this.getColumnCellKey(column.id),
                desiredKeys,
                orderedCells,
                column
            );

            if (column === firstColumn) {
                cell.htmlElement.classList.add(
                    Globals.getClassName('columnFirst')
                );
            }

            if (isNew) {
                await cell.render();
            }
        }
    }

    /**
     * Synchronizes one header cell.
     *
     * @param key
     * The stable cell key.
     *
     * @param desiredKeys
     * The keys expected after synchronization.
     *
     * @param orderedCells
     * The cells in the expected DOM order.
     *
     * @param column
     * The direct column represented by the cell.
     *
     * @param columnsTree
     * The grouped header tree represented by the cell.
     *
     * @returns
     * The synchronized cell and whether it was newly created.
     */
    protected syncHeaderCell(
        key: string,
        desiredKeys: Record<string, boolean>,
        orderedCells: HeaderCell[],
        column?: Column,
        columnsTree?: GroupedHeaderOptions[]
    ): HeaderRowSyncResult {
        let cell = this.headerCellsByKey[key];
        const isNew = !cell;
        const cellIndex = orderedCells.length;

        if (!cell) {
            cell = this.createCell(column, columnsTree);
            cell.headerCellKey = key;
            this.headerCellsByKey[key] = cell;
        } else {
            cell.syncColumns(column, columnsTree);
            cell.reflow();
        }

        desiredKeys[key] = true;
        this.insertCellElement(cell, cellIndex);
        orderedCells.push(cell);

        return { cell, isNew };
    }

    /**
     * Destroys cells that are no longer expected in this row.
     *
     * @param desiredKeys
     * The keys expected after synchronization.
     */
    protected destroyStaleCells(
        desiredKeys: Record<string, boolean>
    ): void {
        for (let i = this.cells.length - 1; i >= 0; --i) {
            const cell = this.cells[i] as HeaderCell;
            const key = cell.headerCellKey;

            if (!key || !desiredKeys[key]) {
                cell.destroy();
            }
        }
    }

    /**
     * Clears position-related classes before recalculating them.
     */
    protected clearPositionClasses(): void {
        const columnFirstClass = Globals.getClassName('columnFirst');
        const lastCellClass = Globals.getClassName('lastHeaderCellInRow');

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            this.cells[i].htmlElement.classList.remove(
                columnFirstClass,
                lastCellClass
            );
        }
    }

    /**
     * Returns the stable key for a column header cell.
     *
     * @param columnId
     * The column ID.
     */
    protected getColumnCellKey(columnId: string): string {
        return 'column:' + columnId;
    }

    /**
     * Returns the stable key for a grouped header cell.
     *
     * @param level
     * The header row level.
     *
     * @param index
     * The index of the grouped header on the level.
     */
    private getGroupCellKey(level: number, index: number): string {
        return 'group:' + level + ':' + index;
    }

    public override unregisterCell(cell: Cell): void {
        const key = (cell as HeaderCell).headerCellKey;

        if (key && this.headerCellsByKey[key] === cell) {
            delete this.headerCellsByKey[key];
        }

        super.unregisterCell(cell);
    }

    /**
     * Get all headers that should be rendered in a level.
     *
     * @param scope
     * Level that we start from
     *
     * @param targetLevel
     * Max level
     *
     * @param currentLevel
     * Current level
     *
     * @param result
     * Target array for matched headers.
     *
     * @return
     * Array of headers that should be rendered in a level
     */
    private getColumnsAtLevel(
        scope: Array<GroupedHeaderOptions | string>,
        targetLevel: number,
        currentLevel: number = 0,
        result: Array<GroupedHeaderOptions|string> = []
    ): Array<GroupedHeaderOptions|string> {
        for (const column of scope) {
            if (currentLevel === targetLevel) {
                result.push(column);
                continue;
            }

            if (typeof column !== 'string' && column.columns) {
                this.getColumnsAtLevel(
                    column.columns,
                    targetLevel,
                    currentLevel + 1,
                    result
                );
            }
        }

        return result;
    }

    /**
     * Sets the row HTML element attributes and additional classes.
     */
    private setRowAttributes(): void {
        this.viewport.grid.accessibility?.setRowIndex(
            this.htmlElement,
            this.level // Level (1-based)
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderRow;
