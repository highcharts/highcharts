/* *
 *
 *  Highcharts Grid class
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

import type { Options, GroupedHeaderOptions, IndividualColumnOptions } from './Options';
import type DataTableOptions from '../../Data/DataTableOptions';
import type Column from './Table/Column';

import Accessibility from './Accessibility/Accessibility.js';
import AST from '../../Core/Renderer/HTML/AST.js';
import Defaults from './Defaults.js';
import GridUtils from './GridUtils.js';
import DataTable from '../../Data/DataTable.js';
import Table from './Table/Table.js';
import U from '../../Core/Utilities.js';
import QueryingController from './Querying/QueryingController.js';
import Globals from './Globals.js';
import TimeBase from '../../Shared/TimeBase.js';

const { makeHTMLElement, setHTMLContent } = GridUtils;
const {
    fireEvent,
    extend,
    getStyle,
    merge,
    pick,
    defined
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * A base class for the Grid.
 */
class Grid {

    /* *
    *
    *  Static Methods
    *
    * */

    /**
     * Creates a new Grid.
     *
     * @param renderTo
     * The render target (html element or id) of the Grid.
     *
     * @param options
     * The options of the Grid.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When true, the
     * function returns a promise that resolves with the dashboard instance.
     *
     * @return
     * The new Grid.
     */
    public static grid(
        renderTo: string|HTMLElement,
        options: Options,
        async?: boolean
    ): Grid;

    /**
     * Creates a new Grid.
     *
     * @param renderTo
     * The render target (html element or id) of the Grid.
     *
     * @param options
     * The options of the Grid.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When true, the
     * function returns a promise that resolves with the dashboard instance.
     *
     * @return
     * Promise that resolves with the new Grid.
     */
    public static grid(
        renderTo: string|HTMLElement,
        options: Options,
        async: true
    ): Promise<Grid>;

