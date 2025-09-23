/* *
 *
 *  Grid Filter Toolbar Button class
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

import type ColumnToolbar from '../ColumnToolbar.js';

import ToolbarButton from '../../../UI/ToolbarButton.js';


/* *
 *
 *  Class
 *
 * */

class FilterToolbarButton extends ToolbarButton {


    /* *
     *
     *  Properties
     *
     * */

    public override toolbar?: ColumnToolbar;


    /* *
     *
     *  Constructor
     *
     * */

    constructor() {
        super({
            icon: 'filter',
            classNameKey: 'headerCellFilterIcon'
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override clickHandler(event: MouseEvent): void {
        super.clickHandler(event);
        this.setActive(!this.isActive);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilterToolbarButton;
