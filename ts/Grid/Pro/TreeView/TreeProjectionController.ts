/* *
 *
 *  Grid Tree Projection Controller
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

import type DataTable from '../../../Data/DataTable';
import type Grid from '../../Core/Grid';
import type { RowId } from '../../Core/Data/DataProvider';
import type { LocalDataProviderOptions } from '../../Core/Data/LocalDataProvider';
import type {
    TreeIndexBuildResult,
    TreeInputParentIdOptions
} from './TreeViewTypes';

import { buildIndexFromColumns } from './InputAdapters/ParentIdTreeInputAdapter.js';
import { isNumber, isString } from '../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

type DataOptionsWithTreeView = LocalDataProviderOptions;

interface NormalizedTreeViewOptions {
    enabled: true;
    input: TreeInputParentIdOptions;
    treeColumnId?: string;
    initiallyExpanded: boolean;
    expandedRowIds: RowId[];
}


/* *
 *
 *  Class
 *
 * */

/**
 * Infrastructure controller for TreeView projection state.
 *
 * This step initializes and validates tree input options and builds a canonical
 * relation index for `parentId` input. It does not alter Grid rendering or
 * provider query methods yet.
 */
class TreeProjectionController {

    /* *
     *
     *  Properties
     *
     * */

    private readonly grid: Grid;

    private normalizedOptions?: NormalizedTreeViewOptions;

    private indexCache?: TreeIndexBuildResult;

    private cacheSource?: {
        table: DataTable;
        idColumn: string;
        parentIdColumn: string;
    };


    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid) {
        this.grid = grid;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Synchronizes internal state from current Grid options and provider.
     */
    public sync(): void {
        const normalizedOptions = this.normalizeOptions();
        this.normalizedOptions = normalizedOptions;

        if (!normalizedOptions) {
            this.clearCache();
            return;
        }

        const dataProvider = this.grid.dataProvider;
        if (!TreeProjectionController.hasGetDataTable(dataProvider)) {
            // Remote provider runtime support is intentionally deferred.
            this.clearCache();
            return;
        }

        const table = dataProvider.getDataTable(false);
        if (!table) {
            this.clearCache();
            return;
        }

        const dataOptions = this.getDataOptions();
        const idColumn = dataOptions?.idColumn;
        if (!idColumn) {
            throw new Error(
                'TreeView: `data.idColumn` is required for `parentId` input.'
            );
        }

        const parentIdColumn = normalizedOptions.input.parentIdColumn;

        if (
            this.cacheSource?.table === table &&
            this.cacheSource.idColumn === idColumn &&
            this.cacheSource.parentIdColumn === parentIdColumn
        ) {
            return;
        }

        this.indexCache = buildIndexFromColumns(
            table.columns,
            idColumn,
            parentIdColumn
        );
        this.cacheSource = {
            table,
            idColumn,
            parentIdColumn
        };
    }

    /**
     * Returns normalized TreeView options.
     */
    public getOptions(): NormalizedTreeViewOptions | undefined {
        return this.normalizedOptions;
    }

    /**
     * Returns canonical tree index cache.
     */
    public getIndexCache(): TreeIndexBuildResult | undefined {
        return this.indexCache;
    }

    /**
     * Destroys controller state.
     */
    public destroy(): void {
        this.normalizedOptions = void 0;
        this.clearCache();
    }

    private clearCache(): void {
        this.indexCache = void 0;
        this.cacheSource = void 0;
    }

    private getDataOptions(): DataOptionsWithTreeView | undefined {
        return this.grid.options?.data as DataOptionsWithTreeView | undefined;
    }

    private normalizeOptions(): NormalizedTreeViewOptions | undefined {
        const dataOptions = this.getDataOptions();
        const treeView = dataOptions?.treeView;

        if (!treeView || treeView.enabled === false) {
            return;
        }

        if (!treeView.input || treeView.input.type !== 'parentId') {
            throw new Error(
                'TreeView: `data.treeView.input.type` must be "parentId".'
            );
        }

        if (!treeView.input.parentIdColumn) {
            throw new Error(
                'TreeView: `data.treeView.input.parentIdColumn` is required.'
            );
        }

        return {
            enabled: true,
            input: {
                type: 'parentId',
                parentIdColumn: treeView.input.parentIdColumn
            },
            treeColumnId: treeView.treeColumnId,
            initiallyExpanded: treeView.initiallyExpanded ?? false,
            expandedRowIds: this.normalizeExpandedRowIds(
                treeView.expandedRowIds
            )
        };
    }

    private normalizeExpandedRowIds(expandedRowIds?: RowId[]): RowId[] {
        if (!expandedRowIds) {
            return [];
        }

        const normalized: RowId[] = [];
        for (let i = 0, iEnd = expandedRowIds.length; i < iEnd; ++i) {
            const rowId = expandedRowIds[i];
            if (!isString(rowId) && !isNumber(rowId)) {
                throw new Error(
                    'TreeView: `data.treeView.expandedRowIds` must contain ' +
                    'only string or number values.'
                );
            }
            normalized.push(rowId);
        }

        return normalized;
    }

    private static hasGetDataTable(
        provider: unknown
    ): provider is {
        getDataTable: (presentation?: boolean) => DataTable | undefined;
    } {
        return !!(
            provider &&
            typeof (
                provider as {
                    getDataTable?: unknown;
                }
            ).getDataTable === 'function'
        );
    }
}
/* *
 *
 *  Default export
 *
 * */

export default TreeProjectionController;
