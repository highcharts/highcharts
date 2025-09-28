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

import type Button from '../../../UI/Button';

import ColumnFiltering from '../../Actions/ColumnFiltering/ColumnFiltering.js';
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
     *
     * @param button
     * The button that opened the popup.
     */
    constructor(
        filtering: ColumnFiltering,
        button: Button
    ) {
        super(filtering.column.viewport.grid, button);
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

    public override show(anchorElement?: HTMLElement): void {
        super.show(anchorElement);
        this.filtering.filterSelect?.focus();
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilterPopup;
