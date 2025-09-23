/* *
 *
 *  Grid Menu Popup class
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

import type MenuToolbarButton from './Buttons/MenuToolbarButton.js';
import type Grid from '../../../Grid.js';

import Popup from '../../../UI/Popup.js';


/* *
 *
 *  Class
 *
 * */

/**
 * The column filtering popup.
 */
class MenuPopup extends Popup {

    /* *
     *
     *  Properties
     *
     * */

    public button: MenuToolbarButton;

    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid, button: MenuToolbarButton) {
        super(grid);
        this.button = button;
    }

    /* *
     *
     *  Methods
     *
     * */

    protected override renderContent(contentElement: HTMLElement): void {
        // TODO: Render content
        contentElement.innerHTML = 'MenuPopup';
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default MenuPopup;
