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

    /**
     * The visible columns of the table.
     */
    public columns: DataGridColumn[] = [];

    /**
     * The container of the table head.
     */
    public container: HTMLElement;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new table head.
     *
     * @param container The container of the table head.
     * @param columns The columns of the table.
     */
    constructor(container: HTMLElement, columns: DataGridColumn[]) {
        this.columns = columns;
        this.container = makeHTMLElement('tr', {}, container);
        this.container.setAttribute('aria-rowindex', 1);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the table head.
     */
    public render(): void {

        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            const element = makeHTMLElement('th', {
                innerText: this.columns[i].name
            }, this.container);

            element.setAttribute('scope', 'col');

            this.columns[i].headElement = element;
        }
    }

    /**
     * Reflows the table head's content dimensions.
     */
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
