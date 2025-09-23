/* *
 *
 *  Grid ColumnFiltering class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
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

import type Column from '../../Column';
import type { FilteringCondition } from '../../../Options';
import type FilterCell from './FilterCell.js';

import U from '../../../../../Core/Utilities.js';
import GU from '../../../GridUtils.js';
import Globals from '../../../Globals.js';
import {
    booleanConditions,
    conditionsMap,
    BooleanCondition,
    Condition,
    booleanValueMap
} from './FilteringTypes.js';

const { fireEvent, addEvent } = U;
const { makeHTMLElement } = GU;

/* *
 *
 *  Class
 *
 * */

/**
 * Class that manages filtering for a dedicated column.
 */
class ColumnFiltering {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The filtered column of the table.
     */
    public column: Column;

    /**
     * The filter cell of the column.
     */
    public inlineCell?: FilterCell;

    /**
     * The input element for the filtering. Can be of type `text`, `number`
     * or `date`.
     */
    public filterInput?: HTMLInputElement;

    /**
     * The select element setting the condition for the filtering.
     */
    public filterSelect?: HTMLSelectElement;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs filtering controller for a dedicated column.
     *
     * @param column
     * The filtered column.
     */
    constructor(column: Column) {
        this.column = column;
    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Applies the filtering to the column.
     *
     * @param options
     * The filtering options.
     */
    public async applyFilter(options: FilteringCondition): Promise<void> {
        const viewport = this.column.viewport;
        const querying = viewport.grid.querying;
        const filteringController = querying.filtering;

        fireEvent(this.column, 'beforeFiltering', {
            target: this.column
        });

        // Update the userOptions.
        this.column.update({ filtering: options }, false);

        filteringController.addColumnFilterCondition(this.column.id, options);

        await querying.proceed();
        await viewport.updateRows();

        fireEvent(this.column, 'afterFiltering', {
            target: this.column
        });
    }

    /**
     * Render the filtering input element, based on the column type.
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
    private renderFilteringInput(
        filteringOptions: FilteringCondition,
        inputWrapper: HTMLElement,
        columnType: Exclude<Column.DataType, 'boolean'>
    ): void {
        // Render the input element.
        this.filterInput = makeHTMLElement('input', {}, inputWrapper);
        this.filterInput.setAttribute('tabindex', '-1');
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

                if (columnType === 'number') {
                    // Set the number value to `undefined` if the input is empty
                    // to clear the filtering condition.
                    filteringOptions.value =
                        value === '' ? void 0 : Number(value);
                } else {
                    filteringOptions.value = value;
                }

                void this.applyFilter(filteringOptions);
            });
        }

        // Attach change event listener (number or datetime types).
        if (columnType === 'number' || columnType === 'datetime') {
            addEvent(this.filterInput, 'change', (e): void => {
                const value = e.target.value;

                if (columnType === 'number') {
                    // Set the number value to `undefined` if the input is empty
                    // to clear the filtering condition.
                    filteringOptions.value =
                        value === '' ? void 0 : Number(value);
                } else {
                    filteringOptions.value = value;
                }

                void this.applyFilter(filteringOptions);
            });
        }
    }

    /**
     * Render the condition select element.
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
    private renderConditionSelect(
        filteringOptions: FilteringCondition,
        inputWrapper: HTMLElement,
        conditions: readonly Condition[]
    ): void {
        // Render the select element.
        this.filterSelect = makeHTMLElement('select', {}, inputWrapper);
        this.filterSelect.setAttribute('tabindex', '-1');

        // Render the options.
        for (const condition of conditions) {
            const optionElement = document.createElement('option');
            optionElement.value = condition;
            optionElement.textContent =
                this.parseCamelCaseToReadable(condition);
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

            // Disable the input since the `empty` or `notEmpty` condition
            // doesn't require a value.
            if (option === 'empty' || option === 'notEmpty') {
                this.filterInput && (this.filterInput.disabled = true);
            } else if (this.filterInput?.disabled) {
                this.filterInput.disabled = false;
            }

            void this.applyFilter(filteringOptions);
        });
    }

    /**
     * Render the filtering content in the container.
     *
     * @param container
     * The container element.
     */
    public renderFilteringContent(container: HTMLElement): void {
        const column = this.column;
        const filteringOptions = column.options?.filtering;

        if (!column || !filteringOptions?.enabled) {
            return;
        }

        // Render the input wrapper.
        const inputWrapper = makeHTMLElement('div', {
            className: Globals.getClassName('columnFilterWrapper')
        }, container);
        const columnType = column.dataType;

        // Render the proper element based on the column type.
        switch (columnType) {
            case 'string':
            case 'number':
            case 'datetime':
                // Render the input element.
                this.renderFilteringInput(
                    filteringOptions,
                    inputWrapper,
                    columnType
                );

                // Render the condition select element.
                this.renderConditionSelect(
                    filteringOptions,
                    inputWrapper,
                    conditionsMap[columnType]
                );
                break;
            case 'boolean':
                // Render the select element.
                this.filterSelect = makeHTMLElement('select', {}, inputWrapper);
                this.filterSelect.setAttribute('tabindex', '-1');

                // Render the options.
                for (const option of booleanConditions) {
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
                    const option: BooleanCondition = e.target.value;

                    filteringOptions.value = booleanValueMap[option];

                    if (option !== 'all') {
                        filteringOptions.condition = 'equals';

                        // Clear the condition if the "all" option is selected.
                    } else {
                        delete filteringOptions.condition;
                    }

                    void this.applyFilter(filteringOptions);
                });
                break;
        }

        // Set the padding bottom of the header content to the height of the
        // filter select or input element.
        const headerContent = container.querySelector(
            Globals.getClassName('headerCellContent')
        ) as HTMLElement;
        if (headerContent) {
            const filterSelect = this.filterSelect;
            const filterInput = this.filterInput;

            if (filterSelect) {
                headerContent.style.paddingBottom =
                    filterSelect.offsetHeight + filterSelect.offsetTop + 'px';
            } else if (filterInput) {
                headerContent.style.paddingBottom =
                    filterInput.offsetHeight + filterInput.offsetTop + 'px';
            }
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
    private parseCamelCaseToReadable(value: string): string {
        return value
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .split(/\s+/).join(' ');
    }

    public async set(value?: string, condition?: Condition): Promise<void> {
        if (this.filterInput) {
            this.filterInput.value = value ?? '';
        }

        if (this.filterSelect) {
            this.filterSelect.value =
                condition ?? conditionsMap[this.column.dataType][0];
        }

        await this.applyFilter({ value, condition });
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnFiltering;
