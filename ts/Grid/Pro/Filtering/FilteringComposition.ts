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
 *  - Kamil Kubik
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
        'endsWith',
        'empty',
        'notEmpty'
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
        'lessThanOrEqualTo',
        'empty',
        'notEmpty'
    ] as const;

    /**
     * DateTime conditions values for the condition select options.
     */
    export const dateTimeConditions: DateTimeCondition[] = [
        'equals',
        'doesNotEqual',
        'before',
        'after',
        'empty',
        'notEmpty'
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
        this.filterInput.placeholder = 'value...';

        if (columnType === 'number') {
            this.filterInput.type = 'number';
        }

        if (columnType === 'datetime') {
            this.filterInput.type = 'date';
        }

        // Assign the default input value.
        if (filteringOptions.value) {
            this.filterInput.value = filteringOptions.value.toString();
        }

        // Attach keyup event listener (string type only).
        if (columnType === 'string' || columnType === 'number') {
            addEvent(this.filterInput, 'keyup', (e): void => {
                const value = e.target.value;
                filteringOptions.value =
                    columnType === 'number' ? Number(value) : value;
                void column.filtering?.applyFilter(filteringOptions);
            });
        }

        // Attach change event listener (number or datetime types).
        if (columnType === 'number' || columnType === 'datetime') {
            addEvent(this.filterInput, 'change', (e): void => {
                const value = e.target.value;
                filteringOptions.value =
                    columnType === 'number' ? Number(value) : value;
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
        // Render the select element.
        this.filterSelect = makeHTMLElement('select', {}, inputWrapper);

        // Render the options.
        for (const condition of conditions) {
            const optionElement = document.createElement('option');
            optionElement.value = condition;
            optionElement.textContent = parseCamelCaseToReadable(condition);
            this.filterSelect.appendChild(optionElement);
        }

        // Use condition from options or first available condition as default.
        const filteringCondition = filteringOptions.condition;
        if (filteringCondition && conditions.includes(filteringCondition)) {
            this.filterSelect.value = filteringCondition;
        } else {
            this.filterSelect.value = conditions[0];
            filteringOptions.condition = conditions[0];
        }

        // Attach event listener.
        addEvent(this.filterSelect, 'change', (e): void => {
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
                this.filterSelect = makeHTMLElement('select', {}, inputWrapper);

                // Render the options.
                for (const option of Object.keys(booleanValueMap)) {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    this.filterSelect.appendChild(optionElement);
                }

                // Assign the default select value.
                if (filteringOptions.value) {
                    this.filterSelect.value = filteringOptions.value.toString();
                }

                // Attach event listener.
                addEvent(this.filterSelect, 'change', (e): void => {
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

        // Apply initial filtering if provided from options.
        if (filteringOptions.value && filteringOptions.condition) {
            void column.filtering?.applyFilter(filteringOptions);
        }

        // Set the padding bottom of the header content to the height of the
        // filter select or input element.
        const filterSelect = this.filterSelect;
        const filterInput = this.filterInput;

        if (filterSelect) {
            this.headerContent.style.paddingBottom =
                filterSelect.offsetHeight + filterSelect.offsetTop + 'px';
        } else if (filterInput) {
            this.headerContent.style.paddingBottom =
                filterInput.offsetHeight + filterInput.offsetTop + 'px';
        }
    }

    /**
     * Parses a camel case string to a readable string.
     *
     * @param value
     * The camel case string to parse.
     *
     * @returns
     * The readable string.
     */
    function parseCamelCaseToReadable(value: string): string {
        return value
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .split(/\s+/).join(' ');
    }
}

/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Table/Header/HeaderCell' {
    export default interface HeaderCell {
        /**
         * The input element for the filtering. Can be of type `text`, `number`
         * or `date`.
         */
        filterInput: HTMLInputElement;

        /**
         * The select element setting the condition for the filtering.
         */
        filterSelect: HTMLSelectElement;
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
        | 'endsWith'
        | 'empty'
        | 'notEmpty';

    /**
     * Number filtering conditions.
     */
    export type NumberCondition =
        | 'equals'
        | 'doesNotEqual'
        | 'greaterThan'
        | 'greaterThanOrEqualTo'
        | 'lessThan'
        | 'lessThanOrEqualTo'
        | 'empty'
        | 'notEmpty';

    /**
     * DateTime filtering conditions.
     */
    export type DateTimeCondition =
        | 'equals'
        | 'doesNotEqual'
        | 'before'
        | 'after'
        | 'empty'
        | 'notEmpty';

    /**
     * Combined filtering conditions.
     */
    export type Condition =
        StringCondition | NumberCondition | DateTimeCondition;

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
