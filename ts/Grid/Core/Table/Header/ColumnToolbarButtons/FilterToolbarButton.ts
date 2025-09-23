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

import FilterPopup from '../../Actions/ColumnFiltering/FilterPopup.js';
import ToolbarButton from '../../../UI/ToolbarButton.js';
import U from '../../../../../Core/Utilities.js';

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

    private popup?: FilterPopup;


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

    protected override refreshState(): void {
        const {
            condition,
            value
        } = this.toolbar?.column.options.filtering || {};

        this.setActive(!!(condition && (
            ['empty', 'notEmpty'].includes(condition) ||
            (value !== void 0 && value !== '') // Accept null and 0
        )));
    }

    protected override addEventListeners(): void {
        super.addEventListeners();

        const toolbar = this.toolbar;
        if (!toolbar) {
            return;
        }

        addEvent(toolbar.column, 'afterFiltering', (): void => {
            this.refreshState();
        });
    }

    protected override clickHandler(event: MouseEvent): void {
        super.clickHandler(event);
        const filtering = this.toolbar?.column.filtering;

        if (!filtering) {
            return;
        }

        if (!this.popup) {
            this.popup = new FilterPopup(filtering);

            this.eventListenerDestroyers.push(
                addEvent(this.popup, 'afterShow', (): void => {
                    this.setHighlighted(true);
                }),
                addEvent(this.popup, 'afterHide', (): void => {
                    this.setHighlighted(false);
                })
            );
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
