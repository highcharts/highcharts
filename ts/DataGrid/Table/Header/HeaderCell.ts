/* *
 *
 *  DataGrid class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

import type { GroupedHeaderOptions } from '../../Options';

import Cell from '../Cell.js';
import Column from '../Column';
import Row from '../Row';
import DGUtils from '../../Utils.js';
import Globals from '../../Globals.js';
import ColumnSorting from '../Actions/ColumnSorting.js';
import Utilities from '../../../Core/Utilities.js';

const { makeHTMLElement, isHTML } = DGUtils;
const { merge, isString } = Utilities;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell in the data grid header.
 */
class HeaderCell extends Cell {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The HTML element of the header cell content.
     */
    public headerContent?: HTMLElement;

    /**
     * Reference to options in settings header.
     */
    public options: Partial<Column.Options> = {};

    /**
     * Nested structure of columns that are grouped in the header cell.
     */
    public readonly columnsTree?: GroupedHeaderOptions[];

    /**
     * Whether the cell is a main column cell in the header.
     */
    private readonly isMain: boolean;

    /**
     * Content value of the header cell.
     */
    public override value: string = '';


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid header.
     *
     * @param column
     * The column of the cell.
     *
     * @param row
     * The row of the cell.
     *
     * @param columnsTree
     * If the cell is a wider than one column, this property contains the
     * structure of the columns that are subordinated to the header cell.
     */
    constructor(
        column: Column,
        row: Row,
        columnsTree?: GroupedHeaderOptions[]
    ) {
        super(column, row);
        column.header = this;

        this.isMain = !!this.row.viewport.getColumn(this.column.id);
        this.columnsTree = columnsTree;
    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Init element.
     */
    public override init(): HTMLTableCellElement {
        const elem = document.createElement('th', {});
        elem.classList.add(Globals.classNames.headerCell);
        return elem;
    }

    /**
     * Render the cell container.
     */
    public override render(): void {
        const column = this.column;
        const options = merge(column.options, this.options); // ??
        const headerCellOptions = options.header || {};
        const isSortableData = options.sorting?.sortable && column.data;

        if (headerCellOptions.formatter) {
            this.value = headerCellOptions.formatter.call(this).toString();
        } else if (isString(headerCellOptions.format)) {
            this.value = column.format(headerCellOptions.format);
        } else {
            this.value = column.id;
        }

        // Render content of th element
        this.row.htmlElement.appendChild(this.htmlElement);

        this.headerContent = makeHTMLElement('span', {
            className: Globals.classNames.headerCellContent
        }, this.htmlElement);

        if (isHTML(this.value)) {
            this.renderHTMLCellContent(
                this.value,
                this.headerContent
            );
        } else {
            this.headerContent.innerText = this.value;
        }

        if (isSortableData) {
            column.viewport.dataGrid.accessibility?.addSortableColumnHint(
                this.headerContent
            );
        }

        this.htmlElement.setAttribute('scope', 'col');

        if (this.options.className) {
            this.htmlElement.classList.add(
                ...this.options.className.split(/\s+/g)
            );
        }

        if (this.isMain) {
            this.htmlElement.setAttribute('data-column-id', column.id);

            // Add user column classname
            if (column.options.className) {
                this.htmlElement.classList.add(
                    ...column.options.className.split(/\s+/g)
                );
            }

            // Add resizing
            this.column.viewport.columnsResizer?.renderColumnDragHandles(
                this.column,
                this
            );

            // Add sorting
            this.initColumnSorting();
        }

        if (this.isLastColumn()) {
            this.htmlElement.classList.add(
                Globals.classNames.lastHeaderCellInRow
            );
        } else {
            this.htmlElement.classList.remove(
                Globals.classNames.lastHeaderCellInRow
            );
        }

        this.setCustomClassName(options.header?.className);
    }

    public override reflow(): void {
        const cell = this;
        const th = cell.htmlElement;
        const vp = cell.column.viewport;

        if (!th) {
            return;
        }

        let width = 0;

        if (cell.columnsTree) {
            const columnsIds = vp.dataGrid.getColumnIds(cell.columnsTree);
            for (const columnId of columnsIds) {
                width += (vp.getColumn(columnId || '')?.getWidth()) || 0;
            }
        } else {
            width = cell.column.getWidth();
        }
        // Set the width of the column. Max width is needed for the
        // overflow: hidden to work.
        th.style.width = th.style.maxWidth = width + 'px';
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        if (e.target !== this.htmlElement) {
            return;
        }

        if (e.key === 'Enter') {
            if (this.column.options.sorting?.sortable) {
                this.column.sorting?.toggle();
            }
            return;
        }

        super.onKeyDown(e);
    }

    protected override onClick(e: MouseEvent): void {
        const column = this.column;

        if (
            !this.isMain || (
                e.target !== this.htmlElement &&
                e.target !== column.header?.headerContent
            )
        ) {
            return;
        }

        if (column.options.sorting?.sortable) {
            column.sorting?.toggle();
        }

        column.viewport.dataGrid.options?.events?.header?.click?.call(column);
    }

    /**
     * Add sorting option to the column.
     */
    private initColumnSorting(): void {
        const { column } = this;

        column.sorting = new ColumnSorting(
            column,
            this.htmlElement
        );
    }

    /**
     * Gets the column id of the last column in the scope.
     *
     * @param scope
     * Structure of header under the current cell.
     *
     * @returns
     * Column id of the last column in the scope.
     */
    private getLastColumnId(scope: (GroupedHeaderOptions|string)[]): string {
        const lastColumn = scope[scope.length - 1];

        if (typeof lastColumn === 'string') {
            return lastColumn;
        }

        if (lastColumn.columnId) {
            return lastColumn.columnId;
        }

        if (lastColumn.columns) {
            return this.getLastColumnId(lastColumn.columns);
        }

        return '';
    }

    /**
     * Check if the cell is part of the last cell in the header.
     */
    private isLastColumn(): boolean {
        const columns = this.row.viewport.columns;
        const lastViewportColumnId = columns[columns.length - 1].id;
        const lastCellColumnId = this.columnsTree ?
            this.getLastColumnId(this.columnsTree) : this.column.id;

        return lastViewportColumnId === lastCellColumnId;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace HeaderCell {

}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderCell;
