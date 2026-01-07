/* *
 *
 *  Grid Sort Context Menu Button class
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

import type MenuPopup from '../MenuPopup';
import type { LangOptions } from '../../../../Options';

import ContextMenuButton from '../../../../UI/ContextMenuButton.js';
import StateHelpers from '../StateHelpers.js';
import U from '../../../../../../Core/Utilities.js';

const { addEvent } = U;


/* *
 *
 *  Class
 *
 * */

class SortMenuButton extends ContextMenuButton {


    /* *
     *
     *  Properties
     *
     * */

    public override contextMenu?: MenuPopup;

    private direction: ('asc'|'desc');


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        langOptions: LangOptions,
        direction: typeof SortMenuButton.prototype.direction
    ) {
        super({ icon: direction === 'asc' ? 'sortAsc' : 'sortDesc' });

        this.direction = direction;
        this.options.label = langOptions[
            direction === 'asc' ? 'sortAscending' : 'sortDescending'
        ];
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override refreshState(): void {
        const column = this.contextMenu?.button?.toolbar?.column;
        if (!column) {
            return;
        }

        this.setActive(StateHelpers.isSorted(column, this.direction));
    }

    protected override addEventListeners(): void {
        super.addEventListeners();

        const column = this.contextMenu?.button?.toolbar?.column;
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

    protected override clickHandler(event: MouseEvent): void {
        super.clickHandler(event);
        const sorting = this.contextMenu?.button?.toolbar?.column.sorting;
        if (!sorting) {
            return;
        }

        void sorting.setOrder(this.isActive ? null : this.direction);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SortMenuButton;
