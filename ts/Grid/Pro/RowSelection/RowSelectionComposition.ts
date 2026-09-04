/* *
 *
 *  Grid Row Selection composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Author:
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type Options from '../../Core/Options';
import type Table from '../../Core/Table/Table';
import type TableCell from '../../Core/Table/Body/TableCell';
import type { DeepPartial } from '../../../Shared/Types';
import type { GridEvent } from '../../Core/GridUtils';
import type { RowSelectionChangeEvent } from './RowSelectionOptions';

import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import RowSelectionController from './RowSelectionController.js';
import { classNames, selectionColumnId } from './RowSelectionGlobals.js';
import { addEvent, merge, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

/**
 * Default options for row selection.
 */
export const defaultOptions: DeepPartial<Options> = {
    lang: {
        rowSelection: {
            selectRow: 'Select row'
        }
    },
    rowSelection: {
        enabled: false,
        mode: 'single',
        trigger: 'both',
        clickBehavior: 'toggle',
        modifierKey: 'ctrlOrMeta',
        checkbox: {
            enabled: false,
            columnWidth: 44
        }
    }
};

/**
 * Elements that own their own click behaviour, so a click on them must not
 * also select the row.
 */
const interactiveSelector = 'input, select, button, a, textarea';

/* *
 *
 *  Functions
 *
 * */

/**
 * Composes row selection into Grid Pro.
 *
 * @param GridClass
 * Grid class to compose into.
 *
 * @param TableClass
 * Table class to compose into.
 *
 * @param TableCellClass
 * TableCell class to compose into.
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table,
    TableCellClass: typeof TableCell
): void {
    if (!pushUnique(Globals.composed, 'RowSelection')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);

    addEvent(GridClass, 'beforeLoad', initRowSelection);
    addEvent(GridClass, 'beforeRenderViewport', registerSelectionColumn);
    addEvent(GridClass, 'beforeRowSelectionChange', onBeforeRowSelectionChange);
    addEvent(GridClass, 'afterRowSelectionChange', onAfterRowSelectionChange);
    addEvent(TableClass, 'beforeInit', enableSelectionColumn);
    addEvent(TableClass, 'afterInit', markSelectableTable);
    addEvent(TableCellClass, 'click', onCellClick);
    addEvent(TableCellClass, 'keyDown', onCellKeyDown);
    addEvent(TableCellClass, 'afterRender', decorateSelectionCell);
}

/**
 * Creates the row selection controller for a grid instance.
 */
function initRowSelection(this: Grid): void {
    this.rowSelection = new RowSelectionController(this);
}

/**
 * Runs the grid callback before the row selection changes.
 *
 * @param e
 * Row selection change payload.
 */
function onBeforeRowSelectionChange(
    this: Grid,
    e: RowSelectionChangeEvent
): void {
    this.options?.events?.beforeRowSelectionChange?.call(this, e);
}

/**
 * Runs the grid callback after the row selection changed.
 *
 * @param e
 * Row selection change payload.
 */
function onAfterRowSelectionChange(
    this: Grid,
    e: RowSelectionChangeEvent
): void {
    this.options?.events?.afterRowSelectionChange?.call(this, e);
}

/**
 * Registers the options of the dedicated selection column, and adds its id to
 * a configured header.
 *
 * Registering the options is what keeps the column unbound: without an entry
 * in the column policy, the `Column` constructor pushes a bare `{ id }` into
 * `options.columns`, which then resolves to a data-backed column.
 */
function registerSelectionColumn(this: Grid): void {
    const controller = this.rowSelection;

    if (!controller?.hasCheckbox() || controller.options.checkbox?.columnId) {
        return;
    }

    this.columnPolicy.setColumnOption(selectionColumnId, {
        index: -1,
        options: {
            dataId: null,
            width: controller.options.checkbox?.columnWidth ?? 44,
            header: { format: ' ' }
        }
    });

    const options = this.options;
    const header = options?.header;

    // The header, when configured, drives which cells a header row renders, so
    // a column missing from it would leave the header one cell short.
    if (
        options &&
        header &&
        !this.getColumnIds(header, false).includes(selectionColumnId)
    ) {
        // A new array, never `unshift`: `options.header` shares its array with
        // `userOptions.header`, and the reserved id must not leak into what
        // `getOptions()` hands back.
        options.header = [selectionColumnId, ...header];
    }
}

/**
 * Puts the dedicated selection column first among the rendered columns.
 */
function enableSelectionColumn(this: Table): void {
    const grid = this.grid;
    const controller = grid.rowSelection;

    if (
        !controller?.hasCheckbox() ||
        controller.options.checkbox?.columnId ||
        !grid.enabledColumns ||
        grid.enabledColumns.includes(selectionColumnId)
    ) {
        return;
    }

    grid.enabledColumns.unshift(selectionColumnId);
}

/**
 * Sets `aria-multiselectable` and the selectable class on the table element.
 *
 * Runs per table, because the element is recreated on every viewport render.
 */
function markSelectableTable(this: Table): void {
    const controller = this.grid.rowSelection;
    const el = this.tableElement;

    if (!controller?.isEnabled()) {
        el.removeAttribute('aria-multiselectable');
        el.classList.remove(classNames.rowsSelectable);
        return;
    }

    el.setAttribute(
        'aria-multiselectable',
        controller.mode === 'multiple' ? 'true' : 'false'
    );

    // Suppresses the text selection a Shift-click would otherwise drag out.
    el.classList.toggle(
        classNames.rowsSelectable,
        controller.selectsOnRowClick()
    );
}

