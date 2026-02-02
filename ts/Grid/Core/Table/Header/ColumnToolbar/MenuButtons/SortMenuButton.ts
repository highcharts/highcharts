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
import type Column from '../../../Column';

import ContextMenuButton from '../../../../UI/ContextMenuButton.js';
import StateHelpers from '../StateHelpers.js';
import { addEvent } from '../../../../../../Shared/Utilities.js';


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

    private baseLabel: string;


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
        this.baseLabel = langOptions[
            direction === 'asc' ? 'sortAscending' : 'sortDescending'
        ] || '';
        this.options.label = this.baseLabel;
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

        const isSorted = StateHelpers.isSorted(column, this.direction);
        this.setActive(isSorted);

        // Update label with priority if multi-column sorting is active
        this.updateLabelWithPriority(isSorted ? column : void 0);
    }

    /**
     * Updates the label to include the sort priority when multi-column
     * sorting is active.
     *
     * @param column
     * The column to get the priority from, or undefined to reset the label.
     */
    private updateLabelWithPriority(column?: Column): void {
        if (!column) {
            this.setLabel(this.baseLabel);
            return;
        }

        const { currentSortings } =
            column.viewport.grid.querying.sorting;
        const sortings = currentSortings || [];

        const sortIndex = sortings.findIndex((sorting): boolean =>
            sorting.columnId === column.id
        );

        const priority = (
            sortings.length > 1 && sortIndex !== -1 ?
                sortIndex + 1 :
                void 0
        );

        if (priority) {
            this.setLabel(`${this.baseLabel} (${priority})`);
        } else {
            this.setLabel(this.baseLabel);
        }
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

        void sorting.setOrder(
            this.isActive ? null : this.direction,
            !!event?.shiftKey
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SortMenuButton;
