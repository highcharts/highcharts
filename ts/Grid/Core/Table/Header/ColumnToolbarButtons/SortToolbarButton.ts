/* *
 *
 *  Grid Sort Toolbar Button class
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
import U from '../../../../../Core/Utilities.js';

const { addEvent } = U;


/* *
 *
 *  Class
 *
 * */

class SortToolbarButton extends ToolbarButton {


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
            icon: 'chevronSelector',
            classNameKey: 'headerCellSortIcon'
        });
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override clickHandler(event: MouseEvent): void {
        super.clickHandler(event);
        this.toolbar?.column.sorting?.toggle();
    }

    protected override refreshState(): void {
        const {
            currentSorting
        } = this.toolbar?.column.viewport.grid.querying.sorting || {};

        if (
            currentSorting?.columnId === this.toolbar?.column.id &&
            currentSorting?.order
        ) {
            this.setIcon(
                currentSorting.order === 'asc' ? 'chevronUp' : 'chevronDown'
            );
            this.setActive(true);
            return;
        }

        this.setIcon('chevronSelector');
        this.setActive(false);
    }

    protected override addEventListeners(): void {
        super.addEventListeners();

        const column = this.toolbar?.column;
        if (!column) {
            return;
        }

        // If this grid is currently sorted, update the state
        this.eventListenerDestroyers.push(
            addEvent(
                column.viewport.grid,
                'afterSorting',
                (): void => this.refreshState()
            )
        );
    }

    protected override renderActiveIndicator(): void {
        // Do nothing
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SortToolbarButton;
