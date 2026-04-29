/* *
 *
 *  Grid Editing composition
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
import type TableCell from '../../Core/Table/Body/TableCell';
import type { DeepPartial } from '../../../Shared/Types';
import type Options from '../../Core/Options';

import GridEditingController from './GridEditingController.js';
import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import {
    registerBuiltInAction,
    registerBuiltInGroup
} from '../../Core/Table/Body/CellContextMenuBuiltInActions.js';
import {
    addEvent,
    merge,
    pushUnique
} from '../../../Shared/Utilities.js';


/* *
 *
 *  Defaults
 *
 * */

export const defaultOptions: DeepPartial<Options> = {
    gridEditing: {
        enabled: true
    },
    accessibility: {
        announcements: {
            gridEditing: true
        }
    },
    lang: {
        addRowAbove: 'Add row above',
        addRowBelow: 'Add row below',
        deleteRow: 'Delete row',
        addColumnBefore: 'Add column before',
        addColumnAfter: 'Add column after',
        deleteColumn: 'Delete column',
        rowsGroup: 'Rows',
        columnsGroup: 'Columns',
        accessibility: {
            gridEditing: {
                announcements: {
                    rowAdded: 'Row added.',
                    rowDeleted: 'Row deleted.',
                    columnAdded: 'Column added.',
                    columnDeleted: 'Column deleted.'
                }
            }
        }
    }
};


/* *
 *
 *  Functions
 *
 * */

/**
 * Returns the grid editing controller associated with a cell.
 *
 * @param cell
 * Cell from which to resolve the grid.
 */
function getEditing(cell: TableCell): GridEditingController | undefined {
    return cell.row.viewport.grid.gridEditing;
}

/**
 * Returns whether row mutation actions should be active for the cell.
 *
 * @param cell
 * Cell to evaluate.
 */
function isRowMutationsActive(cell: TableCell): boolean {
    const editing = getEditing(cell);
    return !!(editing && editing.isEnabled() && editing.canMutateRows());
}

/**
 * Returns whether column mutation actions should be active for the cell.
 *
 * @param cell
 * Cell to evaluate.
 */
function isColumnMutationsActive(cell: TableCell): boolean {
    const editing = getEditing(cell);
    return !!(editing && editing.isEnabled() && editing.canMutateColumns());
}

/**
 * Registers row/column editing built-in context menu actions and the
 * `rows` / `columns` groups that bundle them in the default menu.
 */
function registerBuiltInActions(): void {
    registerBuiltInAction('addRowAbove', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.addRowAbove || '',
        icon: 'addRowAbove',
        isDisabled: (cell, rowId): boolean => {
            const editing = getEditing(cell);
            return rowId === void 0 ||
                !editing?.isEnabled() ||
                !editing.canMutateRows();
        },
        onClick: (cell, rowId): void => {
            void getEditing(cell)?.addRowAbove(rowId);
        }
    });

    registerBuiltInAction('addRowBelow', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.addRowBelow || '',
        icon: 'addRowBelow',
        isDisabled: (cell, rowId): boolean => {
            const editing = getEditing(cell);
            return rowId === void 0 ||
                !editing?.isEnabled() ||
                !editing.canMutateRows();
        },
        onClick: (cell, rowId): void => {
            void getEditing(cell)?.addRowBelow(rowId);
        }
    });

    registerBuiltInAction('deleteRow', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.deleteRow || '',
        icon: 'trash',
        isDisabled: (cell, rowId): boolean => {
            if (rowId === void 0) {
                return true;
            }
            const editing = getEditing(cell);
            return !editing?.isEnabled() || !editing.isRowDeletable(rowId);
        },
        onClick: (cell, rowId): void => {
            void getEditing(cell)?.deleteRow(rowId);
        }
    });

    registerBuiltInAction('addColumnBefore', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.addColumnBefore || '',
        icon: 'addColumnBefore',
        isDisabled: (cell): boolean => {
            const editing = getEditing(cell);
            return !editing?.isEnabled() || !editing.canMutateColumns();
        },
        onClick: (cell): void => {
            void getEditing(cell)?.addColumnBefore(cell.column.id);
        }
    });

    registerBuiltInAction('addColumnAfter', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.addColumnAfter || '',
        icon: 'addColumnAfter',
        isDisabled: (cell): boolean => {
            const editing = getEditing(cell);
            return !editing?.isEnabled() || !editing.canMutateColumns();
        },
        onClick: (cell): void => {
            void getEditing(cell)?.addColumnAfter(cell.column.id);
        }
    });

    registerBuiltInAction('deleteColumn', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.deleteColumn || '',
        icon: 'trash',
        isDisabled: (cell): boolean => {
            const editing = getEditing(cell);
            return !editing?.isEnabled() ||
                !editing.isColumnDeletable(cell.column.id);
        },
        onClick: (cell): void => {
            void getEditing(cell)?.deleteColumn(cell.column.id);
        }
    });

    registerBuiltInGroup('rows', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.rowsGroup || 'Rows',
        icon: 'addRowAbove',
        items: ['addRowAbove', 'addRowBelow', 'deleteRow'],
        isActive: (cell): boolean => isRowMutationsActive(cell)
    });

    registerBuiltInGroup('columns', {
        getLabel: (cell): string =>
            cell.row.viewport.grid.options?.lang?.columnsGroup || 'Columns',
        icon: 'addColumnBefore',
        items: ['addColumnBefore', 'addColumnAfter', 'deleteColumn'],
        isActive: (cell): boolean => isColumnMutationsActive(cell)
    });
}

/**
 * Initializes the grid editing controller on a grid instance.
 */
function initGridEditing(this: Grid): void {
    this.gridEditing = new GridEditingController(this);
}

/**
 * Destroys the grid editing controller on a grid instance.
 */
function destroyGridEditing(this: Grid): void {
    delete this.gridEditing;
}


/* *
 *
 *  Compose
 *
 * */

/**
 * Composes the grid editing feature onto the Grid class.
 *
 * @param GridClass
 * Grid class to compose into.
 */
export function compose(GridClass: typeof Grid): void {
    if (!pushUnique(Globals.composed, 'GridEditing')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);
    registerBuiltInActions();

    addEvent(GridClass, 'beforeLoad', initGridEditing);
    addEvent(GridClass, 'afterDestroy', destroyGridEditing);
}


/* *
 *
 *  Module augmentations
 *
 * */

declare module '../../Core/Options' {
    interface CellContextMenuBuiltInActionIdRegistry {
        addRowAbove: never;
        addRowBelow: never;
        deleteRow: never;
        addColumnBefore: never;
        addColumnAfter: never;
        deleteColumn: never;
    }

    interface CellContextMenuBuiltInGroupIdRegistry {
        rows: never;
        columns: never;
    }

    interface LangOptions {
        addRowAbove?: string;
        addRowBelow?: string;
        deleteRow?: string;
        addColumnBefore?: string;
        addColumnAfter?: string;
        deleteColumn?: string;
        rowsGroup?: string;
        columnsGroup?: string;
    }
}

declare module '../../Core/Accessibility/A11yOptions' {
    interface A11yAnnouncementsOptions {
        gridEditing?: boolean;
    }

    interface LangAccessibilityOptions {
        gridEditing?: {
            announcements?: {
                rowAdded?: string;
                rowDeleted?: string;
                columnAdded?: string;
                columnDeleted?: string;
            };
        };
    }
}


/* *
 *
 *  Default export
 *
 * */

export default {
    compose
} as const;
