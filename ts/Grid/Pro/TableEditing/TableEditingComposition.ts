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
import type HeaderCell from '../../Core/Table/Header/HeaderCell';
import type { DeepPartial } from '../../../Shared/Types';
import type Options from '../../Core/Options';
import type {
    CellContextMenuContext
} from '../../Core/Table/CellContextMenu/CellContextMenuBuiltInActions';

import { createGridIcon } from '../../Core/UI/SvgIcons.js';
import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import GridUtils from '../../Core/GridUtils.js';
import {
    registerBuiltInAction,
    registerBuiltInGroup
} from '../../Core/Table/CellContextMenu/CellContextMenuBuiltInActions.js';
import {
    registerHeaderContextMenuAction
} from '../../Core/Table/Header/HeaderContextMenu.js';
import TableEditingController, {
    emptyStateButtonClassName,
    type ColumnEditingContext,
    type TableEditingOptions
} from './TableEditingController.js';
import {
    addEvent,
    merge,
    pushUnique
} from '../../../Shared/Utilities.js';

const { makeHTMLElement, joinClassNames } = GridUtils;

const emptyStateRowClassName = Globals.classNamePrefix + 'empty-state-row';

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
            deleteColumn: 'Delete column',
            addFirstRow: 'Add row',
            addFirstColumn: 'Add column',
            renameColumn: 'Rename column',
            changeColumnId: 'Change column id'
        }
    },
    tableEditing: {
        enabled: false,
        columnRenaming: {
            enabled: true
        },
        columnIdEditing: {
            enabled: false
        }
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

    /**
     * Label used for the empty state button that adds the first row.
     *
     * @default 'Add row'
     */
    addFirstRow?: string;

    /**
     * Label used for the empty state button that adds the first column.
     *
     * @default 'Add column'
     */
    addFirstColumn?: string;

    /**
     * Label of the header context menu action that changes the displayed name
     * of a column, and the accessible name of the input it opens.
     *
     * @default 'Rename column'
     */
    renameColumn?: string;

    /**
     * Label of the header context menu action that changes the id a column
     * has in the data, and the accessible name of the input it opens.
     *
     * @default 'Change column id'
     */
    changeColumnId?: string;
}

/**
 * Extends Grid Pro with structural table editing.
 *
 * @param GridClass
 * The class to extend.
 *
 * @param HeaderCellClass
 * The header cell class the rename triggers are attached to.
 */
export function compose(
    GridClass: typeof Grid,
    HeaderCellClass: typeof HeaderCell
): void {
    if (!pushUnique(Globals.composed, 'TableEditing')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);
    registerBuiltInActions();

    addEvent(GridClass, 'beforeLoad', initTableEditing);
    addEvent(GridClass, 'afterRenderViewport', renderEmptyStateButton);
    addEvent(HeaderCellClass, 'keyDown', onHeaderCellKeyDown);

    registerHeaderContextMenuAction({
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.renameColumn || '',
        icon: 'pencil',
        isVisible: (context): boolean =>
            context.grid.tableEditing?.canRenameColumn(context.column) === true,
        onClick: (context): void => {
            context.grid.tableEditing?.startRenamingColumn(
                context.cell,
                'name'
            );
        }
    });

    registerHeaderContextMenuAction({
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.changeColumnId || '',
        icon: 'key',
        isVisible: (context): boolean =>
            context.grid.tableEditing?.canEditColumnId(context.column) === true,
        isDisabled: (context): boolean =>
            context.grid.tableEditing
                ?.getColumnIdBlocker(context.column) !== void 0,
        onClick: (context): void => {
            context.grid.tableEditing?.startRenamingColumn(context.cell, 'id');
        }
    });

    // The same structural actions the cell menu offers, so that a column can
    // be worked on from the header it belongs to. They stay in the cell menu
    // as well, which is the only route left when the header is turned off.
    registerHeaderContextMenuAction({
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.addColumnBefore || '',
        icon: 'addColumnLeft',
        isVisible: isColumnActionVisible,
        startsGroup: true,
        onClick: (context): void => {
            void context.grid.tableEditing?.addColumnBefore(context);
        }
    });

    registerHeaderContextMenuAction({
        getLabel: (context): string =>
            context.grid.options?.lang?.tableEditing?.addColumnAfter || '',
        icon: 'addColumnRight',
        isVisible: isColumnActionVisible,
        onClick: (context): void => {
            void context.grid.tableEditing?.addColumnAfter(context);
        }
    });

    registerHeaderContextMenuAction({
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
 * Renders a button that seeds an empty table with its first column or row,
 * which cannot be done through the cell context menu.
 */
function renderEmptyStateButton(this: Grid): void {
    const grid = this;
    const controller = grid.tableEditing;
    const state = controller?.getEmptyState();
    const contentWrapper = grid.contentWrapper;

    if (!controller || !state || !contentWrapper) {
        return;
    }

    const isRow = state === 'rows';
    const lang = grid.options?.lang?.tableEditing;
    const button = makeHTMLElement('button', {
        className: joinClassNames(
            Globals.getClassName('button'),
            emptyStateButtonClassName
        )
    });

    button.appendChild(createGridIcon(
        'plus',
        grid.options?.rendering?.icons
    ));
    makeHTMLElement('span', {
        innerText: (isRow ? lang?.addFirstRow : lang?.addFirstColumn) || ''
    }, button);

    button.addEventListener('click', (): void => {
        void (async (): Promise<void> => {
            await (
                isRow ? controller.addFirstRow() : controller.addFirstColumn()
            );

            // The button is gone after the redraw, so move the focus to where
            // the work continues: the new cell, or the next empty state step.
            (
                grid.viewport?.getRenderedRows()[0]?.cells[0]?.htmlElement ||
                grid.contentWrapper?.querySelector<HTMLElement>(
                    '.' + emptyStateButtonClassName
                )
            )?.focus();
        })();
    });

    const tbody = grid.viewport?.tbodyElement;

    if (isRow && tbody) {
        makeHTMLElement('td', {}, makeHTMLElement('tr', {
            className: emptyStateRowClassName
        }, tbody)).appendChild(button);
        return;
    }

    const noData = contentWrapper.querySelector(
        '.' + Globals.getClassName('noData')
    );
    contentWrapper.insertBefore(button, noData?.nextSibling || null);
}

/**
 * Opens the header for editing on F2, the keyboard counterpart of the context
 * menu actions. Renaming is the one it reaches for, since changing an id is
 * the rarer and more consequential of the two.
 *
 * @param e
 * Header cell key down event.
 *
 * @param e.originalEvent
 * The native keyboard event.
 */
function onHeaderCellKeyDown(
    this: HeaderCell,
    e: { originalEvent: KeyboardEvent }
): void {
    const tableEditing = this.row.viewport.grid.tableEditing;

    if (e.originalEvent.key !== 'F2' || !tableEditing) {
        return;
    }

    e.originalEvent.preventDefault();
    tableEditing.startRenamingColumn(
        this,
        tableEditing.canRenameColumn(this.column) ? 'name' : 'id'
    );
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
function isColumnActionVisible(context: ColumnEditingContext): boolean {
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
         * @sample grid-pro/basic/table-editing-empty Building an empty table
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
