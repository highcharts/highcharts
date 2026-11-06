/* *
 *
 *  Grid Value List Filter class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */


'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Button from '../../Core/UI/Button';
import type ColumnFiltering from
    '../../Core/Table/Actions/ColumnFiltering/ColumnFiltering';
import type { FilteringRuleItem } from '../../Core/Options';
import type { ValueListFilterLangOptions } from './ValueListFilterOptions';

import Globals from '../../Core/Globals.js';
import ValueListPopup from './ValueListPopup.js';
import { hasDataTableProvider } from '../../Core/Data/DataProvider.js';
import {
    focusNextControl,
    formatText,
    joinClassNames,
    makeHTMLElement
} from '../../Core/GridUtils.js';
import { isArray } from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

const classNames = {
    items: Globals.classNamePrefix + 'value-list-items',
    item: Globals.classNamePrefix + 'value-list-item',
    toggle: Globals.classNamePrefix + 'value-list-toggle'
};


/* *
 *
 *  Class
 *
 * */

/**
 * The value editor of the `oneOf` filtering operator: the unique values of the
 * column, each with a checkbox. It renders as a list where the filter UI has
 * the room for it, and behind a button opening a popup in the filter row.
 */
class ValueListFilter implements Button {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The column filtering the value list belongs to.
     */
    public filtering: ColumnFiltering;

    /**
     * The popup holding the list in inline filtering.
     */
    public popup?: ValueListPopup;

    /**
     * The unique values of the column, blanks first.
     */
    private values: FilteringRuleItem[] = [];

    /**
     * The selected values of the column.
     */
    private selected = new Set<FilteringRuleItem>();

    /**
     * The checkboxes of the values, in the order of the list.
     */
    private itemInputs: HTMLInputElement[] = [];

    /**
     * The button opening the popup in inline filtering.
     */
    private toggleButton?: HTMLButtonElement;

    /**
     * The element holding the checkboxes.
     */
    private itemsElement?: HTMLElement;

