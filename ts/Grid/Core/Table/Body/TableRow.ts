/* *
 *
 *  Grid TableRow class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Cell from '../Cell';
import type Column from '../Column';
import type DataTable from '../../../../Data/DataTable';
import type { ColumnViewport } from '../Table.js';

import Row from '../Row.js';
import Table from '../Table.js';
import TableCell from './TableCell.js';
import Globals from '../../Globals.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid.
 */
class TableRow extends Row {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The row values from the data table in the original column order.
     */
    public data: DataTable.RowObject = {};

    /**
     * The local index of the row in the presentation data table.
     */
    public index: number;

    /**
     * The index of the row in the original data table (ID).
     */
    public id?: number;

    /**
     * Last version tag applied to this row.
     */
    private lastVersionTag?: string;

    /**
     * The vertical translation of the row.
     */
    public translateY: number = 0;

    /**
     * The spacer cells used for column virtualization.
     */
    private leftPadCell?: HTMLTableCellElement;
    private rightPadCell?: HTMLTableCellElement;


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
     * @param index
     * The index of the row in the data table.
     */
    constructor(viewport: Table, index: number) {
        super(viewport);
        this.index = index;
        this.id = viewport.dataTable.getOriginalRowIndex(index);
        this.lastVersionTag = viewport.dataTable.getVersionTag?.();

        this.loadData();
        this.setRowAttributes();
    }

    /* *
    *
    *  Methods
    *
    * */

    public override createCell(column: Column): Cell {
        return new TableCell(this, column);
    }

    public override render(): void {
        const vp = this.viewport;
        const columns = vp.columns;
        const columnViewport = vp.getColumnViewport();
        const useColumnVirtualization = vp.virtualColumns && columnViewport;

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            const cell = this.createCell(columns[i]) as TableCell;
            if (!useColumnVirtualization) {
                cell.render();
                continue;
            }
            if (i >= columnViewport.start && i <= columnViewport.end) {
                cell.render();
            }
        }

        this.rendered = true;

        if (vp.virtualRows) {
            this.reflow();
        }

