/* *
 *
 *  Grid Pagination Controller class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import QueryingController from './QueryingController.js';
import RangeModifier from '../../../Data/Modifiers/RangeModifier.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages one of the data grid querying types - pagination.
 */
class PaginationController {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The grid instance.
     */
    private querying: QueryingController;

    /**
     * The modifier that is applied to the data table.
     */
    public modifier?: RangeModifier;

    /**
     * The current page.
     */
    public currentPage?: number;

    /**
     * Whether the next button is pressed.
     */
    public isNext?: boolean = false;

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs the PaginationController instance.
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
     * Sets the range options.
     *
     * @param currentPage
     * The current page.
     *
     * @param isNext
     * Whether the next button is pressed.
     */
    public setRange(currentPage: number, isNext: boolean): void {
        this.currentPage = currentPage;
        this.isNext = isNext;
        this.querying.shouldBeUpdated = true;
        this.modifier = this.createModifier();
    }

    /**
     * Loads range options from the grid options.
     */
    public loadOptions(): void {
        const pagination = this.querying.grid.pagination;

        if (
            pagination &&
            pagination.options.enabled &&
            this.currentPage !== pagination.currentPage
        ) {
            this.currentPage = pagination.currentPage;
            this.isNext = pagination.isNext;
            this.setRange(this.currentPage, this.isNext);
        }
    }

    /**
     * Returns the range modifier.
     */
    private createModifier(): RangeModifier | undefined {
        const isNext = this.isNext;
        const currentPage = this.currentPage || 0;
        const itemsPerPage =
            this.querying.grid.pagination?.options.itemsPerPage;

        if (!itemsPerPage) {
            return;
        }

        const start = currentPage * itemsPerPage;

        return new RangeModifier({
            start: isNext ? start : start - itemsPerPage,
            end: start + (isNext ? itemsPerPage : 0)
        });
    }

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace PaginationController {

}


/* *
 *
 *  Default Export
 *
 * */

export default PaginationController;
