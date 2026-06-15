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
import TableEditingController from './TableEditingController.js';
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
        contextMenuRows: 'Rows',
        contextMenuColumns: 'Columns',
        addRowAbove: 'Add row above',
        addRowBelow: 'Add row below',
        deleteRow: 'Delete row',
        addColumnBefore: 'Add column before',
        addColumnAfter: 'Add column after',
        deleteColumn: 'Delete column'
    },
    tableEditing: {
        enabled: false
    }
};

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
            context.grid.options?.lang?.addRowAbove || '',
        icon: 'addRowAbove',
        isVisible: isRowActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addRowAbove(context);
        }
    });

    registerBuiltInAction('addRowBelow', {
        getLabel: (context): string =>
            context.grid.options?.lang?.addRowBelow || '',
        icon: 'addRowBelow',
        isVisible: isRowActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addRowBelow(context);
        }
    });

    registerBuiltInAction('deleteRow', {
        getLabel: (context): string =>
            context.grid.options?.lang?.deleteRow || '',
        icon: 'trash',
        isVisible: isRowActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.deleteRow(context);
        }
    });

    registerBuiltInAction('addColumnBefore', {
        getLabel: (context): string =>
            context.grid.options?.lang?.addColumnBefore || '',
        icon: 'addColumnLeft',
        isVisible: isColumnActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addColumnBefore(context);
        }
    });

    registerBuiltInAction('addColumnAfter', {
        getLabel: (context): string =>
            context.grid.options?.lang?.addColumnAfter || '',
        icon: 'addColumnRight',
        isVisible: isColumnActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addColumnAfter(context);
        }
    });

    registerBuiltInAction('deleteColumn', {
        getLabel: (context): string =>
            context.grid.options?.lang?.deleteColumn || '',
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
            context.grid.options?.lang?.contextMenuRows || '',
        icon: 'addRowBelow',
        isVisible: isRowActionVisible,
        items: ['addRowAbove', 'addRowBelow', 'deleteRow']
    }, true);

    registerBuiltInGroup('columns', {
        getLabel: (context): string =>
            context.grid.options?.lang?.contextMenuColumns || '',
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
 *  Default Export
 *
 * */

export default {
    compose,
    defaultOptions
};