    // Implementation
    public static grid(
        renderTo: string|HTMLElement,
        options: Options,
        async?: boolean
    ): (Grid | Promise<Grid>) {

        if (async) {
            return new Promise<Grid>((resolve): void => {
                void new Grid(renderTo, options, (grid): void => {
                    resolve(grid);
                });
            });
        }

        return new Grid(renderTo, options);
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * An array containing the current Grid objects in the page.
     * @internal
     */
    public static readonly grids: Array<(Grid|undefined)> = [];

    /**
     * The accessibility controller.
     */
    public accessibility?: Accessibility;

    /**
     * The caption element of the Grid.
     */
    public captionElement?: HTMLElement;

    /**
     * The user options declared for the columns as an object of column ID to
     * column options.
     * @internal
     */
    public columnOptionsMap: Record<string, Grid.ColumnOptionsMapItem> = {};

    /**
     * The container of the grid.
     */
    public container?: HTMLElement;

    /**
     * The content container of the Grid.
     */
    public contentWrapper?: HTMLElement;

    /**
     * The data source of the Grid. It contains the original data table
     * that was passed to the Grid.
     */
    public dataTable?: DataTable;

    /**
     * The description element of the Grid.
     */
    public descriptionElement?: HTMLElement;

    /**
     * The container element of the loading indicator overlaying the Grid.
     */
    public loadingWrapper?: HTMLElement;

    /**
     * The presentation table of the Grid. It contains a modified version
     * of the data table that is used for rendering the Grid content. If
     * not modified, just a reference to the original data table.
     */
    public presentationTable?: DataTable;

    /**
     * The HTML element of the table.
     */
    public tableElement?: HTMLTableElement;

    /**
     * The options of the Grid. Contains the options that were declared
     * by the user and some of the default options.
     */
    public options?: Options;

    /**
     * The options that were declared by the user when creating the Grid
     * or when updating it.
     */
    public userOptions: Partial<Options> = {};

    /**
     * The table (viewport) element of the Grid.
     */
    public viewport?: Table;

    /**
     * The list of columns that are displayed in the Grid.
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
     * The synced row index.
     * @internal
     */
    public syncedRowIndex?: number;

    /**
     * The synced column ID.
     * @internal
     */
    public syncedColumnId?: string;

    /**
     * The querying controller.
     * @internal
     */
    public querying: QueryingController;

    /**
     * The time instance.
     */
    public time: TimeBase;

    /**
     * The locale of the Grid.
     */
    public locale?: string | string[];

    /**
     * The initial height of the container. Can be 0 also if not set.
     * @internal
     */
    public initialContainerHeight: number = 0;

    /**
     * The unique ID of the Grid.
     */
    public id: string;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new Grid.
     *
     * @param renderTo
     * The render target (container) of the Grid.
     *
     * @param options
     * The options of the Grid.
     *
     * @param afterLoadCallback
     * The callback that is called after the Grid is loaded.
     */
    constructor(
        renderTo: string | HTMLElement,
        options: Options,
        afterLoadCallback?: Grid.AfterLoadCallback
    ) {
        this.loadUserOptions(options);

        this.querying = new QueryingController(this);
        this.id = this.options?.id || U.uniqueKey();

        this.initContainers(renderTo);
        this.initAccessibility();
        this.loadDataTable(this.options?.dataTable);
        this.initVirtualization();

        this.locale = this.options?.lang?.locale || (
            (this.container?.closest('[lang]') as HTMLElement|null)?.lang
        );

        this.time = new TimeBase(extend<TimeBase.TimeOptions>(
            this.options?.time,
            { locale: this.locale }
        ), this.options?.lang);

        this.querying.loadOptions();
        void this.querying.proceed().then((): void => {
            this.renderViewport();
            afterLoadCallback?.(this);
        });

        Grid.grids.push(this);
    }


    /* *
     *
     *  Methods
     *
     * */

    /*
     * Initializes the accessibility controller.
     */
    private initAccessibility(): void {
        this.accessibility?.destroy();
        delete this.accessibility;

        if (this.options?.accessibility?.enabled) {
            this.accessibility = new Accessibility(this);
        }
    }

    /**
     * Initializes the container of the Grid.
     *
     * @param renderTo
     * The render target (html element or id) of the Grid.
     *
     */
    private initContainers(renderTo: string|HTMLElement): void {
        const container = (typeof renderTo === 'string') ?
            Globals.win.document.getElementById(renderTo) : renderTo;

        // Display an error if the renderTo is wrong
        if (!container) {
            // eslint-disable-next-line no-console
            console.error(`
                Rendering div not found. It is unable to find the HTML element
                to render the Grid in.
            `);
            return;
        }

        this.initialContainerHeight = getStyle(container, 'height', true) || 0;

        this.container = container;
        this.container.innerHTML = AST.emptyHTML;
        this.contentWrapper = makeHTMLElement('div', {
            className: Globals.getClassName('container')
        }, this.container);
    }

    /**
     * Loads the new user options to all the important fields (`userOptions`,
     * `options` and `columnOptionsMap`).
     *
     * @param newOptions
     * The options that were declared by the user.
     *
     * @param oneToOne
     * When `false` (default), the existing column options will be merged with
     * the ones that are currently defined in the user options. When `true`,
     * the columns not defined in the new options will be removed.
     */
    private loadUserOptions(
        newOptions: Partial<Options>,
        oneToOne = false
    ): void {
        // Operate on a copy of the options argument
        newOptions = merge(newOptions);

        if (newOptions.columns) {
            if (oneToOne) {
                this.setColumnOptionsOneToOne(newOptions.columns);
            } else {
                this.setColumnOptions(newOptions.columns);
            }
            delete newOptions.columns;
        }

        this.userOptions = merge(this.userOptions, newOptions);
        this.options = merge(
            this.options ?? Defaults.defaultOptions,
            this.userOptions
        );

        // Generate column options map
        const columnOptionsArray = this.options?.columns;
        if (!columnOptionsArray) {
            return;
        }
        const columnOptionsMap: Record<string, Grid.ColumnOptionsMapItem> = {};
        for (let i = 0, iEnd = columnOptionsArray?.length ?? 0; i < iEnd; ++i) {
            columnOptionsMap[columnOptionsArray[i].id] = {
                index: i,
                options: columnOptionsArray[i]
            };
        }
        this.columnOptionsMap = columnOptionsMap;
    }

    /**
     * Sets the new column options to the userOptions field.
     *
     * @param newColumnOptions
     * The new column options that should be loaded.
     *
     * @param overwrite
     * Whether to overwrite the existing column options with the new ones.
     * Default is `false`.
     */
    private setColumnOptions(
        newColumnOptions: IndividualColumnOptions[],
        overwrite = false
    ): void {
        if (!this.userOptions.columns) {
            this.userOptions.columns = [];
        }
        const columnOptions = this.userOptions.columns;

        for (let i = 0, iEnd = newColumnOptions.length; i < iEnd; ++i) {
            const newOptions = newColumnOptions[i];
            const colOptionsIndex =
                this.columnOptionsMap?.[newOptions.id]?.index ?? -1;

            // If the new column options contain only the id.
            if (Object.keys(newOptions).length < 2) {
                if (overwrite && colOptionsIndex !== -1) {
                    columnOptions.splice(colOptionsIndex, 1);
                }
                continue;
            }

            if (colOptionsIndex === -1) {
                columnOptions.push(newOptions);
            } else if (overwrite) {
                columnOptions[colOptionsIndex] = newOptions;
            } else {
                merge(true, columnOptions[colOptionsIndex], newOptions);
            }
        }

        if (columnOptions.length < 1) {
            delete this.userOptions.columns;
        }
    }

    /**
     * Loads the new column options to the userOptions field in a one-to-one
     * manner. It means that all the columns that are not defined in the new
     * options will be removed.
     *
     * @param newColumnOptions
     * The new column options that should be loaded.
     */
    private setColumnOptionsOneToOne(
        newColumnOptions: IndividualColumnOptions[]
    ): void {
        const prevColumnOptions = this.userOptions.columns;
        const columnOptions = [];

        let prevOptions: IndividualColumnOptions | undefined;
        for (let i = 0, iEnd = newColumnOptions.length; i < iEnd; ++i) {
            const newOptions = newColumnOptions[i];
            const indexInPrevOptions = prevColumnOptions?.findIndex(
                (prev): boolean => prev.id === newOptions.id
            );

            if (indexInPrevOptions !== void 0 && indexInPrevOptions !== -1) {
                prevOptions = prevColumnOptions?.[indexInPrevOptions];
            }

            const resultOptions = merge(prevOptions ?? {}, newOptions);
            if (Object.keys(resultOptions).length > 1) {
                columnOptions.push(resultOptions);
            }
        }

        this.userOptions.columns = columnOptions;
    }

    public update(
        options?: Options,
        render?: boolean,
        oneToOne?: boolean
    ): Promise<void>;

    public update(
        options: Options,
        render: false,
        oneToOne?: boolean
    ): void;

    /**
     * Updates the Grid with new options.
     *
     * @param options
     * The options of the Grid that should be updated. If not provided,
     * the update will be proceeded based on the `this.userOptions` property.
     * The `column` options are merged using the `id` property as a key.
     *
     * @param render
     * Whether to re-render the Grid after updating the options.
     *
     * @param oneToOne
     * When `false` (default), the existing column options will be merged with
     * the ones that are currently defined in the user options. When `true`,
     * the columns not defined in the new options will be removed.
     */
    public async update(
        options: Options = {},
        render = true,
        oneToOne = false
    ): Promise<void> {
        this.loadUserOptions(options, oneToOne);
        this.initAccessibility();

        let newDataTable = false;
        if (!this.dataTable || options.dataTable) {
            this.userOptions.dataTable = options.dataTable;
            (this.options ?? {}).dataTable = options.dataTable;

            this.loadDataTable(this.options?.dataTable);
            newDataTable = true;

            this.initVirtualization();
        }

        this.querying.loadOptions();

        // Update locale.
        const locale = options.lang?.locale;
        if (locale) {
            this.locale = locale;
            this.time.update(extend<TimeBase.TimeOptions>(
                options.time || {},
                { locale: this.locale }
            ));
        }

        if (render) {
            await this.querying.proceed(newDataTable);
            this.renderViewport();
        }
    }

    public updateColumn(
        columnId: string,
        options: Column.Options,
        render?: boolean,
        overwrite?: boolean
    ): Promise<void>;

    public updateColumn(
        columnId: string,
        options: Column.Options,
        render?: false,
        overwrite?: boolean
    ): void;

    /**
     * Updates the column of the Grid with new options.
     *
     * @param columnId
     * The ID of the column that should be updated.
     *
     * @param options
     * The options of the columns that should be updated. If null,
     * column options for this column ID will be removed.
     *
     * @param render
     * Whether to re-render the Grid after updating the columns.
     *
     * @param overwrite
     * If true, the column options will be updated by replacing the existing
     * options with the new ones instead of merging them.
     */
    public async updateColumn(
        columnId: string,
        options: Column.Options,
        render: boolean = true,
        overwrite = false
    ): Promise<void> {
        this.setColumnOptions([{
            id: columnId,
            ...options
        }], overwrite);

        await this.update(void 0, render);
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
     * Sets the sync state to the row with the provided index. It removes the
     * synced effect from the previously synced row.
     *
     * @param rowIndex
     * The index of the row.
     */
    public syncRow(rowIndex?: number): void {
        const rows = this.viewport?.rows;
        if (!rows) {
            return;
        }

        const firstRowIndex = this.viewport?.rows[0]?.index ?? 0;

        if (this.syncedRowIndex !== void 0) {
            rows[this.syncedRowIndex - firstRowIndex]?.setSyncedState(false);
        }

        if (rowIndex !== void 0) {
            rows[rowIndex - firstRowIndex]?.setSyncedState(true);
        }

        this.syncedRowIndex = rowIndex;
    }

    /**
     * Sets the sync state to the column with the provided ID. It removes the
     * synced effect from the previously synced column.
     *
     * @param columnId
     * The ID of the column.
     */
    public syncColumn(columnId?: string): void {
        const vp = this.viewport;

        if (!vp) {
            return;
        }

        if (this.syncedColumnId) {
            vp.getColumn(this.syncedColumnId)?.setSyncedState(false);
        }

        if (columnId) {
            vp.getColumn(columnId)?.setSyncedState(true);
        }

        this.syncedColumnId = columnId;
    }

    /**
     * Render caption above the grid.
     * @internal
     */
    public renderCaption(): void {
        const captionOptions = this.options?.caption;
        const captionText = captionOptions?.text;

        if (!captionText) {
            return;
        }

        // Create a caption element.
        this.captionElement = makeHTMLElement('div', {
            className: Globals.getClassName('captionElement'),
            id: this.id + '-caption'
        }, this.contentWrapper);

        // Render the caption element content.
        setHTMLContent(this.captionElement, captionText);

        if (captionOptions.className) {
            this.captionElement.classList.add(
                ...captionOptions.className.split(/\s+/g)
            );
        }
    }

    /**
     * Render description under the grid.
     *
     * @internal
     */
    public renderDescription(): void {
        const descriptionOptions = this.options?.description;
        const descriptionText = descriptionOptions?.text;

        if (!descriptionText) {
            return;
        }

        // Create a description element.
        this.descriptionElement = makeHTMLElement('div', {
            className: Globals.getClassName('descriptionElement'),
            id: this.id + '-description'
        }, this.contentWrapper);

        // Render the description element content.
        setHTMLContent(this.descriptionElement, descriptionText);

        if (descriptionOptions.className) {
            this.descriptionElement.classList.add(
                ...descriptionOptions.className.split(/\s+/g)
            );
        }
    }

    /**
     * Resets the content wrapper of the Grid. It clears the content and
     * resets the class names.
     * @internal
     */
    public resetContentWrapper(): void {
        if (!this.contentWrapper) {
            return;
        }

        this.contentWrapper.innerHTML = AST.emptyHTML;
        this.contentWrapper.className =
            Globals.getClassName('container') + ' ' +
            this.options?.rendering?.theme || '';
    }

    /**
     * Renders the viewport of the Grid. If the Grid is already
     * rendered, it will be destroyed and re-rendered with the new data.
     * @internal
     */
    public renderViewport(): void {
        const viewportMeta = this.viewport?.getStateMeta();

        this.enabledColumns = this.getEnabledColumnIDs();

        this.credits?.destroy();

        this.viewport?.destroy();
        delete this.viewport;

        this.resetContentWrapper();
        this.renderCaption();

        if (this.enabledColumns.length > 0) {
            this.viewport = this.renderTable();
            if (viewportMeta && this.viewport) {
                this.viewport.applyStateMeta(viewportMeta);
            }
        } else {
            this.renderNoData();
        }

        this.renderDescription();

        this.accessibility?.setA11yOptions();

        fireEvent(this, 'afterRenderViewport');

        this.viewport?.reflow();
    }

    /**
     * Renders the table (viewport) of the Grid.
     *
     * @returns
     * The newly rendered table (viewport) of the Grid.
     */
    private renderTable(): Table {
        this.tableElement = makeHTMLElement('table', {
            className: Globals.getClassName('tableElement')
        }, this.contentWrapper);

        return new Table(this, this.tableElement);
    }

    /**
     * Renders a message that there is no data to display.
     */
    private renderNoData(): void {
        makeHTMLElement('div', {
            className: Globals.getClassName('noData'),
            innerText: this.options?.lang?.noData
        }, this.contentWrapper);
    }

    /**
     * Returns the array of IDs of columns that should be displayed in the data
     * grid, in the correct order.
     */
    private getEnabledColumnIDs(): string[] {
        const { columnOptionsMap } = this;
        const header = this.options?.header;
        const headerColumns = this.getColumnIds(header || [], false);
        const columnsIncluded = this.options?.rendering?.columns?.included || (
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
            if (columnOptionsMap?.[columnName]?.options?.enabled !== false) {
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
     * @param columnsTree
     * Structure that we start calculation
     *
     * @param [onlyEnabledColumns=true]
     * Extract all columns from header or columns filtered by enabled param
     * @returns
     */
    public getColumnIds(
        columnsTree: Array<GroupedHeaderOptions|string>,
        onlyEnabledColumns: boolean = true
    ): string[] {
        let columnIds: string[] = [];
        const { enabledColumns } = this;

        for (const column of columnsTree) {
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
     * Destroys the Grid.
     */
    public destroy(): void {
        const dgIndex = Grid.grids.findIndex(
            (dg): boolean => dg === this
        );

        this.viewport?.destroy();

        if (this.container) {
            this.container.innerHTML = AST.emptyHTML;
            this.container.classList.remove(
                Globals.getClassName('container')
            );
        }

        // Clear all properties
        Object.keys(this).forEach((key): void => {
            delete this[key as keyof this];
        });

        Grid.grids.splice(dgIndex, 1);
    }

    /**
     * Grey out the Grid and show a loading indicator.
     *
     * @param message
     * The message to display in the loading indicator.
     */
    public showLoading(message?: string): void {
        if (this.loadingWrapper) {
            return;
        }

        // Create loading wrapper.
        this.loadingWrapper = makeHTMLElement(
            'div',
            {
                className: Globals.getClassName('loadingWrapper')
            },
            this.contentWrapper
        );

        // Create spinner element.
        makeHTMLElement(
            'div',
            {
                className: Globals.getClassName('loadingSpinner')
            },
            this.loadingWrapper
        );


        // Create loading message span element.
        const loadingSpan = makeHTMLElement(
            'span',
            {
                className: Globals.getClassName('loadingMessage')
            },
            this.loadingWrapper
        );

        setHTMLContent(
            loadingSpan,
            pick(message, this.options?.lang?.loading, '')
        );
    }

    /**
     * Removes the loading indicator.
     */
    public hideLoading(): void {
        this.loadingWrapper?.remove();
        delete this.loadingWrapper;
    }

    /**
     * Returns the current grid data as a JSON string.
     *
     * @return
     * JSON representation of the data
     */
    public getData(): string {
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

    /**
     * Returns the current grid data as a JSON string.
     *
     * @return
     * JSON representation of the data
     *
     * @deprecated
     */
    public getJSON(): string {
        return this.getData();
    }

    /**
     * Returns the current Grid options.
     *
     * @param onlyUserOptions
     * Whether to return only the user options or all options (user options
     * merged with the default ones). Default is `true`.
     *
     * @returns
     * Grid options.
     */
    public getOptions(onlyUserOptions = true): Globals.DeepPartial<Options> {
        const options =
            onlyUserOptions ? merge(this.userOptions) : merge(this.options);

        if (options.dataTable?.id) {
            options.dataTable = {
                columns: options.dataTable.columns
            };
        }

        return options;
    }

    /**
     * Returns the current Grid options.
     *
     * @param onlyUserOptions
     * Whether to return only the user options or all options (user options
     * merged with the default ones). Default is `true`.
     *
     * @returns
     * Options as a JSON string
     *
     * @deprecated
     */
    public getOptionsJSON(onlyUserOptions = true): string {
        return JSON.stringify(this.getOptions(onlyUserOptions));
    }

    /**
     * Enables virtualization if the row count is greater than or equal to the
     * threshold or virtualization is enabled externally. Should be fired after
     * the data table is loaded.
     */
    private initVirtualization(): void {
        const rows = this.userOptions.rendering?.rows;
        const virtualization = rows?.virtualization;
        const threshold = Number(
            rows?.virtualizationThreshold ||
            Defaults.defaultOptions.rendering?.rows?.virtualizationThreshold
        );
        const rowCount = Number(this.dataTable?.rowCount);

        // Makes sure all nested options are defined.
        ((this.options ??= {}).rendering ??= {}).rows ??= {};
        this.options.rendering.rows.virtualization =
            defined(virtualization) ? virtualization : rowCount >= threshold;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */
namespace Grid {
    /**
     * @internal
     * Callback that is called after the Grid is loaded.
     */
    export type AfterLoadCallback = (grid: Grid) => void;

    /**
     * @internal
     * An item in the column options map.
     */
    export interface ColumnOptionsMapItem {
        index: number;
        options: Column.Options
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Grid;
