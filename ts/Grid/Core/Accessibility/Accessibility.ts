/* *
 *
 *  Grid Accessibility class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type Grid from '../Grid';
import type { ColumnSortingOrder, FilteringCondition } from '../Options';
import whcm from '../../../Accessibility/HighContrastMode.js';

import Globals from '../Globals.js';
import ColumnFiltering from '../Table/Actions/ColumnFiltering/ColumnFiltering.js';
import GridUtils from '../GridUtils.js';
import AST from '../../../Core/Renderer/HTML/AST.js';
import U from '../../../Core/Utilities.js';
import HTMLU from '../../../Accessibility/Utils/HTMLUtilities.js';

const { formatText } = GridUtils;
const { replaceNested } = U;
const { getHeadingTagNameForElement } = HTMLU;


/**
 *  Representing the accessibility functionalities for the Data Grid.
 */
class Accessibility {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The Data Grid Table instance which the accessibility belong to.
     */
    public grid: Grid;

    /**
     * The HTML element of the accessibility.
     */
    private element: HTMLElement;

    /**
     * The HTML element of the announcer.
     */
    private announcerElement: HTMLElement;

    /**
     * The timeout for the announcer element removal.
     */
    private announcerTimeout?: number;

    /**
     * The before Grid screen reader section element.
     */
    private beforeGridElement: HTMLElement | null = null;

