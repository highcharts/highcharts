/* *
 *
 *  Data Grid class
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
const { merge } = Utilities;


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
     * Columns that are grouped in the header cell. In most cases is contains
     * only one column, but can be more if the header cell is grouped.
     */
    public columns?: GroupedHeaderOptions[];

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
     */
    constructor(column: Column, row: Row) {
        super(column, row);
        column.header = this;
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
        const isSingleColumn = this.row.viewport.getColumn(this.column.id);
        const options = merge(column.options, this.options);
        const headerCellOptions = options.header || {};

        if (headerCellOptions.formatter) {
            this.value = headerCellOptions.formatter.call(this);
        } else if (headerCellOptions.format) {
            this.value = column.format(headerCellOptions.format);
        } else {
            this.value = column.id;
        }

        // Render content of th element
        this.row.htmlElement.appendChild(this.htmlElement);
        this.headerContent = makeHTMLElement('div', {
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

        // Set the accessibility attributes.
        this.htmlElement.setAttribute('scope', 'col');
        this.htmlElement.setAttribute('data-column-id', column.id);

        if (this.options.className) {
            this.htmlElement.classList.add(
                ...this.options.className.split(/\s+/g)
            );
        }

        if (isSingleColumn) {
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

            // Add API click event
            this.initColumnClickEvent();

            // Add sorting
            this.initColumnSorting();
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

        if (cell.columns) {
            for (const col of cell.columns) {
                width += (vp.getColumn(col.columnId || '')?.getWidth()) || 0;
            }
        } else {
            width = cell.column.getWidth();
        }

        // Set the width of the column. Max width is needed for the
        // overflow: hidden to work.
        th.style.width = th.style.maxWidth = width + 'px';
    }

    /**
     * Add click event to the header
     */
    private initColumnClickEvent(): void {
        const column = this.column;
        const vp = column.viewport;
        const dataGrid = vp.dataGrid;

        if (
            !this.htmlElement ||
            !dataGrid.options?.events?.header?.click
        ) {
            return;
        }

        const onHeaderClick = (): void => {
            dataGrid.options?.events?.header?.click?.call(
                column
            );
        };

        vp.header?.addHeaderEvent(
            this.htmlElement,
            onHeaderClick
        );

        this.headerContent?.addEventListener('click', onHeaderClick);
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
