/* *
 *
 *  Grid HeaderCell class
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

import type { GroupedHeaderOptions } from '../../Options';
import type { NoIdColumnOptions } from '../Column';

import Cell from '../Cell.js';
import Column from '../Column';
import Row from '../Row';
import GridUtils from '../../GridUtils.js';
import ColumnSorting from '../Actions/ColumnSorting.js';
import Globals from '../../Globals.js';
import Utilities from '../../../../Core/Utilities.js';
import TableHeader from './TableHeader.js';
import ColumnToolbar from './ColumnToolbar/ColumnToolbar.js';

const {
    makeHTMLElement,
    setHTMLContent,
    createOptionsProxy
} = GridUtils;
const {
    fireEvent,
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
     * The container element of the header cell.
     */
    public container?: HTMLDivElement;

    /**
     * Reference to options taken from the header settings, that will override
     * the column options.
     * @internal
     */
    public readonly superColumnOptions: Partial<NoIdColumnOptions> = {};

    /**
     * List of columns that are subordinated to the header cell.
     */
    public readonly columns: Column[] = [];

    /**
     * Content value of the header cell.
     */
    public override value: string = '';

    /**
     * The table header that this header cell belongs to.
     */
    public tableHeader: TableHeader;

    /**
     * The toolbar of the header cell.
     */
    toolbar?: ColumnToolbar;


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
        const header = this.row.viewport.header;
        if (!header) {
            throw new Error('No header found.');
        }
        this.tableHeader = header;

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
        elem.setAttribute('role', 'columnheader');
        return elem;
    }

    /**
     * Render the cell container.
     */
    public override render(): void {
        const { column } = this;
        const options = createOptionsProxy(
            this.superColumnOptions,
            column?.options
        );
        const headerCellOptions = options.header || {};

        if (column && headerCellOptions.formatter) {
            this.value = headerCellOptions.formatter.call(column).toString();
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
        const container = this.container = makeHTMLElement('div', {
            className: Globals.getClassName('headerCellContainer')
        }, this.htmlElement);

        this.headerContent = makeHTMLElement('span', {
            className: Globals.getClassName('headerCellContent')
        }, container);

        // Render the header cell element content.
        setHTMLContent(this.headerContent, this.value);

        this.htmlElement.setAttribute('scope', 'col');

        if (this.superColumnOptions.className) {
            this.htmlElement.classList.add(
                ...this.superColumnOptions.className.split(/\s+/g)
            );
        }

        if (column) {
            this.htmlElement.setAttribute('data-column-id', column.id);
            this.htmlElement.setAttribute('aria-label', column.id);

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

            // Add toolbar
            this.toolbar = new ColumnToolbar(column);
            this.toolbar.add();

            // Add sorting
            this.initColumnSorting();
        }

        // Set alignment in column cells based on column data type
        this.htmlElement.classList[
            column?.dataType === 'number' ? 'add' : 'remove'
        ](Globals.getClassName('rightAlign'));

        // Add custom class name from column options
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
        this.toolbar?.reflow();
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        if (!this.column || e.target !== this.htmlElement) {
            return;
        }

        if (e.key === 'Enter') {
            this.toolbar?.focus();
            e.preventDefault();
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

        if ((
            column.options.sorting?.enabled ??
            column.options.sorting?.sortable
        )) {
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

    public override destroy(): void {
        this.toolbar?.destroy();
        super.destroy();
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderCell;
