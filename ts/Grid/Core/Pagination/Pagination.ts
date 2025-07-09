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
        enabled: false
    };

    /* *
    *
    *  Properties
    *
    * */
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
     * The row in tfoot
     */
    public row?: HTMLElement;

    /**
     * The cell of the row in the tfoot
     */
    public cell?: HTMLElement;

    /**
     * Navigation next button
     */
    public nextButton?: HTMLElement;

    /**
     * Navigation prev button
     */
    public prevButton?: HTMLElement;

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
        const paginationContainer = this.grid.viewport?.tfootElement;
        this.row = makeHTMLElement('tr', {}, paginationContainer);
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
        this.prevButton = makeHTMLElement(
            'button',
            {
                innerHTML: '&lsaquo;' // TODO: add lang support
            },
            this.contentWrapper
        );
        this.prevButton.setAttribute('disabled', true);

        this.nextButton = makeHTMLElement(
            'button',
            {
                innerHTML: '&rsaquo;' // TODO: add lang support
            },
            this.contentWrapper
        );
        this.nextButton.setAttribute('disabled', true);
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
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Pagination;
