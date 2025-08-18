/* *
 *
 *  Grid Pagination class
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

import type Grid from '../Grid';
import type { PaginationOptions, PaginationLangOptions } from './PaginationOptions';

import Defaults from '../Defaults.js';
import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';
import Utilities from '../../../Core/Utilities.js';

const { makeHTMLElement } = GridUtils;
const { merge, fireEvent } = Utilities;

/**
 *  Representing the pagination functionalities for the Grid.
 */
class Pagination {

    /* *
    *
    *  Static Properties
    *
    * */

    /**
     * Default options of the pagination.
     */
    public static defaultOptions: PaginationOptions = {
        enabled: false,
        pageSize: 10,
        controls: {
            pageSizeSelector: {
                enabled: true,
                options: [10, 20, 50, 100]
            },
            pageInfo: true,
            firstLastButtons: true,
            prevNextButtons: true,
            pageButtons: {
                enabled: true,
                count: 5
            }
        }
    };

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The row in tfoot
     */
    private row?: HTMLElement;

    /**
     * The cell of the row in the tfoot
     */
    private cell?: HTMLElement;

    /**
     * The Grid Table instance which the pagination belongs to.
     */
    public grid: Grid;

    /**
     * The options for the pagination.
     */
    public options: PaginationOptions;

    /**
     * The content container of the Pagination.
     */
    public contentWrapper?: HTMLElement;

    /**
     * Navigation first button
     */
    public firstButton?: HTMLElement;

    /**
     * Navigation previous button
     */
    public prevButton?: HTMLElement;

    /**
     * Navigation next button
     */
    public nextButton?: HTMLElement;

    /**
     * Navigation last button
     */
    public lastButton?: HTMLElement;

    /**
     * Page number buttons container
     */
    public pageNumbersContainer?: HTMLElement;

    /**
     * Items per page selector dropdown
     */
    public pageSizeSelect?: HTMLSelectElement;

    /**
     * Page info text element
     */
    public pageInfoElement?: HTMLElement;

    /**
     * Current page number, starting from 1.
     */
    public currentPage: number = 1;

    /**
     * Available items per page options
     */
    public pageSizeOptions: Array<number>;

    /**
     * Current items per page setting
     */
    public currentPageSize: number;

    /**
     * Language options for pagination text
     */
    public lang: PaginationLangOptions;

    /**
     * Total number of pages
     */
    public totalPages: number = 1;

