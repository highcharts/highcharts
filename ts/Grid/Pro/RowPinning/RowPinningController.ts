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

    private optionsHash = '';

    constructor(grid: Grid) {
        this.grid = grid;
    }

    public loadOptions(): void {
        const rowsOptions = this.grid.options?.rendering?.rows;
        const pinnedOptions = rowsOptions?.pinned;
        const top = pinnedOptions?.top || [];
        const bottom = pinnedOptions?.bottom || [];
        const hash = JSON.stringify({
            top,
            bottom,
            rowIdColumn: rowsOptions?.rowIdColumn,
            sorting: pinnedOptions?.sorting || 'exclude',
            filtering: pinnedOptions?.filtering || 'exclude'
        });

        if (hash === this.optionsHash) {
            return;
        }

        this.optionsHash = hash;
        this.topRowIds = RowPinningController.uniqueRowIds(top);
        this.bottomRowIds = RowPinningController.uniqueRowIds(bottom).filter((
            rowId
        ): boolean => !this.topRowIds.includes(rowId));
    }

    public isEnabled(): boolean {
        this.loadOptions();

        const pinned = this.grid.options?.rendering?.rows?.pinned;
        return !!(
            this.topRowIds.length ||
            this.bottomRowIds.length ||
            pinned?.resolve
        );
    }

    public isSortingIncluded(): boolean {
        return (
            this.grid.options?.rendering?.rows?.pinned?.sorting === 'include'
        );
    }

    public isFilteringIncluded(): boolean {
        return (
            this.grid.options?.rendering?.rows?.pinned?.filtering === 'include'
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
    }

    public getPinnedRows(): { top: RowId[]; bottom: RowId[] } {
        return {
            top: this.topRowIds.slice(),
            bottom: this.bottomRowIds.slice()
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

        const resolve = this.grid.options?.rendering?.rows?.pinned?.resolve;
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

        return {
            topOriginalIndexes,
            bottomOriginalIndexes,
            topRowIds: topOriginalIndexes.map((idx): RowId|undefined => (
                this.getRowIdFromOriginalIndex(idx, originalTable)
            )).filter((rowId): rowId is RowId => rowId !== void 0),
            bottomRowIds: bottomOriginalIndexes.map((idx): RowId|undefined => (
                this.getRowIdFromOriginalIndex(idx, originalTable)
            )).filter((rowId): rowId is RowId => rowId !== void 0)
        };
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
        row: Record<string, unknown>,
        table: DataTable
    ): (RowId|undefined) {
        const rowIdColumn = this.grid.options?.rendering?.rows?.rowIdColumn;
        if (rowIdColumn && table.hasColumns([rowIdColumn])) {
            const rowId = row[rowIdColumn];
            if (typeof rowId === 'string' || typeof rowId === 'number') {
                return rowId;
            }
            return;
        }

        return originalIndex;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default RowPinningController;
