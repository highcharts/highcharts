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

import type { Options, GroupedHeaderOptions, IndividualColumnOptions } from './Options';
import type DataTableOptions from '../Data/DataTableOptions';
import type Column from './Column';

import AST from '../Core/Renderer/HTML/AST.js';
import DataGridDefaultOptions from './DefaultOptions.js';
import Table from './Table.js';
import DataGridUtils from './Utils.js';
import DataTable from '../Data/DataTable.js';
import QueryingController from './Querying/QueryingController.js';
import Globals from './Globals.js';
import U from '../Core/Utilities.js';

const { makeHTMLElement } = DataGridUtils;
const { win } = Globals;
const { merge } = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Creates a grid structure (table).
 */
class DataGrid {

    /* *
    *
    *  Static Methods
    *
    * */

    /**
     * Creates a new data grid.
     *
     * @param renderTo
     * The render target (html element or id) of the data grid.
     *
     * @param options
     * The options of the data grid.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When true, the
     * function returns a promise that resolves with the dashboard instance.
     *
     * @return
     * The new data grid.
     */
    public static dataGrid(
        renderTo: string|HTMLElement,
        options: Options,
        async?: boolean
    ): DataGrid;

    /**
     * Creates a new data grid.
     *
     * @param renderTo
     * The render target (html element or id) of the data grid.
     *
     * @param options
     * The options of the data grid.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When true, the
     * function returns a promise that resolves with the dashboard instance.
     *
     * @return
     * Promise that resolves with the new data grid.
     */
    public static dataGrid(
        renderTo: string|HTMLElement,
        options: Options,
        async: true
    ): Promise<DataGrid>;

