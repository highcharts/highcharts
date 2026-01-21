/* *
 *
 *  Grid Pagination Controller class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
     * Whether the pagination is enabled.
     */
    public enabled: boolean;

    /**
     * The current page (1-based index).
     */
    public currentPage: number = 1;

    /**
     * The current page size.
     */
    public currentPageSize: number = 10;

    /**
     * The number of rows before pagination.
     */
    private _totalItems?: number;


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
        this.enabled = !!querying.grid.options?.pagination?.enabled;
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Total number of items (rows)
     */
    public get totalItems(): number {
        return this._totalItems ?? this.querying.grid.dataTable?.rowCount ?? 0;
    }

    /**
     * Gets the total number of pages.
     */
    public get totalPages(): number {
        return this.currentPageSize > 0 ? Math.ceil(
            this.totalItems / this.currentPageSize
        ) : 1;
    }

    /**
     * Clamps the current page to the total number of pages.
     */
    public clampPage(): void {
        if (this.currentPage <= this.totalPages) {
            return;
        }

        this.currentPage = this.totalPages;
        this.querying.shouldBeUpdated = true;
    }

    /**
     * Sets the page.
     *
     * @param currentPage
     * The current page.
     */
    public setPage(currentPage: number): void {
        this.currentPage = currentPage;
        this.clampPage();
        this.querying.shouldBeUpdated = true;
    }

    /**
     * Sets the page size.
     *
     * @param pageSize
     * The page size.
     */
    public setPageSize(pageSize: number): void {
        this.currentPageSize = pageSize;
        this.querying.shouldBeUpdated = true;
    }

    /**
     * Loads range options from the grid options.
     */
    public loadOptions(): void {
        const options = this.querying.grid.options?.pagination || {};

        if (this.enabled === !options.enabled) {
            this.enabled = !!options.enabled;
            this.querying.shouldBeUpdated = true;
        }

        if (this.currentPageSize !== options.pageSize) {
            this.setPageSize(options.pageSize ?? this.currentPageSize);
        }

        if (this.currentPage !== options.page) {
            this.setPage(options.page ?? this.currentPage);
        }
    }

    /**
     * Returns the range modifier.
     *
     * @param rowsCountBeforePagination
     * The number of rows before pagination. Default is the number of rows in
     * the original data table.
     */
    public createModifier(
        rowsCountBeforePagination: number = (
            this.querying.grid.dataTable?.rowCount || 0
        )
    ): RangeModifier | undefined {
        if (!this.enabled) {
            return;
        }

        const currentPage = this.currentPage;
        const pageSize = this.currentPageSize;

        // Calculate the start index (0-based)
        const start = (currentPage - 1) * pageSize;
        const end = Math.min(
            start + pageSize,
            rowsCountBeforePagination
        );

        this._totalItems = rowsCountBeforePagination;

        return new RangeModifier({
            start,
            end
        });
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default PaginationController;
