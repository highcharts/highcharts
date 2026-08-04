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
import type Column from '../../Core/Table/Column';
import type HeaderCell from '../../Core/Table/Header/HeaderCell';
import type Options from '../../Core/Options';
import type Table from '../../Core/Table/Table';
import type { DeepPartial } from '../../../Shared/Types';
import type { RestoreCellFocusEvent } from '../../Core/Table/Table';
import type TableCell from '../../Core/Table/Body/TableCell';
import type {
    TableCellAfterDataMutationEvent,
    TableCellGetEditabilityEvent
} from '../../Core/Table/Body/TableCell';
import type { RowId } from '../../Core/Data/DataProvider';
import type {
    DeprecatedTreeViewOptions,
    RowGroupingOptions,
    TreeExpandedLevels,
    TreeViewColumnAggregatorOption,
    TreeViewColumnOptions,
    TreeViewOptions
} from './TreeViewTypes';
import type {
    NormalizedTreeInputOptions
} from './TreeViewOptionsNormalizer';
import type {
    AfterTreeRowToggleEvent,
    BeforeTreeRowToggleEvent
} from './Projection/TreeProjectionController';
import type TreeStickyRowController from './UI/TreeStickyRowController';

import Globals from '../../Core/Globals.js';
import TableRow from '../../Core/Table/Body/TableRow.js';
import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import { setHTMLContent } from '../../Core/GridUtils.js';
import TreeProjectionController from './Projection/TreeProjectionController.js';
import TreeViewValidation from './TreeViewValidation.js';
import { decorateTreeViewCell } from './UI/TreeViewCellDecorator.js';
import {
    createTreeToggleListeners,
    removeTreeToggleListeners,
    type TreeToggleListeners
} from './UI/TreeViewTableInteractions.js';
import {
    getTreeViewRowId,
    syncTreeViewRowId
} from './TreeViewRowResolver.js';
import { addEvent, merge, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

type TreeToggleScrollListener = () => void;
type TreeViewCompositionListeners = TreeToggleListeners & {
    scroll?: TreeToggleScrollListener;
};

/**
 * Language options for the row grouping feature.
 */
export interface RowGroupingLangOptions {
    /**
     * Header of the generated group column, used when the column has no header
     * options configured.
     *
     * @default 'Group'
     */
    columnHeader?: string;
}

/**
 * Default options for the tree view and row grouping features.
 */
export const defaultOptions: DeepPartial<Options> = {
    lang: {
        rowGrouping: {
            columnHeader: 'Group'
        }
    }
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
 *
 * @param HeaderCellClass
 * HeaderCell class to extend.
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table,
    TableCellClass: typeof TableCell,
    HeaderCellClass: typeof HeaderCell
): void {
    if (!pushUnique(Globals.composed, 'TreeView')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);
    TreeViewValidation.registerTreeViewValidationRules();

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
    addEvent(TableRow, 'afterUpdateAttributes', onRowAfterUpdateAttributes);
    addEvent(TableCellClass, 'getEditability', onCellGetEditability);
    addEvent(TableCellClass, 'afterDataMutation', onCellAfterDataMutation);
    addEvent(TableCellClass, 'afterRender', onAfterCellRender);
    addEvent(HeaderCellClass, 'afterRender', onAfterHeaderCellRender);
}

/**
 * Applies the default header of the generated row grouping column.
 *
 * @param e
 * Header cell render event payload.
 *
 * @param e.column
 * Rendered column, when the header cell is bound to one.
 */
function onAfterHeaderCellRender(
    this: HeaderCell,
    e: { column?: Column }
): void {
    const column = e.column;
    const headerContent = this.headerContent;

    if (!column || !headerContent) {
        return;
    }

    const grid = column.viewport.grid;
    const sourceColumnId = grid.columnPolicy.getColumnSourceId(column.id) ||
        column.id;
    const headerOptions = column.options.header;

    if (
        headerOptions?.format ||
        headerOptions?.formatter ||
        !grid.treeView?.isGroupingDisplayColumn(sourceColumnId)
    ) {
        return;
    }

    const columnHeader = grid.options?.lang?.rowGrouping?.columnHeader;

    if (columnHeader) {
        this.value = columnHeader;
        setHTMLContent(headerContent, columnHeader);
    }
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
        this.columnPolicy.setHiddenSourceColumnIds(
            controller.getHiddenSourceColumnIds()
        );
        TreeViewValidation.syncTreePathValidationRules(this);
        e.table = controller.projectTable(e.table);
        this.columnPolicy.setAvailableSourceColumnIds(e.table.getColumnIds());
    } catch (error) {
        this.columnPolicy.setHiddenSourceColumnIds();
        // eslint-disable-next-line no-console
        console.error((error as { message?: string }).message || error);
    }
}

/**
 * Vetoes editing for structural TreeView cells and cells currently derived
 * by TreeView aggregation.
 *
 * @param e
 * Editability event fired by the body cell.
 */
