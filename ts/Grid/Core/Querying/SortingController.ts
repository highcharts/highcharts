/* *
 *
 *  Grid Sorting Controller class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { ColumnSortingOrder } from '../Options.js';
import type { SortModifierOrderByOption } from '../../../Data/Modifiers/SortModifierOptions.js';

import QueryingController from './QueryingController.js';
import SortModifier from '../../../Data/Modifiers/SortModifier.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages one of the data grid querying types - sorting.
 */
class SortingController {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The data grid instance.
     */
    private querying: QueryingController;

    /**
     * The current sorting options: column ID and sorting order.
     */
    public currentSorting?: SortingState;

    /**
     * The current multi-column sorting options in priority order.
     */
    public currentSortings?: SortingState[];

    /**
     * The modifier that is applied to the data table.
     */
    public modifier?: SortModifier;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs the SortingController instance.
     *
     * @param querying
     * The querying controller instance.
     */
    constructor(querying: QueryingController) {
        this.querying = querying;
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Sets the sorting state. If the new sorting state is different than the
     * current one, the `shouldBeUpdated` flag is set to `true`. If the
     * same, the flag is set to `false`.
     *
     * @param order
     * The sorting order.
     *
     * @param columnId
     * The column ID to sort by.
     */
    public setSorting(order: ColumnSortingOrder, columnId?: string): void;
    public setSorting(sortings: SortingState[]): void;
    public setSorting(
        orderOrSortings: (ColumnSortingOrder|SortingState[]),
        columnId?: string
    ): void {
        if (Array.isArray(orderOrSortings)) {
            const sortings = orderOrSortings
                .filter((sorting): boolean => !!(
                    sorting.columnId && sorting.order
                ))
                .map((sorting): SortingState => ({
                    columnId: sorting.columnId,
                    order: sorting.order
                }));

            const currentSortings = this.currentSortings || [];
            if (!SortingController.sortingsEqual(sortings, currentSortings)) {
                this.querying.shouldBeUpdated = true;
                this.currentSortings = sortings;
                this.currentSorting = sortings[0] || { order: null };
            }

            this.modifier = this.createModifier();
            return;
        }

        const order = orderOrSortings;

        if (
            this.currentSorting?.columnId !== columnId ||
            this.currentSorting?.order !== order
        ) {
            this.querying.shouldBeUpdated = true;
            this.currentSorting = {
                columnId,
                order
            };
            this.currentSortings = (
                order && columnId ?
                    [{ columnId, order }] :
                    []
            );
        }

        this.modifier = this.createModifier();
    }

    /**
     * Checks whether two sorting state arrays are equal.
     *
     * @param a
     * First sorting state array.
     *
     * @param b
     * Second sorting state array.
     */
    private static sortingsEqual(
        a: SortingState[],
        b: SortingState[]
    ): boolean {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0, iEnd = a.length; i < iEnd; ++i) {
            if (
                a[i].columnId !== b[i].columnId ||
                a[i].order !== b[i].order
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns the sorting options from the data grid options.
     */
    private getSortingOptions(): SortingState[] {
        const grid = this.querying.grid,
            { columnOptionsMap } = grid;

        if (!columnOptionsMap) {
            return [];
        }

        const columnIDs = Object.keys(columnOptionsMap);

        const sortings: Array<SortingState & {
            priority?: number;
            index: number;
        }> = [];
        for (let i = 0, iEnd = columnIDs.length; i < iEnd; ++i) {
            const columnId = columnIDs[i];
            const columnOptions = columnOptionsMap[columnId]?.options || {};
            const order = columnOptions.sorting?.order;

            if (order) {
                sortings.push({
                    columnId,
                    order,
                    priority: columnOptions.sorting?.priority,
                    index: i
                });
            }
        }

        if (sortings.some((sorting): boolean =>
            typeof sorting.priority === 'number'
        )) {
            sortings.sort((a, b): number => {
                const aPriority = (
                    typeof a.priority === 'number' ?
                        a.priority :
                        Number.POSITIVE_INFINITY
                );
                const bPriority = (
                    typeof b.priority === 'number' ?
                        b.priority :
                        Number.POSITIVE_INFINITY
                );

                if (aPriority !== bPriority) {
                    return aPriority - bPriority;
                }

                return a.index - b.index;
            });
        } else {
            sortings.reverse();
        }

        return sortings.map((sorting): SortingState => ({
            columnId: sorting.columnId,
            order: sorting.order
        }));
    }

    /**
     * Loads sorting options from the data grid options.
     */
    public loadOptions(): void {
        const sortingsFromOptions = this.getSortingOptions();
        if (
            !SortingController.sortingsEqual(
                sortingsFromOptions,
                this.currentSortings || []
            )
        ) {
            this.setSorting(sortingsFromOptions);
        }
    }

    /**
     * Returns the sorting modifier based on the loaded sorting options.
     */
    private createModifier(): SortModifier | undefined {
        const sortings = (
            this.currentSortings ||
            (this.currentSorting ? [this.currentSorting] : [])
        ).filter((
            sorting
        ): sorting is SortingState & { columnId: string } => !!(
            sorting.columnId && sorting.order
        ));

        if (!sortings.length) {
            return;
        }

        const grid = this.querying.grid;

        const defaultCompare =
            grid.options?.columnDefaults?.sorting?.compare;

        return new SortModifier({
            direction: sortings[0].order as ('asc'|'desc'),
            columns: sortings.map((
                sorting
            ): SortModifierOrderByOption => ({
                column: sorting.columnId,
                direction: sorting.order as ('asc'|'desc'),
                compare: grid.columnOptionsMap?.[sorting.columnId]
                    ?.options?.sorting?.compare || defaultCompare
            }))
        });
    }
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * The sorting state interface.
 */
export interface SortingState {
    columnId?: string;
    order: ColumnSortingOrder;
}


/* *
 *
 *  Default Export
 *
 * */

export default SortingController;
