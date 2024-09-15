/* *
 *
 *  Data Grid class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
        const sortingOptions = col.options.sorting;
        const { currentSorting } = col.viewport.dataGrid.querying.sorting;

        const el = this.headerCellElement;

        if (sortingOptions?.sortable) {
            el.classList.add(Globals.classNames.columnSortable);
        }

        if (currentSorting?.columnId !== col.id || !currentSorting?.order) {
            el.classList.remove(Globals.classNames.columnSortedAsc);
            el.classList.remove(Globals.classNames.columnSortedDesc);
            return;
        }

        switch (currentSorting?.order) {
            case 'asc':
                el.classList.add(Globals.classNames.columnSortedAsc);
                el.classList.remove(Globals.classNames.columnSortedDesc);
                break;
            case 'desc':
                el.classList.remove(Globals.classNames.columnSortedAsc);
                el.classList.add(Globals.classNames.columnSortedDesc);
                break;
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
        const querying = viewport.dataGrid.querying;
        const sortingController = querying.sorting;

        sortingController.setSorting(order, this.column.id);
        await querying.proceed();

        viewport.loadPresentationData();

        for (const col of viewport.columns) {
            col.sorting?.addHeaderElementAttributes();
        }

        viewport.dataGrid.options?.events?.column?.afterSorting?.call(
            this.column
        );
    }

    /**
     * Toggle sorting order for the column in the order: asc -> desc -> none
     */
    public toggle = (): void => {
        const viewport = this.column.viewport;
        const querying = viewport.dataGrid.querying;
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
 *  Default Export
 *
 * */

export default ColumnSorting;
