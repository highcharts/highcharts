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

import Column from '../Column.js';
import Globals from '../Globals.js';

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
    public headElement: HTMLElement;


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
     * @param headElement
     * The head element of the column.
     */
    constructor(column: Column, headElement: HTMLElement) {
        this.column = column;
        this.headElement = headElement;

        this.addHeaderElementAttributes();
        this.addSortingEvents();
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
        const sortingOptions = this.column.options.sorting;

        if (sortingOptions?.sortable) {
            this.headElement.classList.add(Globals.classNames.columnSortable);
        }

        let className: string | undefined;
        switch (sortingOptions?.order) {
            case 'asc':
                className = Globals.classNames.columnSortedAsc;
                break;
            case 'desc':
                className = Globals.classNames.columnSortedDesc;
                break;
        }

        if (className) {
            this.headElement.classList.add(className);
        }
    }

    /**
     * Adds CSS classes and click event to the header of column.
     */
    private addSortingEvents(): void {
        this.column.header?.headerContent?.addEventListener(
            'click',
            this.setSortingState
        );
    }

    /**
     * Apply the dedicated sorting for a column
     * (ascending, descending or default).
     */
    private setSortingState = (): void => {
        const currentOrder = this.column.options.sorting?.order || 'none';
        const consequents = {
            none: 'asc',
            asc: 'desc',
            desc: null
        } as const;

        const newOrder = consequents[currentOrder];

        // TODO: Rebuild sorting after impementing the re-rendering of the
        // rows only, without the whole table. Then, call the `afterSorting`
        // callback option.

        void this.column.update({
            sorting: {
                order: newOrder
            }
        });
    };

    /**
     * Unbind click event
     */
    public removeEventListeners(): void {
        this.headElement.removeEventListener('click', this.setSortingState);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace ColumnSorting {
    export type SortingState = 'asc' | 'desc' | 'none';
}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnSorting;
