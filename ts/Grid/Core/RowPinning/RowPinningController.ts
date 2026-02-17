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
import type DataTable from '../../../Data/DataTable';
import type { RowObject as DataTableRowObject } from '../../../Data/DataTable';
import type {
    DataProvider,
    ProviderPinningViewState
} from '../../Core/Data/DataProvider';

/* *
 *
 *  Declarations
 *
 * */

export type RowId = (string|number);
export type RowPinningPosition = 'top'|'bottom';

export interface RowPinningResult {
    topOriginalIndexes: number[];
    bottomOriginalIndexes: number[];
    topRowIds: RowId[];
    bottomRowIds: RowId[];
}

export interface ComputePinnedStateContext {
    groupedOriginalIndexes: number[];
    sortingOriginalIndexes?: number[];
    sortingActive: boolean;
    filteringActive: boolean;
}

export interface ComputePinnedStateForProviderContext {
    sortingActive: boolean;
    filteringActive: boolean;
    paginationEnabled: boolean;
    currentPage: number;
    currentPageSize: number;
}

export interface ProviderPinningResult {
    topRowIds: RowId[];
    bottomRowIds: RowId[];
    scrollableRowIds: RowId[];
    activeRowIds: RowId[];
    topCount: number;
    bottomCount: number;
    scrollableCount: number;
}

/* *
 *
 *  Class
 *
 * */

class RowPinningController {

    public readonly grid: Grid;

    private topRowIds: RowId[] = [];

    private bottomRowIds: RowId[] = [];

    private explicitUnpinned: Set<RowId> = new Set();

    private warnedDuplicateRowIds: Set<RowId> = new Set();

    private warnedExpensiveResolve = false;

    private optionsHash = '';

    private effectiveTopRowIds: RowId[] = [];

    private effectiveBottomRowIds: RowId[] = [];

    private hasEffectivePinnedState = false;

    private stickyTopRowIds: RowId[] = [];

    constructor(grid: Grid) {
        this.grid = grid;
    }

    private getPinningOptions(): {
        idColumn?: string;
        topIds?: RowId[];
        bottomIds?: RowId[];
        resolve?: (row: DataTableRowObject) => ('top'|'bottom'|null|undefined);
        sorting?: 'exclude'|'include';
        filtering?: 'exclude'|'include';
    }|undefined {
        return this.grid.options?.rendering?.rows?.pinning;
    }

    public loadOptions(): void {
        const pinningOptions = this.getPinningOptions();
        const top = pinningOptions?.topIds || [];
        const bottom = pinningOptions?.bottomIds || [];
        const hash = JSON.stringify({
            top,
            bottom,
            idColumn: pinningOptions?.idColumn,
            sorting: pinningOptions?.sorting || 'exclude',
            filtering: pinningOptions?.filtering || 'exclude'
        });

        if (hash === this.optionsHash) {
            return;
        }

        this.optionsHash = hash;
        this.topRowIds = RowPinningController.uniqueRowIds(top);
        this.bottomRowIds = RowPinningController.uniqueRowIds(bottom).filter((
            rowId
        ): boolean => !this.topRowIds.includes(rowId));
        this.effectiveTopRowIds.length = 0;
        this.effectiveBottomRowIds.length = 0;
        this.hasEffectivePinnedState = false;
    }

    public isEnabled(): boolean {
        this.loadOptions();

        const pinningOptions = this.getPinningOptions();
        return !!(
            this.hasEffectivePinnedState ||
            this.hasStickyRows() ||
            this.topRowIds.length ||
            this.bottomRowIds.length ||
            pinningOptions?.resolve
        );
    }

    public setStickyTopRowIds(rowIds: RowId[]): void {
        this.stickyTopRowIds = rowIds;
    }

    public getStickyTopRowIds(): RowId[] {
        return this.stickyTopRowIds;
    }

    public hasStickyRows(): boolean {
        return this.stickyTopRowIds.length > 0;
    }

    public requiresTbodySplit(): boolean {
        return this.hasEffectivePinnedState || this.hasStickyRows();
    }

    public isSortingIncluded(): boolean {
        return (
            this.getPinningOptions()?.sorting === 'include'
        );
    }

    public isFilteringIncluded(): boolean {
        return (
            this.getPinningOptions()?.filtering === 'include'
        );
    }

    public pinRow(
        rowId: RowId,
        position: RowPinningPosition = 'top',
        index?: number
    ): void {
        this.loadOptions();

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

        this.effectiveTopRowIds.length = 0;
        this.effectiveBottomRowIds.length = 0;
        this.hasEffectivePinnedState = false;
    }

