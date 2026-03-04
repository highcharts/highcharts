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

/* *
 *
 *  Declarations
 *
 * */

export type RowId = (string|number);
export type RowPinningPosition = 'top'|'bottom';

export interface RowResolveEntry {
    rowId: RowId;
    row: DataTableRowObject;
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

    private resolvedTopRowIds: RowId[] = [];

    private resolvedBottomRowIds: RowId[] = [];

    private explicitUnpinned: Set<RowId> = new Set();

    private optionsHash = '';

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
        const pinningOptions = this.getPinningOptions();
        const top = pinningOptions?.topIds || [];
        const bottom = pinningOptions?.bottomIds || [];
        const hash = JSON.stringify({
            enabled: pinningOptions?.enabled !== false,
            top,
            bottom,
            idColumn: pinningOptions?.idColumn,
            hasResolve: !!pinningOptions?.resolve
        });

        if (hash === this.optionsHash) {
            return;
        }

        this.optionsHash = hash;

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

    public resolveAllPinnedIds(
        allRows: RowResolveEntry[]
    ): { topIds: RowId[]; bottomIds: RowId[] } {
        this.loadOptions();

        const resolve = this.getPinningOptions()?.resolve;
        if (!resolve || !this.isOptionEnabled()) {
            return {
                topIds: this.topRowIds.slice(),
                bottomIds: this.bottomRowIds.slice()
            };
        }

        const explicitTop = this.topRowIds.slice();
        const explicitBottom = this.bottomRowIds.slice();
        const used = new Set<RowId>([...explicitTop, ...explicitBottom]);
        const topResolved: RowId[] = [];
        const bottomResolved: RowId[] = [];

        for (const { rowId, row } of allRows) {
            if (
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
                topResolved.push(rowId);
                used.add(rowId);
            } else if (position === 'bottom') {
                bottomResolved.push(rowId);
                used.add(rowId);
            }
        }

        return {
            topIds: [...explicitTop, ...topResolved],
            bottomIds: [...explicitBottom, ...bottomResolved]
        };
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