    /**
     * The checkbox toggling every value.
     */
    private selectAllInput?: HTMLInputElement;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs the value list of a filtered column.
     *
     * @param filtering
     * The column filtering the value list belongs to.
     */
    constructor(filtering: ColumnFiltering) {
        this.filtering = filtering;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Renders the value editor and returns its controls, in the order the
     * arrow keys navigate them.
     *
     * @param container
     * The element to render the editor in.
     */
    public render(container: HTMLElement): HTMLElement[] {
        const column = this.filtering.column;

        if (
            !column.viewport.grid.columnPolicy
                .isColumnInlineFilteringEnabled(column.id)
        ) {
            return this.renderList(container);
        }

        // The list does not fit the filter row, so it opens in a popup.
        const button = makeHTMLElement<HTMLButtonElement>('button', {
            className: joinClassNames(
                Globals.getClassName('input'),
                classNames.toggle
            ),
            innerText: this.getSummary()
        }, container);

        button.type = 'button';
        button.setAttribute('tabindex', '-1');
        button.addEventListener('click', (): void => {
            this.popup ??= new ValueListPopup(this);
            this.popup.toggle(button);
        });

        this.toggleButton = button;

        return [button];
    }

    /**
     * Renders the checkbox of every value, and the one toggling them all.
     *
     * @param container
     * The element to render the list in.
     */
    public renderList(container: HTMLElement): HTMLElement[] {
        this.values = this.getUniqueValues();
        this.loadSelection();

        const items = this.itemsElement = makeHTMLElement('div', {
            className: classNames.items
        }, container);

        this.itemInputs = [];
        this.selectAllInput = this.renderItem(
            items,
            this.getLang().selectAll || '',
            (checked): void => this.toggle(this.values, checked)
        );

        for (const value of this.values) {
            this.itemInputs.push(this.renderItem(
                items,
                this.getLabel(value),
                (checked): void => this.toggle([value], checked)
            ));
        }

        this.refreshChecked();

        return this.getControls();
    }

    /**
     * Handles the keydown event of the popup holding the list, so that the
     * arrow keys navigate the checkboxes there too.
     *
     * @param e
     * The keyboard event.
     */
    public onKeyDown(e: KeyboardEvent): void {
        focusNextControl(this.getControls(), e);
    }

    /**
     * Re-reads the applied selection, so that the list and the button follow
     * the filter when it changes outside of them.
     */
    public refresh(): void {
        this.loadSelection();

        if (this.toggleButton) {
            this.toggleButton.innerText = this.getSummary();
        }

        if (this.itemsElement?.isConnected) {
            this.refreshChecked();
        }
    }

    /**
     * Focuses the first checkbox of the rendered list.
     */
    public focusList(): void {
        this.selectAllInput?.focus();
    }

    public focus(): void {
        this.toggleButton?.focus();
    }

    public setHighlighted(highlighted: boolean): void {
        this.toggleButton?.classList.toggle(
            Globals.getClassName('buttonSelected'),
            highlighted
        );
    }

    public setActive(): void {
        // The button reads its state from the applied selection instead.
    }

    /**
     * Selects or deselects values and filters the column with the result.
     *
     * @param values
     * The values to select or deselect.
     *
     * @param checked
     * Whether the values become selected.
     */
    private toggle(values: FilteringRuleItem[], checked: boolean): void {
        for (const value of values) {
            if (checked) {
                this.selected.add(value);
            } else {
                this.selected.delete(value);
            }
        }

        this.refreshChecked();

        const selected = this.values.filter(
            (value): boolean => this.selected.has(value)
        );

        // Selecting every value clears the filter, so that the column is not
        // marked as filtered.
        void this.filtering.set(
            selected.length === this.values.length ? void 0 : selected,
            'oneOf'
        );
    }

    /**
     * Returns the checkboxes in the order the arrow keys navigate them.
     */
    private getControls(): HTMLElement[] {
        return this.selectAllInput ?
            [this.selectAllInput, ...this.itemInputs] :
            [];
    }

    /**
     * Renders one labeled checkbox of the list.
     *
     * @param parent
     * The element to render the checkbox in.
     *
     * @param label
     * The label of the checkbox.
     *
     * @param onChange
     * Callback invoked with the new state of the checkbox.
     */
    private renderItem(
        parent: HTMLElement,
        label: string,
        onChange: (checked: boolean) => void
    ): HTMLInputElement {
        const item = makeHTMLElement('label', {
            className: classNames.item
        }, parent);

        const input = makeHTMLElement<HTMLInputElement>('input', {
            className: Globals.getClassName('input')
        }, item);
        input.type = 'checkbox';
        input.setAttribute('tabindex', '-1');
        input.addEventListener('change', (): void => {
            onChange(input.checked);
        });

        makeHTMLElement('span', { innerText: label }, item);

        return input;
    }

    /**
     * Checks the boxes of the selected values, without re-rendering them, so
     * that the clicked checkbox keeps the focus.
     */
    private refreshChecked(): void {
        const values = this.values;
        let selectedCount = 0;

        for (let i = 0, iEnd = this.itemInputs.length; i < iEnd; ++i) {
            const checked = this.selected.has(values[i]);

            this.itemInputs[i].checked = checked;
            selectedCount += checked ? 1 : 0;
        }

        if (this.selectAllInput) {
            this.selectAllInput.checked = (
                values.length > 0 && selectedCount === values.length
            );
            this.selectAllInput.indeterminate = (
                selectedCount > 0 && selectedCount < values.length
            );
        }
    }

    /**
     * Reads the applied selection from the column options. Without an applied
     * rule, every value is selected.
     */
    private loadSelection(): void {
        const value = this.filtering.column.options.filtering?.rule?.value;

        this.selected = new Set(isArray(value) ? value : this.values);
    }

    /**
     * Returns the values offered in the list: the `filtering.values` option
     * when it is set, otherwise the unique values of the column data, sorted,
     * with a blank entry when the column holds empty cells.
     */
    private getUniqueValues(): FilteringRuleItem[] {
        const column = this.filtering.column;
        const optionValues = column.options.filtering?.values;
        if (optionValues) {
            return optionValues;
        }

        const grid = column.viewport.grid;
        const dataProvider = grid.dataProvider;
        const sourceColumnId = grid.columnPolicy.getColumnSourceId(column.id);
        if (!hasDataTableProvider(dataProvider) || !sourceColumnId) {
            return [];
        }

        // Read from the unfiltered data, so that excluding a value does not
        // remove it from the list.
        const data = dataProvider.getDataTable()?.getColumn(sourceColumnId);
        const values: FilteringRuleItem[] = [];
        const seen = new Set<FilteringRuleItem>();
        let hasBlanks = false;

        for (let i = 0, iEnd = data?.length || 0; i < iEnd; ++i) {
            const value = data?.[i];

            if (value === null || value === '' || value === void 0) {
                hasBlanks = true;
            } else if (!seen.has(value)) {
                seen.add(value);
                values.push(value);
            }
        }

        values.sort((a, b): number => (
            typeof a === 'number' && typeof b === 'number' ?
                a - b :
                String(a).localeCompare(String(b))
        ));

        if (hasBlanks) {
            values.unshift(null);
        }

        return values;
    }

    /**
     * Returns the label a value is listed with.
     *
     * @param value
     * The value to label.
     */
    private getLabel(value: FilteringRuleItem): string {
        if (value === null) {
            return this.getLang().blanks || '';
        }

        const column = this.filtering.column;
        if (column.dataType === 'datetime') {
            return column.viewport.grid.time.dateFormat(
                '%Y-%m-%d',
                Number(value)
            );
        }

        return String(value);
    }

    /**
     * Returns the label of the button opening the popup.
     */
    private getSummary(): string {
        const lang = this.getLang();
        const value = this.filtering.column.options.filtering?.rule?.value;

        return isArray(value) ?
            formatText(lang.selected || '', { count: value.length }) :
            lang.all || '';
    }

    /**
     * Returns the language options of the value list.
     */
    private getLang(): ValueListFilterLangOptions {
        return (
            this.filtering.column.viewport.grid.options
                ?.lang?.valueListFilter || {}
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ValueListFilter;
