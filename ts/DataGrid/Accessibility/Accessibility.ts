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
     * The HTML element of the description for the editable cell.
     */
    private editableCellDescriptionEl: HTMLElement;

    /**
     * The HTML element of the description for the sortable column.
     */
    private sortableColumnDescriptionEl: HTMLElement;

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

        this.editableCellDescriptionEl = document.createElement('p');
        this.sortableColumnDescriptionEl = document.createElement('p');
        this.editableCellDescriptionEl.setAttribute('aria-hidden', true);
        this.sortableColumnDescriptionEl.setAttribute('aria-hidden', true);

        this.editableCellDescriptionEl.id =
            Accessibility.decriptionElementIds.editableCell;
        this.sortableColumnDescriptionEl.id =
            Accessibility.decriptionElementIds.sortableColumn;

        this.element.appendChild(this.editableCellDescriptionEl);
        this.element.appendChild(this.sortableColumnDescriptionEl);

        this.loadOptions();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Load the accessibility options.
     */
    public loadOptions(): void {
        const lang = this.dataGrid.options?.lang?.accessibility;
        if (!lang) {
            return;
        }

        this.editableCellDescriptionEl.textContent =
            lang.cellEditing?.editable || '';
        this.sortableColumnDescriptionEl.textContent =
            lang.sorting?.sortable || '';
    }

    /**
     * Add the description for the editable cell.
     *
     * @param cellElement
     * The cell element to add the description to.
     */
    public addEditableCellDescription(cellElement: HTMLElement): void {
        cellElement.setAttribute(
            'aria-describedby',
            Accessibility.decriptionElementIds.editableCell
        );
    }

    /**
     * Add the description for the sortable column header.
     *
     * @param thElement
     * The header cell element to add the description to.
     */
    public addSortableColumnDescription(thElement: HTMLElement): void {
        thElement.setAttribute(
            'aria-describedby',
            Accessibility.decriptionElementIds.sortableColumn
        );
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
        const announcements = this.dataGrid.options?.lang
            ?.accessibility?.sorting?.announcements;

        if (!announcements?.enabled) {
            return;
        }

        let msg: string | undefined;

        switch (order) {
            case 'asc':
                msg = announcements?.ascending;
                break;
            case 'desc':
                msg = announcements?.descending;
                break;
            default:
                msg = announcements?.none;
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
        const messages = this.dataGrid.options?.lang
            ?.accessibility?.cellEditing?.announcements;

        if (!messages?.enabled) {
            return;
        }

        const msg = messages?.[msgType];
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

    /**
     * Dictionary of the IDs of the description elements.
     */
    export const decriptionElementIds = {
        editableCell: 'highchartsdata-grid-editable-cell-description',
        sortableColumn: 'highcharts-datagrid-sortable-column-description'
    } as const;
}


/* *
 *
 *  Default Export
 *
 * */

export default Accessibility;
