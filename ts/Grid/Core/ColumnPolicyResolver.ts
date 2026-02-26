/* *
 *
 *  Grid Column Policy Resolver class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { NoIdColumnOptions } from './Table/Column';


/* *
 *
 *  Declarations
 *
 * */

export interface ColumnOptionsMapItemLike {
    /**
     * Index of the column in `options.columns`.
     */
    index: number;

    /**
     * Column options for a single Grid column id.
     */
    options: NoIdColumnOptions;
}


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a column policy resolver.
 */
class ColumnPolicyResolver {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Individual column options map keyed by Grid column id.
     */
    public columnOptionsMap: Record<string, ColumnOptionsMapItemLike> = {};

    /**
     * Source column id map keyed by Grid column id.
     */
    private sourceColumnIdMap: Record<string, (string | undefined)> = {};

    /**
     * Column defaults merged into all capability checks.
     */
    private columnDefaults: NoIdColumnOptions = {};

    /**
     * Available source column ids from the active data provider.
     */
    private availableSourceColumnIds?: Set<string>;

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Sets the current column options map and rebuilds source id mappings.
     *
     * @param columnOptionsMap
     * Column options keyed by Grid column id.
     */
    public setColumnOptionsMap(
        columnOptionsMap: Record<string, ColumnOptionsMapItemLike>
    ): void {
        this.columnOptionsMap = columnOptionsMap;
        this.rebuildSourceColumnIdMap();
    }

    /**
     * Removes all column options from the resolver.
     */
    public clearColumnOptions(): void {
        this.columnOptionsMap = {};
        this.sourceColumnIdMap = {};
    }

    /**
     * Returns whether options for the given column id exist.
     *
     * @param columnId
     * Grid column id.
     */
    public hasColumnOptions(columnId: string): boolean {
        return !!this.columnOptionsMap[columnId];
    }

    /**
     * Returns column ids for all configured column options.
     */
    public getColumnIds(): string[] {
        return Object.keys(this.columnOptionsMap);
    }

    /**
     * Returns raw options for a Grid column.
     *
     * @param columnId
     * Grid column id.
     */
    public getIndividualColumnOptions(
        columnId: string
    ): NoIdColumnOptions | undefined {
        return this.columnOptionsMap[columnId]?.options;
    }

    /**
     * Returns the index of a Grid column in `options.columns`.
     *
     * @param columnId
     * Grid column id.
     */
    public getColumnOptionIndex(columnId: string): number | undefined {
        return this.columnOptionsMap[columnId]?.index;
    }

    /**
     * Adds or replaces a single column option entry.
     *
     * @param columnId
     * Grid column id.
     *
     * @param columnOption
     * Column map item to store.
     */
    public setColumnOption(
        columnId: string,
        columnOption: ColumnOptionsMapItemLike
    ): void {
        this.columnOptionsMap[columnId] = columnOption;
        this.sourceColumnIdMap[columnId] = this.resolveSourceColumnId(columnId);
    }

    /**
     * Removes a single column option entry.
     *
     * @param columnId
     * Grid column id.
     */
    public removeColumnOption(columnId: string): void {
        delete this.columnOptionsMap[columnId];
        delete this.sourceColumnIdMap[columnId];
    }

    /**
     * Sets column defaults used for capability checks.
     *
     * @param columnDefaults
     * Grid column defaults.
     */
    public setColumnDefaults(columnDefaults?: NoIdColumnOptions): void {
        this.columnDefaults = columnDefaults || {};
    }

    /**
     * Sets available source column ids from the current data provider.
     *
     * @param columnIds
     * List of source column ids. If omitted, the cache is cleared.
     */
    public setAvailableSourceColumnIds(columnIds?: string[]): void {
        this.availableSourceColumnIds = columnIds ?
            new Set(columnIds) :
            void 0;
    }

    /**
     * Returns cached source column ids from the data provider.
     */
    public getAvailableSourceColumnIds(): string[] | undefined {
        return this.availableSourceColumnIds ?
            Array.from(this.availableSourceColumnIds) :
            void 0;
    }

    /**
     * Resolves source column id for a Grid column id.
     *
     * @param columnId
     * Grid column id.
     */
    public getColumnSourceId(columnId: string): string | undefined {
        if (columnId in this.sourceColumnIdMap) {
            return this.sourceColumnIdMap[columnId];
        }

        return columnId;
    }

