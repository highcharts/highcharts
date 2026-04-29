/* *
 *
 *  Grid Editing controller
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
import type { RowId } from '../../Core/Data/DataProvider';
import type {
    RowObject as RowObjectType,
    Column as DataTableColumnType
} from '../../../Data/DataTable';
import type { IndividualColumnOptions } from '../../Core/Options';
import type { GridEvent } from '../../Core/GridUtils';

import { fireEvent } from '../../../Shared/Utilities.js';
import { uniqueKey } from '../../../Core/Utilities.js';


/* *
 *
 *  Types
 *
 * */

export type GridEditingRowAction =
    'addRowAbove' | 'addRowBelow' | 'deleteRow';

export type GridEditingColumnAction =
    'addColumnBefore' | 'addColumnAfter' | 'deleteColumn';

/**
 * Payload for row-level editing change events.
 *
 * Listeners registered via `addEvent(grid, 'beforeRowChange', ...)` can
 * call `e.preventDefault()` to abort the mutation. Listeners registered
 * via `grid.options.gridEditing.events.beforeRowChange` can either call
 * `preventDefault()` or set `e.cancel = true`.
 */
export interface GridEditingRowChangeEvent {
    action: GridEditingRowAction;
    anchorRowId: RowId;
    originalRowIndex: number;
    row?: RowObjectType;
    insertedRowId?: RowId;
    cancel?: boolean;
    defaultPrevented?: boolean;
}

/**
 * Payload for column-level editing change events. See
 * `GridEditingRowChangeEvent` for cancellation semantics.
 */
export interface GridEditingColumnChangeEvent {
    action: GridEditingColumnAction;
    anchorColumnId: string;
    insertedColumnId?: string;
    insertPosition?: number;
    column?: DataTableColumnType;
    cancel?: boolean;
    defaultPrevented?: boolean;
}

export interface GridEditingEvents {
    beforeRowChange?: (e: GridEditingRowChangeEvent) => void;
    afterRowChange?: (e: GridEditingRowChangeEvent) => void;
    beforeColumnChange?: (e: GridEditingColumnChangeEvent) => void;
    afterColumnChange?: (e: GridEditingColumnChangeEvent) => void;

    /**
     * Optional factory for a row inserted via addRowAbove / addRowBelow when
     * the caller does not supply one.
     */
    defaultRow?: (
        context: {
            anchorRowId: RowId;
            action: 'addRowAbove' | 'addRowBelow';
        }
    ) => RowObjectType | Promise<RowObjectType>;

    /**
     * Optional factory for a column inserted via addColumnBefore /
     * addColumnAfter when the caller does not supply one.
     */
    defaultColumn?: (
        context: {
            anchorColumnId: string;
            action: 'addColumnBefore' | 'addColumnAfter';
        }
    ) => {
        columnId: string;
        column: DataTableColumnType;
        options?: Omit<IndividualColumnOptions, 'id'>;
    } | Promise<{
        columnId: string;
        column: DataTableColumnType;
        options?: Omit<IndividualColumnOptions, 'id'>;
    }>;
}

/**
 * Specification for a column to insert via `addColumnBefore` /
 * `addColumnAfter`.
 */
export interface GridEditingAddColumnSpec {
    /** Id of the new column. */
    columnId?: string;
    /** Initial column data aligned with the current row count. */
    column?: DataTableColumnType;
    /** Additional per-column options merged onto the new column. */
    options?: Omit<IndividualColumnOptions, 'id'>;
}

export interface GridEditingOptions {
    /**
     * Whether the row/column mutation actions are enabled for this grid.
     * Defaults to `true`. When set to `false`, actions will be unavailable
     * even when editing is enabled on individual columns.
     */
    enabled?: boolean;

    /**
     * Event callbacks fired before/after mutations run.
     */
    events?: GridEditingEvents;
}


/* *
 *
 *  Class
 *
 * */

/**
 * Coordinates row and column mutation actions exposed by Grid Pro editing.
 *
 * Exposed as `grid.gridEditing`. All mutation methods are asynchronous and
 * tolerate invalid input by logging a warning and resolving without effect.
 */
export class GridEditingController {

    public readonly grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    /* *
     *
     *  Feature detection
     *
     * */

    public isEnabled(): boolean {
        const options = this.grid.options?.gridEditing;
        if (options?.enabled === false) {
            return false;
        }

        const grid = this.grid;
        const columnIds = grid.viewport?.columns.map((c): string => c.id) ?? [];
        for (const id of columnIds) {
            if (grid.columnPolicy?.isColumnEditable(id)) {
                return true;
            }
        }
        return false;
    }

    public canMutateRows(): boolean {
        return !!this.grid.dataProvider?.supportsRowMutation();
    }