    public unpinRow(rowId: RowId): void {
        this.loadOptions();

        const topIndex = this.topRowIds.indexOf(rowId);
        if (topIndex !== -1) {
            this.topRowIds.splice(topIndex, 1);
        }

        const bottomIndex = this.bottomRowIds.indexOf(rowId);
        if (bottomIndex !== -1) {
            this.bottomRowIds.splice(bottomIndex, 1);
        }

        this.explicitUnpinned.add(rowId);
        this.effectiveTopRowIds.length = 0;
        this.effectiveBottomRowIds.length = 0;
        this.hasEffectivePinnedState = false;
    }

    public getPinnedRows(): { topIds: RowId[]; bottomIds: RowId[] } {
        if (this.hasEffectivePinnedState) {
            return {
                topIds: this.effectiveTopRowIds.slice(),
                bottomIds: this.effectiveBottomRowIds.slice()
            };
        }

        return {
            topIds: this.topRowIds.slice(),
            bottomIds: this.bottomRowIds.slice()
        };
    }

    public computePinnedState(
        originalTable: DataTable,
        context: ComputePinnedStateContext
    ): RowPinningResult {
        this.loadOptions();

        const rowIdMap = this.createFirstMatchRowIdMap(originalTable);
        const topRowIds: RowId[] = [];
        const bottomRowIds: RowId[] = [];
        const used = new Set<RowId>();

        for (const rowId of this.topRowIds) {
            if (used.has(rowId) || !rowIdMap.has(rowId)) {
                continue;
            }
            topRowIds.push(rowId);
            used.add(rowId);
        }

        for (const rowId of this.bottomRowIds) {
            if (used.has(rowId) || !rowIdMap.has(rowId)) {
                continue;
            }
            bottomRowIds.push(rowId);
            used.add(rowId);
        }

        const resolve = this.getPinningOptions()?.resolve;
        if (resolve) {
            for (
                let i = 0, iEnd = originalTable.getRowCount();
                i < iEnd;
                ++i
            ) {
                const row = originalTable.getRowObject(i);
                if (!row) {
                    continue;
                }

                const rowId = this.getRowIdFromOriginalRow(
                    i,
                    row,
                    originalTable
                );
                if (
                    rowId === void 0 ||
                    used.has(rowId) ||
                    this.explicitUnpinned.has(rowId)
                ) {
                    continue;
                }

                let position: ('top'|'bottom'|null|undefined);
                try {
                    position = resolve(row);
                } catch {
                    continue;
                }

                if (position === 'top') {
                    topRowIds.push(rowId);
                    used.add(rowId);
                } else if (position === 'bottom') {
                    bottomRowIds.push(rowId);
                    used.add(rowId);
                }
            }
        }

        let topOriginalIndexes = topRowIds.map((rowId): number => (
            rowIdMap.get(rowId) as number
        ));
        let bottomOriginalIndexes = bottomRowIds.map((rowId): number => (
            rowIdMap.get(rowId) as number
        ));

        if (context.filteringActive && this.isFilteringIncluded()) {
            const groupedSet = new Set(context.groupedOriginalIndexes);

            topOriginalIndexes = topOriginalIndexes.filter((idx): boolean =>
                groupedSet.has(idx)
            );
            bottomOriginalIndexes = bottomOriginalIndexes.filter((
                idx
            ): boolean => groupedSet.has(idx));
        }

        if (context.sortingActive && this.isSortingIncluded()) {
            const sourceOrder = (
                context.filteringActive && !this.isFilteringIncluded() ?
                    (
                        context.sortingOriginalIndexes ||
                        context.groupedOriginalIndexes
                    ) :
                    context.groupedOriginalIndexes
            );
            const sourcePosition = new Map<number, number>();
            for (let i = 0, iEnd = sourceOrder.length; i < iEnd; ++i) {
                sourcePosition.set(sourceOrder[i], i);
            }

            const sortBySourcePosition = (a: number, b: number): number => {
                const aPos = sourcePosition.get(a);
                const bPos = sourcePosition.get(b);

                if (aPos !== void 0 && bPos !== void 0) {
                    return aPos - bPos;
                }

                if (aPos !== void 0) {
                    return -1;
                }

                if (bPos !== void 0) {
                    return 1;
                }

                return a - b;
            };

            topOriginalIndexes.sort(sortBySourcePosition);
            bottomOriginalIndexes.sort(sortBySourcePosition);
        }

        const result = {
            topOriginalIndexes,
            bottomOriginalIndexes,
            topRowIds: topOriginalIndexes.map((idx): RowId|undefined => (
                this.getRowIdFromOriginalIndex(idx, originalTable)
            )).filter((rowId): rowId is RowId => rowId !== void 0),
            bottomRowIds: bottomOriginalIndexes.map((idx): RowId|undefined => (
                this.getRowIdFromOriginalIndex(idx, originalTable)
            )).filter((rowId): rowId is RowId => rowId !== void 0)
        };

        this.effectiveTopRowIds = result.topRowIds.slice();
        this.effectiveBottomRowIds = result.bottomRowIds.slice();
        this.hasEffectivePinnedState = true;

        return result;
    }

