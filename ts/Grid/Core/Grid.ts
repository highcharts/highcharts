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
import type Popup from './UI/Popup.js';
import type { UpdateConfig, OptionChange, UpdatePlan } from './Update/UpdateScope';

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
import Pagination from './Pagination/Pagination.js';
import { UpdateScope } from './Update/UpdateScope.js';
import { CaptionUpdateConfig } from './Caption/CaptionUpdateConfig.js';
import { DescriptionUpdateConfig } from './Description/DescriptionUpdateConfig.js';
import { LangUpdateConfig } from './Lang/LangUpdateConfig.js';
import { RenderingUpdateConfig } from './Rendering/RenderingUpdateConfig.js';
import { TimeUpdateConfig } from './Time/TimeUpdateConfig.js';
import Credits from './Credits.js';

const { makeHTMLElement, setHTMLContent } = GridUtils;
const {
    extend,
    fireEvent,
    getStyle,
    merge,
    pick,
    isObject,
    diffObjects
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
     * @private
     */
    public static readonly grids: Array<(Grid|undefined)> = [];

    /**
     * The accessibility controller.
     */
    public accessibility?: Accessibility;

    /**
     * The Pagination controller.
     */
    public pagination?: Pagination;

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

    /**
     * The list of currently shown popups.
     */
    public popups: Set<Popup> = new Set();

    /**
     * Functions that unregister events attached to the grid's data table,
     * that need to be removed when the grid is destroyed.
     */
    private dataTableEventDestructors: Function[] = [];

    /**
     * Registry of update configurations from all modules.
     * @internal
     */
    private updateConfigRegistry = new Map<string, UpdateConfig>();

    /**
     * Module instances for update handlers.
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private moduleInstances = new Map<string, any>();


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
        afterLoadCallback?: (grid: Grid) => void
    ) {
        this.loadUserOptions(options);
        this.id = this.options?.id || U.uniqueKey();
        this.querying = new QueryingController(this);
        this.locale = this.options?.lang?.locale || (
            (this.container?.closest('[lang]') as HTMLElement|null)?.lang
        );
        this.time = new TimeBase(extend<TimeBase.TimeOptions>(
            this.options?.time,
            { locale: this.locale }
        ), this.options?.lang);

        fireEvent(this, 'beforeLoad');

        Grid.grids.push(this);
        this.registerUpdateConfigs();
        this.initContainers(renderTo);
        this.initAccessibility();
        this.initPagination();
        this.loadDataTable();
        this.querying.loadOptions();
        void this.querying.proceed().then((): void => {
            this.renderViewport();
            afterLoadCallback?.(this);
            fireEvent(this, 'afterLoad');
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    /*
     * Initializes the accessibility controller.
     */
    public initAccessibility(): void {
        this.accessibility?.destroy();
        delete this.accessibility;

        if (this.options?.accessibility?.enabled) {
            this.accessibility = new Accessibility(this);
        }
    }

    /*
     * Initializes the pagination.
     */
    public initPagination(): void {
        let state: Pagination.PaginationState | undefined;

        if (this.pagination) {
            const {
                currentPageSize,
                currentPage
            } = this.pagination || {};

            state = {
                currentPageSize,
                currentPage
            };
        }

        this.pagination?.destroy();
        delete this.pagination;

        const rawOptions = this.options?.pagination;
        const options = isObject(rawOptions) ? rawOptions : {
            enabled: rawOptions
        };

        if (options?.enabled) {
            this.pagination = new Pagination(this, options, state);
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
            this.userOptions.columns = this.options?.columns ?? [];
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
        const previousOptions = merge({}, this.options);

        this.loadUserOptions(options, oneToOne);

        if (!this.dataTable || options.dataTable) {
            this.userOptions.dataTable = options.dataTable;
            (this.options ?? {}).dataTable = options.dataTable;

            this.loadDataTable();
            this.querying.shouldBeUpdated = true;
        }

        if (!render) {
            return;
        }

        // Check structural options (columns, header, dataTable, columnDefaults)
        // These always require full viewport render
        let requiresViewportRender = false;
        const structuralOptions: Array<keyof Options> = [
            'columns',
            'header',
            'dataTable',
            'columnDefaults'
        ];

        for (const key of structuralOptions) {
            if (options[key] !== void 0 && options[key] !== null) {
                const newVal = this.options?.[key];
                const oldVal = previousOptions?.[key];

                // Check if values are objects before using diffObjects
                if (
                    isObject(newVal, true) &&
                    isObject(oldVal, true)
                ) {
                    const diff = diffObjects(newVal, oldVal);
                    if (Object.keys(diff).length > 0) {
                        requiresViewportRender = true;
                        break;
                    }
                } else if (newVal !== oldVal) {
                    // For non-objects, simple comparison
                    requiresViewportRender = true;
                    break;
                }
            }
        }

        // Collect all changes from module configs
        const allChanges = this.collectChangesFromConfigs(
            options,
            previousOptions
        );

        // Create update plan (sort + group by phases)
        const plan = this.createUpdatePlan(allChanges);

        // Override maxScope if structural changes detected
        if (requiresViewportRender) {
            plan.maxScope = UpdateScope.VIEWPORT_RENDER;
        }

        // Execute update plan
        await this.executeUpdatePlan(plan);
    }

    /**
     * Registers update configurations from all modules.
     * @internal
     */
    private registerUpdateConfigs(): void {
        // Register configs from modules
        this.updateConfigRegistry.set('pagination', Pagination.updateConfig);
        this.updateConfigRegistry.set(
            'accessibility',
            Accessibility.updateConfig
        );
        this.updateConfigRegistry.set('lang', LangUpdateConfig);
        this.updateConfigRegistry.set(
            'rendering',
            RenderingUpdateConfig
        );
        this.updateConfigRegistry.set('caption', CaptionUpdateConfig);
        this.updateConfigRegistry.set(
            'description',
            DescriptionUpdateConfig
        );
        this.updateConfigRegistry.set('time', TimeUpdateConfig);
        this.updateConfigRegistry.set('credits', Credits.updateConfig);

    }

    /**
     * Collects changes from all registered configs.
     * @param newOptions New options to compare
     * @param oldOptions Previous options to compare
     * @internal
     */
    private collectChangesFromConfigs(
        newOptions: Partial<Options>,
        oldOptions: Partial<Options>
    ): OptionChange[] {
        const changes: OptionChange[] = [];

        // Update module instances (may have been re-initialized)
        this.moduleInstances.set('pagination', this.pagination);
        this.moduleInstances.set('accessibility', this.accessibility);
        this.moduleInstances.set('credits', this.credits);

        for (const [moduleKey, moduleConfig] of this.updateConfigRegistry) {
            if (newOptions[moduleKey as keyof Options] === void 0) {
                continue;
            }

            const moduleInstance = this.moduleInstances.get(moduleKey);
            const moduleChanges = this.processModuleConfig(
                moduleKey,
                moduleConfig,
                moduleInstance,
                newOptions[moduleKey as keyof Options],
                oldOptions[moduleKey as keyof Options]
            );

            changes.push(...moduleChanges);
        }

        return changes;
    }

    /**
     * Processes a single module's config and returns changes.
     * @param moduleKey Module key (pagination, accessibility, etc.)
     * @param moduleConfig Module's update configuration
     * @param moduleInstance Module instance or undefined
     * @param newOptions New module options
     * @param oldOptions Previous module options
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private processModuleConfig(
        moduleKey: string,
        moduleConfig: UpdateConfig,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moduleInstance: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newOptions: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        oldOptions: any
    ): OptionChange[] {
        const changes: OptionChange[] = [];

        for (const configEntry of Object.values(moduleConfig)) {
            const { scope, options, handler, priority, dependencies } =
                configEntry;

            for (const optionPath of options) {
                const rawNewVal = this.getValueByPath(newOptions, optionPath);
                const rawOldVal = this.getValueByPath(oldOptions, optionPath);

                // Normalize boolean shorthand
                const newVal = this.normalizeOption(rawNewVal);
                const oldVal = this.normalizeOption(rawOldVal);

                // Deep comparison - skip if no changes
                if (newVal === oldVal) {
                    continue;
                }

                // For objects, check if there are any differences
                if (
                    typeof newVal === 'object' &&
                    typeof oldVal === 'object' &&
                    newVal !== null &&
                    oldVal !== null
                ) {
                    const diff = diffObjects(newVal, oldVal);
                    if (Object.keys(diff).length === 0) {
                        continue;
                    }
                }

                const gridContext = this;
                changes.push({
                    path: `${moduleKey}.${optionPath}`,
                    scope,
                    priority,
                    dependencies: dependencies?.map(
                        (d): string => `${moduleKey}.${d}`
                    ),
                    handler: handler ?
                        function (): void {
                            handler.call(
                                gridContext,
                                moduleInstance,
                                rawNewVal,
                                rawOldVal,
                                optionPath
                            );
                        } :
                        (): void => {}
                });
            }
        }

        return changes;
    }

    /**
     * Creates update plan with phases and sorting.
     * @param changes Collected option changes to process
     * @internal
     */
    private createUpdatePlan(changes: OptionChange[]): UpdatePlan {
        // Sort by dependencies and priority
        const sortedChanges = this.sortChangesByDependencies(changes);

        // Group by scope (phases)
        const phases = new Map<UpdateScope, OptionChange[]>();
        let maxScope = UpdateScope.NONE;

        for (const change of sortedChanges) {
            maxScope = Math.max(maxScope, change.scope);

            if (!phases.has(change.scope)) {
                phases.set(change.scope, []);
            }
            phases.get(change.scope)!.push(change);
        }

        const hasStructuralChanges = sortedChanges.some(
            (c): boolean => c.scope === UpdateScope.VIEWPORT_RENDER
        );

        return { phases, maxScope, hasStructuralChanges };
    }

    /**
     * Sorts changes by dependencies and priority.
     * @param changes Changes to sort by dependencies
     * @internal
     */
    private sortChangesByDependencies(
        changes: OptionChange[]
    ): OptionChange[] {
        const sorted: OptionChange[] = [];
        const processed = new Set<string>();
        const inProgress = new Set<string>();

        const visit = (change: OptionChange): void => {
            const path = change.path;

            // Cycle detection
            if (inProgress.has(path)) {
                // eslint-disable-next-line no-console
                console.warn(`Circular dependency detected: ${path}`);
                return;
            }

            if (processed.has(path)) {
                return;
            }

            inProgress.add(path);

            // Process dependencies first
            if (change.dependencies) {
                for (const depPath of change.dependencies) {
                    const depChange = changes.find(
                        (c): boolean => c.path === depPath
                    );
                    if (depChange) {
                        visit(depChange);
                    }
                }
            }

            inProgress.delete(path);
            processed.add(path);
            sorted.push(change);
        };

        // Pre-sort by scope and priority
        const preSorted = [...changes].sort((a, b): number => {
            if (a.scope !== b.scope) {
                return a.scope - b.scope;
            }
            return (a.priority || 0) - (b.priority || 0);
        });

        // Visit all changes
        for (const change of preSorted) {
            visit(change);
        }

        return sorted;
    }

    /**
     * Executes update plan in phases.
     * @param plan Update plan to execute
     * @internal
     */
    private async executeUpdatePlan(plan: UpdatePlan): Promise<void> {
        const { phases, maxScope, hasStructuralChanges } = plan;

        // Shortcut for structural changes
        if (hasStructuralChanges || maxScope === UpdateScope.VIEWPORT_RENDER) {
            this.executeAllHandlers(phases);
            this.initAccessibility();
            this.initPagination();
            this.querying.loadOptions();
            await this.querying.proceed();
            this.renderViewport();
            return;
        }

        // Execute phases in order
        const scopeOrder = [
            UpdateScope.NONE,
            UpdateScope.DOM_ATTR,
            UpdateScope.DOM_ELEMENT,
            UpdateScope.REFLOW,
            UpdateScope.ROWS_UPDATE
        ];

        for (const scope of scopeOrder) {
            const scopeChanges = phases.get(scope);
            if (scopeChanges) {
                for (const change of scopeChanges) {
                    change.handler();
                }
            }
        }

        // Execute global action based on max scope
        if (maxScope === UpdateScope.ROWS_UPDATE) {
            this.querying.loadOptions();
            await this.querying.proceed();
            await this.viewport?.updateRows();
        } else if (maxScope === UpdateScope.REFLOW) {
            this.viewport?.reflow();
        }
    }

    /**
     * Executes all handlers from all phases.
     * @param phases Grouped changes by UpdateScope
     * @internal
     */
    private executeAllHandlers(phases: Map<UpdateScope, OptionChange[]>): void {
        for (const [, changes] of phases) {
            for (const change of changes) {
                change.handler();
            }
        }
    }

    /**
     * Gets value by dot-notation path.
     * @param obj Object to traverse
     * @param path Dot-separated path
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getValueByPath(obj: any, path: string): any {
        return path.split('.').reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (current, key): any => current?.[key],
            obj
        );
    }

    /**
     * Normalizes boolean shorthand to object with 'enabled' property.
     * @param value Value to normalize
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private normalizeOption(value: any): any {
        if (value === null || value === void 0) {
            return value;
        }

        if (typeof value === 'boolean') {
            return { enabled: value };
        }

        return value;
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
        const pagination = this.pagination;
        const paginationPosition = pagination?.options.position;

        this.enabledColumns = this.getEnabledColumnIDs();

        this.credits?.destroy();

        this.viewport?.destroy();
        delete this.viewport;

        this.resetContentWrapper();

        fireEvent(this, 'beforeRenderViewport');

        this.renderCaption();

        // Render top pagination if enabled (before table)
        if (paginationPosition === 'top') {
            pagination?.render();
        }

        if (this.enabledColumns.length > 0) {
            this.viewport = this.renderTable();
            if (viewportMeta && this.viewport) {
                this.viewport.applyStateMeta(viewportMeta);
            }
        } else {
            this.renderNoData();
        }

        this.accessibility?.setA11yOptions();

        // Render bottom pagination, footer pagination,
        // or custom container pagination (after table).
        if (paginationPosition !== 'top') {
            pagination?.render();
        }

        this.renderDescription();

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

        this.tableElement.setAttribute('role', 'grid');

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
                headerColumns : this.dataTable?.getColumnIds()
        );

        if (!columnsIncluded?.length) {
            return [];
        }

        if (!columnOptionsMap) {
            return columnsIncluded;
        }

        let columnId: string;
        const result: string[] = [];
        for (let i = 0, iEnd = columnsIncluded.length; i < iEnd; ++i) {
            columnId = columnsIncluded[i];
            if (columnOptionsMap?.[columnId]?.options?.enabled !== false) {
                result.push(columnId);
            }
        }

        return result;
    }

    /**
     * Loads the data table of the Grid. If the data table is passed as a
     * reference, it should be used instead of creating a new one.
     */
    private loadDataTable(): void {
        // Unregister all events attached to the previous data table.
        this.dataTableEventDestructors.forEach((fn): void => fn());
        const tableOptions = this.options?.dataTable;

        // If the table is passed as a reference, it should be used instead of
        // creating a new one.
        if ((tableOptions as DataTable)?.clone) {
            this.dataTable = tableOptions as DataTable;
            this.presentationTable = this.dataTable.getModified();
            return;
        }

        const dt = this.dataTable = this.presentationTable =
            new DataTable(tableOptions as DataTableOptions);

        // If the data table is modified, mark the querying controller to be
        // updated on the next proceed.
        ([
            'afterDeleteColumns',
            'afterDeleteRows',
            'afterSetCell',
            'afterSetColumns',
            'afterSetRows'
        ] as const).forEach((eventName): void => {
            this.dataTableEventDestructors.push(dt.on(eventName, (): void => {
                this.querying.shouldBeUpdated = true;
            }));
        });
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

        this.dataTableEventDestructors.forEach((fn): void => fn());
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
     * Returns the grid data as a JSON string.
     *
     * @param modified
     * Whether to return the modified data table (after filtering/sorting/etc.)
     * or the unmodified, original one. Default value is set to `true`.
     *
     * @return
     * JSON representation of the data
     */
    public getData(modified: boolean = true): string {
        const dataTable = modified ? this.viewport?.dataTable : this.dataTable;
        const columns = dataTable?.columns;

        if (!this.enabledColumns || !columns) {
            return '{}';
        }

        for (const key of Object.keys(columns)) {
            if (this.enabledColumns.indexOf(key) === -1) {
                delete columns[key];
            }
        }

        return JSON.stringify(columns, null, 2);
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
    public getOptions(onlyUserOptions = true): Partial<Options> {
        const options =
            onlyUserOptions ? merge(this.userOptions) : merge(this.options);

        if (options.dataTable?.id) {
            options.dataTable = {
                columns: options.dataTable.columns
            };
        }

        return options;
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
