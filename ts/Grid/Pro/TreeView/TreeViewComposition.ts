/* *
 *
 *  Grid Tree View Composition
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

import type Grid from '../../Core/Grid';
import type TableCell from '../../Core/Table/Body/TableCell';
import type { TreeViewOptions } from './TreeViewTypes';

import Globals from '../../Core/Globals.js';
import TreeProjectionController from './TreeProjectionController.js';
import { addEvent, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

/**
 * Composes Grid Pro with TreeView projection infrastructure.
 *
 * @param GridClass
 * Grid class to extend.
 *
 * @param TableCellClass
 * TableCell class to extend.
 */
export function compose(
    GridClass: typeof Grid,
    TableCellClass: typeof TableCell
): void {
    if (!pushUnique(Globals.composed, 'TreeView')) {
        return;
    }

    addEvent(GridClass, 'beforeLoad', onBeforeLoad);
    addEvent(GridClass, 'beforeDestroy', onBeforeDestroy);
    addEvent(TableCellClass, 'afterRender', onAfterCellRender);
}

/**
 * Initializes TreeView projection infrastructure before first data querying.
 */
function onBeforeLoad(this: Grid): void {
    if (!this.treeProjectionController) {
        this.treeProjectionController =
            new TreeProjectionController(this);
    }
}

/**
 * Cleans up TreeView projection infrastructure on Grid destroy.
 *
 * @param e
 * Grid destroy event metadata.
 *
 * @param e.onlyDOM
 * Whether destroy is limited to DOM teardown before a re-render.
 */
function onBeforeDestroy(this: Grid, e: { onlyDOM?: boolean }): void {
    if (e.onlyDOM) {
        return;
    }

    this.treeProjectionController?.destroy();
    delete this.treeProjectionController;
}

/**
 * Decorates tree column cells with indentation and toggle control.
 */
function onAfterCellRender(this: TableCell): void {
    const grid = this.row.viewport.grid;
    const controller = grid.treeProjectionController;
    const options = controller?.getOptions();
    const projectionState = controller?.getProjectionState();

    if (!options || !projectionState) {
        return;
    }

    const treeColumn = (
        options.treeColumn ||
        this.row.viewport.columns[0]?.id
    );

    if (!treeColumn || this.column.id !== treeColumn) {
        return;
    }

    const rendererType = this.column.options.cells?.renderer?.type;
    if (rendererType && rendererType !== 'text') {
        return;
    }

    const rowId = (
        this.row.id ??
        projectionState.rowIds[this.row.index]
    );
    if (rowId === void 0) {
        return;
    }

    const rowState = projectionState.rowsById.get(rowId);
    if (!rowState) {
        return;
    }

    const cellElement = this.htmlElement;
    const wrapper = document.createElement('div');
    wrapper.className = Globals.classNamePrefix + 'tree-cell-wrapper';

    const toggleContainer = document.createElement('span');
    toggleContainer.className = (
        Globals.classNamePrefix + 'tree-toggle-container'
    );
    toggleContainer.style.setProperty(
        '--hcg-tree-depth',
        String(rowState.depth)
    );

    if (rowState.hasChildren) {
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = (
            Globals.getClassName('button') +
            ' ' +
            Globals.classNamePrefix +
            'tree-toggle-button'
        );
        toggleButton.textContent = rowState.isExpanded ? '▾' : '▸';
        toggleButton.setAttribute(
            'aria-label',
            rowState.isExpanded ? 'Collapse row' : 'Expand row'
        );
        toggleButton.setAttribute(
            'aria-expanded',
            rowState.isExpanded ? 'true' : 'false'
        );

        toggleButton.addEventListener('click', (event): void => {
            event.preventDefault();
            event.stopPropagation();

            const changed = controller?.toggleRow(rowId);
            if (!changed) {
                return;
            }

            grid.querying.shouldBeUpdated = true;
            grid.dirtyFlags.add('rows');
            void grid.redraw();
        });

        toggleContainer.appendChild(toggleButton);
    }

    const valueContainer = document.createElement('span');
    valueContainer.className = Globals.classNamePrefix + 'tree-value-container';

    while (cellElement.firstChild) {
        valueContainer.appendChild(cellElement.firstChild);
    }

    wrapper.appendChild(toggleContainer);
    wrapper.appendChild(valueContainer);
    cellElement.appendChild(wrapper);
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Grid' {
    export default interface Grid {
        treeProjectionController?: TreeProjectionController;
    }
}

declare module '../../Core/Data/LocalDataProvider' {
    interface LocalDataProviderOptions {
        /**
         * Tree view options for local provider (Grid Pro module).
         */
        treeView?: TreeViewOptions;
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