    // Implementation
    public static dataGrid(
        renderTo: string|HTMLElement,
        options: Options,
        async?: boolean
    ): (DataGrid | Promise<DataGrid>) {

        if (async) {
            return new Promise<DataGrid>((resolve): void => {
                void new DataGrid(renderTo, options, (dataGrid): void => {
                    resolve(dataGrid);
                });
            });
        }

        return new DataGrid(renderTo, options);
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Default options for all DataGrid instances.
     * @internal
     */
    public static readonly defaultOptions = DataGridDefaultOptions;


    /**
     * The user options declared for the columns as an object of column ID to
     * column options.
     */
    public columnOptionsMap: Record<string, Column.Options> = {};

    /**
     * The container of the data grid.
     */
    public container?: HTMLElement;

    /**
     * The content container of the data grid.
     */
    public contentWrapper?: HTMLElement;

    /**
     * The data source of the data grid. It contains the original data table
     * that was passed to the data grid.
     */
    public dataTable?: DataTable;

    /**
     * The presentation table of the data grid. It contains a modified version
     * of the data table that is used for rendering the data grid content. If
     * not modified, just a reference to the original data table.
     */
    public presentationTable?: DataTable;

    /**
     * The HTML element of the table.
     */
    public tableElement?: HTMLTableElement;

    /**
     * The options of the data grid. Contains the options that were declared
     * by the user and some of the default options.
     */
    public options?: Options;

    /**
     * The options that were declared by the user when creating the data grid
     * or when updating it.
     */
    public userOptions?: Partial<Options>;

    /**
     * The table (viewport) element of the data grid.
     */
    public viewport?: Table;

    /**
     * The list of columns that are displayed in the data grid.
     * @internal
     */
    public enabledColumns?: string[];

    /**
     * The hovered row index.
     * @internal
     */
    public hoveredRowIndex?: number;

    /**
     * The hovered column ID.
     * @internal
     */
    public hoveredColumnId?: string;

    /**
     * The querying controller.
     */
    public querying: QueryingController;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new data grid.
     *
     * @param renderTo
     * The render target (container) of the data grid.
     *
     * @param options
     * The options of the data grid.
     *
     * @param afterLoadCallback
     * The callback that is called after the data grid is loaded.
     */
    constructor(
        renderTo: string | HTMLElement,
        options: Options,
        afterLoadCallback?: DataGrid.AfterLoadCallback
    ) {
        this.loadUserOptions(options);

        this.querying = new QueryingController(this);

        this.initContainers(renderTo);
        this.loadDataTable(this.options?.dataTable);

        this.querying.loadOptions();
        void this.querying.proceed().then((): void => {
            this.renderViewport();
            afterLoadCallback?.(this);
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Initializes the container of the data grid.
     *
     * @param renderTo
     * The render target (html element or id) of the data grid.
     *
     */
    private initContainers(renderTo: string|HTMLElement): void {
        const container = typeof renderTo === 'string' ?
            win.document.getElementById(renderTo) :
            renderTo;

        // Display an error if the renderTo is wrong
        if (!container) {
            // eslint-disable-next-line no-console
            console.error(`
                Rendering div not found. It is unable to find the HTML element
                to render the DataGrid in.
            `);
            return;
        }

        this.container = container;
        this.container.innerHTML = AST.emptyHTML;
        this.contentWrapper = makeHTMLElement('div', {
            className: Globals.classNames.container
        }, this.container);
    }

    /**
     * Loads the user options to all the important fields.
     *
     * @param newOptions
     * The options that were declared by the user.
     *
     * @param overwrite
     * Whether to overwrite or merge the new options with the existing options.
     * Default is `false`.
     */
    private loadUserOptions(
        newOptions: Partial<Options>,
        overwrite: boolean = false
    ): void {

        if (overwrite) {
            this.userOptions = newOptions;
            this.options = merge(DataGrid.defaultOptions, newOptions);
        } else {
            this.userOptions = merge(this.userOptions ?? {}, newOptions);
            this.options = merge(
                this.options ?? DataGrid.defaultOptions,
                this.userOptions
            );
        }

        const columnOptionsArray = this.options?.columns;
        if (!columnOptionsArray) {
            return;
        }
        const columnOptionsObj: Record<string, Column.Options> = {};
        for (let i = 0, iEnd = columnOptionsArray?.length ?? 0; i < iEnd; ++i) {
            columnOptionsObj[columnOptionsArray[i].id] = columnOptionsArray[i];
        }

        this.columnOptionsMap = columnOptionsObj;
    }

    /**
     * Updates the data grid with new options. It overwrites the existing column
     * options array. If you want to merge the column options, use the
     * `updateColumns` method instead.
     *
     * @param options
     * The options of the data grid that should be updated. If not provieded,
     * the update will be proceeded based on the `this.userOptions` property.
     *
     * @param render
     * Whether to re-render the data grid after updating the options.
     *
     * @param overwrite
     * If true, the column options will be updated by replacing the existing
     * options with the new ones instead of merging them.
     */
    public async update(
        options: Options = {},
        render: boolean = true,
        overwrite = false
    ): Promise<void> {
        this.loadUserOptions(options, overwrite);

        let newDataTable = false;
        if (
            !overwrite && (!this.dataTable || options.dataTable) ||
            overwrite && (options.dataTable?.id !== this.dataTable?.id)
        ) {
            this.loadDataTable(this.options?.dataTable);
            newDataTable = true;
        }

        this.querying.loadOptions();

        if (render) {
            await this.querying.proceed(newDataTable);
            this.renderViewport();
        }
    }

    /**
     * Updates the columns of the data grid with new options. Unlike the
     * `update` method, it does not overwrite the existing column options array.
     * Instead, it merges the provided options with the existing ones.
     *
     * @param options
     * The options of the columns that should be updated.
     *
     * @param render
     * Whether to re-render the data grid after updating the columns.
     *
     * @param overwrite
     * If true, the column options will be updated by replacing the existing
     * options with the new ones instead of merging them.
     */
    public async updateColumns(
        options: IndividualColumnOptions[],
        render: boolean = true,
        overwrite = false
    ): Promise<void> {
        const columnOptions = this.userOptions?.columns ?? [];

        for (let i = 0, iEnd = options.length; i < iEnd; ++i) {
            const columnId = options[i].id;
            if (!columnId) {
                continue;
            }

            const indexInPrevOptions = columnOptions?.findIndex(
                (prev): boolean => prev.id === columnId
            );

            if (indexInPrevOptions === -1) {
                columnOptions.push(options[i]);
            } else if (overwrite) {
                columnOptions[indexInPrevOptions] = options[i];
            } else {
                columnOptions[indexInPrevOptions] = merge(
                    columnOptions[indexInPrevOptions],
                    options[i]
                );
            }
        }

        await this.update({
            columns: columnOptions
        }, render);
    }

    /**
     * Hovers the row with the provided index. It removes the hover effect from
     * the previously hovered row.
     *
     * @param rowIndex
     * The index of the row.
     */
    public hoverRow(rowIndex?: number): void {
        const rows = this.viewport?.rows;
        if (!rows) {
            return;
        }

        const firstRowIndex = this.viewport?.rows[0]?.index ?? 0;

        if (this.hoveredRowIndex !== void 0) {
            rows[this.hoveredRowIndex - firstRowIndex]?.setHoveredState(false);
        }

        if (rowIndex !== void 0) {
            rows[rowIndex - firstRowIndex]?.setHoveredState(true);
        }

        this.hoveredRowIndex = rowIndex;
    }

    /**
     * Hovers the column with the provided ID. It removes the hover effect from
     * the previously hovered column.
     *
     * @param columnId
     * The ID of the column.
     */
    public hoverColumn(columnId?: string): void {
        const vp = this.viewport;

        if (!vp) {
            return;
        }

        if (this.hoveredColumnId) {
            vp.getColumn(this.hoveredColumnId)?.setHoveredState(false);
        }

        if (columnId) {
            vp.getColumn(columnId)?.setHoveredState(true);
        }

        this.hoveredColumnId = columnId;
    }

    /**
     * Renders the viewport of the data grid. If the data grid is already
     * rendered, it will be destroyed and re-rendered with the new data.
     * @internal
     */
    public renderViewport(): void {
        let vp = this.viewport;
        const viewportMeta = vp?.getStateMeta();

        this.enabledColumns = this.getEnabledColumnIDs();
        vp?.destroy();
        if (this.contentWrapper) {
            this.contentWrapper.innerHTML = AST.emptyHTML;
        }

        if (this.enabledColumns.length > 0) {
            this.renderTable();
            vp = this.viewport;
            if (viewportMeta && vp) {
                vp.applyStateMeta(viewportMeta);
            }
        } else {
            this.renderNoData();
        }
    }

    /**
     * Renders the table (viewport) of the data grid.
     */
    private renderTable(): void {
        this.tableElement = makeHTMLElement('table', {
            className: Globals.classNames.tableElement
        }, this.contentWrapper);

        this.viewport = new Table(this, this.tableElement);

        // Accessibility
        this.tableElement.setAttribute(
            'aria-rowcount',
            this.dataTable?.getRowCount() ?? 0
        );
    }

    /**
     * Renders a message that there is no data to display.
     */
    private renderNoData(): void {
        makeHTMLElement('div', {
            className: Globals.classNames.noData,
            innerText: 'No data to display'
        }, this.contentWrapper);
    }

    /**
     * Returns the array of IDs of columns that should be displayed in the data
     * grid, in the correct order.
     */
    private getEnabledColumnIDs(): string[] {
        const { columnOptionsMap } = this;
        const header = this.options?.settings?.header;
        const headerColumns = this.getColumnIds(header || [], false);
        const columnsIncluded = this.options?.settings?.columns?.included || (
            headerColumns && headerColumns.length > 0 ?
                headerColumns : this.dataTable?.getColumnNames()
        );

        if (!columnsIncluded?.length) {
            return [];
        }

        if (!columnOptionsMap) {
            return columnsIncluded;
        }

        let columnName: string;
        const result: string[] = [];
        for (let i = 0, iEnd = columnsIncluded.length; i < iEnd; ++i) {
            columnName = columnsIncluded[i];
            if (columnOptionsMap?.[columnName]?.enabled !== false) {
                result.push(columnName);
            }
        }

        return result;
    }

    private loadDataTable(tableOptions?: DataTable | DataTableOptions): void {
        // If the table is passed as a reference, it should be used instead of
        // creating a new one.
        if (tableOptions?.id) {
            this.dataTable = tableOptions as DataTable;
            this.presentationTable = this.dataTable.modified;
            return;
        }

        this.dataTable = this.presentationTable =
            new DataTable(tableOptions as DataTableOptions);
    }

    /**
     * Extracts all references to columnIds on all levels below defined level
     * in the settings.header structure.
     *
     * @param columns
     * Structure that we start calculation
     *
     * @param [onlyEnabledColumns=true]
     * Extract all columns from header or columns filtered by enabled param
     * @returns
     */
    public getColumnIds(
        columns: Array<GroupedHeaderOptions|string>,
        onlyEnabledColumns: boolean = true
    ): string[] {
        let columnIds: string[] = [];
        const { enabledColumns } = this;

        for (const column of columns) {
            const columnId: string | undefined =
                typeof column === 'string' ? column : column.columnId;

            if (
                columnId &&
                (!onlyEnabledColumns || (enabledColumns?.includes(columnId)))
            ) {
                columnIds.push(columnId);
            }

            if (typeof column !== 'string' && column.columns) {
                columnIds = columnIds.concat(
                    this.getColumnIds(column.columns, onlyEnabledColumns)
                );
            }
        }

        return columnIds;
    }

    /**
     * Destroys the data grid.
     */
    public destroy(): void {
        this.viewport?.destroy();

        if (this.container) {
            this.container.innerHTML = AST.emptyHTML;
            this.container.classList.remove(Globals.classNames.container);
        }

        // Clear all properties
        Object.keys(this).forEach((key): void => {
            delete this[key as keyof this];
        });
    }

    /**
     * Returns the current dataGrid data as a JSON string.
     *
     * @return
     * JSON representation of the data
     */
    public getJSON(): string {
        const json = this.viewport?.dataTable.modified.columns;

        if (!this.enabledColumns || !json) {
            return '{}';
        }

        for (const key of Object.keys(json)) {
            if (this.enabledColumns.indexOf(key) === -1) {
                delete json[key];
            }
        }

        return JSON.stringify(json);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */
namespace DataGrid {
    export type AfterLoadCallback = (dataGrid: DataGrid) => void;
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGrid;
