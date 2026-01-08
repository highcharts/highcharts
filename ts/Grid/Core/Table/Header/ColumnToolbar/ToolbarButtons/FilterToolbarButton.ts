/* *
 *
 *  Grid Filter Toolbar Button class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import FilterPopup from '../FilterPopup.js';
import ToolbarButton from '../../../../UI/ToolbarButton.js';
import StateHelpers from '../StateHelpers.js';
import U from '../../../../../../Core/Utilities.js';

const { addEvent } = U;


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

    public override popup?: FilterPopup;


    /* *
     *
     *  Constructor
     *
     * */

    constructor() {
        super({
            icon: 'filter',
            classNameKey: 'headerCellFilterIcon',
            accessibility: {
                ariaLabel: 'filter',
                ariaExpanded: false,
                ariaControls: 'filter-popup'
            }
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    public override refreshState(): void {
        const column = this.toolbar?.column;
        if (column) {
            this.setActive(StateHelpers.isFiltered(column));
        }
    }

    protected override addEventListeners(): void {
        super.addEventListeners();

        const toolbar = this.toolbar;
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
        const filtering = this.toolbar?.column.filtering;

        if (!filtering) {
            return;
        }

        if (!this.popup) {
            this.popup = new FilterPopup(filtering, this);
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