    public async computePinnedStateForProvider(
        dataProvider: DataProvider,
        context: ComputePinnedStateForProviderContext
    ): Promise<ProviderPinningResult> {
        this.loadOptions();

        const rawRowCount = await dataProvider.getScopedRowCount('raw');
        const rawRowIds: RowId[] = [];
        const rawRowsById = new Map<RowId, DataTableRowObject>();

        if (
            rawRowCount > 1000 &&
            this.getPinningOptions()?.resolve
        ) {
            this.warnResolveScan();
        }

        for (let i = 0; i < rawRowCount; ++i) {
            const rowId = await dataProvider.getScopedRowId(i, 'raw');
            if (rowId === void 0) {
                continue;
            }
            rawRowIds.push(rowId as RowId);
            const row = await dataProvider.getScopedRowObject(i, 'raw');
            if (row) {
                rawRowsById.set(rowId as RowId, row);
            }
        }

        const rawRowIdSet = new Set<RowId>(rawRowIds);
        const topRowIds: RowId[] = [];
        const bottomRowIds: RowId[] = [];
        const used = new Set<RowId>();

        for (const rowId of this.topRowIds) {
            if (used.has(rowId) || !rawRowIdSet.has(rowId)) {
                continue;
            }
            topRowIds.push(rowId);
            used.add(rowId);
        }

        for (const rowId of this.bottomRowIds) {
            if (used.has(rowId) || !rawRowIdSet.has(rowId)) {
                continue;
            }
            bottomRowIds.push(rowId);
            used.add(rowId);
        }

        const resolve = this.getPinningOptions()?.resolve;
        if (resolve) {
            for (const rowId of rawRowIds) {
                if (used.has(rowId) || this.explicitUnpinned.has(rowId)) {
                    continue;
                }
                const row = rawRowsById.get(rowId);
                if (!row) {
                    continue;
                }
                let position: ('top'|'bottom'|null|undefined);
                try {
                    position = resolve(row);
                } catch {
                    continue;
                }
                if (position === 'top') {
                    topRowIds.push(rowId);
                    used.add(rowId);
                } else if (position === 'bottom') {
                    bottomRowIds.push(rowId);
                    used.add(rowId);
                }
            }
        }

        const groupedRowCount = await dataProvider.getScopedRowCount('grouped');
        const groupedRowIds: RowId[] = [];
        for (let i = 0; i < groupedRowCount; ++i) {
            const rowId = await dataProvider.getScopedRowId(i, 'grouped');
            if (rowId !== void 0) {
                groupedRowIds.push(rowId as RowId);
            }
        }

        let sortingOnlyRowIds: RowId[] = groupedRowIds;
        if (
            context.sortingActive &&
            context.filteringActive &&
            this.isSortingIncluded() &&
            !this.isFilteringIncluded()
        ) {
            const sortingOnlyCount = await dataProvider.getScopedRowCount(
                'sortingOnly'
            );
            sortingOnlyRowIds = [];
            for (let i = 0; i < sortingOnlyCount; ++i) {
                const rowId = await dataProvider.getScopedRowId(
                    i,
                    'sortingOnly'
                );
                if (rowId !== void 0) {
                    sortingOnlyRowIds.push(rowId as RowId);
                }
            }
        }

        let effectiveTop = topRowIds.slice();
        let effectiveBottom = bottomRowIds.slice();
        if (context.filteringActive && this.isFilteringIncluded()) {
            const groupedSet = new Set(groupedRowIds);
            effectiveTop = effectiveTop.filter((rowId): boolean =>
                groupedSet.has(rowId)
            );
            effectiveBottom = effectiveBottom.filter((rowId): boolean =>
                groupedSet.has(rowId)
            );
        }

        if (context.sortingActive && this.isSortingIncluded()) {
            const sourceOrder = (
                context.filteringActive && !this.isFilteringIncluded() ?
                    sortingOnlyRowIds :
                    groupedRowIds
            );
            const sourcePosition = createRowIdPositionMap(sourceOrder);
            const sortBySourcePosition = (a: RowId, b: RowId): number => {
                const aPos = sourcePosition.get(a);
                const bPos = sourcePosition.get(b);
                if (aPos !== void 0 && bPos !== void 0) {
                    return aPos - bPos;
                }
                if (aPos !== void 0) {
                    return -1;
                }
                if (bPos !== void 0) {
                    return 1;
                }
                return String(a).localeCompare(String(b));
            };
            effectiveTop.sort(sortBySourcePosition);
            effectiveBottom.sort(sortBySourcePosition);
        }

        const pinnedSet = new Set<RowId>([
            ...effectiveTop,
            ...effectiveBottom
        ]);
        const nonPinned = groupedRowIds.filter((rowId): boolean =>
            !pinnedSet.has(rowId)
        );

        let scrollableRowIds = nonPinned;
        if (context.paginationEnabled) {
            const start = Math.max(
                0,
                (context.currentPage - 1) * context.currentPageSize
            );
            scrollableRowIds = nonPinned.slice(
                start,
                start + context.currentPageSize
            );
        }

        this.effectiveTopRowIds = effectiveTop.slice();
        this.effectiveBottomRowIds = effectiveBottom.slice();
        this.hasEffectivePinnedState = true;

        return {
            topRowIds: effectiveTop,
            bottomRowIds: effectiveBottom,
            scrollableRowIds,
            activeRowIds: [
                ...effectiveTop,
                ...scrollableRowIds,
                ...effectiveBottom
            ],
            topCount: effectiveTop.length,
            bottomCount: effectiveBottom.length,
            scrollableCount: scrollableRowIds.length
        };
    }

