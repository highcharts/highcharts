/* *
 *
 *  Grid Row Selection options
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
import type { GridEvent } from '../../Core/GridUtils';
import type { RowId } from '../../Core/Data/DataProvider';


/* *
 *
 *  Declarations
 *
 * */

/**
 * How many rows can be selected at once.
 */
export type RowSelectionMode = 'single'|'multiple';

/**
 * Which interactions select a row.
 */
export type RowSelectionTrigger = 'row'|'checkbox'|'both';

/**
 * What a click without a modifier key does in the `multiple` mode.
 */
export type RowSelectionClickBehavior = 'toggle'|'replace';

/**
 * The modifier key that adds a row to, or removes it from, the selection.
 */
export type RowSelectionModifierKey = 'ctrlOrMeta'|'alt';

/**
 * Options for the selection checkbox.
 */
export interface RowSelectionCheckboxOptions {
    /**
     * Whether to render a checkbox reflecting the selected state of each row.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * The id of an existing column to prepend the checkbox to. When omitted, a
     * dedicated selection column is rendered as the first column instead.
     *
     * @sample grid-pro/options/row-selection Row selection
     */
    columnId?: string;

    /**
     * The width of the dedicated selection column, in pixels. Ignored when
     * `columnId` is set.
     *
     * @default 44
     */
    columnWidth?: number;
}

/**
 * Row selection options, letting users select one or more rows.
 *
 * @sample grid-pro/options/row-selection Row selection
 */
export interface RowSelectionOptions {
    /**
     * Whether row selection is enabled.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * How many rows can be selected at once.
     *
     * In the `single` mode, clicking the selected row again deselects it. In
     * the `multiple` mode, `Shift`-clicking selects a continuous range of rows
     * from the last selected one.
     *
     * @default 'single'
     */
    mode?: RowSelectionMode;

    /**
     * Which interactions select a row: clicking anywhere on the row, clicking
     * the checkbox only, or both.
     *
     * With `checkbox`, the `checkbox.enabled` option must also be set,
     * otherwise there is nothing to click.
     *
     * @default 'both'
     */
    trigger?: RowSelectionTrigger;

    /**
     * What a click without a modifier key does in the `multiple` mode.
     *
     * - `toggle`: the clicked row is added to, or removed from, the selection.
     * - `replace`: the selection is replaced by the clicked row, and rows are
     *   added or removed with the `modifierKey` instead.
     *
     * Ignored in the `single` mode, and for clicks on the checkbox, which
     * always toggle.
     *
     * @default 'toggle'
     */
    clickBehavior?: RowSelectionClickBehavior;

    /**
     * The modifier key that adds a row to, or removes it from, the selection.
     *
     * `ctrlOrMeta` matches the Command key on macOS and the Control key
     * elsewhere. `Shift` is not available, as it selects a range.
     *
     * @default 'ctrlOrMeta'
     */
    modifierKey?: RowSelectionModifierKey;

    /**
     * Options for the selection checkbox.
     */
    checkbox?: RowSelectionCheckboxOptions;
}

/**
 * Payload of the row selection change events.
 */
export interface RowSelectionChangeEvent extends GridEvent<Grid> {
    /**
     * The ids of the rows that became selected.
     */
    addedRowIds: RowId[];

    /**
     * The ids of the rows that became deselected.
     */
    removedRowIds: RowId[];

    /**
     * The ids of all selected rows. On `beforeRowSelectionChange` this is the
     * selection as it stands before the change, on
     * `afterRowSelectionChange` the selection after it.
     */
    selectedRowIds: RowId[];

    /**
     * The browser event that triggered the change, if any. Absent when the
     * selection was changed through the API.
     */
    originalEvent?: MouseEvent|KeyboardEvent;
}

/**
 * Callback function to be called when the row selection changes.
 */
export type RowSelectionChangeEventCallback = (
    this: Grid,
    e: RowSelectionChangeEvent
) => void;


/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * Row selection options, letting users select one or more rows.
         *
         * @sample grid-pro/options/row-selection Row selection
                 */
        rowSelection?: RowSelectionOptions;
    }
}

declare module '../GridEvents' {
    interface GridEvents {
        /**
         * Callback function to be called before the row selection changes.
         *
         * Call `event.preventDefault()` to cancel the change.
         */
        beforeRowSelectionChange?: RowSelectionChangeEventCallback;

        /**
         * Callback function to be called after the row selection changed.
         */
        afterRowSelectionChange?: RowSelectionChangeEventCallback;
    }
}
