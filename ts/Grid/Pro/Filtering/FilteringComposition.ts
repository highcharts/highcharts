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
     * The options for the boolean select.
     */
    export enum BooleanSelectOptions {
        All = 'all',
        True = 'true',
        False = 'false',
        Empty = 'empty'
    }

    /**
     * Corresponding values for the boolean select options.
     */
    export const booleanValueMap = {
        [BooleanSelectOptions.All]: 'all',
        [BooleanSelectOptions.True]: true,
        [BooleanSelectOptions.False]: false,
        [BooleanSelectOptions.Empty]: null
    } as const;

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

        // Render the input wrapper.
        const inputWrapper = makeHTMLElement('div', {
            className: FilteringComposition.classNames.colFilterWrapper
        }, this.htmlElement);
        const filteringOptions = column.options.filtering;

        // Render the proper element based on the column type.
        switch (column.dataType) {
            case 'string':
            case 'number':
            case 'datetime':
                // Render the input element.
                this.filterInput = makeHTMLElement('input', {}, inputWrapper);

                // Attach event listener.
                addEvent(this.filterInput, 'keyup', (e): void => {
                    filteringOptions.value = e.target.value;
                    filteringOptions.condition = 'contains';
                    void column.filtering?.applyFilter(filteringOptions);
                });
                break;
            case 'boolean':
                // Render the select element.
                this.filterInput = makeHTMLElement('select', {}, inputWrapper);

                // Render the options.
                for (const option of Object.values(BooleanSelectOptions)) {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;

                    // Set the default value.
                    if (option === BooleanSelectOptions.All) {
                        optionElement.selected = true;
                    }

                    this.filterInput.appendChild(optionElement);
                }

                // Attach event listener.
                addEvent(this.filterInput, 'change', (e): void => {
                    const option: keyof typeof booleanValueMap = e.target.value;

                    filteringOptions.value = booleanValueMap[option];

                    if (option !== BooleanSelectOptions.All) {
                        filteringOptions.condition = 'equals';

                        // Clear the condition if the "all" option is selected.
                    } else {
                        delete filteringOptions.condition;
                    }

                    void column.filtering?.applyFilter(filteringOptions);
                });
                break;
        }

        this.headerContent.style.paddingBottom =
            this.filterInput.offsetHeight + this.filterInput.offsetTop + 'px';
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
        value?: string | boolean | null;
    }
}
/* *
 *
 *  Default Export
 *
 * */

export default FilteringComposition;
