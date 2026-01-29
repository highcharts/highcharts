/* *
 *
 *  Grid Pagination class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type {
    PaginationOptions,
    PaginationLangOptions,
    PageSizeSelectorOptions,
    PageButtonsOptions
} from './PaginationOptions';
import type { DeepPartial } from '../../../Shared/Types';

import Icons from './Icons.js';
import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';
import Utilities from '../../../Core/Utilities.js';
import AST from '../../../Core/Renderer/HTML/AST.js';
import PaginationController from '../Querying/PaginationController';

const { makeHTMLElement, formatText } = GridUtils;
const { defined, fireEvent, isObject, merge } = Utilities;

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
        page: 1,
        pageSize: 10,
        position: 'bottom',
        controls: {
            pageSizeSelector: {
                enabled: true,
                options: [10, 20, 50, 100]
            },
            pageInfo: {
                enabled: true
            },
            firstLastButtons: {
                enabled: true
            },
            previousNextButtons: {
                enabled: true
            },
            pageButtons: {
                enabled: true,
                count: 7
            }
        }
    };


    /* *
    *
    *  Properties
    *
    * */

    /**
     * The pagination container element (div for top/bottom,
     * tfoot cell for footer, or custom element).
     */
    private paginationContainer?: HTMLElement;

    /**
     * The pagination controller instance.
     */
    private readonly controller: PaginationController;

    /**
     * The Grid Table instance which the pagination belongs to.
     */
    public grid: Grid;

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
     * Page selector dropdown
     */
    public dropdownPageSelector?: HTMLSelectElement;

    /**
     * Page info text element
     */
    public pageInfoElement?: HTMLElement;

    /**
     * Old total number of items (rows) to compare with the current total items.
     */
    private oldTotalItems?: number;

    /**
     * Whether the pagination is dirty due to querying changes.
     * @internal
     */
    public isDirtyQuerying?: boolean;


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
     */
    constructor(grid: Grid) {
        this.grid = grid;
        this.controller = grid.querying.pagination;
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Returns the reference to the pagination options.
     */
    public get options(): PaginationOptions | undefined {
        return this.grid.options?.pagination;
    }

    /**
     * Returns the language options for pagination text.
     */
    public get lang(): PaginationLangOptions | undefined {
        return this.grid.options?.lang?.pagination;
    }

    /**
     * Returns the page size selector options.
     */
    public get pageSizeSelectorOptions(): number[] {
        const raw = this.options?.controls?.pageSizeSelector;
        if (isObject(raw)) {
            return raw.options ?? [];
        }

        return (
            Pagination.defaultOptions
                .controls?.pageSizeSelector as PageSizeSelectorOptions
        ).options ?? [];
    }

    /**
     * Internal method to set the dirty flags for the pagination based on the
     * options differences.
     *
     * @param diff
     * The differences between the previous and the new options.
     *
     * @internal
     */
    public update(diff: DeepPartial<PaginationOptions>): void {
        if (
            'page' in diff ||
            'pageSize' in diff
        ) {
            this.isDirtyQuerying = true;
            delete diff.page;
            delete diff.pageSize;
        }

        // TODO: Optimize more options here.

        if (Object.keys(diff).length > 0) {
            this.grid.dirtyFlags.add('grid');
        }
    }

    /**
     * Render the pagination container.
     *
     * The pagination container is positioned based on the `position` option:
     * - `'top'`: Rendered before the table
     * - `'bottom'`: Rendered after the table (default)
     * - `'footer'`: Rendered inside a tfoot element
     * - `'#id'` or any string: Rendered inside a custom container with
     * the specified ID.
     */
    public render(): void {
        const position = this.options?.position;
        const grid = this.grid;

        this.oldTotalItems = this.controller.totalItems;

        // Set row count for a11y
        grid.tableElement?.setAttribute('aria-current', 'page');
        this.updateA11yRowsCount(this.controller.currentPageSize);

        // Render pagination container
        if (typeof position === 'string' && position.startsWith('#')) {
            this.renderCustomContainer(position);
        } else {
            if (position === 'footer') {
                this.renderFooter();
            }

            this.contentWrapper = makeHTMLElement(
                'nav',
                {
                    className: Globals.getClassName('paginationWrapper')
                },
                position === 'footer' ?
                    this.paginationContainer : grid.contentWrapper
            );

            this.contentWrapper.setAttribute(
                'aria-label',
                'Results pagination'
            );
        }

        // Render all components
        this.renderPageInfo();
        this.renderControls();
        this.renderPageSizeSelector();

        // Update button states after rendering
        this.updateButtonStates();
    }

    /**
     * Render pagination in a tfoot element.
     */
    private renderFooter(): void {
        const tableElement = this.grid.tableElement;
        if (!tableElement) {
            return;
        }

        // Create tfoot element
        const tfootElement = makeHTMLElement('tfoot', {}, tableElement);

        // Create tfoot row
        const tfootRow = makeHTMLElement('tr', {}, tfootElement);

        // Create tfoot cell with colspan and store it in paginationContainer
        this.paginationContainer = makeHTMLElement('td', {}, tfootRow);
        this.paginationContainer.setAttribute(
            'colSpan',
            (this.grid.enabledColumns || []).length.toString()
        );

        this.reflow();
    }

    /**
     * Render pagination in a custom container by ID.
     *
     * @param id
     * The ID of the custom container.
     */
    private renderCustomContainer(id: string): void {
        const customContainer = document.querySelector(id) as HTMLElement;

        if (!customContainer) {
            console.warn(`Pagination: Custom container with ID "${id}" not found.`); // eslint-disable-line no-console
            return;
        }

        this.paginationContainer = customContainer;

        // Set content wrapper to the custom container
        this.contentWrapper = makeHTMLElement('div', {
            className: Globals.getClassName('paginationContainer')
        }, customContainer);
    }

    /**
     * Render the page information text.
     */
    public renderPageInfo(): void {
        const pageInfo = this.options?.controls?.pageInfo;
        if (
            pageInfo === false ||
            (isObject(pageInfo) && pageInfo.enabled === false)
        ) {
            return;
        }

        this.pageInfoElement = makeHTMLElement('div', {
            className: Globals.getClassName('paginationPageInfo')
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

        const {
            currentPage,
            currentPageSize,
            totalItems,
            totalPages
        } = this.controller;

        const startItem = (currentPage - 1) * currentPageSize + 1;
        const endItem = Math.min(
            currentPage * currentPageSize,
            totalItems
        );

        const pageInfoText = formatText(this.lang?.pageInfo ?? '', {
            start: startItem,
            end: endItem,
            total: totalItems,
            currentPage: currentPage,
            totalPages: totalPages
        });

        this.pageInfoElement.innerHTML = pageInfoText;
    }

    /**
     * Render the controls buttons and page numbers.
     */
    public renderControls(): void {
        const navContainer = makeHTMLElement('div', {
            className: Globals.getClassName('paginationControlsContainer')
        }, this.contentWrapper);
        const controls = this.options?.controls || {};

        // Render first/previous buttons
        if (controls.firstLastButtons) {
            this.renderFirstButton(navContainer);
        }

        // Render previous button
        if (controls.previousNextButtons) {
            this.renderPrevButton(navContainer);
        }

        // Render page numbers
        if (controls.pageButtons) {
            this.renderPageNumbers(navContainer);
        }

        // Render dropdown page selector
        this.renderDropdownPageSelector(navContainer);

        // Render next button
        if (controls.previousNextButtons) {
            this.renderNextButton(navContainer);
        }

        // Render last/first buttons
        if (controls.firstLastButtons) {
            this.renderLastButton(navContainer);
        }
    }

    /**
     * Update the pagination controls.
     *
     * @param force
     * Whether to force update the controls.
     *
     * @internal
     */
    public updateControls(force: boolean = false): void {
        const {
            totalItems,
            currentPageSize
        } = this.controller;

        if (this.oldTotalItems === this.controller.totalItems && !force) {
            return;
        }

        this.updatePageInfo();
        this.updatePageNumbers();
        this.updateButtonStates();
        this.updateA11yRowsCount(currentPageSize);

        this.oldTotalItems = totalItems;
    }

    /**
     * Render the first page button.
     *
     * @param container
     * The container element for the first page button.
     *
     */
    public renderFirstButton(container: HTMLElement): void {
        const firstLastButtons = this.options?.controls?.firstLastButtons;
        if (
            firstLastButtons === false ||
            (isObject(firstLastButtons) && firstLastButtons.enabled === false)
        ) {
            return;
        }

        // Create first button
        this.firstButton = makeHTMLElement('button', {
            className: Globals.getClassName('button'),
            innerHTML: Icons.first
        }, container);
        this.firstButton.title = this.lang?.firstPage ?? '';

        // Set aria-label for a11y
        this.firstButton.setAttribute(
            'aria-label',
            this.lang?.firstPage ?? ''
        );

        // Add click event
        this.firstButton.addEventListener('click', (): void => {
            void this.goToPage(1);
        });

        this.setButtonState(
            this.firstButton,
            this.controller.currentPage === 1
        );
    }

    /**
     * Render the previous page button.
     *
     * @param container
     * The container element for the previous page button.
     */
    public renderPrevButton(container: HTMLElement): void {
        const previousNextButtons = this.options?.controls?.previousNextButtons;
        if (
            previousNextButtons === false ||
            (
                isObject(previousNextButtons) &&
                previousNextButtons.enabled === false
            )
        ) {
            return;
        }

        // Create previous button
        this.prevButton = makeHTMLElement('button', {
            className: Globals.getClassName('button'),
            innerHTML: Icons.previous
        }, container);
        this.prevButton.title = this.lang?.previousPage ?? '';

        // Set aria-label for a11y
        this.prevButton.setAttribute(
            'aria-label',
            this.lang?.previousPage ?? ''
        );

        // Add click event
        this.prevButton.addEventListener('click', (): void => {
            void this.goToPage(this.controller.currentPage - 1);
        });

        this.setButtonState(
            this.prevButton,
            this.controller.currentPage === 1
        );
    }

    /**
     * Render the next page button.
     *
     * @param container
     * The container element for the next page button.
     */
    public renderNextButton(container: HTMLElement): void {
        const previousNextButtons = this.options?.controls?.previousNextButtons;
        if (
            previousNextButtons === false ||
            (
                isObject(previousNextButtons) &&
                previousNextButtons.enabled === false
            )
        ) {
            return;
        }

        // Create next button
        this.nextButton = makeHTMLElement('button', {
            className: Globals.getClassName('button'),
            innerHTML: Icons.next
        }, container);
        this.nextButton.title = this.lang?.nextPage ?? '';

        // Set aria-label for a11y
        this.nextButton.setAttribute(
            'aria-label',
            this.lang?.nextPage ?? ''
        );

        // Add click event
        this.nextButton.addEventListener('click', (): void => {
            void this.goToPage(this.controller.currentPage + 1);
        });

        this.setButtonState(
            this.nextButton,
            this.controller.currentPage >= this.controller.totalPages
        );
    }

    /**
     * Render the last page button.
     *
     * @param container
     * The container element for the last page button.
     */
    public renderLastButton(container: HTMLElement): void {
        const firstLastButtons = this.options?.controls?.firstLastButtons;
        if (
            firstLastButtons === false ||
            (isObject(firstLastButtons) && firstLastButtons.enabled === false)
        ) {
            return;
        }

        // Create last button
        this.lastButton = makeHTMLElement('button', {
            className: Globals.getClassName('button'),
            innerHTML: Icons.last
        }, container);
        this.lastButton.title = this.lang?.lastPage ?? '';

        // Set aria-label for a11y
        this.lastButton.setAttribute(
            'aria-label',
            this.lang?.lastPage ?? ''
        );

        // Add click event
        this.lastButton.addEventListener('click', (): void => {
            void this.goToPage(this.controller.totalPages);
        });

        this.setButtonState(
            this.lastButton,
            this.controller.currentPage >= this.controller.totalPages
        );
    }

    /**
     * Render page number buttons with ellipsis.
     *
     * @param container
     * The container element for the page number buttons.
     */
    public renderPageNumbers(container: HTMLElement): void {
        const pageButtons = this.options?.controls?.pageButtons;
        if (
            pageButtons === false ||
            (isObject(pageButtons) && pageButtons.enabled === false)
        ) {
            return;
        }

        this.pageNumbersContainer = makeHTMLElement('div', {
            className: Globals.getClassName('paginationNavButtonsContainer')
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
        this.pageNumbersContainer.innerHTML = AST.emptyHTML;

        const pageButtons = this.options?.controls?.pageButtons;
        const maxPageNumbers = isObject(pageButtons) ?
            pageButtons.count :
            (Pagination.defaultOptions.controls?.pageButtons as PageButtonsOptions).count; // eslint-disable-line

        if (!maxPageNumbers) {
            return;
        }

        const {
            totalPages,
            currentPage
        } = this.controller;

        if (totalPages <= maxPageNumbers) {
            // Show all page numbers if total pages is less than max
            for (let i = 1; i <= totalPages; i++) {
                this.createPageButton(i, i === currentPage);
            }
        } else {
            const elements = [];

            // Determine layout based on current page position
            const isNearStart = currentPage <= 3;
            const isNearEnd = currentPage >= totalPages - 2;

            if (isNearStart) {
                // -2 for ellipsis and last page
                const pagesToShow = maxPageNumbers - 2;
                const maxPages = Math.min(pagesToShow, totalPages - 1);

                for (let i = 1; i <= maxPages; i++) {
                    elements.push({ type: 'button', page: i });
                }

                if (totalPages > pagesToShow + 1) {
                    elements.push({ type: 'ellipsis' });
                    elements.push({ type: 'button', page: totalPages });
                }

            } else if (isNearEnd) {
                // -2 for first page and ellipsis
                const pagesToShow = maxPageNumbers - 2;
                let i = totalPages - pagesToShow + 1;

                elements.push({ type: 'button', page: 1 });
                elements.push({ type: 'ellipsis' });

                for (i; i <= totalPages; i++) {
                    elements.push({ type: 'button', page: i });
                }

            } else {
                // Always add first page
                elements.push({ type: 'button', page: 1 });

                // -4 for first, last, and two ellipsis
                const maxMiddlePages = maxPageNumbers - 4;
                const halfMiddle = Math.floor(maxMiddlePages / 2);

                let startPage = Math.max(2, currentPage - halfMiddle);
                let endPage = Math.min(
                    totalPages - 1,
                    currentPage + halfMiddle
                );

                // Adjust to ensure we have exactly maxMiddlePages
                if (endPage - startPage + 1 > maxMiddlePages) {
                    if (startPage === 2) {
                        endPage = startPage + maxMiddlePages - 1;
                    } else {
                        startPage = endPage - maxMiddlePages + 1;
                    }
                }

                // Check if we actually need ellipsis
                const needFirstEllipsis = startPage > 2;
                const needLastEllipsis = endPage < totalPages - 1;

                if (!needFirstEllipsis && !needLastEllipsis) {
                    // -2 for first and last
                    const availableSlots = maxPageNumbers - 2;
                    startPage = 2;
                    endPage = Math.min(
                        totalPages - 1,
                        startPage + availableSlots - 1
                    );
                } else if (!needFirstEllipsis) {
                    // -3 for first, last, and one ellipsis
                    const availableSlots = maxPageNumbers - 3;
                    startPage = 2;
                    endPage = Math.min(
                        totalPages - 1,
                        startPage + availableSlots - 1
                    );
                } else if (!needLastEllipsis) {
                    // -3 for first, last, and one ellipsis
                    const availableSlots = maxPageNumbers - 3;
                    endPage = totalPages - 1;
                    startPage = Math.max(2, endPage - availableSlots + 1);
                }

                // Add first ellipsis
                if (needFirstEllipsis) {
                    elements.push({ type: 'ellipsis' });
                }

                // Add middle pages
                for (let i = startPage; i <= endPage; i++) {
                    elements.push({ type: 'button', page: i });
                }

                // Add last ellipsis
                if (needLastEllipsis) {
                    elements.push({ type: 'ellipsis' });
                }

                // Always add last page
                elements.push({ type: 'button', page: totalPages });
            }

            // Render all elements
            elements.forEach((element): void => {
                if (element.type === 'button' && defined(element.page)) {
                    this.createPageButton(
                        element.page,
                        element.page === currentPage
                    );
                } else if (element.type === 'ellipsis') {
                    this.createEllipsis();
                }
            });
        }

        // Update dropdown selector if it exists
        this.updateDropdownPageSelector();
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
            className: Globals.getClassName('button'),
            innerHTML: pageNumber.toString()
        }, this.pageNumbersContainer);

        if (isActive) {
            button.classList.add(Globals.getClassName('buttonSelected'));
            button.setAttribute('aria-current', 'page');
        }

        button.title = formatText(
            this.lang?.pageNumber ?? '',
            { page: pageNumber }
        );

        // Set aria-label for a11y
        button.setAttribute(
            'aria-label',
            formatText(this.lang?.pageNumber ?? '', { page: pageNumber })
        );

        // Add click event
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
            innerHTML: '...'
        }, this.pageNumbersContainer);
        ellipsisElement.title = this.lang?.ellipsis ?? '';

        // Set aria-label for a11y
        ellipsisElement.setAttribute('aria-hidden', true);
    }

    /**
     * Render the page size selector.
     */
    public renderPageSizeSelector(): void {

        const pageSizeSelector = this.options?.controls?.pageSizeSelector;
        if (
            pageSizeSelector === false ||
            (
                isObject(pageSizeSelector) &&
                pageSizeSelector.enabled === false
            )
        ) {
            return;
        }

        const container = makeHTMLElement('div', {
            className: Globals.getClassName('paginationPageSize')
        }, this.contentWrapper);

        makeHTMLElement('span', {
            innerHTML: this.lang?.pageSizeLabel ?? ''
        }, container);

        this.pageSizeSelect = makeHTMLElement('select', {
            className: Globals.getClassName('input'),
            id: Globals.getClassName('paginationPageSize')
        }, container) as HTMLSelectElement;

        this.pageSizeSelectorOptions.forEach((option: number): void => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toString();
            optionElement.innerHTML = option.toString();

            if (option === this.controller.currentPageSize) {
                optionElement.selected = true;
            }

            this.pageSizeSelect?.appendChild(optionElement);
        });

        this.pageSizeSelect.addEventListener('change', (): void => {
            if (!this.pageSizeSelect) {
                return;
            }

            void this.setPageSize(parseInt(this.pageSizeSelect.value, 10));
        });
    }

    /**
     * Sets the new options for the pagination.
     *
     * @param newOptions
     * The new options to set.
     */
    private setOptions(newOptions: Partial<PaginationOptions>): void {
        const userOptions = this.grid.userOptions.pagination ??= {};
        const options = ((this.grid.options ??= {}).pagination ??= {});

        merge(true, userOptions, newOptions);
        merge(true, options, newOptions);
    }

    /**
     * Set the page size and recalculate pagination.
     *
     * @param newPageSize
     * The new page size to set.
     */
    public async setPageSize(newPageSize: number): Promise<void> {
        const oldPageSize = this.controller.currentPageSize;
        const langAccessibility = this.grid.options?.lang?.accessibility;

        fireEvent(
            this,
            'beforePageSizeChange',
            {
                pageSize: oldPageSize,
                newPageSize: newPageSize
            }
        );
        this.controller.setPageSize(newPageSize);
        this.controller.setPage(1);

        this.setOptions({
            pageSize: newPageSize,
            page: 1
        });

        // Update the grid's pagination range
        await this.updateGridPagination();

        // Update UI
        this.updatePageInfo();
        this.updatePageNumbers();
        this.updateButtonStates();

        // Update row count for a11y
        this.updateA11yRowsCount(this.controller.currentPageSize);

        // Announce the page size change
        this.grid.accessibility?.announce(
            langAccessibility?.pagination?.announcements?.pageSizeChange +
            ' ' + newPageSize
        );

        fireEvent(
            this,
            'afterPageSizeChange',
            {
                pageSize: newPageSize,
                previousPageSize: oldPageSize
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
        const langAccessibility = this.grid.options?.lang?.accessibility;
        const {
            totalPages,
            currentPage,
            currentPageSize
        } = this.controller;

        if (
            pageNumber < 1 ||
            pageNumber > totalPages ||
            pageNumber === currentPage
        ) {
            return;
        }

        const previousPage = currentPage;

        fireEvent(
            this,
            'beforePageChange',
            {
                currentPage: currentPage,
                nextPage: pageNumber,
                pageSize: currentPageSize
            }
        );

        this.controller.setPage(pageNumber);
        const newPage = this.controller.currentPage; // Take clamped page

        this.setOptions({
            page: newPage
        });

        await this.updateGridPagination();
        this.updatePageInfo();
        this.updatePageNumbers();
        this.updateButtonStates();


        // Announce the page change
        this.grid.accessibility?.announce(
            langAccessibility?.pagination?.announcements?.pageChange +
            ' ' + newPage
        );

        fireEvent(
            this,
            'afterPageChange',
            {
                currentPage: newPage,
                previousPage: previousPage,
                pageSize: currentPageSize
            }
        );
    }

    /**
     * Update the grid's pagination state.
     */
    public async updateGridPagination(): Promise<void> {
        // Update the viewport to reflect the new data
        await this.grid.viewport?.updateRows();

        // Scroll to top after page change
        const tBody = this.grid.viewport?.tbodyElement;
        if (tBody) {
            tBody.scrollTop = 0;
        }
    }

    /**
     * Update button states based on current page.
     */
    public updateButtonStates(): void {
        const {
            currentPage,
            totalPages
        } = this.controller;

        if (this.firstButton) {
            this.setButtonState(this.firstButton, currentPage === 1);
        }
        if (this.prevButton) {
            this.setButtonState(this.prevButton, currentPage === 1);
        }
        if (this.nextButton) {
            this.setButtonState(
                this.nextButton,
                currentPage >= totalPages
            );
        }
        if (this.lastButton) {
            this.setButtonState(
                this.lastButton,
                currentPage >= totalPages
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
        const { currentPage } = this.controller;
        const newPage = isNextPage ? currentPage + 1 : currentPage - 1;
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
            button.setAttribute('disabled', 'disabled');
        } else {
            button.removeAttribute('disabled');
        }
    }

    /**
     * Reflow the pagination container.
     */
    public reflow(): void {
        const position = this.options?.position;

        if (!this.paginationContainer) {
            return;
        }

        if (position === 'footer') {
            // Set the width to match the table width
            this.paginationContainer.style.width =
                this.grid.tableElement?.offsetWidth + 'px';
            return;
        }
    }

    /**
     * Destroy the pagination instance.
     */
    public destroy(): void {
        const position = this.options?.position;

        if (position === 'footer') {
            // For footer position, remove the entire tfoot element.
            this.paginationContainer?.parentElement?.parentElement?.remove();
        } else {
            this.contentWrapper?.remove();
        }
    }

    /**
     * Render the dropdown page selector (select dropdown).
     *
     * @param container
     * The container element for the dropdown page selector.
     */
    public renderDropdownPageSelector(container: HTMLElement): void {
        if (this.controller.totalPages <= 1) {
            return;
        }

        const wrapper: HTMLSelectElement = makeHTMLElement('div', {
            className: Globals.getClassName('paginationNavDropdown')
        }, container);

        const select: HTMLSelectElement = makeHTMLElement('select', {
            className: Globals.getClassName('input'),
            id: Globals.getClassName('paginationNavDropdown')
        }, wrapper);

        this.dropdownPageSelector = select;

        this.updateDropdownPageSelector();

        // Add event listener for page change
        select.addEventListener('change', (): void => {
            const newPage = parseInt(select.value, 10);
            if (newPage !== this.controller.currentPage) {
                void this.goToPage(newPage);
            }
        });
    }

    /**
     * Updates the dropdown page selector DOM elements.
     */
    private updateDropdownPageSelector(): void {
        const select = this.dropdownPageSelector;
        if (!select) {
            return;
        }

        const {
            totalPages,
            currentPage
        } = this.controller;

        select.innerHTML = AST.emptyHTML;

        // Add options for each page
        for (let i = 1; i <= totalPages; i++) {
            const option: HTMLOptionElement =
                makeHTMLElement('option', {}, select);
            option.value = i.toString();
            option.textContent = `Page ${i} of ${totalPages}`;
        }

        // Set current page as selected
        select.value = currentPage.toString();
    }

    /**
     * Update the row count for a11y.
     *
     * @param currentPageSize
     * The current page size.
     */
    public updateA11yRowsCount(currentPageSize: number): void {
        const grid = this.grid;
        grid.tableElement?.setAttribute(
            'aria-rowcount',
            currentPageSize || this.controller.totalItems
        );
    }
}

/* *
 *
 *  Declarations
 *
 * */

export interface PaginationState {
    currentPage?: number;
    currentPageSize?: number;
}


/* *
 *
 *  Default Export
 *
 * */

export default Pagination;