function onCellGetEditability(
    this: TableCell,
    e: TableCellGetEditabilityEvent
): void {
    const controller = this.row.viewport.grid.treeView;
    const sourceColumnId = this.row.viewport.grid.columnPolicy
        .getColumnSourceId(this.column.id) || this.column.id;
    const input = controller?.options?.input;
    const rowId = getTreeViewRowId(
        this.row,
        controller?.getProjectionState()
    );
    const isStructurallyReadonly = !!(
        controller?.isTreeSpecialColumn(sourceColumnId) &&
        !(
            input?.type === 'path' &&
            sourceColumnId === input.pathColumn
        )
    );

    if (
        isStructurallyReadonly ||
        controller?.isCellDerived(rowId, this.column.id) ||
        controller?.isGeneratedRow(rowId)
    ) {
        e.editable = false;
    }
}

/**
 * Returns whether a mutation of the source column affects TreeView structure.
 *
 * @param input
 * Resolved TreeView input options.
 *
 * @param sourceColumnId
 * Source column ID that has changed.
 */
function isTreeStructureMutation(
    input: NormalizedTreeInputOptions | undefined,
    sourceColumnId: string
): boolean {
    if (!input) {
        return false;
    }

    switch (input.type) {
        case 'path':
            return sourceColumnId === input.pathColumn;
        case 'parentId':
            return sourceColumnId === input.parentIdColumn;
        case 'grouping':
            return input.groupBy.indexOf(sourceColumnId) !== -1;
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
    const mutatesTreeStructure = isTreeStructureMutation(
        controller?.options?.input,
        e.sourceColumnId
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
    this.afterUpdateRowsHooks.push((): Promise<void> => {
        const stickyRowController = this.treeStickyRowController;

        if (!stickyRowController) {
            return Promise.resolve();
        }

        return stickyRowController.refreshNow(true, true);
    });
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
 * Synchronizes rendered row IDs with the active TreeView projection.
 */
function onRowAfterUpdateAttributes(
    this: TableRow
): void {
    syncTreeViewRowId(
        this,
        this.viewport.grid.treeView?.getProjectionState()
    );
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
         * @deprecated 3.1.0
         * @deprnote Use the root level `treeView` and `rowGrouping` instead.
         */
        treeView?: DeprecatedTreeViewOptions;
    }
}

declare module '../../Core/Options' {
    interface Options {
        /**
         * Tree view options, turning hierarchical data into expandable parent
         * and child rows.
         *
         * @sample grid-pro/tree-view/parent-id Parent ID tree input
         * @sample grid-pro/tree-view/input-path Path tree input
         */
        treeView?: TreeViewOptions;

        /**
         * Row grouping options, turning repeated values of the selected
         * columns into expandable group rows.
         *
         * @sample grid-pro/options/row-grouping Row grouping
         */
        rowGrouping?: RowGroupingOptions;
    }

    interface RowsSettings {
        /**
         * Number of tree levels expanded initially, or `'all'` to expand every
         * level. A row is initially expanded when its depth is lower than the
         * configured number of levels, or when its ID is listed in
         * `expandedRowIds`.
         *
         * Applies to `treeView` and `rowGrouping`.
         *
         * @default 0
         */
        expandedLevels?: TreeExpandedLevels;

        /**
         * Explicit set of row IDs expanded initially, in addition to the rows
         * expanded by `expandedLevels`.
         *
         * Applies to `treeView` and `rowGrouping`.
         *
         * @default []
         */
        expandedRowIds?: RowId[];

        /**
         * Enables sticky parent rows.
         *
         * Applies to `treeView` and `rowGrouping`.
         *
         * @sample grid-pro/tree-view/sticky-parents Sticky parents
         * @default true
         */
        stickyParents?: boolean;
    }

    interface ColumnOptions {
        /**
         * Aggregator used for parent rows of the projected tree, in the
         * `treeView` and `rowGrouping` features.
         *
         * When provided as a string, the function is applied to every row that
         * has children in the projected tree, overriding the row's source
         * value. Structural columns such as `data.idColumn`,
         * `treeView.input.pathColumn`, `treeView.input.parentIdColumn`, and
         * `rowGrouping.groupBy` columns never aggregate, even if configured.
         *
         * When provided as a callback, it is invoked for matching parent rows
         * and should return a registered Formula processor function name, or a
         * falsy value to skip aggregation for the current row.
         *
         * @sample grid-pro/tree-view/data-aggregation TreeView data aggregation
         * @sample grid-pro/options/row-grouping Row grouping
         */
        aggregator?: TreeViewColumnAggregatorOption;

        /**
         * TreeView options for a single column.
         *
         * @deprecated 3.1.0
         * @deprnote Use the column level `aggregator` option instead.
         */
        treeView?: TreeViewColumnOptions;
    }

    interface LangOptions {
        /**
         * Language options for the row grouping feature.
         */
        rowGrouping?: RowGroupingLangOptions;
    }
}


/* *
 *
 *  Default export
 *
 * */

export default {
    compose,
    defaultOptions
} as const;
