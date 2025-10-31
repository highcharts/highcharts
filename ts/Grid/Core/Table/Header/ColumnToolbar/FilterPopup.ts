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
import U from '../../../../../Core/Utilities.js';

const { merge } = U;


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
     *
     * @param options
     * Popup options.
     */
    constructor(
        filtering: ColumnFiltering,
        button: Button,
        options?: Popup.Options
    ) {
        const grid = filtering.column.viewport.grid;
        super(grid, button, merge({
            header: {
                category: grid.options?.lang?.setFilter,
                label: filtering.column.header?.value || ''
            }
        }, options));
        this.filtering = filtering;
    }


    /* *
     *
     *  Methods
     *
     * */

    public override show(anchorElement?: HTMLElement): void {
        super.show(anchorElement);
        this.filtering.filterSelect?.focus();
    }

    protected override renderContent(contentElement: HTMLElement): void {
        this.filtering.renderFilteringContent(contentElement);
    }

    protected override onKeyDown(event: KeyboardEvent): void {
        super.onKeyDown(event);
        this.filtering.onKeyDown(event);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilterPopup;
