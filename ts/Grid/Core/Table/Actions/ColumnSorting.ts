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
import U from '../../../../Core/Utilities.js';

const {
    fireEvent
} = U;

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
     * Whether the invalid order sequence warning has already been shown.
     */
    private hasWarnedInvalidOrderSequence: boolean = false;


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
     * Returns true if the provided sorting order sequence is valid.
     *
     * @param sequence
     * Sorting order sequence to validate.
     */
    private isValidOrderSequence(
        sequence?: Array<ColumnSortingOrder>
    ): sequence is [
        ColumnSortingOrder,
        ColumnSortingOrder,
        ColumnSortingOrder
    ] {
        if (!Array.isArray(sequence) || sequence.length !== 3) {
            return false;
        }

        const allowedValues: ColumnSortingOrder[] = ['asc', 'desc', null];

        for (const value of allowedValues) {
            if (
                sequence.indexOf(value) === -1 ||
                sequence.lastIndexOf(value) !== sequence.indexOf(value)
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns sorting order sequence for this column.
     */
    private getOrderSequence():
    [ColumnSortingOrder, ColumnSortingOrder, ColumnSortingOrder] {
        const defaultSequence: [
            ColumnSortingOrder,
            ColumnSortingOrder,
            ColumnSortingOrder
        ] = ['asc', 'desc', null];
        const configuredSequence = this.column.options.sorting?.orderSequence;

        if (this.isValidOrderSequence(configuredSequence)) {
            return configuredSequence;
        }

        if (
            configuredSequence &&
            !this.hasWarnedInvalidOrderSequence
        ) {
            this.hasWarnedInvalidOrderSequence = true;
            // eslint-disable-next-line no-console
            console.warn(
                `Grid: Invalid sorting.orderSequence for column "${
                    this.column.id
                }". Expected an exact permutation of ["asc", "desc", null].`
            );
        }

        return defaultSequence;
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

        const currentOrder = (
            additive ?
                sortingController.currentSortings?.find((sorting): boolean =>
                    sorting.columnId === this.column.id
                )?.order :
                (
                    sortingController.currentSorting?.columnId ===
                    this.column.id ?
                        sortingController.currentSorting.order :
                        null
                )
        ) ?? null;
        const orderSequence = this.getOrderSequence();
        const currentOrderIndex = orderSequence.indexOf(currentOrder);
        const nextOrder = orderSequence[
            currentOrderIndex === -1 ? 0 :
                (currentOrderIndex + 1) % orderSequence.length
        ];

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
