/* *
 *
 *  Grid Column class
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

import type { IndividualColumnOptions } from '../Options';
import type Cell from './Cell';
import type CellContent from './CellContent/CellContent';
import type HeaderCell from './Header/HeaderCell';
import type { DeepPartial } from '../../../Shared/Types';
import type { NonArrayColumnOptions } from '../Grid';

import Table from './Table.js';
import DataTable from '../../../Data/DataTable.js';
import Utils from '../../../Core/Utilities.js';
import ColumnSorting from './Actions/ColumnSorting';
import ColumnFiltering from './Actions/ColumnFiltering/ColumnFiltering.js';
import Templating from '../../../Core/Templating.js';
import TextContent from './CellContent/TextContent.js';
import Globals from '../Globals.js';
import TableCell from './Body/TableCell';
import GridUtils from '../GridUtils.js';

const {
    defined,
    fireEvent
} = Utils;

const {
    createOptionsProxy
} = GridUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a column in the data grid.
 */
export class Column {

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
    public readonly dataType: ColumnDataType;

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
     * The options of the column as a proxy that provides merged access to
     * original options and defaults if not defined in the individual options.
     */
    public options: NoIdColumnOptions;

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

    /**
     * Filtering column module.
     */
    public filtering?: ColumnFiltering;


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

        // Populate column options map if not exists, to prepare option
        // references for each column.
        if (grid.options && !grid.columnOptionsMap?.[id]) {
            const columnOptions: IndividualColumnOptions = { id };
            (grid.options.columns ??= []).push(columnOptions);
            grid.columnOptionsMap[id] = {
                index: grid.options.columns.length - 1,
                options: columnOptions
            };
        }

        this.options = createOptionsProxy(
            grid.columnOptionsMap?.[id]?.options ?? {},
            grid.options?.columnDefaults
        );

        if (this.options.filtering?.enabled) {
            this.filtering = new ColumnFiltering(this);
        }

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
    private assumeDataType(): ColumnDataType {
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
        return this.viewport.columnResizing.getColumnWidth(this);
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

    /**
     * Sets the new column options to the userOptions field.
     *
     * @param options
     * The options to set.
     *
     * @param overwrite
     * Whether to overwrite the existing column options with the new ones.
     * Default is `false`.
     *
     * @returns
     * The difference between the previous and the new column options in form
     * of a record of `[column.id]: column.options`.
     *
     * @internal
     */
    public setOptions(
        options: NoIdColumnOptions,
        overwrite = false
    ): DeepPartial<NonArrayColumnOptions> {
        return this.viewport.grid.setColumnOptions([{
            id: this.id,
            ...options
        }], overwrite);
    }

    public update(options: NoIdColumnOptions, render?: boolean): void;

    public update(options: NoIdColumnOptions, render?: true): Promise<void>;

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
        newOptions: NoIdColumnOptions,
        render: boolean = true
    ): Promise<void> {
        await this.viewport.grid.updateColumn(this.id, newOptions, render);
    }
}


/* *
 *
 *  Declarations
 *
 * */

export type NoIdColumnOptions = Omit<IndividualColumnOptions, 'id'>;

export type ColumnDataType = 'string' | 'number' | 'boolean' | 'datetime';


/* *
 *
 *  Default Export
 *
 * */

export default Column;