    public createProviderPinningViewState(
        result: ProviderPinningResult
    ): ProviderPinningViewState {
        return {
            topRowIds: result.topRowIds.slice(),
            bottomRowIds: result.bottomRowIds.slice(),
            scrollableRowIds: result.scrollableRowIds.slice(),
            activeRowIds: result.activeRowIds.slice(),
            topCount: result.topCount,
            bottomCount: result.bottomCount,
            scrollableCount: result.scrollableCount
        };
    }

    private warnResolveScan(): void {
        if (this.warnedExpensiveResolve) {
            return;
        }

        this.warnedExpensiveResolve = true;
        // eslint-disable-next-line no-console
        console.warn(
            'Grid row pinning: resolve(row) scans raw provider rows. ' +
            'This may be expensive for large remote datasets.'
        );
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

    private createFirstMatchRowIdMap(table: DataTable): Map<RowId, number> {
        const map = new Map<RowId, number>();

        for (let i = 0, iEnd = table.getRowCount(); i < iEnd; ++i) {
            const row = table.getRowObject(i);
            if (!row) {
                continue;
            }

            const rowId = this.getRowIdFromOriginalRow(i, row, table);
            if (rowId === void 0) {
                continue;
            }

            if (map.has(rowId)) {
                if (!this.warnedDuplicateRowIds.has(rowId)) {
                    this.warnedDuplicateRowIds.add(rowId);
                    // eslint-disable-next-line no-console
                    console.warn(
                        `Grid row pinning: Duplicate rowId "${rowId}" ` +
                        'detected. Using first match.'
                    );
                }
                continue;
            }

            map.set(rowId, i);
        }

        return map;
    }

    private getRowIdFromOriginalIndex(
        originalIndex: number,
        table: DataTable
    ): (RowId|undefined) {
        const row = table.getRowObject(originalIndex);
        if (!row) {
            return;
        }

        return this.getRowIdFromOriginalRow(originalIndex, row, table);
    }

    private getRowIdFromOriginalRow(
        originalIndex: number,
        row: DataTableRowObject,
        table: DataTable
    ): (RowId|undefined) {
        const idColumn = this.getPinningOptions()?.idColumn;
        if (idColumn && table.hasColumns([idColumn])) {
            const rowId = row[idColumn];
            if (typeof rowId === 'string' || typeof rowId === 'number') {
                return rowId;
            }
            return;
        }

        return originalIndex;
    }
}

/**
 * Create fast lookup map for row positions.
 *
 * @param rowIds
 * Row IDs in source order.
 */
function createRowIdPositionMap(rowIds: RowId[]): Map<RowId, number> {
    const map = new Map<RowId, number>();
    for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
        map.set(rowIds[i], i);
    }
    return map;
}

/* *
 *
 *  Default Export
 *
 * */

export default RowPinningController;
