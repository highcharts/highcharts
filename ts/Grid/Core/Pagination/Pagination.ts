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
import RangeModifier from '../../../Data/Modifiers/RangeModifier.js';

const { makeHTMLElement } = GridUtils;


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

    // public init(): HTMLElement {
    //     return makeHTMLElement('tfoot', this.grid.tableElement);
    // }

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

    public renderNavButtons(): void {
        const pg = this;

        this.prevButton = makeHTMLElement(
            'button',
            {
                innerHTML: '&lsaquo;' // TODO: add lang support
            },
            this.contentWrapper
        );
        this.prevButton.setAttribute('disabled', true);
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
        const pgOptions = pg.options;
        const originalDataTable = grid.dataTable;

        if (!originalDataTable) {
            return;
        }

        if (!isNext) {
            pg.currentPage--;
        }

        const start = pg.currentPage * pgOptions.itemsPerPage;
        const rangeModifier = new RangeModifier({
            start: isNext ? start : start - pgOptions.itemsPerPage,
            end: start + (isNext ? pgOptions.itemsPerPage : 0)
        });
        const dataTableCopy = originalDataTable.clone();
        await rangeModifier.modify(dataTableCopy.modified);
        grid.presentationTable = dataTableCopy.modified;

        if (isNext) {
            pg.currentPage++;
        }

        if (
            (pg.grid.presentationTable?.rowCount || 0) < pgOptions.itemsPerPage
        ) {
            pg.nextButton?.setAttribute('disabled', true);
        } else {
            pg.nextButton?.removeAttribute('disabled');
        }

        if (pg.currentPage > 1) {
            pg.prevButton?.removeAttribute('disabled');
        } else {
            pg.prevButton?.setAttribute('disabled', true);
        }

        grid.viewport?.updateRows();
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
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Pagination;
