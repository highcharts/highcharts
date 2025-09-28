/* *
 *
 *  Grid Filter Context Menu Button class
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

import type MenuPopup from '../MenuPopup';

import FilterPopup from '../FilterPopup.js';
import ContextMenuButton from '../../../../UI/ContextMenuButton.js';
import U from '../../../../../../Core/Utilities.js';

const { addEvent } = U;


/* *
 *
 *  Class
 *
 * */

class FilterToolbarButton extends ContextMenuButton {


    /* *
     *
     *  Properties
     *
     * */

    public override contextMenu?: MenuPopup;

    public override popup?: FilterPopup;


    /* *
     *
     *  Constructor
     *
     * */

    constructor() {
        super({
            label: 'Filter', // TODO: Use lang option
            icon: 'filter',
            chevron: true
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override refreshState(): void {
        const {
            condition,
            value
        } = this.contextMenu?.button.toolbar?.column.options.filtering || {};

        this.setActive(!!(condition && (
            ['empty', 'notEmpty'].includes(condition) ||
            (value !== void 0 && value !== '') // Accept null and 0
        )));
    }

    protected override addEventListeners(): void {
        super.addEventListeners();

        const toolbar = this.contextMenu?.button.toolbar;
        if (!toolbar) {
            return;
        }

        this.eventListenerDestroyers.push(
            addEvent(toolbar.column, 'afterFilter', (): void => {
                this.refreshState();
            })
        );
    }

    protected override clickHandler(event: MouseEvent): void {
        super.clickHandler(event);
        const filtering = this.contextMenu?.button.toolbar?.column.filtering;

        if (!filtering) {
            return;
        }

        if (!this.popup) {
            this.popup = new FilterPopup(filtering, this, {
                nextToAnchor: true
            });
        }

        this.popup.toggle(this.wrapper);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default FilterToolbarButton;
