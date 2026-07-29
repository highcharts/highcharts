/* *
 *
 *  Grid Row Grouping Controller
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

import type Grid from '../../Core/Grid';
import type { RowId } from '../../Core/Data/DataProvider';
import type { RowGroupingOptions } from './RowGroupingTypes';

import {
    resolveGroupByColumnIds
} from './RowGroupingOptionsResolver.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Public API of the row grouping feature.
 *
 * Row grouping is configured with `rowGrouping`, and is projected by the same
 * infrastructure as TreeView, so expansion methods operate on the generated
 * group rows.
 */
class RowGroupingController {

    /* *
     *
     *  Properties
     *
     * */

    private readonly grid: Grid;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid) {
        this.grid = grid;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns whether rows are currently grouped.
     */
    public get enabled(): boolean {
        return this.grid.treeView?.options?.input.type === 'grouping';
    }

    /**
     * Returns ordered source column IDs currently used as grouping levels, or
     * an empty array when row grouping is disabled.
     */
    public getGroupBy(): string[] {
        const input = this.grid.treeView?.options?.input;

        if (input?.type === 'grouping') {
            return input.groupBy.slice();
        }

        return this.grid.options?.rowGrouping?.enabled ?
            resolveGroupByColumnIds(this.grid) :
            [];
    }

    /**
     * Replaces the current grouping levels.
     *
     * Enables row grouping when called with at least one column, so that a
     * "group by" control does not have to update `rowGrouping.enabled` itself.
     *
     * @param columnIds
     * Ordered column IDs to group by. An empty array removes grouping.
     *
     * @returns
     * Promise resolved when the Grid is updated.
     */
    public async setGroupBy(columnIds: string[]): Promise<void> {
        await this.grid.update({
            rowGrouping: columnIds.length ?
                {
                    enabled: true,
                    groupBy: columnIds
                } :
                {
                    groupBy: []
                }
        });
    }

    /**
     * Expands all group rows.
     *
     * @param redraw
     * Whether to redraw rows after the state change.
     *
     * @returns
     * Promise resolving to `true` when state changed, otherwise `false`.
     */
    public expandAll(redraw: boolean = true): Promise<boolean> {
        return this.grid.treeView?.expandAll(redraw) ?? Promise.resolve(false);
    }

    /**
     * Collapses all group rows.
     *
     * @param redraw
     * Whether to redraw rows after the state change.
     *
     * @returns
     * Promise resolving to `true` when state changed, otherwise `false`.
     */
    public collapseAll(redraw: boolean = true): Promise<boolean> {
        return this.grid.treeView?.collapseAll(redraw) ??
            Promise.resolve(false);
    }

    /**
     * Toggles expansion state of a group row.
     *
     * @param rowId
     * Row ID of the group row to toggle.
     *
     * @param redraw
     * Whether to redraw rows after the state change.
     *
     * @returns
     * Promise resolving to `true` when state changed, otherwise `false`.
     */
    public toggleRow(
        rowId: RowId,
        redraw: boolean = true
    ): Promise<boolean> {
        return this.grid.treeView?.toggleRow(rowId, redraw) ??
            Promise.resolve(false);
    }

}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Grid' {
    export default interface Grid {
        rowGrouping?: RowGroupingController;
    }
}

declare module '../../Core/Options' {
    interface Options {
        /**
         * Row grouping options (Grid Pro module).
         *
         * Rows sharing the values of the columns listed in
         * [rowGrouping.groupBy](https://api.highcharts.com/grid/rowGrouping.groupBy)
         * are collected under generated group rows, which are rendered in a
         * dedicated column with expand/collapse UI.
         *
         * @sample grid-pro/options/row-grouping Row grouping
         */
        rowGrouping?: RowGroupingOptions;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default RowGroupingController;
