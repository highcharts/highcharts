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

import type FilterToolbarButton from './Buttons/FilterToolbarButton.js';

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

    /**
     * The toolbar button that opened the popup.
     */
    public button: FilterToolbarButton;


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
     * @param toolbarButton
     * The toolbar button that opened the popup.
     */
    constructor(
        filtering: ColumnFiltering,
        toolbarButton: FilterToolbarButton
    ) {
        super(filtering.column.viewport.grid);
        this.filtering = filtering;
        this.button = toolbarButton;
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

    protected override onKeyDown(event: KeyboardEvent): void {
        this.filtering.onKeyDown(event);

        if (event.key === 'Escape') {
            this.hide();
            this.button.focus();
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilterPopup;
