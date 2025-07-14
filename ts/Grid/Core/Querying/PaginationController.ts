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
    public isNextPage?: boolean = false;

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
     * @param isNextPage
     * Whether the next button is pressed.
     */
    public setRange(currentPage: number, isNextPage: boolean): void {
        this.currentPage = currentPage;
        this.isNextPage = isNextPage;
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
            this.isNextPage = pagination.isNextPage;
            this.setRange(this.currentPage, this.isNextPage);
        }
    }

    /**
     * Returns the range modifier.
     */
    private createModifier(): RangeModifier | undefined {
        const isNextPage = this.isNextPage;
        const currentPage = this.currentPage || 0;
        const itemsPerPage =
            this.querying.grid.pagination?.itemsPerPage;

        if (!itemsPerPage) {
            return;
        }

        const start = currentPage * itemsPerPage;

        return new RangeModifier({
            start: isNextPage ? start : start - itemsPerPage,
            end: start + (isNextPage ? itemsPerPage : 0)
        });
    }

    /**
     * Destroys the pagination controller.
     */
    public destroy(): void {
        delete this.modifier;
        delete this.currentPage;
        delete this.isNextPage;
        this.querying.shouldBeUpdated = true;
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
