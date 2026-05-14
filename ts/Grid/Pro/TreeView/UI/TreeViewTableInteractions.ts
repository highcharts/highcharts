/* *
 *
 *  Grid Tree View Table Interactions
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { RowId } from '../../../Core/Data/DataProvider';
import type Table from '../../../Core/Table/Table';
import type TableRow from '../../../Core/Table/Body/TableRow';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type TreeProjectionController from '../Projection/TreeProjectionController';
import type { TreeRowToggleTriggerEvent } from '../Projection/TreeProjectionController';

import TreeStickyRowController from './TreeStickyRowController.js';
import { waitForAnimationFrame } from '../../../Core/GridUtils.js';


/* *
 *
 *  Declarations
 *
 * */

type TreeToggleClickListener = (event: MouseEvent) => void;
type TreeToggleDblClickListener = (event: MouseEvent) => void;
type TreeToggleMouseDownListener = (event: MouseEvent) => void;
type TreeToggleKeyDownListener = (event: KeyboardEvent) => void;
type TreeToggleWheelListener = (event: WheelEvent) => void;

type TreeToggleContext = {
    cell: TableCell;
    controller: TreeProjectionController;
    isExpanded: boolean;
    rowId: RowId;
};

type TreeToggleAnchor = {
    top: number;
};

export type TreeToggleListeners = {
    click: TreeToggleClickListener;
    dblClick: TreeToggleDblClickListener;
    mouseDown: TreeToggleMouseDownListener;
    keyDown: TreeToggleKeyDownListener;
    stickyBody: HTMLElement;
    wheel: TreeToggleWheelListener;
};


/* *
 *
 *  Functions
 *
 * */

/**
 * Focuses a rendered row in a way that preserves viewport scroll behavior.
 *
 * @param table
 * Table viewport handling the event.
 *
 * @param row
 * Target row.
 *
 * @param columnIndex
 * Target column index.
 */
function focusRenderedRow(
    table: Table,
    row: TableRow | undefined,
    columnIndex: number
): boolean {
    if (!row) {
        return false;
    }

    if (row.htmlElement.parentElement === table.tbodyElement) {
        table.focusCellByRowIndex(row.index, columnIndex);
    } else {
        row.cells[columnIndex]?.htmlElement.focus({
            preventScroll: true
        });
    }

    return true;
}

/**
 * Handles tree-aware keyboard navigation for body and sticky rows.
 *
 * @param table
 * Table viewport handling the event.
 *
 * @param cell
 * Focused cell.
 *
 * @param event
 * Keyboard event to handle.
 */
