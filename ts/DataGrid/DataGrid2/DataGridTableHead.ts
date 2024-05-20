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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Utils from './Utils.js';
import DataGridColumn from './DataGridColumn.js';
import DataGridTable from './DataGridTable.js';

const { makeHTMLElement } = Utils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table header row containing the column names.
 */
class DataGridTableHead {

    /* *
    *
    *  Properties
    *
    * */

    public columns: DataGridColumn[] = [];
    public container: HTMLElement;


    /* *
    *
    *  Constructor
    *
    * */

    constructor(container: HTMLElement, columns: DataGridColumn[]) {
        this.container = container;
        this.columns = columns;
    }


    /* *
    *
    *  Methods
    *
    * */

    public render(): void {
        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            const element = makeHTMLElement('th', {
                innerText: this.columns[i].name
            }, this.container);

            this.columns[i].headElement = element;
        }
    }

    public reflow(): void {
        let width = 0;

        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            const column = this.columns[i];
            if (!column.headElement) {
                continue;
            }

            const columnWidth = column.getWidth();
            column.headElement.style.width = columnWidth + 'px';
            width += columnWidth;
        }

        this.container.style.paddingRight =
            this.container.offsetWidth - width + 'px';
    }


    /* *
    *
    *  Static Methods
    *
    * */

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridTableHead {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridTableHead;
