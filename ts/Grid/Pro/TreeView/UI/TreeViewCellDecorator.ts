/* *
 *
 *  Grid Tree View Cell Decorator
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

import type TableCell from '../../../Core/Table/Body/TableCell';
import type { ResolvedTreeViewOptions } from '../TreeViewOptionsNormalizer';

import Globals from '../../../Core/Globals.js';
import TreeViewGlobals from '../TreeViewGlobals.js';
import { createGridIcon } from '../../../Core/UI/SvgIcons.js';
import { getLastPathSegment } from '../TreeViewCommons.js';
import { getTreeViewCellContext } from './TreeViewCellContext.js';
import { defined } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

/**
 * Resolves the display value for a path-based tree column cell.
 *
 * @param value
 * Raw cell value.
 *
 * @param columnId
 * Rendered column ID.
 *
 * @param options
 * Resolved TreeView options.
 *
 * @returns
 * Display value override for the path column.
 */
function getPathSegmentDisplayValue(
    value: unknown,
    columnId: string,
    options: ResolvedTreeViewOptions
): string | undefined {
    const input = options.input;

    if (
        input.type !== 'path' ||
        input.showFullPath ||
        columnId !== input.pathColumn ||
        typeof value !== 'string'
    ) {
        return;
    }

    return getLastPathSegment(value, input.separator);
}

/**
 * Flags aggregated cells and decorates rendered tree cells.
 *
 * @param cell
 * Rendered table cell.
 *
 * @param toggleAttribute
 * Attribute used to mark the toggle button for delegated listeners.
 */
export function decorateTreeViewCell(
    cell: TableCell,
    toggleAttribute: string
): void {
    const context = getTreeViewCellContext(cell);
    const rowElement = cell.row.htmlElement;
    const rowState = context?.rowState;
    const hasChildren = rowState?.hasChildren === true;
    const isExpanded = rowState?.isExpanded === true;

    rowElement.classList.toggle(
        TreeViewGlobals.classNames.rowTree,
        !!context
    );
    rowElement.classList.toggle(
        TreeViewGlobals.classNames.rowExpanded,
        hasChildren && isExpanded
    );
    rowElement.classList.toggle(
        TreeViewGlobals.classNames.rowCollapsed,
        hasChildren && !isExpanded
    );

    cell.htmlElement.classList.toggle(
        TreeViewGlobals.classNames.cellTree,
        !!context?.isTreeColumnCell
    );

    if (rowState) {
        rowElement.style.setProperty(
            TreeViewGlobals.cssVariables.depth,
            rowState.depth.toFixed()
        );
    } else {
        rowElement.style.removeProperty(TreeViewGlobals.cssVariables.depth);
    }

    cell.htmlElement.classList.toggle(
        TreeViewGlobals.classNames.cellAggregated,
        !!context?.controller.isCellDerived(context.rowId, cell.column.id)
    );

    if (!context?.isTreeColumnCell || !rowState) {
        return;
    }

    const { options } = context;
    const grid = cell.row.viewport.grid;

    const rendererType = cell.column.options.cells?.renderer?.type;
    if (rendererType && rendererType !== 'text') {
        return;
    }

    const cellElement = cell.htmlElement;
    const wrapper = document.createElement('div');
    wrapper.className = TreeViewGlobals.classNames.disclosure;

    const toggleContainer = document.createElement('span');
    toggleContainer.className = TreeViewGlobals.classNames.disclosureToggle;

    if (rowState.hasChildren) {
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = Globals.getClassName('icon');
        toggleButton.setAttribute(
            'aria-label',
            rowState.isExpanded ? 'Collapse row' : 'Expand row'
        );
        toggleButton.setAttribute(
            'aria-expanded',
            rowState.isExpanded ? 'true' : 'false'
        );
        toggleButton.setAttribute('tabindex', '-1');
        toggleButton.setAttribute(toggleAttribute, '');

        const toggleIcon = createGridIcon(
            'chevronRight',
            grid.options?.rendering?.icons
        );
        toggleIcon.classList.add(TreeViewGlobals.classNames.disclosureIcon);
        toggleIcon.setAttribute('aria-hidden', 'true');
        toggleButton.appendChild(toggleIcon);

        toggleContainer.appendChild(toggleButton);
    }

    const valueContainer = document.createElement('span');
    valueContainer.className = TreeViewGlobals.classNames.disclosureValue;

    const pathDisplayValue = getPathSegmentDisplayValue(
        cell.value,
        cell.column.id,
        options
    );

    if (
        !defined(cell.column.options.cells?.format) &&
        !defined(cell.column.options.cells?.formatter) &&
        defined(pathDisplayValue)
    ) {
        cellElement.textContent = '';
        valueContainer.textContent = pathDisplayValue;
    } else {
        while (cellElement.firstChild) {
            valueContainer.appendChild(cellElement.firstChild);
        }
    }

    wrapper.appendChild(toggleContainer);
    wrapper.appendChild(valueContainer);
    cellElement.appendChild(wrapper);
}
