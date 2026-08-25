/* *
 *
 *  Grid Row Selection controller
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
import type TableRow from '../../Core/Table/Body/TableRow';
import type { RowId } from '../../Core/Data/DataProvider';
import type {
    RowSelectionChangeEvent,
    RowSelectionClickBehavior,
    RowSelectionMode,
    RowSelectionOptions,
    RowSelectionTrigger
} from './RowSelectionOptions';

import { classNames } from './RowSelectionGlobals.js';
import { fireEvent, splat } from '../../../Shared/Utilities.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Holds and mutates the set of selected rows of a grid.
 */
class RowSelectionController {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The grid the controller belongs to.
     */
    public readonly grid: Grid;

    /**
     * The ids of the selected rows, in selection order.
     */
    private readonly selected = new Set<RowId>();

    /**
     * The row a `Shift`-click selects a range from, with its presentation
     * index as captured at click time.
     */
    private anchor?: { rowId: RowId; index: number };

    /**
     * Counter identifying the current gesture, used to discard a range whose
     * row ids resolved after a later click.
     */
    private gesture = 0;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs the row selection controller.
     *
     * @param grid
     * The grid the controller belongs to.
     */
    constructor(grid: Grid) {
        this.grid = grid;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns the resolved row selection options.
     */
    public get options(): RowSelectionOptions {
        return this.grid.options?.rowSelection || {};
    }

    /**
     * Returns whether row selection is enabled.
     */
    public isEnabled(): boolean {
        return this.options.enabled === true;
    }

    /**
     * Returns the selection mode.
     */
    public get mode(): RowSelectionMode {
        return this.options.mode || 'single';
    }

    /**
     * Returns which interactions select a row.
     */
    public get trigger(): RowSelectionTrigger {
        return this.options.trigger || 'both';
    }

    /**
     * Returns what an unmodified click does in the `multiple` mode.
     */
    public get clickBehavior(): RowSelectionClickBehavior {
        return this.options.clickBehavior || 'toggle';
    }

    /**
     * Returns whether a checkbox should be rendered for each row.
     */
    public hasCheckbox(): boolean {
        return this.isEnabled() && this.options.checkbox?.enabled === true;
    }

    /**
     * Returns whether clicking a row anywhere selects it.
     */
    public selectsOnRowClick(): boolean {
        return this.trigger !== 'checkbox';
    }

    /**
     * Returns whether clicking the checkbox selects the row.
     */
    public selectsOnCheckboxClick(): boolean {
        return this.trigger !== 'row';
    }

    /**
     * Returns the ids of all selected rows, in selection order.
     */
    public getSelectedRowIds(): RowId[] {
        return [...this.selected];
    }

    /**
     * Returns whether the row with the given id is selected.
     *
     * @param rowId
     * The id of the row to check.
     */
    public isSelected(rowId?: RowId): boolean {
        return rowId !== void 0 && this.selected.has(rowId);
    }

    /**
     * Selects the given rows, keeping the current selection.
     *
     * In the `single` mode only the last of the given rows stays selected.
     *
     * @param rowIds
     * The id, or ids, of the rows to select.
     */
    public select(rowIds: RowId|RowId[]): void {
        const ids = splat(rowIds);

        if (this.mode === 'single') {
            const last = ids[ids.length - 1];

            if (last === void 0) {
                return;
            }

            this.apply([last], this.getSelectedRowIds());
            return;
        }

        this.apply(ids, []);
    }

    /**
     * Deselects the given rows.
     *
     * @param rowIds
     * The id, or ids, of the rows to deselect.
     */
    public deselect(rowIds: RowId|RowId[]): void {
        this.apply([], splat(rowIds));
    }

    /**
     * Selects the row if it is not selected, and deselects it otherwise.
     *
     * @param rowId
     * The id of the row to toggle.
     */
    public toggle(rowId: RowId): void {
        if (this.selected.has(rowId)) {
            this.apply([], [rowId]);
        } else {
            this.select(rowId);
        }
    }

    /**
     * Deselects every selected row.
     */
    public clear(): void {
        this.apply([], this.getSelectedRowIds());
    }

    /**
     * Maps a click on a row to a selection change.
     *
     * @param row
     * The clicked row.
     *
     * @param originalEvent
     * The browser event that triggered the click, if any. Absent for clicks
     * synthesized by other features.
     *
     * @param fromCheckbox
     * Whether the click landed on the selection checkbox, which always
     * toggles.
     */
    public onRowClick(
        row: TableRow,
        originalEvent?: MouseEvent|KeyboardEvent,
        fromCheckbox = false
    ): void {
        const rowId = row.id;

        if (rowId === void 0) {
            return;
        }

        const gesture = ++this.gesture;

        // A pinned or sticky mirror row carries its section index, not the
        // presentation index, so it can neither open nor extend a range.
        const isMirror = (row as { bodySectionId?: string })
            .bodySectionId !== void 0;

        if (this.mode === 'single') {
            if (this.selected.has(rowId)) {
                this.apply([], [rowId], originalEvent);
            } else {
                this.apply([rowId], this.getSelectedRowIds(), originalEvent);
            }
        } else if (
            originalEvent?.shiftKey &&
            this.anchor &&
            !isMirror
        ) {
            void this.applyRange(
                this.anchor.index,
                row.index,
                gesture,
                originalEvent
            );
            return;
        } else if (
            fromCheckbox ||
            this.clickBehavior === 'toggle' ||
            this.isModifierPressed(originalEvent)
        ) {
            if (this.selected.has(rowId)) {
                this.apply([], [rowId], originalEvent);
            } else {
                this.apply([rowId], [], originalEvent);
            }
        } else {
            this.apply([rowId], this.getSelectedRowIds(), originalEvent);
        }

        if (!isMirror) {
            this.anchor = { rowId, index: row.index };
        }
    }

    /**
     * Returns whether the configured modifier key was held down.
     *
     * @param e
     * The browser event to inspect.
     */
    private isModifierPressed(e?: MouseEvent|KeyboardEvent): boolean {
        if (!e) {
            return false;
        }

        return this.options.modifierKey === 'alt' ?
            e.altKey :
            e.ctrlKey || e.metaKey;
    }

    /**
     * Selects every row between the two given presentation indexes.
     *
     * @param fromIndex
     * The presentation index of the row the range starts at.
     *
     * @param toIndex
     * The presentation index of the row the range ends at.
     *
     * @param gesture
     * The gesture this range belongs to. The range is discarded if another
     * click happened while its row ids were being resolved.
     *
     * @param originalEvent
     * The browser event that triggered the range.
     */
    private async applyRange(
        fromIndex: number,
        toIndex: number,
        gesture: number,
        originalEvent?: MouseEvent|KeyboardEvent
    ): Promise<void> {
        const dp = this.grid.dataProvider;
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const pending: Array<Promise<RowId|undefined>> = [];

        for (let i = start; i <= end; ++i) {
            pending.push(Promise.resolve(dp?.getRowId(i)));
        }

        // Ponytail: rows outside a remote provider's loaded window resolve to
        // `undefined` and drop out of the range. Prefetch them if that bites.
        const rowIds = (await Promise.all(pending))
            .filter((rowId): rowId is RowId => rowId !== void 0);

        if (gesture !== this.gesture) {
            return;
        }

        this.apply(rowIds, [], originalEvent);
    }

    /**
     * Applies a selection change, firing the events around it.
     *
     * @param addRowIds
     * The ids of the rows to select.
     *
     * @param removeRowIds
     * The ids of the rows to deselect.
     *
     * @param originalEvent
     * The browser event that triggered the change, if any.
     */
    private apply(
        addRowIds: RowId[],
        removeRowIds: RowId[],
        originalEvent?: MouseEvent|KeyboardEvent
    ): void {
        const added = addRowIds.filter(
            (rowId): boolean => !this.selected.has(rowId)
        );
        const removed = removeRowIds.filter(
            (rowId): boolean =>
                this.selected.has(rowId) && !addRowIds.includes(rowId)
        );

        if (!added.length && !removed.length) {
            // Nothing moved, but the browser may already have flipped a
            // checkbox on the way here.
            this.syncRenderedRows();
            return;
        }

        const grid = this.grid;

        // `target` is deliberately left out: `fireEvent` only attaches
        // `preventDefault` to payloads that do not carry one yet.
        const beforeEvent = {
            addedRowIds: added,
            removedRowIds: removed,
            selectedRowIds: this.getSelectedRowIds(),
            originalEvent
        } as unknown as RowSelectionChangeEvent;

        fireEvent(grid, 'beforeRowSelectionChange', beforeEvent);

        if ((beforeEvent as { defaultPrevented?: boolean }).defaultPrevented) {
            this.syncRenderedRows();
            return;
        }

        for (const rowId of removed) {
            this.selected.delete(rowId);
        }
        for (const rowId of added) {
            this.selected.add(rowId);
        }

        this.syncRenderedRows();

        fireEvent(grid, 'afterRowSelectionChange', {
            addedRowIds: added,
            removedRowIds: removed,
            selectedRowIds: this.getSelectedRowIds(),
            originalEvent
        });
    }

    /**
     * Applies the selection state to every rendered row, including the mirror
     * rows of the pinned sections.
     */
    public syncRenderedRows(): void {
        const rows = this.grid.viewport?.getRenderedRows();

        if (!rows) {
            return;
        }

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            this.syncRow(rows[i]);
        }
    }

    /**
     * Applies the selection state to a single rendered row and its checkbox.
     *
     * @param row
     * The row to sync.
     */
    public syncRow(row: TableRow): void {
        const el = row.htmlElement;
        const selected = this.isSelected(row.id);

        el.classList.toggle(classNames.rowSelected, selected);
        el.setAttribute('aria-selected', selected ? 'true' : 'false');

        const checkbox = el.querySelector<HTMLInputElement>(
            '.' + classNames.checkbox
        );

        if (checkbox) {
            checkbox.checked = selected;
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default RowSelectionController;
