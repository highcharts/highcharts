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

export interface ColumnDataBinding {
    /**
     * Resolved source column id in the data provider.
     */
    sourceColumnId?: string;

    /**
     * Whether the column should be treated as unbound.
     */
    isUnbound: boolean;
}

export interface ColumnOptionsMapItemLike {
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

    private columnOptionsMap: Record<string, ColumnOptionsMapItemLike> = {};

    private sourceColumnIdMap: Record<string, (string | undefined)> = {};

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
     * Resolves full data binding information for a Grid column.
     *
     * @param columnId
     * Grid column id.
     */
    public getColumnDataBinding(columnId: string): ColumnDataBinding {
        return {
            sourceColumnId: this.getColumnSourceId(columnId),
            isUnbound: this.isColumnUnbound(columnId)
        };
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
        return !this.isColumnUnbound(columnId) &&
            this.columnOptionsMap?.[columnId]?.options?.exportable !== false;
    }

    /**
     * Returns whether sorting should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnSortingEnabled(columnId: string): boolean {
        const sortingOptions =
            this.columnOptionsMap?.[columnId]?.options?.sorting;
        return !this.isColumnUnbound(columnId) &&
            !!(sortingOptions?.enabled ?? sortingOptions?.sortable);
    }

    /**
     * Returns whether filtering should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnFilteringEnabled(columnId: string): boolean {
        return !this.isColumnUnbound(columnId) &&
            !!this.columnOptionsMap?.[columnId]?.options?.filtering?.enabled;
    }

    /**
     * Returns whether inline filtering should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnInlineFilteringEnabled(columnId: string): boolean {
        return this.isColumnFilteringEnabled(columnId) &&
            !!this.columnOptionsMap?.[columnId]?.options?.filtering?.inline;
    }

    /**
     * Returns whether editing should be enabled for the column.
     *
     * @param columnId
     * Grid column id.
     */
    public isColumnEditable(columnId: string): boolean {
        return !this.isColumnUnbound(columnId) &&
            !!(
                this.columnOptionsMap?.[columnId]
                    ?.options?.cells?.editMode?.enabled
            );
    }

    /**
     * Rebuilds source column id cache from current column options.
     */
    private rebuildSourceColumnIdMap(): void {
        const sourceColumnIdMap: Record<string, (string | undefined)> = {};
        const columnIds = Object.keys(this.columnOptionsMap);

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            const dataId = this.columnOptionsMap[columnId]?.options?.dataId;
            sourceColumnIdMap[columnId] = dataId === null ?
                void 0 :
                (typeof dataId === 'string' ? dataId : columnId);
        }

        this.sourceColumnIdMap = sourceColumnIdMap;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPolicyResolver;
