/* *
 *
 *  Grid HeaderCell class
 *
 *  (c) 2020-2025 Highsoft AS
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
import GridUtils from '../../GridUtils.js';
import ColumnSorting from '../Actions/ColumnSorting.js';
import Globals from '../../Globals.js';
import Utilities from '../../../../Core/Utilities.js';

const {
    makeHTMLElement,
    setHTMLContent
} = GridUtils;
const {
    fireEvent,
    merge,
    isString
} = Utilities;


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
    public readonly options: Partial<Column.Options> = {};

    /**
     * List of columns that are subordinated to the header cell.
     */
    public readonly columns: Column[] = [];

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
     * @param row
     * The row of the cell.
     *
     * @param column
     * The column of the cell.
     *
     * @param columnsTree
     * If the cell is a wider than one column, this property contains the
     * structure of the columns that are subordinated to the header cell.
     */
    constructor(
        row: Row,
        column?: Column,
        columnsTree?: GroupedHeaderOptions[]
    ) {
        super(row, column);

        if (column) {
            column.header = this;
            this.columns.push(column);
        } else if (columnsTree) {
            const vp = this.row.viewport;
            const columnIds = vp.grid.getColumnIds(columnsTree, true);
            for (const columnId of columnIds) {
                const column = vp.getColumn(columnId);
                if (column) {
                    this.columns.push(column);
                }
            }
        }
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
        elem.classList.add(Globals.getClassName('headerCell'));
        return elem;
    }

    /**
     * Render the cell container.
     */
    public override render(): void {
        const { column } = this;
        const options = merge(column?.options || {}, this.options);
        const headerCellOptions = options.header || {};
        const isSortableData = options.sorting?.sortable && column?.data;


        if (headerCellOptions.formatter) {
            this.value = headerCellOptions.formatter.call(this).toString();
        } else if (isString(headerCellOptions.format)) {
            this.value = column ?
                column.format(headerCellOptions.format) :
                headerCellOptions.format;
        } else {
            this.value = column?.id || '';
        }

        // Render content of th element
        this.row.htmlElement.appendChild(this.htmlElement);

        // Create flex container for header content and icons
        const headerCellContainer = makeHTMLElement('div', {
            className: Globals.getClassName('headerCell')
        }, this.htmlElement);

        this.headerContent = makeHTMLElement('span', {
            className: Globals.getClassName('headerCellContent')
        }, headerCellContainer);

        // Render the header cell element content.
        setHTMLContent(this.headerContent, this.value);

        // Add filter icon right aligned
        const filterIcon = this.getFilterIcon();
        headerCellContainer.appendChild(filterIcon);
        this.htmlElement.setAttribute('scope', 'col');

        if (this.options.className) {
            this.htmlElement.classList.add(
                ...this.options.className.split(/\s+/g)
            );
        }

        if (column) {
            this.htmlElement.setAttribute('data-column-id', column.id);

            if (isSortableData) {
                column.viewport.grid.accessibility?.addSortableColumnHint(
                    this.headerContent
                );
            }

            // Add user column classname
            if (column.options.className) {
                this.htmlElement.classList.add(
                    ...column.options.className.split(/\s+/g)
                );
            }

            // Add resizing
            column.viewport.columnsResizer?.renderColumnDragHandles(
                column,
                this
            );

            // Add sorting
            this.initColumnSorting();
        }

        this.setCustomClassName(options.header?.className);

        fireEvent(this, 'afterRender', { column });
    }

    public override reflow(): void {
        const th = this.htmlElement;

        if (!th) {
            return;
        }

        let width = 0;

        for (const column of this.columns) {
            width += column.getWidth() || 0;
        }

        // Set the width of the column. Max width is needed for the
        // overflow: hidden to work.
        th.style.width = th.style.maxWidth = width + 'px';
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        if (!this.column || e.target !== this.htmlElement) {
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
            !column || (
                e.target !== this.htmlElement &&
                e.target !== column.header?.headerContent
            ) || column.viewport.columnsResizer?.isResizing
        ) {
            return;
        }

        if (column.options.sorting?.sortable) {
            column.sorting?.toggle();
        }

        fireEvent(this, 'click', {
            originalEvent: e,
            column: this.column
        });
    }

    /**
     * Add sorting option to the column.
     */
    private initColumnSorting(): void {
        const { column } = this;
        if (!column) {
            return;
        }

        column.sorting = new ColumnSorting(
            column,
            this.htmlElement
        );
    }

    /**
     * Check if the cell is part of the last cell in the header.
     */
    public isLastColumn(): boolean {
        const vp = this.row.viewport;

        const lastViewportColumn = vp.columns[vp.columns.length - 1];
        const lastCellColumn = this.columns?.[this.columns.length - 1];

        return lastViewportColumn === lastCellColumn;
    }

    private getFilterIcon(): HTMLElement {
        const spanElement = makeHTMLElement('span', {
            className: Globals.getClassName('headerCellFilterIcon')
        });

        // Create inline SVG for better control over styling
        const svgPath = 'M2.2571 3.77791C1.75287 3.21437 1.50076 2.93259 ' +
            '1.49125 2.69312C1.48299 2.48509 1.57238 2.28515 1.73292 ' +
            '2.15259C1.91773 2 2.29583 2 3.05202 2H12.9473C13.7035 2 ' +
            '14.0816 2 14.2664 2.15259C14.427 2.28515 14.5163 2.48509 ' +
            '14.5081 2.69312C14.4986 2.93259 14.2465 3.21437 13.7422 ' +
            '3.77791L9.93808 8.02962C9.83756 8.14196 9.78731 8.19813 ' +
            '9.75147 8.26205C9.71969 8.31875 9.69637 8.37978 9.68225 ' +
            '8.44323C9.66633 8.51476 9.66633 8.59013 9.66633 ' +
            '8.74087V12.3056C9.66633 12.436 9.66633 12.5011 9.64531 ' +
            '12.5575C9.62673 12.6073 9.59651 12.6519 9.55717 ' +
            '12.6877C9.51265 12.7281 9.45213 12.7524 9.33108 ' +
            '12.8008L7.06441 13.7074C6.81938 13.8054 6.69687 13.8545 ' +
            '6.59852 13.834C6.51251 13.8161 6.43704 13.765 6.3885 ' +
            '13.6918C6.333 13.6081 6.333 13.4762 6.333 13.2122V8.74087C6.333 ' +
            '8.59013 6.333 8.51476 6.31708 8.44323C6.30296 8.37978 ' +
            '6.27964 8.31875 6.24786 8.26205C6.21203 8.19813 6.16177 ' +
            '8.14196 6.06126 8.02962L2.2571 3.77791Z';

        spanElement.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" ` +
            `xmlns="http://www.w3.org/2000/svg">
                <path d="${svgPath}" stroke="#8A8A8A" stroke-width="1.33" ` +
                `stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        return spanElement;
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
