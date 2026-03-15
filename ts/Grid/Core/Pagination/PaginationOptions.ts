/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
     * Page size selector configuration including available options and enabled
     * state. Users can select from the options to change the number of items
     * displayed per page.
     *
     * @default { enabled: true, options: [10, 20, 50, 100] }
     */
    pageSizeSelector?: boolean | PageSizeSelectorOptions;

    /**
     * Whether to show the page information text
     * (e.g., "Showing 1 - 20 of 200").
     *
     * @default true
     */
    pageInfo?: boolean | PageInfoOptions;

    /**
     * Whether to show the first/last page controls buttons.
     *
     * @default true
     */
    firstLastButtons?: boolean | FirstLastButtonsOptions;

    /**
     * Whether to show the previous/next page controls buttons.
     *
     * @default true
     */
    previousNextButtons?: boolean | PreviousNextButtonsOptions;

    /**
     * Direct page navigation configuration.
     *
     * @default { enabled: true, renderer: 'buttons', count: 7 }
     */
    pageNavigation?: boolean | PageNavigationOptions;

    /**
     * Page number buttons configuration.
     *
     * @deprecated Use `pageNavigation` instead.
     *
     * @default { enabled: true, count: 7 }
     */
    pageButtons?: boolean | PageButtonsOptions;
}

/**
 * Language options for pagination text values.
 */
export interface PaginationLangOptions {
    /**
     * Text for the page information display.
     * Placeholders: {start}, {end}, {total}, {currentPage}, {totalPages}
     *
     * @default "Showing {start} - {end} of {total} (Page {currentPage} of {totalPages})" // eslint-disable-line
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

    /**
     * Text for the page selector label (accessibility).
     *
     * @default "Select page"
     */
    pageSelectLabel?: string;
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
    enabled?: boolean;

    /**
     * The current page number.
     *
     * @default 1
     */
    page?: number;

    /**
     * Initial number of items per page when the Grid is initialized.
     * This value will be used as the default page size if not specified
     * in pageSizeSelector options.
     *
     * @default 10
     */
    pageSize?: number;

    /**
     * Position of the pagination container relative to the table.
     *
     * @default 'bottom'
     */
    position?: string;

    /**
     * Alignment of the pagination elements within the wrapper.
     */
    align?: 'left' | 'center' | 'right' | 'distributed';

    /**
     * Controls options for pagination UI elements.
     */
    controls?: PaginationControlsOptions;
}

/**
 * Page buttons configuration options.
 */
export interface PageButtonsOptions {
    /**
     * Whether to show page number buttons.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Maximum number of page number buttons to show before using ellipsis.
     *
     * Use `'all'` to render every page without ellipsis.
     *
     * @default 7
     */
    count?: number | 'all';
}

/**
 * Direct page navigation configuration options.
 */
export interface PageNavigationOptions {
    /**
     * Whether to show direct page navigation.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Direct page navigation renderer.
     *
     * @default "buttons"
     */
    renderer?: 'buttons' | 'select';

    /**
     * Maximum number of page entries to show before using ellipsis.
     * Use `'all'` to render every page without ellipsis.
     *
     * @default 7
     */
    count?: number | 'all';
}

/**
 * Page info configuration options.
 */
export interface PageInfoOptions {
    /**
     * Whether to show the page information text.
     *
     * @default true
     */
    enabled?: boolean;
}

/**
 * First/last page navigation buttons configuration options.
 */
export interface FirstLastButtonsOptions {
    /**
     * Whether to show the first/last page navigation buttons.
     *
     * @default true
     */
    enabled?: boolean;
}

/**
 * Previous/next page navigation buttons configuration options.
 */
export interface PreviousNextButtonsOptions {
    /**
     * Whether to show the previous/next page navigation buttons.
     *
     * @default true
     */
    enabled?: boolean;
}
