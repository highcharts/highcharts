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
     * The HTML element of the main description.
     */
    private mainDescriptionEl: HTMLElement;


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
        this.announcerElement.setAttribute('aria-atomic', 'true');
        this.announcerElement.setAttribute('aria-hidden', 'false');

        this.editableCellDescriptionEl = document.createElement('p');
        this.sortableColumnDescriptionEl = document.createElement('p');
        this.mainDescriptionEl = document.createElement('p');

        this.editableCellDescriptionEl.id =
            Accessibility.decriptionElementIds.editableCell;
        this.sortableColumnDescriptionEl.id =
            Accessibility.decriptionElementIds.sortableColumn;
        this.mainDescriptionEl.id =
            Accessibility.decriptionElementIds.main;

        this.element.appendChild(this.editableCellDescriptionEl);
        this.element.appendChild(this.sortableColumnDescriptionEl);
        this.element.appendChild(this.mainDescriptionEl);

        this.loadOptions();
    }


    /* *
    *
    *  Methods
    *
    * */

    public loadOptions(): void {
        const options = this.dataGrid.options?.accessibility;
        if (!options) {
            return;
        }

        this.mainDescriptionEl.textContent = options?.description || '';
        this.editableCellDescriptionEl.textContent =
            options.cellEditing?.description || '';
        this.sortableColumnDescriptionEl.textContent =
            options.sorting?.description || '';
    }

    public addEditableCellDescription(cellElement: HTMLElement): void {
        cellElement.setAttribute(
            'aria-describedby',
            Accessibility.decriptionElementIds.editableCell
        );
    }

    public addSortableColumnDescription(thElement: HTMLElement): void {
        thElement.setAttribute(
            'aria-describedby',
            Accessibility.decriptionElementIds.sortableColumn
        );
    }

    public addMainDescription(): void {
        // TODO: Where to add the main description?
    }

    public announce(msg: string, assertive = false): void {
        this.announcerElement.remove();
        this.announcerElement.setAttribute(
            'aria-live', assertive ? 'assertive' : 'polite'
        );

        this.element.appendChild(this.announcerElement);
        this.announcerElement.textContent = msg;

        // Debug:
        // console.log('announce:', msg);

        setTimeout((): void => {
            this.announcerElement?.remove();
        }, 3000);
    }

    public userSortedColumn(order: ColumnSortingOrder): void {
        const messages = this.dataGrid.options?.accessibility?.sorting;
        let msg: string | undefined;

        switch (order) {
            case 'asc':
                msg = messages?.ascending;
                break;
            case 'desc':
                msg = messages?.descending;
                break;
            default:
                msg = messages?.none;
        }

        if (!msg) {
            return;
        }

        this.announce(msg, true);
    }

    public userEditedCell(msgType: Accessibility.EditMsgType): void {
        const messages = this.dataGrid.options?.accessibility?.cellEditing;
        const msg = messages?.[msgType];
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
    export type EditMsgType = 'startEdit' | 'afterEdit' | 'cancelEdit';

    export const decriptionElementIds = {
        main: 'highcharts-datagrid-main-description',
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