function handleTreeBodyNavigation(
    table: Table,
    cell: TableCell,
    event: KeyboardEvent
): boolean {
    const { column, row } = cell;
    const { header } = table;
    const changeFocusKeys: Record<string, [number, number]> = {
        ArrowDown: [1, 0],
        ArrowUp: [-1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1]
    };
    const dir = changeFocusKeys[event.key];

    if (!dir) {
        return false;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const nextColumnIndex = column.index + dir[1];

    if (!dir[0]) {
        row.cells[nextColumnIndex]?.htmlElement.focus({
            preventScroll: true
        });
        return true;
    }

    const renderedRows = table.getRenderedRows();
    const renderedRowIndex = renderedRows.indexOf(row);
    const nextRenderedRow = renderedRows[renderedRowIndex + dir[0]];
    const isViewportBodyRow = row.htmlElement.parentElement ===
        table.tbodyElement;
    const nextRowIndex = row.index + dir[0];

    if (renderedRowIndex > -1) {
        if (
            !isViewportBodyRow ||
            nextRowIndex < 0 ||
            nextRowIndex >= table.rowsVirtualizer.rowCount
        ) {
            if (focusRenderedRow(table, nextRenderedRow, nextColumnIndex)) {
                return true;
            }
        }
    }

    if (nextRowIndex < 0 && header) {
        const extraRowIdx = header.rows.length + nextRowIndex;

        if (extraRowIdx + 1 > header.levels) {
            header.rows[extraRowIdx]
                .cells[nextColumnIndex]?.htmlElement.focus();
        } else {
            table.columns[nextColumnIndex]
                ?.header?.htmlElement.focus();
        }

        return true;
    }

    const stickyRowController = table.treeStickyRowController;
    if (stickyRowController) {
        stickyRowController.focusCellByRowIndex(nextRowIndex, nextColumnIndex);
    } else {
        table.focusCellByRowIndex(nextRowIndex, nextColumnIndex);
    }

    return true;
}

/**
 * Returns tree-toggle context for an element within a tree cell.
 *
 * @param table
 * Table viewport handling the tree cell.
 *
 * @param element
 * Element within the tree cell or toggle button.
 */
function getTreeToggleContext(
    table: Table,
    element: Element
): TreeToggleContext | undefined {
    const cell = table.treeStickyRowController?.getCellFromElement(element) ||
        (table.getCellFromElement(element) as TableCell | undefined);
    if (!cell) {
        return;
    }

    const controller = cell.row.viewport.grid.treeView;
    const options = controller?.options;
    const projectionState = controller?.getProjectionState();
    const treeColumn = options?.treeColumn || cell.row.viewport.columns[0]?.id;

    if (!controller || !projectionState || !treeColumn) {
        return;
    }

    if (cell.column.id !== treeColumn) {
        return;
    }

    const rowId = cell.row.id ?? projectionState.rowIds[cell.row.index];
    const rowState = rowId !== void 0 ?
        projectionState.rowsById.get(rowId) :
        void 0;

    if (rowId === void 0 || !rowState?.hasChildren) {
        return;
    }

    return {
        cell,
        controller,
        isExpanded: rowState.isExpanded,
        rowId
    };
}

/**
 * Returns whether the event target is a focusable tree column cell with a
 * toggleable row.
 *
 * @param table
 * Table viewport handling the keydown event.
 *
 * @param event
 * Keyboard event originating from a table cell.
 */
function getTreeToggleContextFromKeyboardEvent(
    table: Table,
    event: KeyboardEvent
): TreeToggleContext | undefined {
    if (!(event.target instanceof HTMLTableCellElement)) {
        return;
    }

    return getTreeToggleContext(table, event.target);
}

/**
 * Restores focus to the tree cell after a redraw caused by toggle.
 *
 * @param context
 * Tree-toggle context captured before the redraw.
 */
function restoreTreeCellFocus(
    context: TreeToggleContext
): void {
    const columnIndex = context.cell.column.index;
    const viewport = context.cell.row.viewport;
    const restoredCell = (
        viewport.treeStickyRowController?.getRenderedRow(context.rowId) ||
        viewport.getRow(context.rowId)
    )?.cells[columnIndex];

    if (restoredCell) {
        restoredCell.htmlElement.focus({
            preventScroll: true
        });
        return;
    }

    const rowIndex = context.controller
        .getProjectionState()
        ?.rowIds.indexOf(context.rowId);

    if (typeof rowIndex === 'number' && rowIndex > -1) {
        const stickyRowController = viewport.treeStickyRowController;
        if (stickyRowController) {
            stickyRowController.focusCellByRowIndex(rowIndex, columnIndex);
        } else {
            viewport.focusCellByRowIndex(rowIndex, columnIndex);
        }
    }
}

/**
 * Captures the current visual anchor for a collapsing tree row.
 *
 * @param context
 * Tree-toggle context captured from the current DOM cell.
 */
function captureTreeToggleAnchor(
    context: TreeToggleContext
): TreeToggleAnchor | undefined {
    if (!context.isExpanded) {
        return;
    }

    const rowElement = context.cell.htmlElement.parentElement;

    if (!(rowElement instanceof HTMLTableRowElement)) {
        return;
    }

    return {
        top: rowElement.getBoundingClientRect().top
    };
}

/**
 * Restores the collapsed tree row to its previous visual anchor position.
 *
 * @param context
 * Tree-toggle context captured from the current DOM cell.
 *
 * @param anchor
 * Previously captured anchor position.
 */
async function restoreTreeToggleAnchor(
    context: TreeToggleContext,
    anchor?: TreeToggleAnchor
): Promise<void> {
    if (!anchor) {
        return;
    }

    const viewport = context.cell.row.viewport;
    const renderedRow = (
        viewport.treeStickyRowController?.getRenderedRow(context.rowId) ||
        viewport.getRow(context.rowId)
    );

    if (!renderedRow?.htmlElement.isConnected) {
        return;
    }

    const tbody = viewport.tbodyElement;
    const delta = renderedRow.htmlElement.getBoundingClientRect().top -
        anchor.top;

    if (Math.abs(delta) < 1) {
        return;
    }

    const nextScrollTop = Math.max(
        0,
        Math.min(
            tbody.scrollTop + delta,
            Math.max(tbody.scrollHeight - tbody.clientHeight, 0)
        )
    );

    if (nextScrollTop === tbody.scrollTop) {
        return;
    }

    tbody.scrollTop = nextScrollTop;

    if (viewport.virtualRows) {
        viewport.rowsVirtualizer.scroll();
    }

    viewport.treeStickyRowController?.handleScroll();
    await waitForAnimationFrame();
}

/**
 * Converts wheel delta to CSS pixels.
 *
 * @param event
 * Wheel event raised over the sticky overlay.
 *
 * @param viewportSize
 * The relevant viewport size for page-based deltas.
 *
 * @param lineSize
 * Pixel size used for line-based deltas.
 */
function normalizeWheelDelta(
    event: WheelEvent,
    viewportSize: number,
    lineSize: number
): [number, number] {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        return [
            event.deltaX * lineSize,
            event.deltaY * lineSize
        ];
    }

    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return [
            event.deltaX * viewportSize,
            event.deltaY * viewportSize
        ];
    }

    return [event.deltaX, event.deltaY];
}

