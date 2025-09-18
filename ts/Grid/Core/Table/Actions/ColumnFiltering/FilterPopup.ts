/* *
 *
 *  Grid Filter Popup class
 *
 *  (c) 2020-2025 Highsoft AS
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

import ColumnFiltering from './ColumnFiltering.js';
import Popup from '../../../UI/Popup.js';


/* *
 *
 *  Class
 *
 * */

/**
 * The column filtering popup.
 */
class FilterPopup extends Popup {


    /* *
     *
     *  Properties
     *
     * */

    /**
     * The column filtering.
     */
    public filtering: ColumnFiltering;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a column filtering popup.
     *
     * @param filtering
     * The column filtering.
     */
    constructor(filtering: ColumnFiltering) {
        super(filtering.column.viewport.grid);
        this.filtering = filtering;
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override renderContent(contentElement: HTMLElement): void {
        this.filtering.renderFilteringContent(contentElement);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilterPopup;
