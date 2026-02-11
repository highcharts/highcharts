/* *
 *
 *  Grid RowSticky controller
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';
import type { RowId } from '../Data/DataProvider';
import type { RowObject as DataTableRowObject } from '../../../Data/DataTable';


/* *
 *
 *  Class
 *
 * */

class RowStickyController {

    /* *
     *
     *  Properties
     *
     * */

    public grid: Grid;

    private stickyRowIds: RowId[] = [];

    private effectiveStickyRowIds: RowId[] = [];

    private hasEffectiveStickyState = false;

    private explicitUnstuck: Set<RowId> = new Set();

    private warnedResolveError = false;

    private optionsHash = '';


    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid) {
        this.grid = grid;
        this.loadOptions();
    }


    /* *
     *
     *  Methods
     *
     * */

    public isEnabled(): boolean {
        this.loadOptions();

        const stickyOptions = this.grid.options?.rendering?.rows?.sticky;
        return !!(
            stickyOptions?.resolve ||
            this.stickyRowIds.length > 0 ||
            stickyOptions?.ids?.length
        );
    }

    public resetEffectiveState(): void {
        this.effectiveStickyRowIds.length = 0;
        this.hasEffectiveStickyState = false;
    }

    public loadOptions(): void {
        const stickyOptions = this.grid.options?.rendering?.rows?.sticky;
        const hash = JSON.stringify({
            ids: stickyOptions?.ids || [],
            idColumn: stickyOptions?.idColumn || null,
            hasResolve: !!stickyOptions?.resolve
        });

        if (hash === this.optionsHash) {
            return;
        }

        this.optionsHash = hash;
        this.stickyRowIds = uniqueRowIds(stickyOptions?.ids || []);
        this.effectiveStickyRowIds.length = 0;
        this.hasEffectiveStickyState = false;
    }

    public stickRow(rowId: RowId, index?: number): void {
        this.loadOptions();

        this.explicitUnstuck.delete(rowId);

        const list = this.stickyRowIds;
        const currentIndex = list.indexOf(rowId);

        if (currentIndex !== -1) {
            list.splice(currentIndex, 1);
        }

        if (
            typeof index === 'number' &&
            index >= 0 &&
            index <= list.length
        ) {
            list.splice(index, 0, rowId);
        } else {
            list.push(rowId);
        }

        this.effectiveStickyRowIds.length = 0;
        this.hasEffectiveStickyState = false;
    }

    public unstickRow(rowId: RowId): void {
        this.loadOptions();

        const list = this.stickyRowIds;
        const index = list.indexOf(rowId);

        if (index !== -1) {
            list.splice(index, 1);
        }

        this.explicitUnstuck.add(rowId);
        this.effectiveStickyRowIds.length = 0;
        this.hasEffectiveStickyState = false;
    }

    public isStickyRow(rowId: RowId): boolean {
        return this.getStickyRows().indexOf(rowId) !== -1;
    }

    public toggleStickyRow(rowId: RowId, index?: number): StickyActionType {
        const action: StickyActionType = this.isStickyRow(rowId) ?
            'unstick' :
            'stick';

        if (action === 'unstick') {
            this.unstickRow(rowId);
        } else {
            this.stickRow(rowId, index);
        }

        return action;
    }

    public getStickyRows(): RowId[] {
        return this.hasEffectiveStickyState ?
            [...this.effectiveStickyRowIds] :
            [...this.stickyRowIds];
    }

    public async computeStickyState(): Promise<RowStickyMeta> {
        this.loadOptions();

        const dp = this.grid.dataProvider;
        const stickyOptions = this.grid.options?.rendering?.rows?.sticky;

        if (!dp || !stickyOptions) {
            this.effectiveStickyRowIds.length = 0;
            this.hasEffectiveStickyState = true;
            return createEmptyStickyMeta();
        }

        const rowCount = await dp.getRowCount();
        if (!rowCount) {
            this.effectiveStickyRowIds.length = 0;
            this.hasEffectiveStickyState = true;
            return createEmptyStickyMeta();
        }

        const idColumn = stickyOptions.idColumn;
        const configuredIds = uniqueRowIds(this.stickyRowIds);
        const configuredIdSet = new Set<RowId>(configuredIds);
        const resolvedIdSet = new Set<RowId>();

        const rowIdToIndex = new Map<RowId, number>();

        for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
            const rowObject = await dp.getRowObject(rowIndex);
            const rowId = await this.getRowIdForSticky(
                rowIndex,
                rowObject,
                idColumn
            );

            if (rowId === void 0) {
                continue;
            }

            if (!rowIdToIndex.has(rowId)) {
                rowIdToIndex.set(rowId, rowIndex);
            }

            if (
                stickyOptions.resolve &&
                !configuredIdSet.has(rowId) &&
                !this.explicitUnstuck.has(rowId)
            ) {
                try {
                    if (stickyOptions.resolve(rowObject || {}) === true) {
                        resolvedIdSet.add(rowId);
                    }
                } catch (error: unknown) {
                    if (!this.warnedResolveError) {
                        // eslint-disable-next-line no-console
                        console.warn(
                            'Grid: rendering.rows.sticky.resolve threw an ' +
                            'error and was ignored for one or more rows.',
                            error
                        );
                        this.warnedResolveError = true;
                    }
                }
            }
        }

        const finalIdSet = new Set<RowId>();
        for (const id of configuredIds) {
            finalIdSet.add(id);
        }
        for (const id of resolvedIdSet) {
            finalIdSet.add(id);
        }

        const stickyRowIndexes: number[] = [];

        for (const id of finalIdSet) {
            const index = rowIdToIndex.get(id);
            if (index !== void 0) {
                stickyRowIndexes.push(index);
            }
        }

        stickyRowIndexes.sort((a, b): number => a - b);

        const effectiveStickyRowIds: RowId[] = [];
        for (let i = 0, iEnd = stickyRowIndexes.length; i < iEnd; ++i) {
            const rowIndex = stickyRowIndexes[i];
            const rowId = await this.getRowIdForSticky(
                rowIndex,
                await dp.getRowObject(rowIndex),
                idColumn
            );
            if (rowId !== void 0) {
                effectiveStickyRowIds.push(rowId);
            }
        }

        this.effectiveStickyRowIds = effectiveStickyRowIds;
        this.hasEffectiveStickyState = true;

        return {
            stickyRowIds: effectiveStickyRowIds,
            stickyRowIndexes,
            stickyRowIndexSet: new Set(stickyRowIndexes)
        };
    }

    private async getRowIdForSticky(
        rowIndex: number,
        rowObject: DataTableRowObject | undefined,
        idColumn: string | undefined
    ): Promise<RowId | undefined> {
        if (idColumn && rowObject) {
            const value = rowObject[idColumn];
            if (typeof value === 'string' || typeof value === 'number') {
                return value;
            }
            return void 0;
        }

        return this.grid.dataProvider?.getRowId(rowIndex);
    }
}


/* *
 *
 *  Functions
 *
 * */

/**
 * Returns unique row IDs while preserving the first-seen order.
 *
 * @param ids
 * Row IDs to normalize.
 */
function uniqueRowIds(ids: RowId[]): RowId[] {
    const unique: RowId[] = [];
    const set = new Set<RowId>();

    for (let i = 0, iEnd = ids.length; i < iEnd; ++i) {
        const id = ids[i];
        if (!set.has(id)) {
            set.add(id);
            unique.push(id);
        }
    }

    return unique;
}

/**
 * Creates an empty sticky metadata object.
 */
function createEmptyStickyMeta(): RowStickyMeta {
    return {
        stickyRowIds: [],
        stickyRowIndexes: [],
        stickyRowIndexSet: new Set()
    };
}


/* *
 *
 *  Interface
 *
 * */

export interface RowStickyMeta {
    stickyRowIds: RowId[];
    stickyRowIndexes: number[];
    stickyRowIndexSet: Set<number>;
}

export type StickyActionType = 'stick' | 'unstick';


/* *
 *
 *  Default Export
 *
 * */

export default RowStickyController;
