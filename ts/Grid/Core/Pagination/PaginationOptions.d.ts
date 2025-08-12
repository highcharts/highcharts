/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

/**
 * Page size selector configuration options.
 */
export interface PageSizeSelectorOptions {
    /**
     * Whether the page size selector is enabled.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Available options for page size dropdown.
     *
     * @default [10, 20, 50, 100]
     */
    options?: Array<number>;
}

/**
 * Controls options for pagination UI elements.
 */
export interface PaginationControlsOptions {
    /**
     * Page size selector configuration including available options and enabled state.
     * Users can select from the options to change the number of items displayed per page.
     *
     * @default { enabled: true, options: [10, 20, 50, 100] }
     */
    pageSizeSelector: PageSizeSelectorOptions;

    /**
     * Whether to show the page information text (e.g., "Showing 1 - 20 of 254").
     *
     * @default true
     */
    pageInfo?: boolean;

    /**
     * Whether to show the first/last page navigation buttons.
     *
     * @default true
     */
    firstLastButtons?: boolean;

    /**
     * Whether to show the previous/next page navigation buttons.
     *
     * @default true
     */
    prevNextButtons?: boolean;

    /**
     * Page number buttons configuration.
     *
     * @default { enabled: true, count: 5 }
     */
    pageButtons?: {
        /**
         * Whether to show page number buttons.
         *
         * @default true
         */
        enabled?: boolean;

        /**
         * Maximum number of page number buttons to show before using ellipsis.
         *
         * @default 5
         */
        count?: number;
    };
}

/**
 * Language options for pagination text values.
 */
export interface PaginationLangOptions {
    /**
     * Text for the page information display.
     * Placeholders: {start}, {end}, {total}
     *
     * @default "Showing {start} - {end} of {total}"
     */
    pageInfo?: string;

    /**
     * Text for the page size label.
     *
     * @default "rows per page"
     */
    pageSizeLabel?: string;

    /**
     * Text for the first page button (accessibility).
     *
     * @default "First page"
     */
    firstPage?: string;

    /**
     * Text for the previous page button (accessibility).
     *
     * @default "Previous page"
     */
    previousPage?: string;

    /**
     * Text for the next page button (accessibility).
     *
     * @default "Next page"
     */
    nextPage?: string;

    /**
     * Text for the last page button (accessibility).
     *
     * @default "Last page"
     */
    lastPage?: string;

    /**
     * Text for page number button (accessibility).
     * Placeholder: {page}
     *
     * @default "Page {page}"
     */
    pageNumber?: string;

    /**
     * Text for ellipsis (accessibility).
     *
     * @default "More pages"
     */
    ellipsis?: string;
}

/**
 * Pagination options.
 */
export interface PaginationOptions {
    /**
     * Whether the pagination should be rendered.
     *
     * @default false
     */
    enabled: boolean;

    /**
     * Initial number of items per page when the Grid is initialized.
     * This value will be used as the default page size if not specified in pageSizeSelector options.
     *
     * @default 10
     */
    pageSize?: number;

    /**
     * Controls options for pagination UI elements.
     */
    controls: PaginationControlsOptions;

    /**
     * Events for the pagination.
     */
    events?: PaginationEvents;
}

/**
 * Pagination events.
 */
export interface PaginationEvents {
    /**
     * Fired before a page change occurs.
     *
     * @param currentPage The current page number
     * @param newPage The page number being navigated to
     * @param itemsPerPage The current items per page setting
     */
    beforePageChange?: (currentPage: number, newPage: number, itemsPerPage: number) => void;

    /**
     * Fired after a page change occurs.
     *
     * @param currentPage The new current page number
     * @param itemsPerPage The current items per page setting
     */
    afterPageChange?: (currentPage: number, itemsPerPage: number) => void;

    /**
     * Fired before the page size setting changes.
     *
     * @param newPageSize The new page size value
     * @param oldPageSize The previous page size value
     */
    beforePageSizeChange?: (newPageSize: number, oldPageSize: number) => void;

    /**
     * Fired after the page size setting changes.
     *
     * @param newPageSize The new page size value
     * @param oldPageSize The previous page size value
     */
    afterPageSizeChange?: (newPageSize: number, oldPageSize: number) => void;
}
