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
import GridUtils from '../../../../GridUtils.js';
import Globals from '../../../../Globals.js';
import StateHelpers from '../StateHelpers.js';
import { addEvent } from '../../../../../../Shared/Utilities.js';

const { formatText } = GridUtils;


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

    private sortPriorityIndicator?: HTMLElement;

    private getColumnLabel(): string {
        const column = this.toolbar?.column;
        const label = (
            column?.header?.headerContent?.textContent ||
            column?.header?.value ||
            column?.id ||
            ''
        ).trim();
        return label || column?.id || '';
    }

    private updateA11yLabel(
        order: ('asc'|'desc'|null),
        priority?: number
    ): void {
        const button = this.wrapper?.querySelector('button');
        if (!button) {
            return;
        }

        const column = this.toolbar?.column;
        const lang = column?.viewport.grid.options?.lang;
        const sortingLang = lang?.accessibility?.sorting;
        const announcements = sortingLang?.announcements;

        const columnLabel = this.getColumnLabel();
        const labelParts: string[] = [];
        if (columnLabel) {
            labelParts.push(columnLabel);
        }

        let stateLabel: string | undefined;
        if (order === 'asc') {
            stateLabel = announcements?.ascending;
        } else if (order === 'desc') {
            stateLabel = announcements?.descending;
        } else {
            stateLabel = announcements?.none;
        }

        if (stateLabel) {
            labelParts.push(stateLabel);
        }

        if (priority) {
            labelParts.push(formatText(
                sortingLang?.priority ?? 'Priority {priority}.',
                { priority: String(priority) }
            ));
        }

        if (labelParts.length) {
            button.setAttribute('aria-label', labelParts.join(' '));
        }
    }


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
        this.toolbar?.column.sorting?.toggle(event);
    }

    private renderSortPriorityIndicator(priority?: number): void {
        const wrapper = this.wrapper;
        if (!wrapper) {
            return;
        }

        const button = wrapper.querySelector('button');
        if (!button) {
            return;
        }

        if (!priority) {
            this.sortPriorityIndicator?.remove();
            delete this.sortPriorityIndicator;
            return;
        }

        if (!this.sortPriorityIndicator) {
            this.sortPriorityIndicator = document.createElement('span');
            this.sortPriorityIndicator.className = Globals.getClassName(
                'sortPriorityIndicator'
            );
        }

        // Ensure the indicator is rendered to the right of the icon.
        button.appendChild(this.sortPriorityIndicator);
        this.sortPriorityIndicator.textContent = String(priority);
    }

    public override refreshState(): void {
        const column = this.toolbar?.column;
        if (!column) {
            return;
        }

        const { currentSortings, currentSorting } =
            column.viewport.grid.querying.sorting;
        const sortings = currentSortings || [];
        const columnSorting = (
            sortings.find(
                (sorting): boolean => sorting.columnId === column.id
            ) ||
            (
                currentSorting?.columnId === column.id ?
                    currentSorting :
                    void 0
            )
        );

        if (!StateHelpers.isSorted(column) || !columnSorting?.order) {
            this.setActive(false);
            this.setIcon('upDownArrows');
            this.renderSortPriorityIndicator();
            this.updateA11yLabel(null);
            return;
        }

        this.setActive(true);
        this.setIcon(
            columnSorting.order === 'asc' ? 'sortAsc' : 'sortDesc'
        );

        const sortIndex = sortings.findIndex((sorting): boolean =>
            sorting.columnId === column.id
        );
        const priority = (
            sortings.length > 1 && sortIndex !== -1 ?
                sortIndex + 1 :
                void 0
        );
        this.renderSortPriorityIndicator(priority);
        this.updateA11yLabel(columnSorting.order, priority);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected override renderActiveIndicator(render: boolean): void {
        // Sorting uses directional icons + priority indicators
        // (for multi-sort), not the generic active dot indicator
        // (reserved for filtering).
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SortToolbarButton;
