/* *
 *
 *  Grid Column class
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

import type { IndividualColumnOptions } from '../Options';
import type Cell from './Cell';
import type CellContent from './CellContent/CellContent';
import type HeaderCell from './Header/HeaderCell';

import Table from './Table.js';
import DataTable from '../../../Data/DataTable.js';
import Utils from '../../../Core/Utilities.js';
import ColumnSorting from './Actions/ColumnSorting';
import Templating from '../../../Core/Templating.js';
import TextContent from './CellContent/TextContent.js';
import Globals from '../Globals.js';
import TableCell from './Body/TableCell';

const {
    defined,
    merge,
    fireEvent
} = Utils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a column in the data grid.
 */
class Column {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The viewport (table) the column belongs to.
     */
    public readonly viewport: Table;

    /**
     * Type of the data in the column.
     */
    public readonly dataType: Column.DataType;

    /**
     * The cells of the column.
     */
    public cells: Cell[] = [];

    /**
     * The id of the column (`name` in the Data Table).
     */
    public id: string;

    /**
     * The data of the column.
     */
    public data?: DataTable.Column;

    /**
     * The options of the column.
     */
    public readonly options: Column.Options;

    /**
     * The index of the column in the viewport.
     */
    public readonly index: number;

    /**
     * The wrapper for content of head.
     */
    public header?: HeaderCell;

    /**
     * Sorting column module.
     */
    public sorting?: ColumnSorting;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a column in the data grid.
     *
     * @param viewport
     * The viewport (table) the column belongs to.
     *
     * @param id
     * The id of the column (`name` in the Data Table).
     *
     * @param index
     * The index of the column.
     */
    constructor(
        viewport: Table,
        id: string,
        index: number
    ) {
        const { grid } = viewport;

        this.id = id;
        this.index = index;
        this.viewport = viewport;

        this.loadData();

        this.dataType = this.assumeDataType();

        this.options = merge(
            grid.options?.columnDefaults ?? {},
            grid.columnOptionsMap?.[id]?.options ?? {}
        );

        fireEvent(this, 'afterInit');
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Loads the data of the column from the viewport's data table.
     */
    public loadData(): void {
        this.data = this.viewport.dataTable.getColumn(this.id, true);
    }

    /**
     * Creates a cell content instance.
     *
     * @param cell
     * The cell that is to be edited.
     *
     */
    public createCellContent(cell: TableCell): CellContent {
        return new TextContent(cell);
    }

    /**
     * Assumes the data type of the column based on the options or data in the
     * column if not specified.
     */
    private assumeDataType(): Column.DataType {
        const { grid } = this.viewport;

        const type = grid.columnOptionsMap?.[this.id]?.options.dataType ??
            grid.options?.columnDefaults?.dataType;
        if (type) {
            return type;
        }

        if (!this.data) {
            return 'string';
        }

        if (!Array.isArray(this.data)) {
            // Typed array
            return 'number';
        }

        for (let i = 0, iEnd = Math.min(this.data.length, 30); i < iEnd; ++i) {
            if (!defined(this.data[i])) {
                // If the data is null or undefined, we should look
                // at the next value to determine the type.
                continue;
            }

            switch (typeof this.data[i]) {
                case 'number':
                    return 'number';
                case 'boolean':
                    return 'boolean';
                default:
                    return 'string';
            }
        }

        // eslint-disable-next-line no-console
        console.warn(
            `Column "${this.id}" contains too few data points with ` +
            'unambiguous types to correctly determine its dataType. It\'s ' +
            'recommended to set the `dataType` option for it.'
        );

        return 'string';
    }

    /**
     * Registers a cell in the column.
     *
     * @param cell
     * The cell to register.
     */
    public registerCell(cell: Cell): void {
        cell.htmlElement.setAttribute('data-column-id', this.id);
        if (this.options.className) {
            cell.htmlElement.classList.add(
                ...this.options.className.split(/\s+/g)
            );
        }
        if (this.viewport.grid.hoveredColumnId === this.id) {
            cell.htmlElement.classList.add(
                Globals.getClassName('hoveredColumn')
            );
        }
        this.cells.push(cell);
    }

    /**
     * Unregister a cell from the column.
     *
     * @param cell
     * The cell to unregister.
     */
    public unregisterCell(cell: Cell): void {
        const index = this.cells.indexOf(cell);
        if (index > -1) {
            this.cells.splice(index, 1);
        }
    }

    /**
     * Returns the width of the column in pixels.
     */
    public getWidth(): number {
        return this.viewport.columnDistribution.getColumnWidth(this);
    }

    /**
     * Adds or removes the hovered CSS class to the column element
     * and its cells.
     *
     * @param hovered
     * Whether the column should be hovered.
     */
    public setHoveredState(hovered: boolean): void {
        this.header?.htmlElement?.classList[hovered ? 'add' : 'remove'](
            Globals.getClassName('hoveredColumn')
        );

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            this.cells[i].htmlElement.classList[hovered ? 'add' : 'remove'](
                Globals.getClassName('hoveredColumn')
            );
        }
    }

    /**
     * Adds or removes the synced CSS class to the column element
     * and its cells.
     *
     * @param synced
     * Whether the column should have synced state.
     */
    public setSyncedState(synced: boolean): void {
        this.header?.htmlElement?.classList[synced ? 'add' : 'remove'](
            Globals.getClassName('syncedColumn')
        );

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            this.cells[i].htmlElement.classList[synced ? 'add' : 'remove'](
                Globals.getClassName('syncedColumn')
            );
        }
    }

    /**
     * Returns the formatted string where the templating context is the column.
     *
     * @param template
     * The template string.
     *
     * @return
     * The formatted string.
     */
    public format(template: string): string {
        return Templating.format(template, this, this.viewport.grid);
    }

    public update(options: Column.Options, render?: boolean): void;

    public update(options: Column.Options, render?: true): Promise<void>;

    /**
     * Updates the column with new options.
     *
     * @param newOptions
     * The new options for the column.
     *
     * @param render
     * Whether to re-render after the update. If `false`, the update will just
     * extend the options object. Defaults to `true`.
     */
    public async update(
        newOptions: Column.Options,
        render: boolean = true
    ): Promise<void> {
        await this.viewport.grid.updateColumn(this.id, newOptions, render);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Column {
    export type Options = Omit<IndividualColumnOptions, 'id'>;

    export type DataType = 'string' | 'number' | 'boolean' | 'datetime';
}


/* *
 *
 *  Default Export
 *
 * */

export default Column;