    /**
     * Total number of items
     */
    public totalItems: number = 0;

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Construct the pagination object.
     *
     * @param grid
     * The Grid Table instance which the pagination controller belongs to.
     *
     * @param options
     * The Pagination user options.
     */
    constructor(
        grid: Grid,
        options: any
    ) {
        this.grid = grid;
        this.options = merge(Pagination.defaultOptions, options);

        this.pageSizeOptions =
            this.options.controls.pageSizeSelector.options as number[];

        this.currentPageSize =
            options.currentPageSize ||
            this.options.pageSize ||
            this.pageSizeOptions[0];

        // Lang pack
        this.lang = merge(
            Defaults.defaultOptions.pagination,
            this.grid.options?.lang?.pagination
        );

        // Set state
        if (options.currentPage) {
            this.currentPage = options.currentPage;
        }
        if (options.totalItems) {
            this.totalItems = options.totalItems;
        }
        if (options.totalPages) {
            this.totalPages = options.totalPages;
        }
    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Format text with placeholders.
     *
     * @param template The text template with placeholders
     * @param values Object containing values to replace placeholders
     * @returns Formatted text
     */
    private formatText(template: string, values: Record<string, string | number>): string {
        return template.replace(/\{(\w+)\}/g, (match, key): string => (
            values[key] !== void 0 ? String(values[key]) : match
        ));
    }

    /**
     * Render the pagination container.
     */
    public render(): void {
        const pgContainer = this.grid.viewport?.tfootElement;
        this.row = makeHTMLElement('tr', {}, pgContainer);
        this.cell = makeHTMLElement('td', {}, this.row);
        this.cell.setAttribute(
            'colSpan',
            (this.grid.enabledColumns || []).length
        );
        this.reflow();

        this.contentWrapper = makeHTMLElement('div', {
            className: Globals.getClassName('pgWrapper')
        }, this.cell);

        // Update total pages first to ensure correct calculations
        this.updateTotalPages();

        // Render all components
        this.renderPageInfo();
        this.renderControls();
        this.renderPageSizeSelector();

        // Update button states after rendering
        this.updateButtonStates();
    }

    /**
     * Render the page information text.
     */
    public renderPageInfo(): void {
        if (!this.options.controls?.pageInfo) {
            return;
        }

        this.pageInfoElement = makeHTMLElement('div', {
            className: Globals.getClassName('pgPageInfo')
        }, this.contentWrapper);

        this.updatePageInfo();
    }

    /**
     * Update the page information text.
     */
    public updatePageInfo(): void {
        if (!this.pageInfoElement) {
            return;
        }

        const startItem = (this.currentPage - 1) * this.currentPageSize + 1;
        const endItem = Math.min(
            this.currentPage * this.currentPageSize,
            this.totalItems
        );

        const pageInfoText = this.formatText(this.lang.pageInfo as string, {
            start: startItem,
            end: endItem,
            total: this.totalItems
        });

        this.pageInfoElement.innerHTML = pageInfoText;
    }

    /**
     * Render the controls buttons and page numbers.
     */
    public renderControls(): void {
        const navContainer = makeHTMLElement('div', {
            className: Globals.getClassName('pgControls')
        }, this.contentWrapper);

        // Render first/previous buttons
        if (this.options.controls?.firstLastButtons) {
            this.renderFirstButton(navContainer);
        }

        if (this.options.controls?.prevNextButtons) {
            this.renderPrevButton(navContainer);
        }

        // Render page numbers
        if (this.options.controls?.pageButtons?.enabled) {
            this.renderPageNumbers(navContainer);
        }

        // Render next/last buttons
        if (this.options.controls?.prevNextButtons) {
            this.renderNextButton(navContainer);
        }

        // Render last/first buttons
        if (this.options.controls?.firstLastButtons) {
            this.renderLastButton(navContainer);
        }
    }

    /**
     * Render the first page button.
     *
     * @param container
     * The container element for the first page button.
     *
     */
    public renderFirstButton(container: HTMLElement): void {
        this.firstButton = makeHTMLElement('button', {
            innerHTML: '&laquo;',
            className: Globals.getClassName('pgButton')
        }, container);
        this.firstButton.title = this.lang.firstPage as string;

        this.firstButton.addEventListener('click', (): void => {
            void this.goToPage(1);
        });

        this.setButtonState(this.firstButton, this.currentPage === 1);
    }

    /**
     * Render the previous page button.
     *
     * @param container
     * The container element for the previous page button.
     */
    public renderPrevButton(container: HTMLElement): void {
        this.prevButton = makeHTMLElement('button', {
            innerHTML: '&lsaquo;',
            className: Globals.getClassName('pgButton')
        }, container);
        this.prevButton.title = this.lang.previousPage as string;

        this.prevButton.addEventListener('click', (): void => {
            void this.goToPage(this.currentPage - 1);
        });

        this.setButtonState(this.prevButton, this.currentPage === 1);
    }

    /**
     * Render the next page button.
     *
     * @param container
     * The container element for the next page button.
     */
    public renderNextButton(container: HTMLElement): void {
        this.nextButton = makeHTMLElement('button', {
            innerHTML: '&rsaquo;',
            className: Globals.getClassName('pgButton')
        }, container);
        this.nextButton.title = this.lang.nextPage as string;

        this.nextButton.addEventListener('click', (): void => {
            void this.goToPage(this.currentPage + 1);
        });

        this.setButtonState(
            this.nextButton,
            this.currentPage >= this.totalPages
        );
    }

    /**
     * Render the last page button.
     *
     * @param container
     * The container element for the last page button.
     */
    public renderLastButton(container: HTMLElement): void {
        this.lastButton = makeHTMLElement('button', {
            innerHTML: '&raquo;',
            className: Globals.getClassName('pgButton')
        }, container);
        this.lastButton.title = this.lang.lastPage as string;

        this.lastButton.addEventListener('click', (): void => {
            void this.goToPage(this.totalPages);
        });

        this.setButtonState(
            this.lastButton,
            this.currentPage >= this.totalPages
        );
    }

    /**
     * Render page number buttons with ellipsis.
     *
     * @param container
     * The container element for the page number buttons.
     */
    public renderPageNumbers(container: HTMLElement): void {
        this.pageNumbersContainer = makeHTMLElement('div', {
            className: Globals.getClassName('pgPageButton')
        }, container);

        this.updatePageNumbers();
    }

    /**
     * Update page number buttons based on current page and total pages.
     */
    public updatePageNumbers(): void {
        if (!this.pageNumbersContainer) {
            return;
        }

        // Clear existing page numbers
        this.pageNumbersContainer.innerHTML = '';

        const maxPageNumbers = this.options.controls?.pageButtons?.count || 5;
        const totalPages = this.totalPages;
        const currentPage = this.currentPage;

        if (totalPages <= maxPageNumbers) {
            // Show all page numbers if total pages is less than max
            for (let i = 1; i <= totalPages; i++) {
                this.createPageButton(i, i === currentPage);
            }
        } else {
            // Show page numbers with ellipsis
            const halfMax = Math.floor(maxPageNumbers / 2);
            let startPage = Math.max(1, currentPage - halfMax);
            const endPage = Math.min(
                totalPages,
                startPage + maxPageNumbers - 1
            );

            // Adjust start and end to show maxPageNumbers
            if (endPage - startPage + 1 < maxPageNumbers) {
                startPage = Math.max(1, endPage - maxPageNumbers + 1);
            }

            // First page and ellipsis
            if (startPage > 1) {
                this.createPageButton(1, false);
                this.createEllipsis();
            }

            // Page numbers
            for (let i = startPage; i <= endPage; i++) {
                this.createPageButton(i, i === currentPage);
            }

            // Last page and ellipsis
            if (endPage < totalPages) {
                this.createEllipsis();
                this.createPageButton(totalPages, false);
            }
        }
    }

    /**
     * Create a page number button.
     *
     * @param pageNumber
     * The page number to create a button for.
     *
     * @param isActive
     * Whether the page number button is active.
     */
    public createPageButton(pageNumber: number, isActive: boolean): void {
        if (!this.pageNumbersContainer) {
            return;
        }

        const button = makeHTMLElement('button', {
            innerHTML: pageNumber.toString(),
            className: Globals.getClassName(
                isActive ? 'pgPageButtonActive' : 'pgPageButton'
            )
        }, this.pageNumbersContainer);
        button.title = this.formatText(
            this.lang.pageNumber as string,
            { page: pageNumber }
        );

        button.addEventListener('click', (): void => {
            void this.goToPage(pageNumber);
        });
    }

    /**
     * Create an ellipsis element.
     */
    public createEllipsis(): void {
        if (!this.pageNumbersContainer) {
            return;
        }

        const ellipsisElement = makeHTMLElement('span', {
            innerHTML: '...',
            className: Globals.getClassName('pgEllipsis')
        }, this.pageNumbersContainer);
        ellipsisElement.title = this.lang.ellipsis as string;
    }

    /**
     * Render the page size selector.
     */
    public renderPageSizeSelector(): void {
        if (!this.options.controls.pageSizeSelector.enabled) {
            return;
        }

        const container = makeHTMLElement('div', {
            className: Globals.getClassName('pgPageSizeContainer')
        }, this.contentWrapper);

        makeHTMLElement('span', {
            innerHTML: this.lang.pageSizeLabel
        }, container);

        this.pageSizeSelect = makeHTMLElement('select', {
            className: Globals.getClassName('pgPageSizeSelect')
        }, container) as HTMLSelectElement;

        this.pageSizeOptions.forEach((option: number): void => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toString();
            optionElement.innerHTML = option.toString();

            if (option === this.currentPageSize) {
                optionElement.selected = true;
            }

            this.pageSizeSelect!.appendChild(optionElement);
        });

        this.pageSizeSelect.addEventListener('change', (): void => {
            const newPageSize = parseInt(this.pageSizeSelect!.value, 10);
            void this.setPageSize(newPageSize);
        });
    }

