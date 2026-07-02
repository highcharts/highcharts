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
    CellContextMenuContext
} from '../../Core/Table/CellContextMenu/CellContextMenuBuiltInActions';

import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import {
    registerBuiltInAction,
    registerBuiltInGroup
} from '../../Core/Table/CellContextMenu/CellContextMenuBuiltInActions.js';
import TableEditingController, {
    type TableEditingOptions
} from './TableEditingController.js';
import {
    addEvent,
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
    registerBuiltInAction('addRowAbove', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.addRowAbove || '',
        icon: 'addRowAbove',
        isVisible: isRowActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addRowAbove(context);
        }
    });

    registerBuiltInAction('addRowBelow', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.addRowBelow || '',
        icon: 'addRowBelow',
        isVisible: isRowActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addRowBelow(context);
        }
    });

    registerBuiltInAction('deleteRow', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.deleteRow || '',
        icon: 'trash',
        isVisible: isRowActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.deleteRow(context);
        }
    });

    registerBuiltInAction('addColumnBefore', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.addColumnBefore || '',
        icon: 'addColumnLeft',
        isVisible: isColumnActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addColumnBefore(context);
        }
    });

    registerBuiltInAction('addColumnAfter', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.addColumnAfter || '',
        icon: 'addColumnRight',
        isVisible: isColumnActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addColumnAfter(context);
        }
    });

    registerBuiltInAction('deleteColumn', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.deleteColumn || '',
        icon: 'trash',
        isVisible: isColumnActionVisible,
        isDisabled: (context): boolean =>
            !context.grid.tableEditing?.canDeleteColumn(context),
        onClick: (context): void => {
            void context.grid.tableEditing?.deleteColumn(context);
        }
    });

    registerBuiltInGroup('rows', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.rows || '',
        icon: 'addRowBelow',
        isVisible: isRowActionVisible,
        items: ['addRowAbove', 'addRowBelow', 'deleteRow']
    }, true);

    registerBuiltInGroup('columns', {
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.columns || '',
        icon: 'addColumnRight',
        isVisible: isColumnActionVisible,
        items: ['addColumnBefore', 'addColumnAfter', 'deleteColumn']
    }, true);
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
function isRowActionVisible(context: CellContextMenuContext): boolean {
    return context.grid.tableEditing?.canEditRows(context) === true;
}

/**
 * Returns whether column actions should be visible.
 *
 * @param context
 * Context menu runtime context.
 */
function isColumnActionVisible(context: CellContextMenuContext): boolean {
    return context.grid.tableEditing?.canEditColumns(context) === true;
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

declare module '../../Core/Table/CellContextMenu/CellContextMenuOptions' {
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
