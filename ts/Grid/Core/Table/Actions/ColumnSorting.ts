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

import type { ColumnSortingOrder } from '../../Options.js';

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
        const { currentSorting } = col.viewport.grid.querying.sorting;
        const sortedAscClassName = Globals.getClassName('columnSortedAsc');
        const sortedDescClassName = Globals.getClassName('columnSortedDesc');

        const el = this.headerCellElement;
        const sortingEnabled = sortingOptions?.enabled ??
            sortingOptions?.sortable;

        if (currentSorting?.columnId !== col.id || !currentSorting?.order) {
            el.classList.remove(sortedAscClassName);
            el.classList.remove(sortedDescClassName);

            if (sortingEnabled) {
                a11y?.setColumnSortState(el, 'none');
            }

            return;
        }

        switch (currentSorting?.order) {
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
     * Updates the column options with the new sorting state.
     *
     * @param col
     * The column to update.
     */
    private updateColumnOptions(col: Column): void {
        const order = col.viewport.grid.querying.sorting.currentSorting?.order;

        if (col.id === this.column.id && order) {
            col.setOptions({ sorting: { order } });
        } else {
            delete col.options.sorting?.order;
            if (
                col.options.sorting &&
                Object.keys(col.options.sorting).length < 1
            ) {
                delete col.options.sorting;
            }
        }
    }

    /**
     * Set sorting order for the column. It will modify the presentation data
     * and rerender the rows.
     *
     * @param order
     * The order of sorting. It can be `'asc'`, `'desc'` or `null` if the
     * sorting should be disabled.
     */
    public async setOrder(order: ColumnSortingOrder): Promise<void> {
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

        sortingController.setSorting(order, this.column.id);
        await viewport.updateRows();

        for (const col of viewport.columns) {
            this.updateColumnOptions(col);
            col.sorting?.addHeaderElementAttributes();
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
     * Toggle sorting order for the column in the order: asc -> desc -> none
     */
    public toggle = (): void => {
        const viewport = this.column.viewport;
        const querying = viewport.grid.querying;
        const sortingController = querying.sorting;

        const currentOrder = (
            sortingController.currentSorting?.columnId === this.column.id ?
                sortingController.currentSorting.order : null
        ) || 'none';

        const consequents = {
            none: 'asc',
            asc: 'desc',
            desc: null
        } as const;

        void this.setOrder(consequents[currentOrder]);
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
