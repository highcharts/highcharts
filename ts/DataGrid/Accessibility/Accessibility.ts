/* *
 *
 *  DataGrid Accessibility class
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
import DGUtils from '../Utils.js';

const { makeHTMLElement } = DGUtils;


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
    private element: HTMLElement;

    /**
     * The HTML element of the announcer.
     */
    private announcerElement: HTMLElement;

    /**
     * The timeout for the announcer element removal.
     */
    private announcerTimeout?: number;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Construct the accessibility object.
     *
     * @param dataGrid
     * The DataGrid Table instance which the accessibility controller belong to.
     */
    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;

        this.element = document.createElement('div');
        this.element.classList.add(Globals.classNames.visuallyHidden);
        this.dataGrid.container?.prepend(this.element);

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
     * Add the 'editable' hint span element for the editable cell.
     *
     * @param cellElement
     * The cell element to add the description to.
     */
    public addEditableCellHint(cellElement: HTMLElement): void {
        const editableLang =
            this.dataGrid.options?.lang?.accessibility?.cellEditing?.editable;

        if (!editableLang) {
            return;
        }

        makeHTMLElement('span', {
            className: Globals.classNames.visuallyHidden,
            innerText: ', ' + editableLang
        }, cellElement);
    }

    /**
     * Add the 'sortable' hint span element for the sortable column.
     *
     * @param element
     * The element to add the description to.
     */
    public addSortableColumnHint(element: HTMLElement): void {
        const sortableLang =
            this.dataGrid.options?.lang?.accessibility?.sorting?.sortable;

        if (!sortableLang) {
            return;
        }

        makeHTMLElement('span', {
            className: Globals.classNames.visuallyHidden,
            innerText: ', ' + sortableLang
        }, element);
    }

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
        this.announcerElement.textContent = msg;

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
        const { options } = this.dataGrid;
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
     * Announce the message to the screen reader that the user edited the cell.
     *
     * @param msgType
     * The type of the edit message.
     */
    public userEditedCell(msgType: Accessibility.EditMsgType): void {
        const { options } = this.dataGrid;
        const announcementsLang = options?.lang
            ?.accessibility?.cellEditing?.announcements;

        if (!options?.accessibility?.announcements?.cellEditing) {
            return;
        }

        const msg = announcementsLang?.[msgType];
        if (!msg) {
            return;
        }

        this.announce(msg);
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
        state: Accessibility.AriaSortState
    ): void {
        thElement?.setAttribute('aria-sort', state);
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
     * Set aria attributes for the table element.
     */
    public initTableA11yAttrs(): void {
        const dataGrid = this.dataGrid;
        const tableEl = dataGrid.tableElement;

        if (!tableEl) {
            return;
        }

        tableEl.setAttribute(
            'aria-rowcount',
            dataGrid.dataTable?.getRowCount() || 0
        );

        if (dataGrid.captionElement) {
            tableEl.setAttribute(
                'aria-labelledby',
                dataGrid.captionElement.id
            );
        }

        if (dataGrid.descriptionElement) {
            tableEl.setAttribute(
                'aria-describedby',
                dataGrid.descriptionElement.id
            );
        }
    }

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Accessibility {
    /**
     * The possible states of the aria-sort attribute.
     */
    export type AriaSortState = 'ascending' | 'descending' | 'none';

    /**
     * The possible types of the edit message.
     */
    export type EditMsgType = 'started' | 'edited' | 'cancelled';
}


/* *
 *
 *  Default Export
 *
 * */

export default Accessibility;
