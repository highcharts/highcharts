/* *
 *
 *  Grid ColumnSorting class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    ColumnSortingOrder,
    IndividualColumnSortingOptions
} from '../../Options.js';

import Column from '../Column.js';
import Globals from '../../Globals.js';
import { fireEvent } from '../../../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages sorting for a dedicated column.
 */
class ColumnSorting {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The sorted column of the table.
     */
    public column: Column;

    /**
     * The head element of the column.
     */
    public headerCellElement: HTMLElement;

    /**
     * Last index used from the configured order sequence.
     */
    private lastOrderSequenceIndex?: number;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs sorting for a dedicated column.
     *
     * @param column
     * The column that be sorted.
     *
     * @param headerCellElement
     * The head element of the column.
     */
    constructor(column: Column, headerCellElement: HTMLElement) {
        this.column = column;
        this.headerCellElement = headerCellElement;

        this.addHeaderElementAttributes();

        const sortingOptions = column.options.sorting;
        const sortingEnabled = sortingOptions?.enabled ??
            sortingOptions?.sortable;

        if (sortingEnabled) {
            headerCellElement.classList.add(
                Globals.getClassName('columnSortable')
            );
        }
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Adds attributes to the column header.
     */
    private addHeaderElementAttributes(): void {
        const col = this.column;
        const a11y = col.viewport.grid.accessibility;
        const sortingOptions = col.options.sorting;
        const { currentSorting, currentSortings } =
            col.viewport.grid.querying.sorting;
        const sortedAscClassName = Globals.getClassName('columnSortedAsc');
        const sortedDescClassName = Globals.getClassName('columnSortedDesc');

        const el = this.headerCellElement;
        const sortingEnabled = sortingOptions?.enabled ??
            sortingOptions?.sortable;

        const columnSorting = (
            currentSortings?.find((sorting): boolean =>
                sorting.columnId === col.id
            ) ||
            (
                currentSorting?.columnId === col.id ?
                    currentSorting :
                    void 0
            )
        );

        if (!columnSorting?.order) {
            el.classList.remove(sortedAscClassName);
            el.classList.remove(sortedDescClassName);

            if (sortingEnabled) {
                a11y?.setColumnSortState(el, 'none');
            }

            return;
        }

        switch (columnSorting.order) {
            case 'asc':
                el.classList.add(sortedAscClassName);
                el.classList.remove(sortedDescClassName);
                a11y?.setColumnSortState(el, 'ascending');
                break;
            case 'desc':
                el.classList.remove(sortedAscClassName);
                el.classList.add(sortedDescClassName);
                a11y?.setColumnSortState(el, 'descending');
                break;
        }
    }

    /**
     * Refreshes the sorting-related header attributes and classes.
     */
    public refreshHeaderAttributes(): void {
        this.addHeaderElementAttributes();
    }

    /**
     * Updates the column options with the new sorting state.
     *
     * @param col
     * The column to update.
     */
    private updateColumnOptions(col: Column): void {
        const sortings =
            col.viewport.grid.querying.sorting.currentSortings || [];
        const sortingIndex = sortings.findIndex((sorting): boolean =>
            sorting.columnId === col.id
        );

        if (sortingIndex !== -1 && sortings[sortingIndex].order) {
            const sorting = sortings[sortingIndex];
            const sortingOptions: IndividualColumnSortingOptions = {
                order: sorting.order
            };

            if (sortings.length > 1) {
                sortingOptions.priority = sortingIndex + 1;
            }

            col.setOptions({ sorting: sortingOptions });

            if (sortings.length < 2) {
                delete col.options.sorting?.priority;
            }
        } else {
            delete col.options.sorting?.order;
            delete col.options.sorting?.priority;
            if (
                col.options.sorting &&
                Object.keys(col.options.sorting).length < 1
            ) {
                delete col.options.sorting;
            }
        }
    }

    /**
     * Returns sorting order sequence for this column.
     */
    private getOrderSequence(): ColumnSortingOrder[] {
        return this.column.options.sorting?.orderSequence || [
            'asc',
            'desc',
            null
        ];
    }

    /**
     * Normalizes arbitrary sorting values to valid order states.
     *
     * @param order
     * Value to normalize.
     */
    private normalizeOrder(order?: unknown): ColumnSortingOrder {
        return order === 'asc' || order === 'desc' ?
            order :
            null;
    }

    /**
     * Set sorting order for the column. It will modify the presentation data
     * and rerender the rows.
     *
     * @param order
     * The order of sorting. It can be `'asc'`, `'desc'` or `null` if the
     * sorting should be disabled.
     *
     * @param additive
     * Whether to add this sort to existing sorts or replace them.
     */
    public async setOrder(
        order: ColumnSortingOrder,
        additive: boolean = false
    ): Promise<void> {
        const viewport = this.column.viewport;

        // Do not call sorting when cell is currently edited and validated.
        if (viewport.validator?.errorCell) {
            return;
        }

        const querying = viewport.grid.querying;
        const sortingController = querying.sorting;
        const a11y = viewport.grid.accessibility;

        [this.column, viewport.grid].forEach((source): void => {
            fireEvent(source, 'beforeSort', {
                target: this.column,
                order
            });
        });

        if (additive) {
            const baseSortings = (
                sortingController.currentSortings ||
                (
                    sortingController.currentSorting?.columnId &&
                    sortingController.currentSorting.order ?
                        [sortingController.currentSorting] :
                        []
                )
            ).filter(
                (sorting): boolean => !!(sorting.columnId && sorting.order)
            );

            const sortings = baseSortings.slice();
            const index = sortings.findIndex((sorting): boolean =>
                sorting.columnId === this.column.id
            );

            if (!order) {
                if (index !== -1) {
                    sortings.splice(index, 1);
                }
            } else {
                const sorting = {
                    columnId: this.column.id,
                    order
                };

                if (index !== -1) {
                    sortings[index] = sorting;
                } else {
                    sortings.push(sorting);
                }
            }

            sortingController.setSorting(sortings);
        } else {
            sortingController.setSorting(order, this.column.id);
        }
        await viewport.updateRows();

        for (const col of viewport.columns) {
            this.updateColumnOptions(col);
            col.sorting?.refreshHeaderAttributes();
        }

        a11y?.userSortedColumn(order);

        [this.column, viewport.grid].forEach((source): void => {
            fireEvent(source, 'afterSort', {
                target: this.column,
                order
            });
        });
    }

    /**
     * Toggle sorting order for the column according to the configured
     * sorting order sequence.
     *
     * @param e
     * Optional mouse or keyboard event.
     */
    public toggle = (e?: MouseEvent|KeyboardEvent): void => {
        const viewport = this.column.viewport;
        const querying = viewport.grid.querying;
        const sortingController = querying.sorting;

        const additive = !!e?.shiftKey;
        let hasCurrentColumnSorting = false;

        const currentOrder = ((): ColumnSortingOrder => {
            if (additive) {
                const currentSorting = sortingController.currentSortings?.find(
                    (sorting): boolean => sorting.columnId === this.column.id
                );

                hasCurrentColumnSorting = !!currentSorting;
                return this.normalizeOrder(currentSorting?.order);
            }

            const currentSorting = sortingController.currentSorting;
            hasCurrentColumnSorting =
                currentSorting?.columnId === this.column.id;

            return hasCurrentColumnSorting ?
                this.normalizeOrder(currentSorting?.order) :
                null;
        })();

        const orderSequence = this.getOrderSequence();
        if (orderSequence.length < 1) {
            return;
        }

        let nextOrderIndex = 0;
        const lastIndex = this.lastOrderSequenceIndex;

        if (
            hasCurrentColumnSorting &&
            typeof lastIndex === 'number' &&
            orderSequence[lastIndex] === currentOrder
        ) {
            nextOrderIndex = (lastIndex + 1) % orderSequence.length;
        } else {
            const currentOrderIndex = orderSequence.indexOf(currentOrder);
            nextOrderIndex = (
                currentOrderIndex === -1 ?
                    0 :
                    (currentOrderIndex + 1) % orderSequence.length
            );
        }

        this.lastOrderSequenceIndex = nextOrderIndex;
        const nextOrder = orderSequence[nextOrderIndex];

        void this.setOrder(nextOrder, additive);
    };
}


/* *
 *
 *  Declarations
 *
 * */

export interface ColumnSortingEvent {
    target: Column;
    order: ColumnSortingOrder;
}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnSorting;
