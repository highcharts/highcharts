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
import type Column from '../../Core/Table/Column.js';
import type {
    DateTimeCondition,
    FilteringLiteConditionOptions,
    NumberCondition,
    Condition,
    StringCondition
} from '../../Core/Options';

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
    export type BooleanSelectOptions = 'all' | 'true' | 'false' | 'empty';

    /**
     * Corresponding values for the boolean select options.
     */
    export const booleanValueMap: Record<
        BooleanSelectOptions,
        'all' | boolean | null
    > = {
        'all': 'all',
        'true': true,
        'false': false,
        empty: null
    } as const;

    /**
     * String conditions values for the condition select options.
     */
    export const stringConditions: StringCondition[] = [
        'contains',
        'doesNotContain',
        'equals',
        'doesNotEqual',
        'beginsWith',
        'endsWith'
    ] as const;

    /**
     * Number conditions values for the condition select options.
     */
    export const numberConditions: NumberCondition[] = [
        'equals',
        'doesNotEqual',
        'greaterThan',
        'greaterThanOrEqualTo',
        'lessThan',
        'lessThanOrEqualTo'
    ] as const;

    /**
     * DateTime conditions values for the condition select options.
     */
    export const dateTimeConditions: DateTimeCondition[] = [
        'before',
        'after'
    ] as const;

    /**
     * Conditions map for the condition select options.
     */
    export const conditionsMap = {
        string: stringConditions,
        number: numberConditions,
        datetime: dateTimeConditions
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

        addEvent(HeaderCellClass, 'afterRender', renderFilteringContent);
    }

    /**
     * Render the filtering input element, based on the column type.
     *
     * @param this
     * Reference to the column's header.
     *
     * @param column
     * Reference to the column.
     *
     * @param filteringOptions
     * Reference to the filtering options.
     *
     * @param inputWrapper
     * Reference to the input wrapper.
     *
     * @param columnType
     * Reference to the column type.
     */
    function renderFilteringInput(
        this: HeaderCell,
        column: Column,
        filteringOptions: FilteringLiteConditionOptions,
        inputWrapper: HTMLElement,
        columnType: Exclude<Column.DataType, 'boolean'>
    ): void {
        // Render the input element.
        this.filterInput = makeHTMLElement('input', {}, inputWrapper);

        // TO DO: Handle the datetime type.
        if (columnType === 'number') {
            this.filterInput.type = 'number';
        }

        // Attach keyupevent listener.
        addEvent(this.filterInput, 'keyup', (e): void => {
            if (columnType === 'number') {
                filteringOptions.value = Number(e.target.value);

                // TO DO: Handle the datetime type.
            } else {
                filteringOptions.value = e.target.value;
            }

            void column.filtering?.applyFilter(filteringOptions);
        });

        // Attach change event listener (number type only).
        if (columnType === 'number') {
            addEvent(this.filterInput, 'change', (e): void => {
                filteringOptions.value = Number(e.target.value);
                void column.filtering?.applyFilter(filteringOptions);
            });
        }
    }

    /**
     * Render the condition select element.
     *
     * @param this
     * Reference to the column's header.
     *
     * @param column
     * Reference to the column.
     *
     * @param filteringOptions
     * Reference to the filtering options.
     *
     * @param inputWrapper
     * Reference to the input wrapper.
     *
     * @param conditions
     * Reference to the conditions, different for each condition type.
     */
    function renderConditionSelect(
        this: HeaderCell,
        column: Column,
        filteringOptions: FilteringLiteConditionOptions,
        inputWrapper: HTMLElement,
        conditions: Condition[]
    ): void {
        // Render the input element.
        this.filterInput = makeHTMLElement('select', {}, inputWrapper);

        // Render the options.
        let index = 0;
        for (const option of conditions) {
            const optionElement = document.createElement('option');

            optionElement.value = option;
            optionElement.textContent = option;

            // Always set the first option from map as selected.
            if (index === 0) {
                optionElement.selected = true;

                // Set the default condition.
                filteringOptions.condition = option;
            }

            this.filterInput.appendChild(optionElement);
            index++;
        }

        // Attach event listener.
        addEvent(this.filterInput, 'change', (e): void => {
            const option: Condition = e.target.value;
            filteringOptions.condition = option;
            void column.filtering?.applyFilter(filteringOptions);
        });
    }

    /**
     * Render the filtering content in the header.
     *
     * @param this
     * Reference to the column's header.
     */
    function renderFilteringContent(this: HeaderCell): void {
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
        const columnType = column.dataType;

        // Render the proper element based on the column type.
        switch (columnType) {
            case 'string':
            case 'number':
            case 'datetime':
                // Render the input element.
                renderFilteringInput.call(
                    this,
                    column,
                    filteringOptions,
                    inputWrapper,
                    columnType
                );

                // Render the condition select element.
                renderConditionSelect.call(
                    this,
                    column,
                    filteringOptions,
                    inputWrapper,
                    conditionsMap[columnType]
                );
                break;
            case 'boolean':
                // Render the select element.
                this.filterInput = makeHTMLElement('select', {}, inputWrapper);

                // Render the options.
                for (const option of Object.keys(booleanValueMap)) {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;

                    // Set the default value.
                    if (option === 'all') {
                        optionElement.selected = true;
                    }

                    this.filterInput.appendChild(optionElement);
                }

                // Attach event listener.
                addEvent(this.filterInput, 'change', (e): void => {
                    const option: keyof typeof booleanValueMap = e.target.value;

                    filteringOptions.value = booleanValueMap[option];

                    if (option !== 'all') {
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
     * String filtering conditions.
     */
    export type StringCondition =
        | 'contains'
        | 'doesNotContain'
        | 'equals'
        | 'doesNotEqual'
        | 'beginsWith'
        | 'endsWith';

    /**
     * Number filtering conditions.
     */
    export type NumberCondition =
        | 'equals'
        | 'doesNotEqual'
        | 'greaterThan'
        | 'greaterThanOrEqualTo'
        | 'lessThan'
        | 'lessThanOrEqualTo';

    /**
     * DateTime filtering conditions.
     */
    export type DateTimeCondition = 'before' | 'after';

    /**
     * Combined filtering conditions.
     */
    export type Condition =
        | StringCondition
        | NumberCondition
        | DateTimeCondition
        | 'notEmpty'
        | 'empty';

    /**
     * Column filtering options.
     */
    export interface FilteringLiteConditionOptions {
        /**
         * The condition to use for filtering the column.
         */
        condition?: Condition;

        /**
         * Whether the filtering is enabled or not.
         */
        enabled?: boolean;

        /**
         * The value that is used with the condition to filter the column.
         */
        value?: string | number | boolean | null;
    }
}
/* *
 *
 *  Default Export
 *
 * */

export default FilteringComposition;
