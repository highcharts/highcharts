/* *
 *
 *  Grid Tree View Composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

import type DataTable from '../../../Data/DataTable';
import type Grid from '../../Core/Grid';
import type Table from '../../Core/Table/Table';
import type { RestoreCellFocusEvent } from '../../Core/Table/Table';
import type TableCell from '../../Core/Table/Body/TableCell';
import type {
    TableCellAfterDataMutationEvent,
    TableCellGetEditabilityEvent
} from '../../Core/Table/Body/TableCell';
import type {
    TreeViewColumnOptions,
    TreeViewOptions
} from './TreeViewTypes';
import type {
    AfterTreeRowToggleEvent,
    BeforeTreeRowToggleEvent
} from './Projection/TreeProjectionController';
import type TreeStickyRowController from './UI/TreeStickyRowController';

import Globals from '../../Core/Globals.js';
import TreeProjectionController from './Projection/TreeProjectionController.js';
import { decorateTreeViewCell } from './UI/TreeViewCellDecorator.js';
import {
    createTreeToggleListeners,
    removeTreeToggleListeners,
    type TreeToggleListeners
} from './UI/TreeViewTableInteractions.js';
import { addEvent, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

type TreeToggleScrollListener = () => void;
type TreeViewCompositionListeners = TreeToggleListeners & {
    scroll?: TreeToggleScrollListener;
};

const treeToggleAttribute = 'data-hcg-tree-toggle';
const treeToggleListeners = new WeakMap<Table, TreeViewCompositionListeners>();

/**
 * Composes Grid Pro with TreeView projection infrastructure.
 *
 * @param GridClass
 * Grid class to extend.
 *
 * @param TableClass
 * Table class to extend.
 *
 * @param TableCellClass
 * TableCell class to extend.
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table,
    TableCellClass: typeof TableCell
): void {
    if (!pushUnique(Globals.composed, 'TreeView')) {
        return;
    }

    addEvent(GridClass, 'beforeLoad', onBeforeLoad);
    addEvent(GridClass, 'afterLoad', onAfterLoad);
    addEvent(GridClass, 'beforeDestroy', onBeforeDestroy);
    addEvent(GridClass, 'afterRedraw', onAfterRedraw);
    addEvent(GridClass, 'beforeTreeRowToggle', onBeforeTreeRowToggle);
    addEvent(GridClass, 'afterTreeRowToggle', onAfterTreeRowToggle);
    addEvent(
        GridClass,
        'projectPresentationTable',
        onProjectPresentationTable
    );
    addEvent(TableClass, 'beforeInit', onTableBeforeInit);
    addEvent(TableClass, 'afterInit', onTableAfterInit);
    addEvent(TableClass, 'afterReflow', onTableAfterReflow);
    addEvent(
        TableClass,
        'beforeRestoreCellFocus',
        onTableBeforeRestoreCellFocus
    );
    addEvent(TableClass, 'getViewportTopInset', onTableGetViewportTopInset);
    addEvent(TableClass, 'afterDestroy', onTableAfterDestroy);
    addEvent(TableCellClass, 'getEditability', onCellGetEditability);
    addEvent(TableCellClass, 'afterDataMutation', onCellAfterDataMutation);
    addEvent(TableCellClass, 'afterRender', onAfterCellRender);
}

/**
 * Prevents viewport body focus restoration when the target cell is already
 * focused in the sticky overlay.
 *
 * @param event
 * Focus restoration event emitted by the viewport.
 */
function onTableBeforeRestoreCellFocus(
    this: Table,
    event: RestoreCellFocusEvent
): void {
    const stickyCell = this.treeStickyRowController?.getRenderedStickyCell(
        event.rowIndex,
        event.columnIndex
    );

    if (stickyCell?.htmlElement === document.activeElement) {
        event.preventDefault?.();
    }
}

/**
 * Initializes TreeView projection infrastructure before first data querying.
 */
function onBeforeLoad(this: Grid): void {
    if (!this.treeView) {
        this.treeView = new TreeProjectionController(this);
    }
}

/**
 * Schedules sticky parent row refresh after initial render.
 */
function onAfterLoad(this: Grid): void {
    this.viewport?.treeStickyRowController?.scheduleRefresh(false, true);
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

    this.treeView?.destroy();
    delete this.treeView;
}

/**
 * Runs grid callback before a tree row toggle.
 *
 * @param e
 * Tree row toggle event payload.
 */
function onBeforeTreeRowToggle(
    this: Grid,
    e: BeforeTreeRowToggleEvent
): void {
    this.options?.events?.beforeTreeRowToggle?.call(this, e);
}

/**
 * Runs grid callback after a tree row toggle.
 *
 * @param e
 * Tree row toggle event payload.
 */
function onAfterTreeRowToggle(
    this: Grid,
    e: AfterTreeRowToggleEvent
): void {
    this.options?.events?.afterTreeRowToggle?.call(this, e);
}

/**
 * Schedules sticky parent row refresh after grid redraws.
 */
function onAfterRedraw(this: Grid): void {
    this.viewport?.treeStickyRowController?.scheduleRefresh(true, true);
}

