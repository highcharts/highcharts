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

import type DataGridOptions from './DataGridOptions';
import type DataTableOptions from '../Data/DataTableOptions';

import AST from '../Core/Renderer/HTML/AST.js';
import DataGridColumn from './DataGridColumn.js';
import DataGridDefaultOptions from './DataGridDefaultOptions.js';
import DataGridTable from './DataGridTable.js';
import DataGridUtils from './Utils.js';
import DataTable from '../Data/DataTable.js';
import Globals from './Globals.js';
import U from '../Core/Utilities.js';

const { makeDiv, makeHTMLElement } = DataGridUtils;
const { win } = Globals;
const { merge } = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Creates a scrollable grid structure (table).
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
     * @return The new data grid.
     */
    public static dataGrid(
        renderTo: string|HTMLElement,
        options: DataGridOptions
    ): DataGrid {
        return new DataGrid(renderTo, options);
    }

    /**
     * Initializes the container of the data grid.
     *
     * @param renderTo
     * The render target (html element or id) of the data grid.
     *
     * @returns
     * The container element of the data grid.
     */
    private static initContainer(renderTo: string|HTMLElement): HTMLElement {
        if (typeof renderTo === 'string') {
            const existingContainer = win.document.getElementById(renderTo);
            if (existingContainer) {
                return existingContainer;
            }
            return makeDiv(Globals.classNames.container, renderTo);
        }
        renderTo.classList.add(Globals.classNames.container);
        return renderTo;
    }


    /* *
    *
    *  Properties
    *
    * */

    /**
     * Default options for all DataGrid instances.
     */
    public static readonly defaultOptions = DataGridDefaultOptions;


    /**
     * The container of the data grid.
     */
    public container?: HTMLElement;

    /**
     * The HTML element of the table.
     */
    public tableElement?: HTMLTableElement;

    /**
     * The options of the data grid.
     */
    public options?: DataGridOptions;

    /**
     * The user options of the data grid.
     */
    public userOptions?: DataGridOptions;

    /**
     * The table (viewport) element of the data grid.
     */
    public viewport?: DataGridTable;

    /**
     * The list of columns that should be displayed in the data grid.
     */
    public enabledColumns?: string[];


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
     */
    constructor(renderTo: string|HTMLElement, options: DataGridOptions) {
        this.userOptions = options;
        this.options = merge(DataGrid.defaultOptions, options);

        this.container = DataGrid.initContainer(renderTo);
        this.container.classList.add(Globals.classNames.container);

        let dataTable: DataTable;
        if (this.options.table?.id) {
            // If the table is passed as a reference, it should be used
            dataTable = this.options.table as DataTable;
        } else {
            dataTable = new DataTable(this.options.table as DataTableOptions);
        }

        this.renderViewport(dataTable);
    }

    /**
     * Updates the data grid with new options.
     *
     * @param options
     * The options of the data grid that should be updated.
     *
     * @param render
     * Whether to re-render the data grid after updating the options.
     */
    public update(options: DataGridOptions, render: boolean = true): void {
        this.userOptions = merge(this.userOptions, options);
        this.options = merge(DataGrid.defaultOptions, this.userOptions);

        let dataTable = this.viewport?.dataTable;
        if (!dataTable || options.table) {
            if (this.options.table?.id) {
                // If the table is passed as a reference, it should be used
                dataTable = this.options.table as DataTable;
            } else {
                dataTable = new DataTable(
                    this.options.table as DataTableOptions
                );
            }
        }

        if (render) {
            this.renderViewport(dataTable);
        }
    }

    /**
     * Renders the viewport of the data grid. If the data grid is already
     * rendered, it will be destroyed and re-rendered with the new data.
     *
     * @param dataTable
     * The data source of the data grid. If not provided, the data source of
     * the current viewport will be used (only for rerendering).
     */
    public renderViewport(dataTable?: DataTable): void {
        let vp = this.viewport;

        if (!dataTable) {
            if (!vp) {
                return;
            }
            dataTable = vp.dataTable;
        }

        const viewportMeta = vp?.getStateMeta();

        this.enabledColumns = this.getEnabledColumnsIDs(dataTable);
        vp?.destroy();
        if (this.container) {
            this.container.innerHTML = AST.emptyHTML;
        }

        if (this.enabledColumns.length > 0) {
            this.renderTable(dataTable);
            vp = this.viewport;
            if (viewportMeta && vp) {
                vp.applyStateMeta(viewportMeta);
            }
        } else {
            this.renderNoData();
        }
    }

    /**
     * Returns the column with the provided ID.
     *
     * @param id
     * The ID of the column.
     */
    public getColumn(id: string): DataGridColumn | undefined {
        const columns = this.enabledColumns;
        if (!columns) {
            return;
        }

        const columnIndex = columns.indexOf(id);
        if (columnIndex < 0) {
            return;
        }

        return this.viewport?.columns[columnIndex];
    }

    /**
     * Renders the table (viewport) of the data grid.
     *
     * @param dataTable
     * The data source of the data grid.
     */
    private renderTable(dataTable: DataTable): void {
        if (!this.container) {
            return;
        }

        this.tableElement = makeHTMLElement('table', {
            className: Globals.classNames.tableElement
        }, this.container);

        this.viewport = new DataGridTable(this, dataTable, this.tableElement);

        // Accessibility
        this.tableElement.setAttribute(
            'aria-rowcount',
            dataTable.getRowCount()
        );
    }

    /**
     * Renders a message that there is no data to display.
     */
    private renderNoData(): void {
        if (!this.container) {
            return;
        }

        makeHTMLElement('div', {
            className: Globals.classNames.noData,
            innerText: 'No data to display'
        }, this.container);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Returns the array of IDs of columns that should be displayed in the data
     * grid, in the correct order.
     *
     * @param dataTable
     * The data source of the data grid.
     */
    private getEnabledColumnsIDs(dataTable: DataTable): string[] {
        const columnsOptions = this.options?.columns;
        const columnsIncluded =
            this.options?.columnsIncluded ??
            dataTable.getColumnNames();

        let columnName: string;
        const result: string[] = [];
        for (let i = 0, iEnd = columnsIncluded.length; i < iEnd; ++i) {
            columnName = columnsIncluded[i];
            if (columnsOptions?.[columnName]?.enabled !== false) {
                result.push(columnName);
            }
        }

        return result;
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
     * @returns
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

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGrid;
