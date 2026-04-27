/* *
 *
 *  Grid Row Pinning composition
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
import type Table from '../../Core/Table/Table';
import type Column from '../../Core/Table/Column';
import type TableRow from '../../Core/Table/Body/TableRow';
import type TableCell from '../../Core/Table/Body/TableCell';
import type { DeepPartial } from '../../../Shared/Types';
import type Options from '../../Core/Options';

import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import RowPinningController, {
    hasConfiguredGridRowPinningOptions,
    type RowId as GridRowId,
    type RowPinningChangeAction,
    type RowPinningChangeEvent,
    type RowPinningChangeEventCallback,
    type RowPinningEvents,
    type RowPinningOptions,
    type RowPinningPosition,
    type RowPinningSectionOptions
} from './RowPinningController.js';
import RowPinningView, { classNames } from './RowPinningView.js';
import PinnedTableCell from './PinnedTableCell.js';
import { registerBuiltInAction } from '../../Core/Table/Body/CellContextMenuBuiltInActions.js';
import {
    addEvent,
    merge,
    pushUnique
} from '../../../Shared/Utilities.js';

/**
 * Default options for row pinning.
 */
export const defaultOptions: DeepPartial<Options> = {
    accessibility: {
        announcements: {
            rowPinning: true
        }
    },
    lang: {
        pinRowTop: 'Pin row to top',
        pinRowBottom: 'Pin row to bottom',
        unpinRow: 'Unpin row',
        accessibility: {
            rowPinning: {
                announcements: {
                    pinned: 'Row {rowId} pinned to {position}.',
                    unpinned: 'Row {rowId} unpinned.'
                },
                descriptions: {
                    pinnedTop: 'Pinned row in top section.',
                    pinnedBottom: 'Pinned row in bottom section.',
                    alsoPinnedTop: 'This row is also pinned to top section.',
                    alsoPinnedBottom:
                        'This row is also pinned to bottom section.'
                }
            }
        }
    },
    rendering: {
        rows: {
            pinning: {
                enabled: true,
                topIds: [],
                bottomIds: [],
                events: {},
                top: {},
                bottom: {}
            }
        }
    }
};

export { classNames };

const defaultPinnedRowsState = {
    topIds: [],
    bottomIds: []
};

/**
 * Compose row pinning APIs into Grid Pro.
 *
 * @param GridClass
 * Grid class to compose into.
 *
 * @param TableClass
 * Table class to compose into.
 *
 * @param ColumnClass
 * Column class to compose into.
 *
 * @param TableRowClass
 * TableRow class to compose into.
 *
 * @param TableCellClass
 * TableCell class to compose into.
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table,
    ColumnClass: typeof Column,
    TableRowClass: typeof TableRow,
    TableCellClass: typeof TableCell
): void {
    void ColumnClass;

    if (!pushUnique(Globals.composed, 'RowPinning')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);
    registerBuiltInActions();

    addEvent(GridClass, 'beforeLoad', initRowPinning);
    addEvent(GridClass, 'beforeUpdate', onBeforeGridUpdate);
    addEvent(TableClass, 'beforeInit', initRowPinningView);
    addEvent(TableClass, 'afterReflow', onAfterTableReflow);
    addEvent(TableClass, 'bodyScroll', onTableBodyScroll);
    addEvent(TableClass, 'afterDestroy', destroyRowPinningView);
    addEvent(TableRowClass, 'afterLoadData', rememberMaterializedRowData);
    addEvent(TableRowClass, 'afterUpdateAttributes', syncRenderedRowAttrs);
    addEvent(TableCellClass, 'afterEditValue', syncEditedCellMirrors);
}

/**
 * Registers row pinning built-in context menu actions.
 */
function registerBuiltInActions(): void {
    registerBuiltInAction(
        'pinRowTop',
        {
            getLabel: (cell): string =>
                cell.row.viewport.grid.options?.lang?.pinRowTop || '',
            icon: 'pin',
            isVisible: (cell, rowId): boolean =>
                isRowPinningActionVisible(cell, rowId),
            isDisabled: (cell, rowId): boolean =>
                isRowPinningActionDisabled('pinRowTop', cell, rowId),
            onClick: (cell, rowId): void => {
                void cell.row.viewport.grid.rowPinning?.pin(rowId, 'top');
            }
        },
        true
    );

    registerBuiltInAction(
        'pinRowBottom',
        {
            getLabel: (cell): string =>
                cell.row.viewport.grid.options?.lang?.pinRowBottom || '',
            icon: 'pin',
            isVisible: (cell, rowId): boolean =>
                isRowPinningActionVisible(cell, rowId),
            isDisabled: (cell, rowId): boolean =>
                isRowPinningActionDisabled('pinRowBottom', cell, rowId),
            onClick: (cell, rowId): void => {
                void cell.row.viewport.grid.rowPinning?.pin(rowId, 'bottom');
            }
        },
        true
    );

    registerBuiltInAction(
        'unpinRow',
        {
            getLabel: (cell): string =>
                cell.row.viewport.grid.options?.lang?.unpinRow || '',
            icon: 'unpin',
            isVisible: (cell, rowId): boolean =>
                isRowPinningActionVisible(cell, rowId),
            isDisabled: (cell, rowId): boolean =>
                isRowPinningActionDisabled('unpinRow', cell, rowId),
            onClick: (cell, rowId): void => {
                void cell.row.viewport.grid.rowPinning?.unpin(rowId);
            }
        },
        true
    );
}