    /**
     * The after Grid screen reader section element.
     */
    private afterGridElement: HTMLElement | null = null;

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Construct the accessibility object.
     *
     * @param grid
     * The Grid Table instance which the accessibility controller belong to.
     */
    constructor(grid: Grid) {
        this.grid = grid;

        this.element = document.createElement('div');
        this.element.classList.add(Globals.getClassName('visuallyHidden'));
        this.grid.container?.prepend(this.element);

        this.announcerElement = document.createElement('p');
        this.announcerElement.setAttribute('aria-atomic', 'true');
        this.announcerElement.setAttribute('aria-hidden', 'false');
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Add the description to the header cell.
     *
     * @param thElement
     * The header cell element to add the description to.
     *
     * @param description
     * The description to be added.
     */
    public addHeaderCellDescription(
        thElement: HTMLElement,
        description: string | undefined
    ): void {
        if (description) {
            thElement.setAttribute('aria-description', description);
        }
    }

    /**
     * Announce the message to the screen reader.
     *
     * @param msg
     * The message to be announced.
     *
     * @param assertive
     * Whether the message should be assertive. Default is false.
     */
    public announce(msg: string, assertive = false): void {
        if (this.announcerTimeout) {
            clearTimeout(this.announcerTimeout);
        }

        this.announcerElement.remove();
        this.announcerElement.setAttribute(
            'aria-live', assertive ? 'assertive' : 'polite'
        );

        this.element.appendChild(this.announcerElement);
        requestAnimationFrame((): void => {
            this.announcerElement.textContent = msg;
        });

        this.announcerTimeout = setTimeout((): void => {
            this.announcerElement.remove();
        }, 3000);
    }

    /**
     * Announce the message to the screen reader that the user sorted the
     * column.
     *
     * @param order
     * The order of the sorting.
     */
    public userSortedColumn(order: ColumnSortingOrder): void {
        const { options } = this.grid;
        const announcementsLang = options?.lang
            ?.accessibility?.sorting?.announcements;

        if (!options?.accessibility?.announcements?.sorting) {
            return;
        }

        let msg: string | undefined;

        switch (order) {
            case 'asc':
                msg = announcementsLang?.ascending;
                break;
            case 'desc':
                msg = announcementsLang?.descending;
                break;
            default:
                msg = announcementsLang?.none;
        }

        if (!msg) {
            return;
        }

        this.announce(msg, true);
    }

    /**
     * Set the aria sort state of the column header cell element.
     *
     * @param thElement
     * The header cell element to set the `aria-sort` state to.
     *
     * @param state
     * The sort state to be set for the column header cell.
     */
    public setColumnSortState(
        thElement: HTMLElement,
        state: AriaSortState
    ): void {
        thElement?.setAttribute('aria-sort', state);
    }

    /**
     * Announce the message to the screen reader that the user filtered the
     * column.
     *
     * @param filteredColumnValues
     * The values of the filtered column.
     *
     * @param filteringApplied
     * Whether the filtering was applied or cleared.
     */
    public userFilteredColumn(
        filteredColumnValues: FilteredColumnValues,
        filteringApplied: boolean
    ): void {
        const { columnId, condition, value, rowsCount } = filteredColumnValues;
        const { lang, accessibility } = this.grid.options || {};

        if (!accessibility?.announcements?.filtering) {
            return;
        }

        const announcementsLang = lang?.accessibility?.filtering?.announcements;

        let msg: string | undefined;

        if (filteringApplied && condition) {
            const parsedCondition =
                ColumnFiltering.parseCamelCaseToReadable(condition);

            if (
                condition === 'empty' ||
                condition === 'notEmpty' ||
                condition === 'false' ||
                condition === 'true'
            ) {
                msg = formatText(announcementsLang?.emptyFilterApplied || '', {
                    columnId,
                    condition: parsedCondition,
                    rowsCount: rowsCount
                });
            } else {
                msg = formatText(announcementsLang?.filterApplied || '', {
                    columnId,
                    condition: parsedCondition,
                    value: value?.toString() || '',
                    rowsCount: rowsCount
                });
            }
        } else {
            msg = formatText(announcementsLang?.filterCleared || '', {
                columnId,
                rowsCount: rowsCount
            });
        }

        this.announce(msg, true);
    }

    /**
     * Adds high contrast CSS class, if the browser is in High Contrast mode.
     */
    public addHighContrast(): void {
        const highContrastMode =
            this.grid.options?.accessibility?.highContrastMode;

        if (
            highContrastMode !== false && (
                whcm.isHighContrastModeActive() ||
                highContrastMode === true
            )
        ) {
            this.grid.contentWrapper?.classList.add(
                'hcg-theme-highcontrast'
            );
        }
    }

    /**
     * Set the row index attribute for the row element.
     *
     * @param el
     * The row element to set the index to.
     *
     * @param idx
     * The index of the row in the data table.
     */
    public setRowIndex(el: HTMLElement, idx: number): void {
        el.setAttribute('aria-rowindex', idx);
    }

    /**
     * Set a11y options for the Grid.
     */
    public setA11yOptions(): void {
        const grid = this.grid;
        const tableEl = grid.tableElement;

        if (!tableEl) {
            return;
        }

        tableEl.setAttribute(
            'aria-rowcount',
            grid.dataTable?.getRowCount() || 0
        );

        if (grid.captionElement) {
            tableEl.setAttribute(
                'aria-labelledby',
                grid.captionElement.id
            );
        }

        if (grid.descriptionElement) {
            tableEl.setAttribute(
                'aria-describedby',
                grid.descriptionElement.id
            );
        }

        this.addHighContrast();
    }

    /**
     * Adds the screen reader section before or after the Grid.
     *
     * @param placement
     * Either 'before' or 'after'.
     */
    public addScreenReaderSection(placement: 'before' | 'after'): void {
        const grid = this.grid;
        const isBefore = placement === 'before';

        // Get the screen reader section content.
        const defaultFormatter = isBefore ?
            this.defaultBeforeFormatter() :
            this.defaultAfterFormatter();
        const formatter = grid.options?.accessibility?.screenReaderSection?.[
            `${placement}GridFormatter`
        ];
        const content = formatter ? formatter(grid) : defaultFormatter;

        // Create the screen reader section element.
        const sectionElement = this[`${placement}GridElement`] = (
            this[`${placement}GridElement`] || document.createElement('div')
        );

        // Create the hidden element.
        const hiddenElement =
            sectionElement.firstChild as HTMLElement ||
            document.createElement('div');
        if (content) {
            this.setScreenReaderSectionAttributes(sectionElement, placement);
            AST.setElementHTML(hiddenElement, content);

            // Append only if not already a child.
            if (hiddenElement.parentNode !== sectionElement) {
                sectionElement.appendChild(hiddenElement);
            }

            // Insert only if not already in the DOM.
            const gridContainer = grid.container;
            if (!sectionElement.parentNode && gridContainer) {
                if (isBefore) {
                    gridContainer.insertBefore(
                        sectionElement, gridContainer.firstChild
                    );
                } else {
                    gridContainer.appendChild(sectionElement);
                }
            }

            hiddenElement.classList.add(Globals.getClassName('visuallyHidden'));
        } else {
            if (sectionElement.parentNode) {
                sectionElement.parentNode.removeChild(sectionElement);
            }
            this[`${placement}GridElement`] = null;
        }
    }

    /**
     * Sets the accessibility attributes for the screen reader section.
     *
     * @param sectionElement
     * The section element.
     *
     * @param placement
     * Either 'before' or 'after'.
     */
    public setScreenReaderSectionAttributes(
        sectionElement: HTMLElement,
        placement: 'before' | 'after'
    ): void {
        const grid = this.grid;
        sectionElement.setAttribute(
            'id',
            `grid-screen-reader-region-${placement}-${grid.id}`
        );

        const regionLabel =
            grid.options?.lang?.accessibility?.screenReaderSection?.[
                `${placement}RegionLabel`
            ];
        if (regionLabel) {
            sectionElement.setAttribute('aria-label', regionLabel);
            sectionElement.setAttribute('role', 'region');
        }

        // Position the section relatively to the Grid.
        sectionElement.style.position = 'relative';
    }

    /**
     * Gets the default formatter for the before-Grid screen reader section.
     * @private
     */
    private defaultBeforeFormatter(): string {
        const grid = this.grid;
        const { container, dataTable, options } = grid;
        const format =
            options?.accessibility?.screenReaderSection?.beforeGridFormat;

        if (!format || !container) {
            return '';
        }

        const gridTitle = options?.caption?.text;

        let formattedGridTitle = '';
        if (gridTitle) {
            if (this.isWrappedInHeadingTag(gridTitle)) {
                formattedGridTitle = gridTitle;
            } else {
                const headingTag = getHeadingTagNameForElement(container);
                formattedGridTitle =
                    `<${headingTag}>${gridTitle}</${headingTag}>`;
            }
        }

        const context = {
            gridTitle: formattedGridTitle,
            gridDescription: options?.description?.text || '',
            rowCount: dataTable?.rowCount || 0,
            columnCount: (dataTable?.getColumnIds() || []).length
        };

        const formattedString = this.formatTemplateString(format, context);
        return this.stripEmptyHTMLTags(formattedString);
    }

    /**
     * Checks if a string is already wrapped in a heading tag (h1-h6).
     * @private
     *
     * @param text
     * The text to check.
     *
     * @returns
     * True if the text is wrapped in a heading tag.
     */
    private isWrappedInHeadingTag(text: string): boolean {
        return /^<h([1-6])[^>]*>[\s\S]*<\/h\1>$/i.test(text.trim());
    }

    /**
     * Formats a string with template variables.
     *
     * @param format
     * The format string.
     *
     * @param context
     * The context object.
     *
     * @private
     */
    private formatTemplateString(
        format: string,
        context: Record<string, unknown>
    ): string {
        return format.replace(/\{(\w+)\}/g, (_, key): string => (
            key in context ? String(context[key]) : `{${key}}`
        ));
    }

    /**
     * Gets the default formatter for the after-Grid screen reader section.
     * @private
     */
    private defaultAfterFormatter(): string {
        const grid = this.grid;
        const format = grid.options?.accessibility?.screenReaderSection
            ?.afterGridFormat;

        if (!format) {
            return '';
        }
        return this.stripEmptyHTMLTags(format);
    }

    /**
     * Strips empty HTML tags from a string recursively.
     *
     * @param string
     * The string to strip empty HTML tags from.
     *
     * @private
     */
    private stripEmptyHTMLTags(string: string): string {
        return replaceNested(string, [/<([\w\-.:!]+)\b[^<>]*>\s*<\/\1>/g, '']);
    }

    /**
     * Destroy the accessibility controller.
     */
    public destroy(): void {
        // Removes the screen reader before section.
        const beforeGridElement = this.beforeGridElement;
        if (beforeGridElement?.parentNode) {
            beforeGridElement.parentNode.removeChild(beforeGridElement);
        }

        // Removes the screen reader after section.
        const afterGridElement = this.afterGridElement;
        if (afterGridElement?.parentNode) {
            afterGridElement.parentNode.removeChild(afterGridElement);
        }

        this.element.remove();
        this.announcerElement.remove();
        clearTimeout(this.announcerTimeout);
    }
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * The possible states of the aria-sort attribute.
 */
export type AriaSortState = 'ascending' | 'descending' | 'none';

/**
 * The values of the filtered column.
 */
export type FilteredColumnValues = FilteringCondition & {
    columnId: string;
    rowsCount: number;
};


/* *
 *
 *  Default Export
 *
 * */

export default Accessibility;
