/* *
 *
 *  Grid Row Pinning controller
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Author:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type { RowObject as DataTableRowObject } from '../../../Data/DataTable';
import type { RowId as DataProviderRowId } from '../Data/DataProvider';

/* *
 *
 *  Declarations
 *
 * */

export type RowId = DataProviderRowId;
export type RowPinningPosition = 'top'|'bottom';

/* *
 *
 *  Class
 *
 * */

class RowPinningController {

    public readonly grid: Grid;

    private topRowIds: RowId[] = [];

    private bottomRowIds: RowId[] = [];

    private resolvedTopRowIds: RowId[] = [];

    private resolvedBottomRowIds: RowId[] = [];

    private explicitUnpinned: Set<RowId> = new Set();

    private optionsDirty = true;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    private getPinningOptions(): {
        enabled?: boolean;
        idColumn?: string;
        topIds?: RowId[];
        bottomIds?: RowId[];
        resolve?: (row: DataTableRowObject) => ('top'|'bottom'|null|undefined);
    }|undefined {
        return (
            this.grid.userOptions?.rendering?.rows?.pinning ||
            this.grid.options?.rendering?.rows?.pinning
        );
    }

    public loadOptions(): void {
        if (!this.optionsDirty) {
            return;
        }

        this.optionsDirty = false;
        const pinningOptions = this.getPinningOptions();
        const top = pinningOptions?.topIds || [];
        const bottom = pinningOptions?.bottomIds || [];

        if (!this.isOptionEnabled()) {
            this.topRowIds.length = 0;
            this.bottomRowIds.length = 0;
            this.resolvedTopRowIds.length = 0;
            this.resolvedBottomRowIds.length = 0;
            this.explicitUnpinned.clear();
            return;
        }

        this.topRowIds = RowPinningController.uniqueRowIds(top);
        this.bottomRowIds = RowPinningController.uniqueRowIds(bottom).filter((
            rowId
        ): boolean => !this.topRowIds.includes(rowId));
        this.resolvedTopRowIds.length = 0;
        this.resolvedBottomRowIds.length = 0;
    }

    public markOptionsDirty(): void {
        this.optionsDirty = true;
    }

    public isEnabled(): boolean {
        this.loadOptions();

        if (!this.isOptionEnabled()) {
            return false;
        }

        const pinningOptions = this.getPinningOptions();
        return !!(
            this.topRowIds.length ||
            this.bottomRowIds.length ||
            this.resolvedTopRowIds.length ||
            this.resolvedBottomRowIds.length ||
            pinningOptions?.resolve
        );
    }

    public isOptionEnabled(): boolean {
        return this.getPinningOptions()?.enabled !== false;
    }

    public pinRow(
        rowId: RowId,
        position: RowPinningPosition = 'top',
        index?: number
    ): void {
        this.loadOptions();
        if (!this.isOptionEnabled()) {
            return;
        }

        this.explicitUnpinned.delete(rowId);

        const source = (
            position === 'top' ?
                this.topRowIds :
                this.bottomRowIds
        );
        const other = (
            position === 'top' ?
                this.bottomRowIds :
                this.topRowIds
        );

        const existingIndex = source.indexOf(rowId);
        if (existingIndex !== -1) {
            source.splice(existingIndex, 1);
        }

        const otherIndex = other.indexOf(rowId);
        if (otherIndex !== -1) {
            other.splice(otherIndex, 1);
        }

        if (typeof index === 'number' && index >= 0) {
            source.splice(Math.min(index, source.length), 0, rowId);
        } else {
            source.push(rowId);
        }
    }

    public unpinRow(rowId: RowId): void {
        this.loadOptions();
        if (!this.isOptionEnabled()) {
            return;
        }

        const topIndex = this.topRowIds.indexOf(rowId);
        if (topIndex !== -1) {
            this.topRowIds.splice(topIndex, 1);
        }

        const bottomIndex = this.bottomRowIds.indexOf(rowId);
        if (bottomIndex !== -1) {
            this.bottomRowIds.splice(bottomIndex, 1);
        }

        this.explicitUnpinned.add(rowId);
    }

    public setResolvedIds(topIds: RowId[], bottomIds: RowId[]): void {
        this.resolvedTopRowIds = RowPinningController.uniqueRowIds(topIds);
        this.resolvedBottomRowIds = RowPinningController.uniqueRowIds(
            bottomIds
        ).filter((rowId): boolean => !this.resolvedTopRowIds.includes(rowId));
    }