    public canMutateColumns(): boolean {
        return !!this.grid.dataProvider?.supportsColumnMutation();
    }

    public isRowDeletable(rowId: RowId): boolean {
        void rowId;
        const grid = this.grid;
        if (!this.canMutateRows()) {
            return false;
        }
        const presentationRowCount =
            grid.viewport?.dataTable?.rowCount ?? 0;
        return presentationRowCount > 1;
    }

    public isColumnDeletable(columnId: string): boolean {
        const grid = this.grid;
        if (!this.canMutateColumns()) {
            return false;
        }
        if (grid.columnPolicy?.isColumnUnbound(columnId)) {
            return false;
        }
        const pinIdColumn =
            grid.options?.rendering?.rows?.pinning?.idColumn;
        if (pinIdColumn && columnId === pinIdColumn) {
            return false;
        }
        const sourceColumnIds =
            grid.columnPolicy?.getAvailableSourceColumnIds() ?? [];
        return sourceColumnIds.length > 1;
    }

    /* *
     *
     *  Row mutations
     *
     * */

    public async addRowAbove(
        anchorRowId: RowId,
        row?: RowObjectType
    ): Promise<RowId | undefined> {
        return this.addRow('addRowAbove', anchorRowId, row);
    }

    public async addRowBelow(
        anchorRowId: RowId,
        row?: RowObjectType
    ): Promise<RowId | undefined> {
        return this.addRow('addRowBelow', anchorRowId, row);
    }

    public async deleteRow(rowId: RowId): Promise<void> {
        const grid = this.grid;
        const provider = grid.dataProvider;
        if (!provider || !this.canMutateRows()) {
            return;
        }

        const originalRowIndex = await provider.getOriginalRowIndex(rowId);
        if (originalRowIndex === void 0) {
            // eslint-disable-next-line no-console
            console.warn('[grid editing] Unknown rowId:', rowId);
            return;
        }

        this.stopEditingIfActive();

        const event: GridEditingRowChangeEvent = {
            action: 'deleteRow',
            anchorRowId: rowId,
            originalRowIndex
        };
        this.fireRowEvent('beforeRowChange', event);
        if (event.cancel || event.defaultPrevented) {
            return;
        }

        await provider.deleteRow(rowId);

        grid.rowPinning?.pruneMissingExplicitIds([rowId]);

        await grid.viewport?.updateRows();
        await grid.viewport?.rowPinningView?.refreshFromQueryCycle(true);

        this.fireRowEvent('afterRowChange', event);
        this.announce('rowDeleted');
    }

    /* *
     *
     *  Column mutations
     *
     * */

    /**
     * Inserts a column immediately before the anchor column in the grid's
     * visual order.
     *
     * If the grid is in `autogenerateColumns: true` mode, calling this
     * method seeds the explicit column list from the current source
     * columns and turns autogeneration off, so that the specified
     * ordering can be honored.
     *
     * @param anchorColumnId
     * Id of the existing column that the new column should appear before.
     *
     * @param spec
     * Optional new column specification. When omitted, the controller
     * falls back to the `defaultColumn` event factory (if configured),
     * otherwise a blank column with an auto-generated id is inserted.
     *
     * @return
     * The id of the inserted column, or `undefined` when the mutation
     * was cancelled or unsupported by the provider.
     */
    public async addColumnBefore(
        anchorColumnId: string,
        spec?: GridEditingAddColumnSpec
    ): Promise<string | undefined> {
        return this.addColumn('addColumnBefore', anchorColumnId, spec);
    }

    /**
     * Inserts a column immediately after the anchor column in the grid's
     * visual order. See `addColumnBefore` for notes on autogeneration.
     *
     * @param anchorColumnId
     * Id of the existing column that the new column should appear after.
     *
     * @param spec
     * Optional new column specification.
     *
     * @return
     * The id of the inserted column, or `undefined` when the mutation
     * was cancelled or unsupported by the provider.
     */
    public async addColumnAfter(
        anchorColumnId: string,
        spec?: GridEditingAddColumnSpec
    ): Promise<string | undefined> {
        return this.addColumn('addColumnAfter', anchorColumnId, spec);
    }

