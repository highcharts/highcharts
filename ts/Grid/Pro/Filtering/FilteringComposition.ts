/* *
 *
 *  Grid Filtering class
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

import type HeaderCell from '../../Core/Table/Header/HeaderCell';

import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';
import GU from '../../Core/GridUtils.js';
import ColumnFiltering from './ColumnFiltering.js';

const {
    addEvent,
    pushUnique
} = U;

const {
    makeHTMLElement
} = GU;

/* *
 *
 *  Class Namespace
 *
 * */

namespace FilteringComposition {
    /**
     * The class names used by the filtering functionality.
     */
    export const classNames = {
        colFilterWrapper: Globals.classNamePrefix + 'col-filter-wrapper'
    } as const;

    /**
     * Extends the grid classes with customizable credits.
     *
     * @param HeaderCellClass
     * The class to extend.
     *
     */
    export function compose(
        HeaderCellClass: typeof HeaderCell
    ): void {
        if (!pushUnique(Globals.composed, 'Filtering')) {
            return;
        }

        addEvent(HeaderCellClass, 'afterRender', renderFilteringInput);
    }

    /**
     * Render init in header.
     * @param this
     * Reference to columns's header.
     */
    function renderFilteringInput(this: HeaderCell): void {
        const column = this.column;

        if (
            !column ||
            !this.headerContent ||
            !column.options?.filtering?.enabled
        ) {
            return;
        }

        column.filtering = new ColumnFiltering(column);

        const inputWrapper = makeHTMLElement('div', {
            className: FilteringComposition.classNames.colFilterWrapper
        }, this.htmlElement);

        this.filterInput = makeHTMLElement('input', {}, inputWrapper);
        this.headerContent.style.paddingBottom =
            this.filterInput.offsetHeight + this.filterInput.offsetTop + 'px';
        const filteringOptions = column.options.filtering;

        if (filteringOptions?.condition) {
            void column.filtering?.applyFilter(filteringOptions);
        }
    }
}

/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Table/Header/HeaderCell' {
    export default interface HeaderCell {
        filterInput: HTMLInputElement
    }
}

declare module '../../Core/Table/Column' {
    export default interface Column {
        /**
         * The filtering controller for the column.
         */
        filtering?: ColumnFiltering;
    }
}

declare module '../../Core/Options' {
    interface IndividualColumnOptions {
        /**
         * Events options triggered by the grid elements.
         */
        filtering?: FilteringLiteConditionOptions;
    }

    /**
     * Column filtering options.
     */
    export interface FilteringLiteConditionOptions {
        /**
         * The condition to use for filtering the column.
         */
        condition?: 'contains' | 'doesNotContain' | 'equals' | 'doesNotEqual' |
        'beginsWith' | 'endsWith' | 'greaterThan' | 'greaterThanOrEqualTo' |
        'lessThan' | 'lessThanOrEqualTo' | 'before' | 'after' | 'empty' |
        'notEmpty';

        /**
         * Whether the filtering is enabled or not.
         */
        enabled?: boolean;

        /**
         * The value that is used with the condition to filter the column.
         */
        value?: string;
    }
}
/* *
 *
 *  Default Export
 *
 * */

export default FilteringComposition;