/**
 * Initializes row pinning state for a grid instance.
 */
function initRowPinning(this: Grid): void {
    syncPinningIdColumnOption(this.userOptions);
    syncPinningIdColumnOption(this.options);

    this.rowPinning = new RowPinningController(this);
    this.rowPinning.loadOptions();
}

/**
 * Creates the row pinning view helper for a table instance.
 */
function initRowPinningView(this: Table): void {
    this.rowPinningView = new RowPinningView(this);
    const previousGetEffectiveRowCount = this.rowsVirtualizer
        .getEffectiveRowCount;
    this.rowsVirtualizer.getEffectiveRowCount = async (
        providerRowCount: number
    ): Promise<number> => await this.rowPinningView?.getScrollableRowCount(
        await previousGetEffectiveRowCount?.(providerRowCount) ??
            providerRowCount
    ) ?? providerRowCount;
    this.rowsVirtualizer.beforeInitialRenderRows = async (): Promise<void> => {
        await this.rowPinningView?.refreshFromQueryCycle(true);
    };
    const previousAfterRenderRows = this.rowsVirtualizer.afterRenderRows;
    this.rowsVirtualizer.afterRenderRows = async (): Promise<void> => {
        await previousAfterRenderRows?.();
        await this.rowPinningView?.syncPinnedRowsFromMaterializedRows();
    };
    this.afterUpdateRowsHooks.push(async (): Promise<void> => {
        await this.rowPinningView?.refreshFromQueryCycle(true);
    });
}

/**
 * Triggers a reflow of the pinned rows view after the table reflowed.
 */
function onAfterTableReflow(this: Table): void {
    this.rowPinningView?.reflow();
}

/**
 * Syncs horizontal scroll position of pinned rows with the table body.
 *
 * @param e
 * Scroll event payload.
 *
 * @param e.scrollLeft
 * Horizontal scroll offset.
 *
 * @param e.scrollTop
 * Vertical scroll offset (unused).
 */
function onTableBodyScroll(
    this: Table,
    e: { scrollLeft?: number; scrollTop?: number }
): void {
    void e.scrollTop;
    this.rowPinningView?.syncHorizontalScroll(e.scrollLeft || 0);
}

/**
 * Destroys the row pinning view and cleans up its reference on the table.
 */
function destroyRowPinningView(this: Table): void {
    this.rowPinningView?.destroy();
    delete this.rowPinningView;
}

/**
 * Caches the materialized row data in the row pinning controller.
 */
function rememberMaterializedRowData(this: TableRow): void {
    this.viewport.grid.rowPinning?.rememberMaterializedRow(this.id, this.data);
}

/**
 * Syncs HTML attributes of a rendered row into its pinned mirror rows.
 */
function syncRenderedRowAttrs(this: TableRow): void {
    this.viewport.rowPinningView?.updateRowAttributes(this);
}

/**
 * Propagates an edited cell value to pinned mirror rows of the same data row.
 */
function syncEditedCellMirrors(this: TableCell): void {
    if (this instanceof PinnedTableCell) {
        return;
    }

    const rowId = this.row.id;
    if (rowId === void 0) {
        return;
    }

    const sourceColumnId = this.column.viewport.grid.columnPolicy
        .getColumnSourceId(this.column.id);
    if (!sourceColumnId) {
        return;
    }

    this.row.viewport.grid.rowPinning?.updatePinnedRowValue(
        rowId,
        this.column.id,
        this.value
    );

    if (!this.row.viewport.grid.querying.willNotModify()) {
        return;
    }

    void this.row.viewport.rowPinningView?.syncRenderedMirrors(
        rowId,
        this.column.id,
        this.value,
        this.row,
        sourceColumnId
    );
}

/**
 * Syncs row pinning state before a grid update is applied.
 *
 * @param e
 * Pending update payload.
 *
 * @param e.options
 * Pending update options.
 *
 * @param e.scope
 * Update scope.
 */