/**
 * Projects the queried table through TreeView before pagination.
 *
 * @param e
 * Presentation table event fired after sort/filter and before pagination.
 *
 * @param e.table
 * Queried table after filter/sort and before pagination.
 */
function onProjectPresentationTable(
    this: Grid,
    e: {
        table: DataTable;
    }
): void {
    const controller = this.treeView;
    if (!controller) {
        return;
    }

    try {
        controller.sync();
        e.table = controller.projectTable(e.table);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error((error as { message?: string }).message || error);
    }
}

/**
 * Vetoes editing for cells currently derived by TreeView aggregation.
 *
 * @param e
 * Editability event fired by the body cell.
 */
function onCellGetEditability(
    this: TableCell,
    e: TableCellGetEditabilityEvent
): void {
    const controller = this.row.viewport.grid.treeView;
    const rowId = this.row.id ?? controller?.getProjectionState()
        ?.rowIds[this.row.index];

    if (
        controller?.isCellDerived(rowId, this.column.id) ||
        controller?.isGeneratedRow(rowId)
    ) {
        e.editable = false;
    }
}

/**
 * Requests a full row refresh when a TreeView aggregate source changes.
 *
 * @param e
 * Data mutation event fired after a cell writes to the data provider.
 */
function onCellAfterDataMutation(
    this: TableCell,
    e: TableCellAfterDataMutationEvent
): void {
    const controller = this.row.viewport.grid.treeView;
    const input = controller?.options?.input;
    const mutatesTreeStructure = !!(
        input && (
            (
                input.type === 'path' &&
                e.sourceColumnId === input.pathColumn
            ) || (
                input.type === 'parentId' &&
                e.sourceColumnId === input.parentIdColumn
            )
        )
    );

    if (
        controller?.hasColumnAggregation(e.sourceColumnId) ||
        mutatesTreeStructure
    ) {
        this.row.viewport.grid.querying.shouldBeUpdated = true;
        e.requiresFullRowsUpdate = true;
    }
}

/**
 * Adds delegated listeners for tree toggle buttons and keyboard shortcuts.
 */
function onTableBeforeInit(this: Table): void {
    treeToggleListeners.set(
        this,
        createTreeToggleListeners(this, treeToggleAttribute)
    );
}

/**
 * Adds scroll listener for sticky parent row positioning after the table is
 * fully initialized.
 */
function onTableAfterInit(this: Table): void {
    const listeners = treeToggleListeners.get(this);
    if (!listeners) {
        return;
    }

    const scrollListener = (): void => {
        this.treeStickyRowController?.handleScroll();
    };

    this.tbodyElement.addEventListener('scroll', scrollListener);
    listeners.scroll = scrollListener;

    this.treeStickyRowController?.scheduleRefresh(false, true);
}

/**
 * Repositions sticky parent rows after table reflow.
 */
function onTableAfterReflow(this: Table): void {
    this.treeStickyRowController?.scheduleRefresh(false, true);
}

/**
 * Extends the visible viewport inset by the current sticky tree stack height.
 *
 * @param e
 * Event payload with the current top inset.
 *
 * @param e.top
 * Current top inset reserved by composed table features.
 */
function onTableGetViewportTopInset(
    this: Table,
    e: { top: number }
): void {
    e.top = Math.max(
        e.top,
        this.treeStickyRowController?.getStickyRowsHeight() || 0
    );
}

/**
 * Removes delegated tree interaction listeners and sticky row state.
 */
function onTableAfterDestroy(this: Table): void {
    const listeners = treeToggleListeners.get(this);
    if (!listeners) {
        return;
    }

    removeTreeToggleListeners(this, listeners);

    if (listeners.scroll) {
        this.tbodyElement.removeEventListener('scroll', listeners.scroll);
    }

    treeToggleListeners.delete(this);
}

/**
 * Flags aggregated TreeView cells and decorates tree column cells.
 */
function onAfterCellRender(this: TableCell): void {
    decorateTreeViewCell(this, treeToggleAttribute);
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Grid' {
    export default interface Grid {
        treeView?: TreeProjectionController;
    }

    interface RowMetaRecord {
        /**
         * Explicit expansion state override for the row.
         */
        expanded?: boolean;
    }
}

declare module '../../Core/Table/Table' {
    export default interface Table {
        treeStickyRowController?: TreeStickyRowController;
    }
}

declare module '../GridEvents' {
    interface GridEvents {
        /**
         * Callback function to be called before a tree row is toggled.
         *
         * Call `event.preventDefault()` to cancel the toggle.
         */
        beforeTreeRowToggle?: (e: BeforeTreeRowToggleEvent) => void;

        /**
         * Callback function to be called after a tree row is toggled.
         */
        afterTreeRowToggle?: (e: AfterTreeRowToggleEvent) => void;
    }
}

declare module '../../Core/Data/LocalDataProvider' {
    interface LocalDataProviderOptions {
        /**
         * Tree view options for local provider (Grid Pro module).
         *
         * @sample grid-pro/tree-view/parent-id Parent ID tree input
         * @sample grid-pro/tree-view/input-path Path tree input
         */
        treeView?: TreeViewOptions;
    }
}

declare module '../../Core/Options' {
    interface ColumnOptions {
        /**
         * TreeView options for a single column.
         */
        treeView?: TreeViewColumnOptions;
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
