/* *
 *
 *  Grid Pro table editing composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type { DeepPartial } from '../../../Shared/Types';
import type Options from '../../Core/Options';
import type {
    CellMenuTarget,
    MenuContext
} from '../../Core/ContextMenu/ContextMenuTarget';

import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import { registerMenuItem } from '../../Core/ContextMenu/ContextMenuRegistry.js';
import TableEditingController, {
    type TableEditingContext,
    type TableEditingOptions
} from './TableEditingController.js';
import {
    addEvent,
    isNumber,
    isString,
    merge,
    pushUnique
} from '../../../Shared/Utilities.js';

/* *
 *
 *  Composition
 *
 * */

/**
 * Default options for structural table editing.
 */
export const defaultOptions: DeepPartial<Options> = {
    lang: {
        tableEditing: {
            rows: 'Rows',
            columns: 'Columns',
            addRowAbove: 'Add row above',
            addRowBelow: 'Add row below',
            deleteRow: 'Delete row',
            addColumnBefore: 'Add column before',
            addColumnAfter: 'Add column after',
            deleteColumn: 'Delete column'
        }
    },
    tableEditing: {
        enabled: false
    }
};

/**
 * Language options for the table editing feature.
 */
export interface TableEditingLangOptions {
    /**
     * Label used for the built-in row editing context menu group.
     *
     * @default 'Rows'
     */
    rows?: string;

    /**
     * Label used for the built-in column editing context menu group.
     *
     * @default 'Columns'
     */
    columns?: string;

    /**
     * Label used for the built-in "add row above" action.
     *
     * @default 'Add row above'
     */
    addRowAbove?: string;

    /**
     * Label used for the built-in "add row below" action.
     *
     * @default 'Add row below'
     */
    addRowBelow?: string;

    /**
     * Label used for the built-in "delete row" action.
     *
     * @default 'Delete row'
     */
    deleteRow?: string;

    /**
     * Label used for the built-in "add column before" action.
     *
     * @default 'Add column before'
     */
    addColumnBefore?: string;

    /**
     * Label used for the built-in "add column after" action.
     *
     * @default 'Add column after'
     */
    addColumnAfter?: string;

    /**
     * Label used for the built-in "delete column" action.
     *
     * @default 'Delete column'
     */
    deleteColumn?: string;
}

/**
 * Extends Grid Pro with structural table editing.
 *
 * @param GridClass
 * The class to extend.
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'TableEditing')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);
    registerBuiltInActions();

    addEvent(GridClass, 'beforeLoad', initTableEditing);
}

/**
 * Registers table editing built-in context menu actions and groups.
 */
function registerBuiltInActions(): void {
    registerMenuItem<CellMenuTarget>('addRowAbove', {
        icon: 'addRowAbove',
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.addRowAbove || '',
        targets: ['cell'],
        visible: isRowActionVisible,
        onClick: (_target, context): void => {
            void context.grid.tableEditing?.addRowAbove(
                editingContext(context)
            );
        }
    });

    registerMenuItem<CellMenuTarget>('addRowBelow', {
        icon: 'addRowBelow',
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.addRowBelow || '',
        targets: ['cell'],
        visible: isRowActionVisible,
        onClick: (_target, context): void => {
            void context.grid.tableEditing?.addRowBelow(
                editingContext(context)
            );
        }
    });

    registerMenuItem<CellMenuTarget>('deleteRow', {
        icon: 'trash',
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.deleteRow || '',
        targets: ['cell'],
        visible: isRowActionVisible,
        onClick: (_target, context): void => {
            void context.grid.tableEditing?.deleteRow(
                editingContext(context)
            );
        }
    });

    registerMenuItem<CellMenuTarget>('addColumnBefore', {
        icon: 'addColumnLeft',
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.addColumnBefore || '',
        targets: ['cell'],
        visible: isColumnActionVisible,
        onClick: (_target, context): void => {
            void context.grid.tableEditing?.addColumnBefore(
                editingContext(context)
            );
        }
    });

    registerMenuItem<CellMenuTarget>('addColumnAfter', {
        icon: 'addColumnRight',
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.addColumnAfter || '',
        targets: ['cell'],
        visible: isColumnActionVisible,
        onClick: (_target, context): void => {
            void context.grid.tableEditing?.addColumnAfter(
                editingContext(context)
            );
        }
    });

    registerMenuItem<CellMenuTarget>('deleteColumn', {
        icon: 'trash',
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.deleteColumn || '',
        targets: ['cell'],
        visible: isColumnActionVisible,
        disabled: (context): boolean =>
            !context.grid.tableEditing?.canDeleteColumn(
                editingContext(context)
            ),
        onClick: (_target, context): void => {
            void context.grid.tableEditing?.deleteColumn(
                editingContext(context)
            );
        }
    });

    registerMenuItem<CellMenuTarget>('rows', {
        defaultIn: ['cell'],
        icon: 'addRowBelow',
        items: ['addRowAbove', 'addRowBelow', 'deleteRow'],
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.rows || '',
        targets: ['cell'],
        visible: isRowActionVisible
    });

    registerMenuItem<CellMenuTarget>('columns', {
        defaultIn: ['cell'],
        icon: 'addColumnRight',
        items: ['addColumnBefore', 'addColumnAfter', 'deleteColumn'],
        label: (context): string =>
            context.grid.options?.lang?.tableEditing?.columns || '',
        targets: ['cell'],
        visible: isColumnActionVisible
    });
}

/**
 * Narrows a menu context down to what the table editing actions need.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @return
 * Table editing context.
 */
function editingContext(
    context: MenuContext<CellMenuTarget>
): TableEditingContext {
    const { grid, target } = context;
    const rowId = target.row.id;

    return {
        columnId: target.column.id,
        grid,
        rowId: isString(rowId) || isNumber(rowId) ? rowId : void 0,
        sourceColumnId: grid.columnPolicy.getColumnSourceId(target.column.id)
    };
}

/**
 * Creates the table editing controller for a grid instance.
 */
function initTableEditing(this: Grid): void {
    this.tableEditing = new TableEditingController(this);
}

/**
 * Returns whether row actions should be visible.
 *
 * @param context
 * Context menu runtime context.
 */
function isRowActionVisible(context: MenuContext<CellMenuTarget>): boolean {
    return context.grid.tableEditing
        ?.canEditRows(editingContext(context)) === true;
}

/**
 * Returns whether column actions should be visible.
 *
 * @param context
 * Context menu runtime context.
 */
function isColumnActionVisible(
    context: MenuContext<CellMenuTarget>
): boolean {
    return context.grid.tableEditing
        ?.canEditColumns(editingContext(context)) === true;
}

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Grid' {
    export default interface Grid {
        /**
         * Structural table editing controller.
         */
        tableEditing?: TableEditingController;
    }
}

declare module '../../Core/Options' {
    interface Options {
        /**
         * Options for built-in structural table editing.
         *
         * @sample grid-pro/basic/table-editing Table editing
         */
        tableEditing?: TableEditingOptions;
    }

    interface LangOptions {
        /**
         * Language options for the table editing feature.
         */
        tableEditing?: TableEditingLangOptions;
    }
}

declare module '../../Core/ContextMenu/ContextMenuOptions' {
    interface MenuItemIdRegistry {
        addRowAbove: never;
        addRowBelow: never;
        deleteRow: never;
        addColumnBefore: never;
        addColumnAfter: never;
        deleteColumn: never;
        rows: never;
        columns: never;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default {
    compose,
    defaultOptions
};