    /**
     * Returns whether the column is unbound to provider data.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnUnbound(columnId: string): boolean {
        const sourceColumnId = this.getColumnSourceId(columnId);
        if (!sourceColumnId) {
            return true;
        }

        if (!this.availableSourceColumnIds) {
            return false;
        }

        return !this.availableSourceColumnIds.has(sourceColumnId);
    }

    /**
     * Returns whether the column should be included in exports.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnExportable(columnId: string): boolean {
        const exportable =
            this.getIndividualColumnOptions(columnId)?.exportable ??
            this.columnDefaults.exportable;
        return !this.isColumnUnbound(columnId) &&
            exportable !== false;
    }

    /**
     * Returns whether sorting should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnSortingEnabled(columnId: string): boolean {
        const sortingOptions =
            this.getIndividualColumnOptions(columnId)?.sorting;
        const defaultSortingOptions = this.columnDefaults.sorting;
        const sortingEnabled = (
            sortingOptions?.enabled ??
            sortingOptions?.sortable ??
            defaultSortingOptions?.enabled ??
            defaultSortingOptions?.sortable
        );
        return !this.isColumnUnbound(columnId) &&
            !!sortingEnabled;
    }

    /**
     * Returns whether filtering should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnFilteringEnabled(columnId: string): boolean {
        const filteringEnabled = (
            this.getIndividualColumnOptions(columnId)?.filtering?.enabled ??
            this.columnDefaults.filtering?.enabled
        );
        return !this.isColumnUnbound(columnId) &&
            !!filteringEnabled;
    }

    /**
     * Returns whether inline filtering should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnInlineFilteringEnabled(columnId: string): boolean {
        const inlineFilteringEnabled = (
            this.getIndividualColumnOptions(columnId)?.filtering?.inline ??
            this.columnDefaults.filtering?.inline
        );
        return this.isColumnFilteringEnabled(columnId) &&
            !!inlineFilteringEnabled;
    }

    /**
     * Returns whether editing should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnEditable(columnId: string): boolean {
        const editable = (
            this.getIndividualColumnOptions(columnId)
                ?.cells?.editMode?.enabled ??
            this.columnDefaults.cells?.editMode?.enabled
        );
        return !this.isColumnUnbound(columnId) &&
            !!editable;
    }

    /**
     * Resolves ordered column ids that should be rendered.
     *
     * @param headerColumns
     * Column ids resolved from header.
     *
     * @param autogenerateColumns
     * Whether columns should be autogenerated from the provider.
     *
     * @param autoColumns
     * Available column ids from the data provider.
     *
     * @param configuredColumns
     * Column ids from `options.columns`.
     */
    public getColumnsForRender(
        headerColumns: string[],
        autogenerateColumns: boolean,
        autoColumns: string[],
        configuredColumns?: string[]
    ): string[] {
        const columnsIncluded = (
            headerColumns.length > 0 ?
                headerColumns :
                autogenerateColumns ?
                    autoColumns :
                    configuredColumns
        );

        if (!columnsIncluded?.length) {
            return [];
        }

        return this.filterEnabledColumns(columnsIncluded);
    }

    /**
     * Filters out duplicate and disabled columns while preserving order.
     *
     * @param columnIds
     * Candidate column ids.
     */
    public filterEnabledColumns(columnIds: string[]): string[] {
        const seen = new Set<string>();
        const result: string[] = [];

        for (const columnId of columnIds) {
            const columnEnabled = (
                this.columnOptionsMap?.[columnId]?.options as {
                    enabled?: boolean;
                } | undefined
            )?.enabled;

            if (
                seen.has(columnId) ||
                columnEnabled === false
            ) {
                continue;
            }

            seen.add(columnId);
            result.push(columnId);
        }

        return result;
    }

    /**
     * Rebuilds source column id cache from current column options.
     */
    private rebuildSourceColumnIdMap(): void {
        const sourceColumnIdMap: Record<string, (string | undefined)> = {};
        const columnIds = Object.keys(this.columnOptionsMap);

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            sourceColumnIdMap[columnId] = this.resolveSourceColumnId(columnId);
        }

        this.sourceColumnIdMap = sourceColumnIdMap;
    }

    /**
     * Resolves source column id based on map item options.
     *
     * @param columnId
     * Grid column id.
     *
     */
    private resolveSourceColumnId(columnId: string): string | undefined {
        const dataId = this.columnOptionsMap[columnId]?.options?.dataId;
        return dataId === null ?
            void 0 :
            (typeof dataId === 'string' ? dataId : columnId);
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPolicyResolver;
