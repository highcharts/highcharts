/* *
 *
 *  Grid default options
 *
 *  (c) 2009-2026 Highsoft AS
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

import type { Options, LangOptions } from './Options';
import type { DeepPartial } from '../../Shared/Types';

import Pagination from './Pagination/Pagination.js';
import Utils from '../../Core/Utilities.js';

const { merge } = Utils;

/**
 * Default language options for the Grid.
 */
export const defaultLangOptions: DeepPartial<LangOptions> = {
    accessibility: {
        sorting: {
            sortable: 'Sortable.',
            announcements: {
                ascending: 'Sorted ascending.',
                descending: 'Sorted descending.',
                none: 'Not sorted.'
            }
        },
        pagination: {
            announcements: {
                pageSizeChange: 'Page size changed to',
                pageChange: 'Page changed to'
            }
        },
        filtering: {
            announcements: {
                filterApplied: 'Filter applied for {columnId}, ' +
                    '{condition} {value}. {rowsCount} results found.',
                emptyFilterApplied: 'Filter applied for {columnId}, ' +
                    '{condition} values. {rowsCount} results found.',
                filterCleared: 'Filter cleared for {columnId}. ' +
                    '{rowsCount} results found.'
            }
        },
        screenReaderSection: {
            beforeRegionLabel: '',
            afterRegionLabel: ''
        }
    },
    loading: 'Loading...',
    noData: 'No data to display',
    filter: 'Filter',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    column: 'Column',
    setFilter: 'Set filter',
    pagination: {
        pageInfo: 'Showing {start} - {end} of {total} ' +
            '(page {currentPage} of {totalPages})',
        pageSizeLabel: 'rows per page',
        firstPage: 'First page',
        previousPage: 'Previous page',
        nextPage: 'Next page',
        lastPage: 'Last page',
        pageNumber: 'Page {page}',
        ellipsis: 'More pages'
    },
    columnFilteringConditions: {
        contains: 'Contains',
        doesNotContain: 'Does not contain',
        equals: 'Equals',
        doesNotEqual: 'Does not equal',
        beginsWith: 'Begins with',
        endsWith: 'Ends with',
        empty: 'Empty',
        notEmpty: 'Not empty',
        greaterThan: 'Greater than',
        greaterThanOrEqualTo: 'Greater than or equal to',
        lessThan: 'Less than',
        lessThanOrEqualTo: 'Less than or equal to',
        before: 'Before',
        after: 'After',
        all: 'All',
        'true': 'True',
        'false': 'False'
    }
};

/**
 * Default options for the Grid.
 */
export const defaultOptions: DeepPartial<Options> = {
    accessibility: {
        enabled: true,
        highContrastMode: 'auto',
        announcements: {
            sorting: true,
            filtering: true
        },
        screenReaderSection: {
            beforeGridFormat:
                '{gridTitle}' +
                '<div>{gridDescription}</div>' +
                '<div>Grid with {rowCount} rows and {columnCount}' +
                ' columns.</div>',
            afterGridFormat: 'End of Grid.'
        }
    },
    time: {
        timezone: 'UTC'
    },
    rendering: {
        rows: {
            bufferSize: 10,
            minVisibleRows: 2,
            strictHeights: false,
            virtualizationThreshold: 50
        },
        header: {
            enabled: true
        },
        columns: {
            resizing: {
                enabled: true,
                mode: 'adjacent'
            }
        },
        theme: 'hcg-theme-default'
    },
    columnDefaults: {
        sorting: {
            enabled: true
        },
        filtering: {
            inline: false
        }
    },
    pagination: Pagination.defaultOptions,
    lang: defaultLangOptions
};

/**
 * Merge the default options with custom options. Commonly used for defining
 * reusable templates.
 *
 * @param options
 * The new custom grid options.
 */
export function setOptions(
    options: DeepPartial<Options>
): void {
    merge(true, defaultOptions, options);
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    defaultOptions,
    setOptions
} as const;
