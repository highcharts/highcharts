/* *
 *
 *  Data Grid class
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

import Column from '../Column.js';
import DataModifier from '../../Data/Modifiers/DataModifier.js';
import DataTable from '../../Data/DataTable.js';
import Globals from '../Globals.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table header row containing the column names.
 */
class ColumnSorting {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The sorted column of the table.
     */
    public column: Column;

    /**
     * The head element of the column.
     */
    public headElement: HTMLElement;

    /**
     * Current sorting type on column.
     */
    public sortingState: ColumnSorting.SortingState = 'none';


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs sorting for a dedicated column.
     *
     * @param column
     * The column that be sorted.
     *
     * @param headElement
     * The head element of the column.
     */
    constructor(column: Column, headElement: HTMLElement) {
        this.column = column;
        this.headElement = headElement;
        this.addSortingEvents();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Adds CSS classes and click event to the header of column.
     */
    private addSortingEvents(): void {
        const dataGrid = this.column.viewport.dataGrid;
        const columnSortingState =
            dataGrid.columnSortingState?.[this.column.id];

        if (!dataGrid.dataTable) {
            return;
        }

        this.column.header?.headerContent?.addEventListener(
            'click',
            this.setSortingState
        );

        this.headElement.classList.add(Globals.classNames.columnSorting);

        if (columnSortingState === 'asc') {
            this.headElement.classList.add(
                Globals.classNames.columnSortingAsc
            );
        }

        if (columnSortingState === 'desc') {
            this.headElement.classList.add(
                Globals.classNames.columnSortingDesc
            );
        }
    }

    /**
     * Apply the dedicated sorting for a column
     * (ascending, descending or default).
     */
    private setSortingState = (): void => {
        const dataGrid = this.column.viewport.dataGrid;
        let state = this.sortingState;
        let modifier: DataModifier | undefined;

        if (
            dataGrid.columnSortingState &&
            dataGrid.columnSortingState[this.column.id]
        ) {
            state = dataGrid.columnSortingState[this.column.id];
        } else {
            dataGrid.columnSortingState = {};
        }

        if (state === 'desc') {
            this.sortingState = 'none';
        } else if (state === 'none') {
            modifier = new DataModifier.types.Sort({
                direction: 'asc',
                orderByColumn: this.column.id
            });
            this.sortingState = 'asc';
        } else {
            modifier = new DataModifier.types.Sort({
                direction: 'desc',
                orderByColumn: this.column.id
            });

            this.sortingState = 'desc';
        }

        dataGrid.columnSortingState[this.column.id] = this.sortingState;
        dataGrid.update({
            table: modifier ? (
                modifier.modifyTable(
                    (dataGrid.dataTable as DataTable).clone()
                )
            ) : dataGrid.originalDataTable
        });

        dataGrid.options?.events?.column?.afterSorting?.call(this.column);
    };

    /**
     * Unbind click event
     */
    public removeEventListeners(): void {
        this.headElement.removeEventListener('click', this.setSortingState);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace ColumnSorting {
    export type SortingState = 'asc' | 'desc' | 'none';
}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnSorting;