function onBeforeGridUpdate(
    this: Grid,
    e: {
        options?: Omit<Options, 'id'> | Record<string, unknown>;
        scope?: 'grid'|'column';
    }
): void {
    const updateOptions = e.options;

    if (!updateOptions || typeof updateOptions !== 'object') {
        return;
    }

    syncPinningIdColumnOption(updateOptions as Partial<Options>);

    if (
        hasOwnPath(
            updateOptions,
            ['rendering', 'rows', 'pinning']
        )
    ) {
        this.rowPinning?.markOptionsDirty();
    }

    if (
        this.rowPinning &&
        hasDataSourceOptionChanges(updateOptions as Partial<Options>)
    ) {
        this.rowPinning.invalidatePinnedRowObjects();
    }
}

/**
 * Returns whether a row pinning built-in action should be visible.
 *
 * @param cell
 * Context menu cell context.
 *
 * @param cell.row
 * Row context.
 *
 * @param cell.row.viewport
 * Viewport context.
 *
 * @param cell.row.viewport.grid
 * Owning grid instance.
 *
 * @param rowId
 * Current row identifier.
 */
function isRowPinningActionVisible(
    cell: {
        row: {
            viewport: {
                grid: Grid;
            };
        };
    },
    rowId: GridRowId | undefined
): boolean {
    const { grid } = cell.row.viewport;

    return (
        rowId !== void 0 &&
        hasConfiguredGridRowPinningOptions(grid) &&
        grid.rowPinning?.isOptionEnabled() === true
    );
}

/**
 * Returns whether a row pinning built-in action should be disabled.
 *
 * @param actionId
 * Built-in action identifier.
 *
 * @param cell
 * Context menu cell context.
 *
 * @param cell.row
 * Row context.
 *
 * @param cell.row.id
 * Current row identifier.
 *
 * @param cell.row.viewport
 * Viewport context.
 *
 * @param cell.row.viewport.grid
 * Owning grid instance.
 *
 * @param rowId
 * Current row identifier.
 */
function isRowPinningActionDisabled(
    actionId: 'pinRowTop'|'pinRowBottom'|'unpinRow',
    cell: {
        row: {
            id?: GridRowId;
            viewport: {
                grid: Grid;
            };
        };
    },
    rowId: GridRowId | undefined
): boolean {
    const { grid } = cell.row.viewport;

    if (
        rowId === void 0 ||
        !hasConfiguredGridRowPinningOptions(grid) ||
        grid.rowPinning?.isOptionEnabled() !== true
    ) {
        return true;
    }

    const pinned = grid.rowPinning?.getPinnedRows() ||
        defaultPinnedRowsState;
    const inTop = pinned.topIds.includes(rowId);
    const inBottom = pinned.bottomIds.includes(rowId);

    if (actionId === 'pinRowTop') {
        return inTop;
    }

    if (actionId === 'pinRowBottom') {
        return inBottom;
    }

    return !inTop && !inBottom;
}

/**
 * Returns whether an object defines every segment in a nested path.
 *
 * @param obj
 * Object to inspect.
 *
 * @param path
 * Property path to verify.
 */
function hasOwnPath(
    obj: object,
    path: string[]
): boolean {
    let cursor: unknown = obj;

    for (const segment of path) {
        if (
            !cursor ||
            typeof cursor !== 'object' ||
            !Object.prototype.hasOwnProperty.call(cursor, segment)
        ) {
            return false;
        }

        cursor = (cursor as Record<string, unknown>)[segment];
    }

    return true;
}

/**
 * Mirrors `rendering.rows.pinning.idColumn` into `data.idColumn`.
 *
 * @param options
 * Options object to normalize.
 */
function syncPinningIdColumnOption(
    options?: Partial<Options> | Record<string, unknown>
): void {
    if (!options || typeof options !== 'object') {
        return;
    }

    const rendering = (options as Partial<Options>).rendering;
    const idColumn = rendering?.rows?.pinning?.idColumn;

    if (!idColumn) {
        return;
    }

    if (!(options as Partial<Options>).data) {
        (options as Partial<Options>).data = {};
    }

    if ((options as Partial<Options>).data?.idColumn === void 0) {
        (options as Partial<Options>).data!.idColumn = idColumn;
    }
}

/**
 * Returns whether an update includes a data source change.
 *
 * @param options
 * Update options to inspect.
 */
function hasDataSourceOptionChanges(options: Partial<Options>): boolean {
    return (
        Object.prototype.hasOwnProperty.call(options, 'data') ||
        Object.prototype.hasOwnProperty.call(options, 'dataTable')
    );
}

export type {
    GridRowId,
    RowPinningChangeAction,
    RowPinningChangeEvent,
    RowPinningChangeEventCallback,
    RowPinningEvents,
    RowPinningOptions,
    RowPinningPosition,
    RowPinningSectionOptions
};

export default {
    compose
} as const;