/**
 * Toggles tree row and restores focus when redraw replaces the DOM cell.
 *
 * @param context
 * Tree-toggle context captured from the current DOM cell.
 *
 * @param originalEvent
 * Browser event that initiated the toggle.
 */
async function toggleTreeRow(
    context: TreeToggleContext,
    originalEvent?: TreeRowToggleTriggerEvent
): Promise<void> {
    const anchor = captureTreeToggleAnchor(context);
    const changed = await context.controller.toggleRow(
        context.rowId,
        true,
        originalEvent
    );

    if (changed) {
        await waitForAnimationFrame();
        await restoreTreeToggleAnchor(context, anchor);
        restoreTreeCellFocus(context);
    }
}

/**
 * Creates and attaches delegated listeners for tree toggle buttons and
 * keyboard shortcuts.
 *
 * @param table
 * Table viewport instance.
 *
 * @param toggleAttribute
 * Attribute used to identify toggle buttons.
 *
 * @returns
 * Attached listener references.
 */
export function createTreeToggleListeners(
    table: Table,
    toggleAttribute: string
): TreeToggleListeners {
    const treeToggleSelector = '[' + toggleAttribute + ']';
    const stickyRowController = new TreeStickyRowController(table);
    table.treeStickyRowController = stickyRowController;
    const stickyBody = stickyRowController.getStickyBodyElement();

    const clickListener = (event: MouseEvent): void => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const toggleButton = event.target.closest(treeToggleSelector);
        if (
            toggleButton &&
            stickyRowController.containsElement(toggleButton)
        ) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const context = getTreeToggleContext(table, toggleButton);
            if (!context) {
                return;
            }

            void toggleTreeRow(context, event);
            return;
        }

        if (event.currentTarget === stickyBody) {
            stickyRowController.getCellFromElement(event.target)?.onClick();
        }
    };

    const dblClickListener = (event: MouseEvent): void => {
        if (!(event.target instanceof Element)) {
            return;
        }

        if (event.target.closest(treeToggleSelector)) {
            return;
        }

        const context = getTreeToggleContext(table, event.target);
        if (!context) {
            if (event.currentTarget === stickyBody) {
                const cell = stickyRowController.getCellFromElement(
                    event.target
                );
                if (cell && 'onDblClick' in cell) {
                    (
                        cell as unknown as { onDblClick(e: MouseEvent): void }
                    ).onDblClick(event);
                }
            }
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        context.cell.htmlElement.focus();

        void toggleTreeRow(context, event);
    };

    const mouseDownListener = (event: MouseEvent): void => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const toggleButton = event.target.closest(treeToggleSelector);
        if (
            toggleButton &&
            stickyRowController.containsElement(toggleButton)
        ) {
            const context = getTreeToggleContext(table, toggleButton);
            if (!context) {
                return;
            }

            event.preventDefault();
            context.cell.htmlElement.focus();
            return;
        }

        if (event.currentTarget === stickyBody) {
            const cell = stickyRowController.getCellFromElement(event.target);
            if (cell && 'onMouseDown' in cell) {
                (
                    cell as unknown as { onMouseDown(e: MouseEvent): void }
                ).onMouseDown(event);
            }
        }
    };

    const keyDownListener = (event: KeyboardEvent): void => {
        const cell = stickyRowController.getCellFromElement(event.target);

        if (
            (
                event.key === 'Enter' ||
                event.key === ' ' ||
                event.key === 'Spacebar'
            ) &&
            cell
        ) {
            const context = getTreeToggleContextFromKeyboardEvent(table, event);
            if (context) {
                event.preventDefault();
                event.stopImmediatePropagation();

                void toggleTreeRow(context, event);
                return;
            }
        }

        if (!cell) {
            return;
        }

        if (handleTreeBodyNavigation(table, cell, event)) {
            return;
        }

        if (
            event.currentTarget === stickyBody &&
            event.key === 'Enter'
        ) {
            event.preventDefault();
            event.stopImmediatePropagation();
            cell.onClick();
        }
    };

    const wheelListener = (event: WheelEvent): void => {
        if (event.ctrlKey) {
            return;
        }

        const tbody = table.tbodyElement;
        const [deltaX, deltaY] = normalizeWheelDelta(
            event,
            tbody.clientHeight,
            table.rowsVirtualizer.defaultRowHeight
        );
        const maxScrollTop = Math.max(
            tbody.scrollHeight - tbody.clientHeight,
            0
        );
        const maxScrollLeft = Math.max(
            tbody.scrollWidth - tbody.clientWidth,
            0
        );
        const nextScrollTop = Math.max(
            0,
            Math.min(tbody.scrollTop + deltaY, maxScrollTop)
        );
        const nextScrollLeft = Math.max(
            0,
            Math.min(tbody.scrollLeft + deltaX, maxScrollLeft)
        );

        if (
            nextScrollTop === tbody.scrollTop &&
            nextScrollLeft === tbody.scrollLeft
        ) {
            return;
        }

        event.preventDefault();
        tbody.scrollTop = nextScrollTop;
        tbody.scrollLeft = nextScrollLeft;
    };

    table.tbodyElement.addEventListener('click', clickListener);
    table.tbodyElement.addEventListener('dblclick', dblClickListener);
    table.tbodyElement.addEventListener('mousedown', mouseDownListener);
    table.tbodyElement.addEventListener('keydown', keyDownListener);
    stickyBody.addEventListener('click', clickListener);
    stickyBody.addEventListener('dblclick', dblClickListener);
    stickyBody.addEventListener('mousedown', mouseDownListener);
    stickyBody.addEventListener('keydown', keyDownListener);
    stickyBody.addEventListener('wheel', wheelListener, {
        passive: false
    });

    return {
        click: clickListener,
        dblClick: dblClickListener,
        keyDown: keyDownListener,
        mouseDown: mouseDownListener,
        stickyBody,
        wheel: wheelListener
    };
}

/**
 * Removes delegated tree toggle listeners and destroys sticky row state.
 *
 * @param table
 * Table viewport instance.
 *
 * @param listeners
 * Attached listener references.
 */
export function removeTreeToggleListeners(
    table: Table,
    listeners: TreeToggleListeners
): void {
    table.tbodyElement.removeEventListener('click', listeners.click);
    table.tbodyElement.removeEventListener('dblclick', listeners.dblClick);
    table.tbodyElement.removeEventListener('mousedown', listeners.mouseDown);
    table.tbodyElement.removeEventListener('keydown', listeners.keyDown);
    listeners.stickyBody.removeEventListener('click', listeners.click);
    listeners.stickyBody.removeEventListener('dblclick', listeners.dblClick);
    listeners.stickyBody.removeEventListener('mousedown', listeners.mouseDown);
    listeners.stickyBody.removeEventListener('keydown', listeners.keyDown);
    listeners.stickyBody.removeEventListener('wheel', listeners.wheel);

    table.treeStickyRowController?.destroy();
    delete table.treeStickyRowController;
}