    /**
     * Set the page size and recalculate pagination.
     *
     * @param newPageSize
     * The new page size to set.
     */
    public async setPageSize(newPageSize: number): Promise<void> {
        const oldPageSize = this.currentPageSize;

        fireEvent(
            this,
            'beforePageSizeChange',
            {
                newPageSize,
                oldPageSize
            }
        );
        this.currentPageSize = newPageSize;

        // Recalculate total pages
        this.updateTotalPages();

        // Reset to first page when changing page size
        this.currentPage = 1;

        // Update the grid's pagination range
        await this.updateGridPagination();

        // Update UI
        this.updatePageInfo();
        this.updatePageNumbers();
        this.updateButtonStates();

        fireEvent(
            this,
            'afterPageSizeChange',
            {
                newPageSize,
                oldPageSize
            }
        );
    }

    /**
     * Navigate to a specific page.
     *
     * @param pageNumber
     * The page number to navigate to.
     */
    public async goToPage(pageNumber: number): Promise<void> {
        if (
            pageNumber < 1 ||
            pageNumber > this.totalPages ||
            pageNumber === this.currentPage
        ) {
            return;
        }

        fireEvent(
            this,
            'beforePageChange',
            {
                currentPage: this.currentPage,
                newPage: pageNumber,
                itemsPerPage: this.currentPageSize
            }
        );

        this.currentPage = pageNumber;

        await this.updateGridPagination();
        this.updatePageInfo();
        this.updatePageNumbers();
        this.updateButtonStates();

        fireEvent(
            this,
            'afterPageChange',
            {
                currentPage: this.currentPage,
                itemsPerPage: this.currentPageSize
            }
        );
    }

