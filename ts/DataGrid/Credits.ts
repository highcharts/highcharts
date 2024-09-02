/* *
 *
 *  Data Grid Credits class
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

import DataGrid from './DataGrid';
import DGUtils from './Utils.js';

const { makeHTMLElement } = DGUtils;

/* *
 *
 *  Abstract Class of Row
 *
 * */

/**
 * Represents a credits in the data grid.
 */
abstract class Credits {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The Data Grid Table instance which the credits belong to.
     */
    public dataGrid: DataGrid;

    /**
     * The Credits HTML element.
     */
    public htmlElement: HTMLElement;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Construct the credits.
     *
     * @param dataGrid
     * The Data Grid Table instance which the credits belong to.
     */
    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;

        this.htmlElement = makeHTMLElement('div', {
            className: 'temp'
        });
    }


    /* *
    *
    *  Methods
    *
    * */

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Credits {

}


/* *
 *
 *  Default Export
 *
 * */

export default Credits;
