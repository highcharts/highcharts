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

import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';
import Utilities from '../../../Core/Utilities.js';

const { makeHTMLElement } = GridUtils;
const {
    fireEvent
} = Utilities;

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
     * Default options of the credits.
     */
    public static defaultOptions: Pagination.Options = {
        enabled: false,
        itemsPerPage: 10
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
    public options: Pagination.Options;

    /**
     * The content container of the Pagination.
     */
    public contentWrapper?: HTMLElement;

    /**
     * Navigation next button
     */
    public nextButton?: HTMLElement;

    /**
     * Navigation prev button
     */
    public prevButton?: HTMLElement;

    /**
     * Current page
     */
    public currentPage: number = 1;

    /**
     * Whether the next button is pressed.
     */
    public isNext: boolean = false;

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
        options: Pagination.Options
    ) {
        this.grid = grid;
        this.options = options ?? Pagination.defaultOptions;
    }


    /* *
    *
    *  Methods
    *
    * */

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
        this.cell.style.width = this.grid.tableElement?.offsetWidth + 'px';

        this.contentWrapper = makeHTMLElement('div', {
            className: Globals.getClassName('paginationWrapper')
        }, this.cell);

        this.renderNavButtons();
    }

    /**
     * Render the navigation buttons.
     */
    public renderNavButtons(): void {
        const pg = this;
        const grid = pg.grid;
        const originalDataTable = grid.dataTable;

        this.prevButton = makeHTMLElement(
            'button',
            {
                innerHTML: '&lsaquo;' // TODO: add lang support
            },
            this.contentWrapper
        );

        this.setButtonState(
            this.prevButton,
            true
        );

        this.prevButton.addEventListener(
            'click',
            function (): void {
                pg.updatePage(false);
            }
        );

        this.nextButton = makeHTMLElement(
            'button',
            {
                innerHTML: '&rsaquo;' // TODO: add lang support
            },
            this.contentWrapper
        );

        this.nextButton.addEventListener(
            'click',
            function (): void {
                pg.updatePage();
            }
        );

        this.setButtonState(
            this.nextButton,
            (originalDataTable?.rowCount || 0) < this.options.itemsPerPage
        );
    }

    /**
     * Call modifier to replace items with new ones.
     *
     * @param isNext
     * Declare prev or next action triggered by button.
     * @returns
     */
    public async updatePage(isNext: boolean = true): Promise<void> {
        const pg = this;
        const grid = pg.grid;
        const originalDataTable = grid.dataTable;
        const { beforePageChange, afterPageChange } = this.options.events || {};

        if (!originalDataTable || !this.prevButton || !this.nextButton) {
            return;
        }

        // Event trigger before page change, defined by user
        if (beforePageChange) {
            fireEvent(
                this,
                'beforePageChange',
                {
                    currentPage: pg.currentPage
                },
                beforePageChange
            );
        }

        if (!isNext) {
            pg.currentPage--;
        }

        // Set the range of the pagination
        this.grid.querying.pagination.setRange(pg.currentPage, isNext);

        if (isNext) {
            pg.currentPage++;
        }

        pg.isNext = isNext;

        this.setButtonState(this.prevButton, pg.currentPage === 1);
        this.setButtonState(
            this.nextButton,
            Math.ceil(
                originalDataTable.rowCount / this.options.itemsPerPage
            ) === pg.currentPage
        );

        await grid.viewport?.updateRows();

        // Event trigger after page change, defined by user
        if (afterPageChange) {
            fireEvent(
                this,
                'afterPageChange',
                {
                    currentPage: pg.currentPage
                },
                afterPageChange
            );
        }
    }

    /**
     * Set the state of the button.
     *
     * @param button
     * The button to set the state of.
     * @param disabled
     * Whether the button should be disabled.
     */
    public setButtonState(button: HTMLElement, disabled?: boolean): void {
        if (!button || disabled === void 0) {
            return;
        }

        if (disabled) {
            button.setAttribute('disabled', true);
        } else {
            button.removeAttribute('disabled');
        }
    }
    /**
     * Destroy the pagination controller.
     */
    public destroy(): void {
        this.row?.remove();
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Pagination {
    export interface Options {
        /**
         * Whether the pagination should be rendered.
         *
         * @default false
         */
        enabled: boolean;

        /**
         * Displayed items per page.
         */
        itemsPerPage: number;

        /**
         * Events for the pagination.
         */
        events?: Pagination.Events;
    }

    export interface Events {
        beforePageChange: (currentPage: number) => void;
        afterPageChange: (currentPage: number) => void;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Pagination;