    public async deleteColumn(columnId: string): Promise<void> {
        const grid = this.grid;
        const provider = grid.dataProvider;
        if (!provider || !this.canMutateColumns()) {
            return;
        }
        if (!this.isColumnDeletable(columnId)) {
            // eslint-disable-next-line no-console
            console.warn('[grid editing] Column cannot be deleted:', columnId);
            return;
        }

        this.stopEditingIfActive();

        const event: GridEditingColumnChangeEvent = {
            action: 'deleteColumn',
            anchorColumnId: columnId
        };
        this.fireColumnEvent('beforeColumnChange', event);
        if (event.cancel || event.defaultPrevented) {
            return;
        }

        const sourceColumnId =
            grid.columnPolicy?.getColumnSourceId(columnId) ?? columnId;
        await provider.deleteColumn(sourceColumnId);

        // Remove the column from the Grid options column order (if
        // explicitly configured) so the renderer stops drawing it. In
        // autogenerate mode, seed an explicit post-delete list from the
        // provider so the rendered column policy is rebuilt without the
        // removed column.
        const userColumns = grid.userOptions?.columns;
        const nextColumns = userColumns ?
            userColumns.filter((c): boolean => c.id !== columnId) :
            (await provider.getColumnIds())
                .map((id): IndividualColumnOptions => ({ id }));
        const needsAutogenOff =
            grid.userOptions?.data?.autogenerateColumns !== false;
        const updatePayload: {
            columns: IndividualColumnOptions[];
            data?: { autogenerateColumns: false; };
        } = { columns: nextColumns };
        if (needsAutogenOff) {
            updatePayload.data = { autogenerateColumns: false };
        }
        await grid.update(updatePayload, true, true);

        this.fireColumnEvent('afterColumnChange', event);
        this.announce('columnDeleted');
    }

    /* *
     *
     *  Internals
     *
     * */

    private async addRow(
        action: 'addRowAbove' | 'addRowBelow',
        anchorRowId: RowId,
        row?: RowObjectType
    ): Promise<RowId | undefined> {
        const grid = this.grid;
        const provider = grid.dataProvider;
        if (!provider || !this.canMutateRows()) {
            return;
        }

        const anchorIndex = await provider.getOriginalRowIndex(anchorRowId);
        if (anchorIndex === void 0) {
            // eslint-disable-next-line no-console
            console.warn('[grid editing] Unknown rowId:', anchorRowId);
            return;
        }

        this.stopEditingIfActive();

        const rowData = row ?? await this.resolveDefaultRow(
            anchorRowId,
            action
        );
        const insertIndex = action === 'addRowAbove' ?
            anchorIndex :
            anchorIndex + 1;

        const event: GridEditingRowChangeEvent = {
            action,
            anchorRowId,
            originalRowIndex: insertIndex,
            row: rowData
        };
        this.fireRowEvent('beforeRowChange', event);
        if (event.cancel || event.defaultPrevented) {
            return;
        }

        const insertedId = await provider.insertRow(rowData, insertIndex);
        event.insertedRowId = insertedId;

        await grid.viewport?.updateRows();
        await grid.viewport?.rowPinningView?.refreshFromQueryCycle(true);

        this.fireRowEvent('afterRowChange', event);
        this.announce('rowAdded');
        return insertedId;
    }

    private async addColumn(
        action: 'addColumnBefore' | 'addColumnAfter',
        anchorColumnId: string,
        spec?: GridEditingAddColumnSpec
    ): Promise<string | undefined> {
        const grid = this.grid;
        const provider = grid.dataProvider;
        if (!provider || !this.canMutateColumns()) {
            return;
        }

        this.stopEditingIfActive();

        const resolved = await this.resolveColumnSpec(
            anchorColumnId,
            action,
            spec
        );
        if (!resolved) {
            return;
        }

        // Prefer the user-configured column order. When the grid is in
        // `autogenerateColumns` mode with no explicit `columns`, we seed
        // the list from the data provider's current source columns so
        // that the new column can be inserted at a specific position.
        const userColumns = grid.userOptions?.columns;
        const baseColumns: IndividualColumnOptions[] = userColumns ?
            userColumns.slice() :
            ((await provider.getColumnIds()) || [])
                .map((id): IndividualColumnOptions => ({ id }));

        const anchorIdx = baseColumns.findIndex(
            (c): boolean => c.id === anchorColumnId
        );
        const insertPos = anchorIdx < 0 ?
            baseColumns.length :
            (action === 'addColumnBefore' ? anchorIdx : anchorIdx + 1);

        const event: GridEditingColumnChangeEvent = {
            action,
            anchorColumnId,
            insertedColumnId: resolved.columnId,
            insertPosition: insertPos,
            column: resolved.column
        };
        this.fireColumnEvent('beforeColumnChange', event);
        if (event.cancel || event.defaultPrevented) {
            return;
        }

        await provider.insertColumn(resolved.columnId, resolved.column);

        const newColumnOption: IndividualColumnOptions = {
            id: resolved.columnId,
            ...(resolved.options ?? {})
        };
        const nextColumns: IndividualColumnOptions[] = [
            ...baseColumns.slice(0, insertPos),
            newColumnOption,
            ...baseColumns.slice(insertPos)
        ];

        // Force the explicit column order to be honored by disabling
        // autogeneration — otherwise id-only entries are dropped by
        // `setColumnOptionsOneToOne` and the DataTable append order wins.
        const needsAutogenOff =
            grid.userOptions?.data?.autogenerateColumns !== false;
        const updatePayload: {
            columns: IndividualColumnOptions[];
            data?: { autogenerateColumns: false; };
        } = { columns: nextColumns };
        if (needsAutogenOff) {
            updatePayload.data = { autogenerateColumns: false };
        }
        await grid.update(updatePayload, true, true);

        this.fireColumnEvent('afterColumnChange', event);
        this.announce('columnAdded');
        return resolved.columnId;
    }