/**
 * Selects the clicked row.
 *
 * @param e
 * Cell click payload.
 */
function onCellClick(
    this: TableCell,
    e: GridEvent<TableCell, MouseEvent|KeyboardEvent>
): void {
    const controller = this.row.viewport.grid.rowSelection;
    const originalEvent = e.originalEvent;

    if (!controller?.isEnabled()) {
        return;
    }

    // `Enter` also routes through `onClick`, where it belongs to cell editing.
    // Keyboard selection is handled by `onCellKeyDown` instead.
    if (originalEvent && originalEvent.type !== 'click') {
        return;
    }

    const target = originalEvent?.target;
    const onCheckbox = (
        target instanceof Element &&
        !!target.closest('.' + classNames.checkbox)
    );

    if (onCheckbox) {
        if (!controller.selectsOnCheckboxClick()) {
            // Keep the input from drifting out of sync with the state.
            controller.syncRow(this.row);
            return;
        }
    } else if (
        !controller.selectsOnRowClick() ||
        (
            target instanceof Element &&
            target.closest(interactiveSelector)
        )
    ) {
        return;
    }

    controller.onRowClick(this.row, originalEvent, onCheckbox);
}

/**
 * Selects the focused row on `Space`, the ARIA convention for selecting a row
 * in a grid. `Enter` is left to cell editing.
 *
 * @param e
 * Cell key down payload.
 */
function onCellKeyDown(
    this: TableCell,
    e: GridEvent<TableCell, KeyboardEvent>
): void {
    const controller = this.row.viewport.grid.rowSelection;
    const originalEvent = e.originalEvent;

    if (
        !controller?.isEnabled() ||
        !controller.selectsOnRowClick() ||
        originalEvent?.key !== ' ' ||
        originalEvent.target !== this.htmlElement
    ) {
        return;
    }

    originalEvent.preventDefault();
    controller.onRowClick(this.row, originalEvent);
}

/**
 * Applies the selection state to the row and renders the selection checkbox.
 *
 * The single sync point for the rendered state: every path that rebuilds a
 * cell ends in `TableCell.setValue`, so this also covers row recycling, column
 * virtualization and the mirror rows of the pinned sections.
 */
function decorateSelectionCell(this: TableCell): void {
    const row = this.row;
    const controller = row.viewport.grid.rowSelection;

    if (!controller?.isEnabled()) {
        return;
    }

    controller.syncRow(row);

    if (!controller.hasCheckbox() || !isCheckboxColumn(this, controller)) {
        return;
    }

    // A borrowed column must keep its own padding and alignment.
    if (this.column.id === selectionColumnId) {
        this.htmlElement.classList.add(classNames.selectionCell);
    }

    // `innerText` rebuilds drop the checkbox, Pro renderers leave it in place -
    // so reuse whatever survived rather than appending a second one.
    if (!this.selectionCheckbox?.isConnected) {
        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.tabIndex = -1;
        checkbox.className = Globals.getClassName('input') + ' ' +
            classNames.checkbox;
        checkbox.setAttribute(
            'aria-label',
            row.viewport.grid.options?.lang?.rowSelection?.selectRow ||
            'Select row'
        );

        this.selectionCheckbox = checkbox;
        this.htmlElement.prepend(checkbox);
    }

    const interactive = controller.selectsOnCheckboxClick();

    // With `trigger: 'row'` the checkbox is a state indicator, not a control.
    // `pointer-events: none` lets the click hit-test through to the cell, so
    // the checkbox behaves like any other part of the row instead of becoming
    // a dead spot, and the browser never flips it behind our back.
    this.selectionCheckbox.classList.toggle(
        classNames.checkboxReadonly,
        !interactive
    );

    // The row already carries `aria-selected`, so an inoperable checkbox is
    // noise for assistive technology.
    if (interactive) {
        this.selectionCheckbox.removeAttribute('aria-hidden');
    } else {
        this.selectionCheckbox.setAttribute('aria-hidden', 'true');
    }

    this.selectionCheckbox.checked = controller.isSelected(row.id);
}

/**
 * Returns whether the cell is the one that carries the selection checkbox.
 *
 * @param cell
 * The cell to test.
 *
 * @param controller
 * The row selection controller.
 */
function isCheckboxColumn(
    cell: TableCell,
    controller: RowSelectionController
): boolean {
    const columnId = controller.options.checkbox?.columnId;

    return columnId ?
        cell.column.id === columnId :
        cell.column.id === selectionColumnId;
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Grid' {
    export default interface Grid {
        rowSelection?: RowSelectionController;
    }
}

declare module '../../Core/Table/Body/TableCell' {
    export default interface TableCell {
        /**
         * The selection checkbox rendered in this cell, if any.
         */
        selectionCheckbox?: HTMLInputElement;
    }
}

declare module '../../Core/Options' {
    interface LangOptions {
        /**
         * Language options for row selection.
         */
        rowSelection?: {
            /**
             * The accessible label of the row selection checkbox.
             *
             * @default 'Select row'
             */
            selectRow?: string;
        };
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