        if (useColumnVirtualization) {
            this.updateRenderedColumns(columnViewport);
        }
    }

    /**
     * Loads the row data from the data table.
     */
    private loadData(): void {
        if (this.viewport.grid.options?.performance?.readOnly) {
            return;
        }

        const data = this.viewport.dataTable.getRowObject(this.index);
        if (!data) {
            return;
        }

        this.data = data;
    }

    /**
     * Updates the row data and its cells with the latest values from the data
     * table.
     */
    public update(): void {
        const table = this.viewport.dataTable;
        const nextId = table.getOriginalRowIndex(this.index);
        const versionTag = table.getVersionTag?.();
        if (this.id === nextId && this.lastVersionTag === versionTag) {
            return;
        }

        this.id = nextId;
        this.lastVersionTag = versionTag;
        this.updateRowAttributes();

        this.loadData();

        if (this.viewport.virtualColumns) {
            const columnViewport = this.viewport.getColumnViewport();
            if (columnViewport) {
                for (
                    let i = columnViewport.start;
                    i <= columnViewport.end;
                    ++i
                ) {
                    const cell = this.cells[i] as TableCell;
                    if (cell) {
                        void cell.setValue();
                    }
                }
            }
        } else {
            for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
                const cell = this.cells[i] as TableCell;
                void cell.setValue();
            }
        }

        if (this.viewport.virtualColumns) {
            this.updateRenderedColumns(this.viewport.getColumnViewport());
        }

        this.reflow();
    }

    /**
     * Reuses the row instance for a new index.
     *
     * @param index
     * The index of the row in the data table.
     *
     * @param doReflow
     * Whether to reflow the row after updating the cells.
     */
    public reuse(index: number, doReflow: boolean = true): void {
        if (this.index === index) {
            this.update();
            return;
        }

        this.index = index;
        const table = this.viewport.dataTable;
        this.id = table.getOriginalRowIndex(index);
        this.lastVersionTag = table.getVersionTag?.();

        this.htmlElement.setAttribute('data-row-index', index);
        this.updateRowAttributes();
        this.updateParityClass();
        this.updateStateClasses();

        this.loadData();

        if (this.viewport.virtualColumns) {
            const columnViewport = this.viewport.getColumnViewport();
            if (columnViewport) {
                for (
                    let i = columnViewport.start;
                    i <= columnViewport.end;
                    ++i
                ) {
                    const cell = this.cells[i] as TableCell;
                    if (cell) {
                        void cell.setValue();
                    }
                }
            }
        } else {
            for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
                const cell = this.cells[i] as TableCell;
                void cell.setValue();
            }
        }

        if (this.viewport.virtualColumns) {
            this.updateRenderedColumns(this.viewport.getColumnViewport());
        }

        if (doReflow) {
            this.reflow();
        }
    }

    /**
     * Returns the first rendered cell, useful for row height measurements.
     */
    public getFirstRenderedCell(): TableCell | undefined {
        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            const cell = this.cells[i] as TableCell;
            if (cell?.htmlElement?.isConnected) {
                return cell;
            }
        }
        return this.cells[0] as TableCell | undefined;
    }

    /**
     * Updates which columns are rendered for this row.
     *
     * @param columnViewport
     * Column viewport to apply. If undefined, all columns are rendered.
     */
    public updateRenderedColumns(columnViewport?: ColumnViewport): void {
        const rowEl = this.htmlElement;

        if (!columnViewport) {
            if (this.leftPadCell?.isConnected) {
                this.leftPadCell.remove();
            }
            if (this.rightPadCell?.isConnected) {
                this.rightPadCell.remove();
            }

            for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
                const cell = this.cells[i] as TableCell;
                if (!cell) {
                    continue;
                }
                if (!cell.htmlElement.isConnected) {
                    if (!cell.content) {
                        cell.render();
                    } else {
                        rowEl.appendChild(cell.htmlElement);
                        cell.reflow();
                    }
                }
                rowEl.appendChild(cell.htmlElement);
            }
            return;
        }

        const nodes: HTMLElement[] = [];
        if (columnViewport.leftPad > 0) {
            const leftPadCell = this.getSpacerCell('left');
            const leftPadWidth = columnViewport.leftPad + 'px';
            leftPadCell.style.width = leftPadCell.style.maxWidth =
                leftPadCell.style.minWidth = leftPadWidth;
            nodes.push(leftPadCell);
        } else if (this.leftPadCell?.isConnected) {
            this.leftPadCell.remove();
        }

        for (let i = columnViewport.start; i <= columnViewport.end; ++i) {
            const cell = this.cells[i] as TableCell;
            if (!cell) {
                continue;
            }
            if (!cell.htmlElement.isConnected) {
                if (!cell.content) {
                    cell.render();
                } else {
                    rowEl.appendChild(cell.htmlElement);
                    cell.reflow();
                }
                void cell.setValue();
            }
            nodes.push(cell.htmlElement);
        }

        if (columnViewport.rightPad > 0) {
            const rightPadCell = this.getSpacerCell('right');
            const rightPadWidth = columnViewport.rightPad + 'px';
            rightPadCell.style.width = rightPadCell.style.maxWidth =
                rightPadCell.style.minWidth = rightPadWidth;
            nodes.push(rightPadCell);
        } else if (this.rightPadCell?.isConnected) {
            this.rightPadCell.remove();
        }

        const keep = new Set(nodes);
        const children = Array.from(rowEl.children) as HTMLElement[];
        for (let i = 0, iEnd = children.length; i < iEnd; ++i) {
            const child = children[i];
            if (!keep.has(child)) {
                rowEl.removeChild(child);
            }
        }

        for (let i = 0, iEnd = nodes.length; i < iEnd; ++i) {
            rowEl.appendChild(nodes[i]);
        }
    }

    private getSpacerCell(side: 'left' | 'right'): HTMLTableCellElement {
        const existing = side === 'left' ? this.leftPadCell : this.rightPadCell;
        if (existing) {
            return existing;
        }

        const spacer = document.createElement('td');
        spacer.setAttribute('aria-hidden', 'true');
        spacer.setAttribute('role', 'presentation');
        spacer.tabIndex = -1;
        spacer.style.padding = '0';
        spacer.style.border = '0';
        spacer.style.background = 'transparent';
        spacer.style.pointerEvents = 'none';

        if (side === 'left') {
            this.leftPadCell = spacer;
        } else {
            this.rightPadCell = spacer;
        }

        return spacer;
    }

    /**
     * Adds or removes the hovered CSS class to the row element.
     *
     * @param hovered
     * Whether the row should be hovered.
     */
    public setHoveredState(hovered: boolean): void {
        this.htmlElement.classList[hovered ? 'add' : 'remove'](
            Globals.getClassName('hoveredRow')
        );

        if (hovered) {
            this.viewport.grid.hoveredRowIndex = this.index;
        }
    }

    /**
     * Adds or removes the synced CSS class to the row element.
     *
     * @param synced
     * Whether the row should be synced.
     */
    public setSyncedState(synced: boolean): void {
        this.htmlElement.classList[synced ? 'add' : 'remove'](
            Globals.getClassName('syncedRow')
        );

        if (synced) {
            this.viewport.grid.syncedRowIndex = this.index;
        }
    }

    /**
     * Sets the row HTML element attributes and additional classes.
     */
    public setRowAttributes(): void {
        const idx = this.index;
        const el = this.htmlElement;

        el.classList.add(Globals.getClassName('rowElement'));

        // Index of the row in the presentation data table
        el.setAttribute('data-row-index', idx);

        this.updateRowAttributes();

        // Indexing from 0, so rows with even index are odd.
        this.updateParityClass();
        this.updateStateClasses();
    }

    /**
     * Sets the row HTML element attributes that are updateable in the row
     * lifecycle.
     */
    public updateRowAttributes(): void {
        const vp = this.viewport;
        const a11y = vp.grid.accessibility;
        const idx = this.index;
        const el = this.htmlElement;

        // Index of the row in the original data table (ID)
        if (this.id !== void 0) {
            el.setAttribute('data-row-id', this.id);
        }

        // Calculate levels of header, 1 to avoid indexing from 0
        a11y?.setRowIndex(el, idx + (vp.header?.rows.length ?? 0) + 1);
    }

    /**
     * Updates the row parity class based on index.
     */
    private updateParityClass(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('rowEven'),
            Globals.getClassName('rowOdd')
        );

        // Indexing from 0, so rows with even index are odd.
        el.classList.add(
            Globals.getClassName(this.index % 2 ? 'rowEven' : 'rowOdd')
        );
    }

    /**
     * Updates the hovered and synced classes based on grid state.
     */
    private updateStateClasses(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('hoveredRow'),
            Globals.getClassName('syncedRow')
        );

        if (this.viewport.grid.hoveredRowIndex === this.index) {
            el.classList.add(Globals.getClassName('hoveredRow'));
        }

        if (this.viewport.grid.syncedRowIndex === this.index) {
            el.classList.add(Globals.getClassName('syncedRow'));
        }
    }

    /**
     * Sets the vertical translation of the row. Used for virtual scrolling.
     *
     * @param value
     * The vertical translation of the row.
     */
    public setTranslateY(value: number): void {
        this.translateY = value;
        this.htmlElement.style.transform = `translateY(${value}px)`;
    }

    /**
     * Returns the default top offset of the row (before adjusting row heights).
     * @internal
     */
    public getDefaultTopOffset(): number {
        return this.index * this.viewport.rowsVirtualizer.defaultRowHeight;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default TableRow;
