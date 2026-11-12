/* *
 *
 *  Grid Advanced Filtering Composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *  Authors:
 *  - Andrzej Bułeczka
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
import type { ProcessUpdateDiffEvent } from '../../Core/Grid';
import type { FilteringRule, Options } from '../../Core/Options';
import type {
    FilterCondition
} from '../../../Data/Modifiers/FilterModifierOptions';

import Globals from '../../Core/Globals.js';
import { hasDataTableProvider } from '../../Core/Data/DataProvider.js';
import { addEvent, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Logical operator combining the conditions of a filtering group.
 */
export type AdvancedFilteringLogic = 'and' | 'or';

/**
 * Filtering rule applied to a single column.
 */
export interface AdvancedFilteringRule extends FilteringRule {
    /**
     * The id of the column to filter.
     */
    columnId: string;
}

/**
 * Filtering rule or nested group of rules.
 */
export type AdvancedFilteringCondition =
    AdvancedFilteringGroup | AdvancedFilteringRule;

/**
 * Global filtering options, combining rules for multiple columns with
 * logical operators. The result is combined with the column filters using
 * the `and` operator.
 *
 * Not supported with the remote data provider yet.
 */
export interface AdvancedFilteringOptions {
    /**
     * Rules and nested groups of rules to combine.
     *
     * @example
     * ```js
     * filtering: {
     *     conditions: [{
     *         columnId: 'age',
     *         operator: 'greaterThan',
     *         value: 20
     *     }, {
     *         logic: 'or',
     *         conditions: [{
     *             columnId: 'country',
     *             operator: 'equals',
     *             value: 'PL'
     *         }, {
     *             columnId: 'country',
     *             operator: 'equals',
     *             value: 'NO'
     *         }]
     *     }]
     * }
     * ```
     */
    conditions?: AdvancedFilteringCondition[];

    /**
     * Logical operator combining the conditions.
     *
     * @default 'and'
     */
    logic?: AdvancedFilteringLogic;
}

/**
 * Nested group of filtering rules.
 */
export interface AdvancedFilteringGroup extends AdvancedFilteringOptions {
    /**
     * Rules and nested groups of rules to combine.
     */
    conditions: AdvancedFilteringCondition[];

    /**
     * Logical operator combining the conditions.
     */
    logic: AdvancedFilteringLogic;
}


/* *
 *
 *  Composition
 *
 * */

/**
 * Composes Grid Pro with the global filtering.
 *
 * @param GridClass
 * Grid class to extend.
 */
export function compose(GridClass: typeof Grid): void {
    if (!pushUnique(Globals.composed, 'AdvancedFiltering')) {
        return;
    }

    addEvent(GridClass, 'beforeUpdate', onBeforeUpdate);
    addEvent(GridClass, 'getFilterConditions', onGetFilterConditions);
    addEvent(GridClass, 'processUpdateDiff', onProcessUpdateDiff);
}

/**
 * Maps a filtering group to the filter condition. Rules for columns missing
 * in the data and empty groups are skipped.
 *
 * @param grid
 * Grid instance.
 *
 * @param table
 * Source data table.
 *
 * @param group
 * Filtering group to map.
 */
function mapGroup(
    grid: Grid,
    table: DataTable,
    group: AdvancedFilteringOptions
): FilterCondition | undefined {
    const { columnPolicy } = grid;
    const conditions: FilterCondition[] = [];

    for (const item of group.conditions || []) {
        let condition: FilterCondition | undefined;

        if ('conditions' in item) {
            condition = mapGroup(grid, table, item);
        } else {
            const sourceColumnId = columnPolicy.getColumnSourceId(
                item.columnId
            );

            // Hidden `groupBy` columns exist only in the source table and
            // generated columns only in the presentation table.
            if (
                sourceColumnId && (
                    table.hasColumns([sourceColumnId]) ||
                    !columnPolicy.isColumnUnbound(item.columnId)
                )
            ) {
                condition = grid.querying.filtering.createColumnCondition(
                    item.columnId,
                    sourceColumnId,
                    { rule: item }
                );
            }
        }

        if (condition) {
            conditions.push(condition);
        }
    }

    return conditions.length > 1 ? {
        operator: group.logic || 'and',
        conditions
    } : conditions[0];
}

/**
 * Replaces the whole filtering state on update instead of merging it, so
 * that a state saved with `getOptions()` can be restored.
 *
 * @param e
 * Update event.
 *
 * @param e.options
 * Options passed to the update.
 *
 * @param e.scope
 * Scope of the update.
 */
function onBeforeUpdate(
    this: Grid,
    e: { options: Options; scope: 'grid' | 'column' }
): void {
    if (e.scope === 'grid' && 'filtering' in e.options) {
        delete this.userOptions.filtering;
        delete this.options?.filtering;
    }
}

/**
 * Adds the global filtering condition to the column conditions. Skipped for
 * providers without a local data table, e.g. the remote one.
 *
 * @param e
 * Event with the filter conditions.
 *
 * @param e.conditions
 * Filter conditions combined with the `and` operator.
 */
function onGetFilterConditions(
    this: Grid,
    e: { conditions: FilterCondition[] }
): void {
    const { dataProvider, options } = this;
    const table = (
        hasDataTableProvider(dataProvider) &&
        dataProvider.getDataTable()
    );
    const condition = (
        table &&
        options?.filtering &&
        mapGroup(this, table, options.filtering)
    );

    if (condition) {
        e.conditions.push(condition);
    }
}

/**
 * Requeries the data instead of re-rendering the grid when the global
 * filtering options change.
 *
 * @param e
 * Update diff event.
 */
function onProcessUpdateDiff(this: Grid, e: ProcessUpdateDiffEvent): void {
    if ('filtering' in e.diff) {
        delete e.diff.filtering;
        e.flags.add('filtering');
    }
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * Global filtering options, combining rules for multiple columns with
         * logical operators. Updating the option replaces the whole filtering
         * state.
         *
         * @sample grid-pro/options/advanced-filtering Advanced filtering
         */
        filtering?: AdvancedFilteringOptions;
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