    public pruneMissingExplicitIds(rowIds: RowId[]): void {
        if (!rowIds.length) {
            return;
        }

        const missing = new Set(rowIds);
        this.topRowIds = this.topRowIds.filter((rowId): boolean =>
            !missing.has(rowId)
        );
        this.bottomRowIds = this.bottomRowIds.filter((rowId): boolean =>
            !missing.has(rowId)
        );
    }

    public getPinnedRows(): { topIds: RowId[]; bottomIds: RowId[] } {
        this.loadOptions();

        if (!this.isOptionEnabled()) {
            return {
                topIds: [],
                bottomIds: []
            };
        }

        const topIds = RowPinningController.uniqueRowIds([
            ...this.topRowIds,
            ...this.resolvedTopRowIds
        ]).filter((rowId): boolean => !this.explicitUnpinned.has(rowId));

        const topSet = new Set(topIds);
        const bottomIds = RowPinningController.uniqueRowIds([
            ...this.bottomRowIds,
            ...this.resolvedBottomRowIds
        ]).filter((rowId): boolean =>
            !this.explicitUnpinned.has(rowId) && !topSet.has(rowId)
        );

        return {
            topIds,
            bottomIds
        };
    }

    /**
     * Recompute resolve()-based pinned IDs from the active provider view.
     */
    public async recomputeResolvedFromActiveView(): Promise<void> {
        if (!this.isOptionEnabled()) {
            return;
        }

        const resolve = this.getPinningOptions()?.resolve;
        const dataProvider = this.grid.dataProvider;
        if (!resolve || !dataProvider) {
            this.setResolvedIds([], []);
            return;
        }

        const explicitTop = this.topRowIds.slice();
        const explicitBottom = this.bottomRowIds.slice();
        const used = new Set<RowId>([...explicitTop, ...explicitBottom]);
        const topResolved: RowId[] = [];
        const bottomResolved: RowId[] = [];

        const rowCount = await dataProvider.getRowCount();

        for (let i = 0; i < rowCount; ++i) {
            const rowId = await dataProvider.getRowId(i);
            const row = await dataProvider.getRowObject(i);
            if (rowId === void 0 || !row) {
                continue;
            }

            if (used.has(rowId) || this.explicitUnpinned.has(rowId)) {
                continue;
            }

            let position: ('top'|'bottom'|null|undefined);
            try {
                position = resolve(row);
            } catch {
                continue;
            }

            if (position === 'top') {
                topResolved.push(rowId);
                used.add(rowId);
            } else if (position === 'bottom') {
                bottomResolved.push(rowId);
                used.add(rowId);
            }
        }

        this.setResolvedIds(topResolved, bottomResolved);
        const pinned = this.getPinnedRows();
        await dataProvider.primePinnedRows([
            ...pinned.topIds,
            ...pinned.bottomIds
        ]);
    }

    /**
     * Handle missing pinned row IDs after pinned-row render.
     *
     * @param result
     * Render result payload with missing pinned IDs.
     *
     * @param result.missingPinnedRowIds
     * Missing pinned row IDs from the latest render pass.
     *
     * @param source
     * Render source that triggered reconciliation.
     */
    public async handlePinnedRenderResult(
        result: { missingPinnedRowIds: RowId[] },
        source: 'query'|'runtime'
    ): Promise<void> {
        if (!result.missingPinnedRowIds.length) {
            return;
        }

        const isRemote = this.grid.options?.data?.providerType === 'remote';
        if (isRemote) {
            if (source === 'query') {
                await this.grid.dataProvider?.primePinnedRows(
                    result.missingPinnedRowIds
                );
            }
            return;
        }

        if (source === 'query') {
            this.pruneMissingExplicitIds(result.missingPinnedRowIds);
        }
    }

    private static uniqueRowIds(values: unknown[]): RowId[] {
        const result: RowId[] = [];
        const seen = new Set<RowId>();

        for (const value of values) {
            if (typeof value !== 'number' && typeof value !== 'string') {
                continue;
            }

            if (seen.has(value)) {
                continue;
            }

            seen.add(value);
            result.push(value);
        }

        return result;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default RowPinningController;
