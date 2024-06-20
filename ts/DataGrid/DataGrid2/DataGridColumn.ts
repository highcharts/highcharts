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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { ColumnOptions } from './DataGridOptions';

import DataGridCell from './DataGridCell.js';
import DataGridTable from './DataGridTable.js';
import DataTable from '../../Data/DataTable.js';
import Globals from './Globals.js';
import Utils from '../../Core/Utilities.js';
import DGUtils from './Utils.js';

const { merge } = Utils;
const { makeHTMLElement } = DGUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a column in the data grid.
 */
class DataGridColumn {

    /* *
    *
    *  Static Properties
    *
    * */

    /**
     * The minimum width of a column.
     */
    public static readonly MIN_COLUMN_WIDTH = 20;

    /**
     * The default options of the column.
     */
    public static readonly defaultOptions = {};


    /* *
    *
    *  Properties
    *
    * */

    /**
     * The viewport (table) the column belongs to.
     */
    public readonly viewport: DataGridTable;

    /**
     * The width of the column in the viewport. The interpretation of the
     * value depends on the `columns.distribution` option:
     * - `full`: The width is a ratio of the viewport width.
     * - `fixed`: The width is a fixed number of pixels.
     */
    public width: number;

    /**
     * The cells of the column.
     */
    public cells: DataGridCell[] = [];

    /**
     * The id of the column (`name` in the Data Table).
     */
    public readonly id: string;

    /**
     * The data of the column.
     */
    public data?: DataTable.Column;

    /**
     * The type of the column data.
     */
    public type?: DataGridColumn.Type;

    /**
     * The head element of the column.
     */
    public headElement?: HTMLElement;

    /**
     * The user options of the column.
     */
    public readonly userOptions: ColumnOptions;

    /**
     * The options of the column.
     */
    public readonly options: ColumnOptions;

    /**
     * The index of the column in the viewport.
     */
    public readonly index: number;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a column in the data grid.
     *
     * @param viewport The viewport (table) the column belongs to.
     * @param id The id of the column (`name` in the Data Table).
     * @param index The index of the column.
     */
    constructor(
        viewport: DataGridTable,
        id: string,
        index: number
    ) {
        this.userOptions = merge(
            viewport.dataGrid.options.defaults?.columns ?? {},
            viewport.dataGrid.options.columns?.[id] ?? {}
        );
        this.options = merge(DataGridColumn.defaultOptions, this.userOptions);

        this.id = id;
        this.index = index;
        this.viewport = viewport;
        this.data = viewport.dataTable.getColumn(id);

        // Set the initial width of the column.
        const mock = makeHTMLElement('div', {
            className: Globals.classNames.columnElement
        }, viewport.dataGrid.container);
        mock.setAttribute('data-column-id', id);

        if (viewport.columnDistribution === 'full') {
            this.width = this.getInitialFullDistWidth(mock);
        } else {
            this.width = mock.offsetWidth || 100;
        }
        mock.remove();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Registers a cell in the column.
     *
     * @param cell The cell to register.
     */
    public registerCell(cell: DataGridCell): void {
        cell.htmlElement.setAttribute('data-column-id', this.id);
        this.cells.push(cell);
    }

    /**
     * Returns the width of the column in pixels.
     */
    public getWidth(): number {
        const vp = this.viewport;

        return vp.columnDistribution === 'full' ?
            vp.getWidthFromRatio(this.width) :
            this.width;
    }


    /**
     * Sets the column hover state.
     *
     * @param hovered Whether the column should be hovered.
     */
    public setHover(hovered: boolean): void {
        this.headElement?.classList[hovered ? 'add' : 'remove'](
            Globals.classNames.hoveredColumn
        );

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            this.cells[i].htmlElement.classList[hovered ? 'add' : 'remove'](
                Globals.classNames.hoveredColumn
            );
        }
    }

    /**
     * The initial width of the column in the full distribution mode. The last
     * column in the viewport will have to fill the remaining space.
     *
     * @param mock The mock element to measure the width.
     */
    private getInitialFullDistWidth(mock: HTMLElement): number {
        const vp = this.viewport;

        if (this.index < vp.allColumnsCount - 1) {
            return (
                vp.getRatioFromWidth(mock.offsetWidth) ||
                1 / vp.allColumnsCount
            );
        }

        let allPreviousWidths = 0;
        for (let i = 0, iEnd = vp.allColumnsCount - 1; i < iEnd; i++) {
            allPreviousWidths += vp.columns[i].width;
        }

        const result = 1 - allPreviousWidths;

        if (result < 0) {
            throw new Error('The sum of the columns\' widths ' +
                'exceeds the viewport width. It is not allowed in the ' +
                'full distribution mode.');
        }

        return result;
    }

    /* *
    *
    *  Static Methods
    *
    * */

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridColumn {
    export type Type = 'number'|'date'|'string'|'boolean';
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridColumn;
