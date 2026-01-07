/* *
 *
 *  Grid Sort Toolbar Button class
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

import ToolbarButton from '../../../../UI/ToolbarButton.js';
import StateHelpers from '../StateHelpers.js';
import U from '../../../../../../Core/Utilities.js';

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
            icon: 'upDownArrows',
            classNameKey: 'headerCellSortIcon',
            accessibility: {
                ariaLabel: 'sort'
            }
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

    public override refreshState(): void {
        const column = this.toolbar?.column;
        if (!column) {
            return;
        }

        if (!StateHelpers.isSorted(column)) {
            this.setActive(false);
            this.setIcon('upDownArrows');
            return;
        }

        const { currentSorting } = column.viewport.grid.querying.sorting;

        this.setActive(true);
        this.setIcon(
            currentSorting?.order === 'asc' ? 'sortAsc' : 'sortDesc'
        );
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
                'afterSort',
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