    /**
     * Update the grid's pagination range.
     */
    public async updateGridPagination(): Promise<void> {
        if (!this.grid.querying?.pagination) {
            return;
        }

        this.grid.querying.pagination.setRange(this.currentPage);

        // Trigger the grid to update its data and viewport
        this.grid.querying.shouldBeUpdated = true;

        // Force the querying controller to proceed with updates
        await this.grid.querying.proceed(true);

        // Update the viewport to reflect the new data
        await this.grid.viewport?.updateRows();
        this.grid.viewport?.header?.reflow();

        // Scroll to top after page change
        const tBody = this.grid.viewport?.tbodyElement;
        if (tBody) {
            tBody.scrollTop = 0;
        }
    }

    /**
     * Update total pages based on total items and items per page.
     */
    public updateTotalPages(): void {
        const originalDataTable = this.grid.dataTable;
        this.totalItems = originalDataTable?.rowCount || 0;
        this.totalPages =
            Math.ceil(this.totalItems / this.currentPageSize) || 1;

        // Ensure current page is within valid range
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }
    }

    /**
     * Update button states based on current page.
     */
    public updateButtonStates(): void {
        if (this.firstButton) {
            this.setButtonState(this.firstButton, this.currentPage === 1);
        }
        if (this.prevButton) {
            this.setButtonState(this.prevButton, this.currentPage === 1);
        }
        if (this.nextButton) {
            this.setButtonState(
                this.nextButton,
                this.currentPage >= this.totalPages
            );
        }
        if (this.lastButton) {
            this.setButtonState(
                this.lastButton,
                this.currentPage >= this.totalPages
            );
        }
    }

    /**
     * Call modifier to replace items with new ones.
     *
     * @param isNextPage
     * Declare prev or next action triggered by button.
     * @returns
     */
    public async updatePage(isNextPage: boolean = true): Promise<void> {
        const newPage =
            isNextPage ? this.currentPage + 1 : this.currentPage - 1;
        await this.goToPage(newPage);
    }

    /**
     * Set button state (enabled/disabled).
     *
     * @param button
     * The button to set the state for.
     *
     * @param disabled
     * Whether the button should be disabled.
     */
    public setButtonState(button: HTMLElement, disabled?: boolean): void {
        if (disabled) {
            button.classList.add(Globals.getClassName('pgButtonDisabled'));
            button.setAttribute('disabled', 'disabled');
        } else {
            button.classList.remove(Globals.getClassName('pgButtonDisabled'));
            button.removeAttribute('disabled');
        }
    }

    /**
     * Reflow the pagination container.
     */
    public reflow(): void {
        if (!this.cell) {
            return;
        }

        this.cell.style.width = this.grid.tableElement?.offsetWidth + 'px';
    }

    /**
     * Destroy the pagination instance.
     */
    public destroy(): void {
        this.row?.remove();
        this.contentWrapper?.remove();
        this.grid.querying.pagination.reset();
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Pagination;
