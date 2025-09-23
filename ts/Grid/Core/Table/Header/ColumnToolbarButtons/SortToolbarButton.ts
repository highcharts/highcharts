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

import type ColumnSorting from '../../Actions/ColumnSorting.js';
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

    /**
     * Used to remove the event listeners when the button is destroyed.
     */
    private eventListenerDestroyers: Function[] = [];


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

    protected override addEventListeners(): void {
        super.addEventListeners();

        const column = this.toolbar?.column;
        if (!column) {
            return;
        }

        // If this column is currently sorted, update the icon
        this.eventListenerDestroyers.push(
            addEvent(
                column.viewport.grid,
                'afterSorting',
                (e: ColumnSorting.Event): void => {

                    if (e.target !== column) {
                        this.setIcon('chevronSelector');
                        this.setActive(false);
                        return;
                    }

                    switch (e.order) {
                        case 'asc':
                            this.setIcon('chevronDown');
                            this.setActive(true);
                            break;
                        case 'desc':
                            this.setIcon('chevronUp');
                            this.setActive(true);
                            break;
                        default:
                            this.setIcon('chevronSelector');
                            this.setActive(false);
                            break;
                    }
                }
            )
        );
    }

    protected override renderActiveIndicator(): void {
        // Do nothing
    }

    protected override removeEventListeners(): void {
        super.removeEventListeners();

        for (const destroyer of this.eventListenerDestroyers) {
            destroyer();
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SortToolbarButton;