    private async resolveDefaultRow(
        anchorRowId: RowId,
        action: 'addRowAbove' | 'addRowBelow'
    ): Promise<RowObjectType> {
        const factory = this.getEventsOption()?.defaultRow;
        if (factory) {
            return factory({ anchorRowId, action });
        }

        // Build an empty row using the known bound column ids.
        const grid = this.grid;
        const ids = (await grid.dataProvider?.getColumnIds()) ?? [];
        const blank: RowObjectType = {};
        for (const id of ids) {
            blank[id] = null;
        }

        const idColumn = grid.options?.data?.idColumn;
        if (
            idColumn &&
            typeof blank[idColumn] !== 'string' &&
            typeof blank[idColumn] !== 'number'
        ) {
            blank[idColumn] = `row-${uniqueKey()}`;
        }

        return blank;
    }

    private async resolveColumnSpec(
        anchorColumnId: string,
        action: 'addColumnBefore' | 'addColumnAfter',
        spec?: GridEditingAddColumnSpec
    ): Promise<{
        columnId: string;
        column: DataTableColumnType;
        options?: Omit<IndividualColumnOptions, 'id'>;
    } | undefined> {
        if (spec?.columnId && spec.column) {
            return {
                columnId: spec.columnId,
                column: spec.column,
                options: spec.options
            };
        }

        const factory = this.getEventsOption()?.defaultColumn;
        if (factory) {
            return factory({ anchorColumnId, action });
        }

        const grid = this.grid;
        const rowCount = grid.viewport?.dataTable?.rowCount ?? 0;
        const columnId = spec?.columnId ?? `column-${uniqueKey()}`;
        const column: DataTableColumnType =
            spec?.column ?? new Array(rowCount).fill(null);
        return {
            columnId,
            column,
            options: spec?.options
        };
    }

    private stopEditingIfActive(): void {
        const cellEditing = this.grid.viewport?.cellEditing;
        if (cellEditing?.editedCell) {
            cellEditing.stopEditing(false);
        }
    }

    private getEventsOption(): GridEditingEvents | undefined {
        return this.grid.options?.gridEditing?.events;
    }

    private fireRowEvent(
        name: 'beforeRowChange' | 'afterRowChange',
        event: GridEditingRowChangeEvent
    ): void {
        fireEvent(this.grid, name, event);
        const cb = this.getEventsOption()?.[name];
        if (cb) {
            (event as GridEvent<Grid> & GridEditingRowChangeEvent).target =
                this.grid;
            cb.call(
                this.grid,
                event as GridEvent<Grid> & GridEditingRowChangeEvent
            );
        }
    }

    private fireColumnEvent(
        name: 'beforeColumnChange' | 'afterColumnChange',
        event: GridEditingColumnChangeEvent
    ): void {
        fireEvent(this.grid, name, event);
        const cb = this.getEventsOption()?.[name];
        if (cb) {
            (event as GridEvent<Grid> & GridEditingColumnChangeEvent).target =
                this.grid;
            cb.call(
                this.grid,
                event as GridEvent<Grid> & GridEditingColumnChangeEvent
            );
        }
    }

    private announce(
        key: 'rowAdded' | 'rowDeleted' | 'columnAdded' | 'columnDeleted'
    ): void {
        const grid = this.grid;
        const a11y = grid.accessibility;
        if (!a11y) {
            return;
        }
        if (!grid.options?.accessibility?.announcements?.gridEditing) {
            return;
        }
        const ann =
            grid.options?.lang?.accessibility?.gridEditing?.announcements;
        const msg = ann?.[key];
        if (msg) {
            a11y.announce(msg);
        }
    }
}

/* *
 *
 *  Module augmentations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        gridEditing?: GridEditingOptions;
    }
}

declare module '../../Core/Grid' {
    export default interface Grid {
        gridEditing?: GridEditingController;
    }
}

/* *
 *
 *  Exports
 *
 * */

export default GridEditingController;
