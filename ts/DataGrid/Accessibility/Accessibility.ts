/* *
 *
 *  Data Grid Accessibility class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataGrid from '../DataGrid';
import type { ColumnSortingOrder } from '../Options';

import Globals from '../Globals.js';


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
    public dataGrid: DataGrid;

    /**
     * The HTML element of the accessibility.
     */
    public element: HTMLElement;

    /**
     * The HTML element of the announcer.
     */
    private announcerElement: HTMLElement;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Construct the accessibility object.
     *
     * @param dataGrid
     * The Data Grid Table instance which the credits belong to.
     */
    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;

        this.element = document.createElement('div');
        this.element.classList.add(Globals.classNames.visuallyHidden);
        this.dataGrid.container?.prepend(this.element);

        this.announcerElement = document.createElement('p');
    }


    /* *
    *
    *  Methods
    *
    * */

    public announce(msg: string, assertive = false): void {
        this.announcerElement?.remove();

        this.announcerElement.setAttribute(
            'aria-live', assertive ? 'assertive' : 'polite'
        );
        this.announcerElement.setAttribute('aria-atomic', 'true');
        this.announcerElement.setAttribute('aria-hidden', 'false');
        this.element.appendChild(this.announcerElement);

        this.announcerElement.textContent = msg;

        setTimeout((): void => {
            this.announcerElement?.remove();
        }, 3000);
    }

    public userSortedColumn(order: ColumnSortingOrder): void {
        const sortingOptions = this.dataGrid.options?.accessibility?.sorting;
        let msg: string | undefined;

        switch (order) {
            case 'asc':
                msg = sortingOptions?.ascending;
                break;
            case 'desc':
                msg = sortingOptions?.descending;
                break;
            default:
                msg = sortingOptions?.none;
        }

        if (!msg) {
            return;
        }

        this.announce(msg, true);
    }

    public setColumnSortState(
        thElement: HTMLElement,
        state: Accessibility.AriaSortState
    ): void {
        thElement?.setAttribute('aria-sort', state);
    }

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Accessibility {
    export type AriaSortState = 'ascending' | 'descending' | 'none';
}


/* *
 *
 *  Default Export
 *
 * */

export default Accessibility;
