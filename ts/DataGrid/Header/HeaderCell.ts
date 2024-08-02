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

import Cell from '../Cell.js';
import Column from '../Column';
import Row from '../Row';
import DGUtils from '../Utils.js';
import Globals from '../Globals.js';
import Templating from '../../Core/Templating.js';
import ColumnSorting from './../Actions/ColumnSorting.js';

const { format } = Templating;
const { makeHTMLElement } = DGUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell in the data grid.
 */
class HeaderCell extends Cell {

    /* *
    *
    *  Properties
    *
    * */
    public headerContent?: HTMLElement;

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid.
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
     * Init element
     */
    public init(): HTMLTableCellElement {
        return document.createElement('th', {});
    }

    /**
     * Render the cell container.
     */
    public render(): void {
        const column = this.column;
        const innerText = column.userOptions.headerFormat ? (
            format(column.userOptions.headerFormat, column)
        ) : column.id;

        // Render th elements
        this.row.htmlElement.appendChild(this.htmlElement);
        this.headerContent = makeHTMLElement('div', {
            innerText: innerText,
            className: Globals.classNames.headCellContent
        }, this.htmlElement);

        // Set the accessibility attributes.
        this.htmlElement.setAttribute('scope', 'col');
        this.htmlElement.setAttribute('data-column-id', column.id);

        // Add resizing
        this.renderColumnDragHandles();

        // Add API click event
        this.initColumnClickEvent();

        // Add sorting
        this.initColumnSorting();
    }
    /**
     * Render the drag handle for resizing columns.
     */
    private renderColumnDragHandles(): void {
        const column = this.column;
        const vp = column.viewport;

        if (
            vp.columnsResizer && (
                vp.columnDistribution !== 'full' ||
                (
                    vp.dataGrid.enabledColumns &&
                    column.index < vp.dataGrid.enabledColumns.length - 1
                )
            )
        ) {
            const handle = makeHTMLElement('div', {
                className: 'highcharts-datagrid-col-resizer'
            }, this.htmlElement);

            this.column.viewport.columnsResizer?.addHandleListeners(
                handle, column
            );
        }
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
        const column = this.column;

        if (!column.userOptions.sorting) {
            return;
        }
        // Add sorting
        column.columnSorting = new ColumnSorting(
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
