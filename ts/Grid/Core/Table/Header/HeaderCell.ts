/* *
 *
 *  Grid HeaderCell class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { GroupedHeaderOptions } from '../../Options';

import Cell from '../Cell.js';
import Column from '../Column';
import Row from '../Row';
import GridUtils from '../../GridUtils.js';
import ColumnSorting from '../Actions/ColumnSorting.js';
import Globals from '../../Globals.js';
import Utilities from '../../../../Core/Utilities.js';
import HeaderIconManager from './HeaderIconManager.js';
import TableHeader from './TableHeader.js';
import GridIcons from '../../../Icons/GridIcons.js';

const {
    makeHTMLElement,
    setHTMLContent
} = GridUtils;
const {
    fireEvent,
    merge,
    isString
} = Utilities;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell in the data grid header.
 */
class HeaderCell extends Cell {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The HTML element of the header cell content.
     */
    public headerContent?: HTMLElement;

    /**
     * Reference to options in settings header.
     */
    public readonly options: Partial<Column.Options> = {};

    /**
     * List of columns that are subordinated to the header cell.
     */
    public readonly columns: Column[] = [];

    /**
     * Content value of the header cell.
     */
    public override value: string = '';

    /**
     * The table header that this header cell belongs to.
     */
    public tableHeader: TableHeader;

    /**
     * Icon manager for this header cell.
     */
    public iconManager?: HeaderIconManager;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid header.
     *
     * @param row
     * The row of the cell.
     *
     * @param column
     * The column of the cell.
     *
     * @param columnsTree
     * If the cell is a wider than one column, this property contains the
     * structure of the columns that are subordinated to the header cell.
     */
    constructor(
        row: Row,
        column?: Column,
        columnsTree?: GroupedHeaderOptions[]
    ) {
        super(row, column);
        const header = this.row.viewport.header;
        if (!header) {
            throw new Error('No header found.');
        }
        this.tableHeader = header;

        if (column) {
            column.header = this;
            this.columns.push(column);
        } else if (columnsTree) {
            const vp = this.row.viewport;
            const columnIds = vp.grid.getColumnIds(columnsTree, true);
            for (const columnId of columnIds) {
                const column = vp.getColumn(columnId);
                if (column) {
                    this.columns.push(column);
                }
            }
        }
    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Init element.
     */
    public override init(): HTMLTableCellElement {
        const elem = document.createElement('th', {});
        elem.classList.add(Globals.getClassName('headerCell'));
        return elem;
    }

    /**
     * Render the cell container.
     *
     * @param filtering
     * Whether the cell is part of the filtering row.
     */
    public override render(filtering?: boolean): void {
        const { column } = this;
        const options = merge(column?.options || {}, this.options);

        if (!filtering) {
            const headerCellOptions = options.header || {};
            const isSortableData = options.sorting?.sortable && column?.data;

            if (headerCellOptions.formatter) {
                this.value = headerCellOptions.formatter.call(this).toString();
            } else if (isString(headerCellOptions.format)) {
                this.value = column ?
                    column.format(headerCellOptions.format) :
                    headerCellOptions.format;
            } else {
                this.value = column?.id || '';
            }

            this.headerContent = makeHTMLElement('span', {
                className: Globals.getClassName('headerCellContent')
            }, this.htmlElement);

            // Render the header cell element content.
            setHTMLContent(this.headerContent, this.value);

            if (isSortableData) {
                column.viewport.grid.accessibility?.addSortableColumnHint(
                    this.headerContent
                );
            }

            // Add sorting
            this.initColumnSorting();
        }

        // Render content of th element
        this.row.htmlElement.appendChild(this.htmlElement);

        this.htmlElement.setAttribute('scope', 'col');

        if (this.options.className) {
            this.htmlElement.classList.add(
                ...this.options.className.split(/\s+/g)
            );
        }

        if (column) {
            this.htmlElement.setAttribute('data-column-id', column.id);

            // Add user column classname
            if (column.options.className) {
                this.htmlElement.classList.add(
                    ...column.options.className.split(/\s+/g)
                );
            }

            // Add resizing
            column.viewport.columnsResizer?.renderColumnDragHandles(
                column,
                this
            );
        }

        this.setCustomClassName(options.header?.className);

        fireEvent(this, 'afterRender', { column, filtering });
    }

    public override reflow(): void {
        const th = this.htmlElement;

        if (!th) {
            return;
        }

        let width = 0;

        for (const column of this.columns) {
            width += column.getWidth() || 0;
        }

        // Set the width of the column. Max width is needed for the
        // overflow: hidden to work.
        th.style.width = th.style.maxWidth = width + 'px';
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        if (!this.column) {
            return;
        }

        // Handle keyboard navigation within header cell
        if (e.target === this.htmlElement) {
            if (e.key === 'Enter') {
                // Enter on header cell should focus first icon if available
                const firstIcon = this.iconManager?.getFirstFocusableButton();
                if (firstIcon) {
                    e.preventDefault();
                    this.showIcons(); // Ensure icons are visible and focusable
                    firstIcon.focus();
                    return;
                }
                // Fallback to sorting if no icons
                if (this.column.options.sorting?.sortable) {
                    this.column.sorting?.toggle();
                }
                return;
            }
        }

        // Handle navigation between icons
        if (
            e.target &&
            (e.target as HTMLElement).classList.contains('hcg-button')
        ) {
            this.handleIconNavigation(e);
            return;
        }

        super.onKeyDown(e);
    }

    /**
     * Handles keyboard navigation between icons within the header cell.
     *
     * @param e
     * The keyboard event.
     */
    private handleIconNavigation(e: KeyboardEvent): void {
        const target = e.target as HTMLButtonElement;
        if (!this.iconManager) {
            return;
        }

        const allButtons = this.iconManager.getAllButtons();
        const currentIndex = allButtons.indexOf(target);

        if (currentIndex === -1) {
            return;
        }

        let nextButton: HTMLButtonElement | null = null;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                nextButton = allButtons[currentIndex - 1] ||
                    allButtons[allButtons.length - 1];
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextButton = allButtons[currentIndex + 1] || allButtons[0];
                break;
            case 'Tab':
                // Allow normal tab behavior unless it's the last icon
                if (e.shiftKey && currentIndex === 0) {
                    // Shift+Tab on first icon should go back to header cell
                    e.preventDefault();
                    this.htmlElement.focus();
                } else if (
                    !e.shiftKey &&
                    currentIndex === allButtons.length - 1
                ) {
                    // Tab on last icon should go to next focusable element
                    // Let browser handle this naturally
                }
                return;
            case 'Escape':
                e.preventDefault();
                this.htmlElement.focus();
                return;
        }

        if (nextButton) {
            nextButton.focus();
        }
    }

    protected override onClick(e: MouseEvent): void {
        const column = this.column;

        if (
            !column || (
                e.target !== this.htmlElement &&
                e.target !== column.header?.headerContent
            ) || column.viewport.columnsResizer?.isResizing
        ) {
            return;
        }

        if (column.options.sorting?.sortable) {
            column.sorting?.toggle();
        }

        fireEvent(this, 'click', {
            originalEvent: e,
            column: this.column
        });
    }

    /**
     * Add sorting option to the column.
     */
    private initColumnSorting(): void {
        const { column } = this;
        if (!column) {
            return;
        }

        column.sorting = new ColumnSorting(
            column,
            this.htmlElement
        );
    }

    /**
     * Check if the cell is part of the last cell in the header.
     */
    public isLastColumn(): boolean {
        const vp = this.row.viewport;

        const lastViewportColumn = vp.columns[vp.columns.length - 1];
        const lastCellColumn = this.columns?.[this.columns.length - 1];

        return lastViewportColumn === lastCellColumn;
    }

    /**
     * Sets up header icons using the IconManager.
     */
    private setupHeaderIcons(): void {
        if (!this.iconManager) {
            return;
        }

        const { column } = this;
        const iconOptions = column?.options.header?.icons;

        // Register sort icon if column is sortable and enabled
        if (column?.options.sorting?.sortable && iconOptions?.sort !== false) {
            this.iconManager.registerIcon('sort', {
                icon: 'chevronSelector',
                enabled: true,
                onClick: (
                    event: MouseEvent,
                    headerCell: HeaderCell
                ): void => {
                    headerCell.column?.sorting?.toggle();
                },
                onStateChange: (
                    iconElement: HTMLElement,
                    state: any
                ): void => {
                    const iconWrapper = iconElement;
                    const button = iconWrapper.querySelector('.hcg-button');
                    if (!button) {
                        return;
                    }

                    // Remove existing icon
                    const existingIcon = button.querySelector('svg');
                    if (existingIcon) {
                        button.removeChild(existingIcon);
                    }

                    let iconName: 'chevronUp' |
                    'chevronDown' | 'chevronSelector' = 'chevronSelector';

                    if (state === 'asc') {
                        iconName = 'chevronUp';
                    } else if (state === 'desc') {
                        iconName = 'chevronDown';
                    }

                    const newIcon = GridIcons.createGridIcon(
                        iconName,
                        20
                    );
                    button.appendChild(newIcon);
                }
            });

            // Set initial sort state
            this.updateSortIconState();
        }

        // Register filter icon (enabled by default unless explicitly disabled)
        this.iconManager.registerIcon('filter', {
            icon: 'filter',
            enabled: iconOptions?.filter !== false
        });

        // Register menu icon if enabled
        if (iconOptions?.menu === true) {
            this.iconManager.registerIcon('menu', {
                icon: 'menu',
                enabled: true,
                onClick: (): void => {
                    // Menu click handler - can be expanded later
                }
            });
        }

        // Render all icons
        this.iconManager.renderIcons();

        // Add hover and focus event handlers to show/hide icons
        this.htmlElement.addEventListener('mouseenter', (): void => {
            this.showIcons();
        });

        this.htmlElement.addEventListener('mouseleave', (): void => {
            this.hideIcons();
        });

        // Show icons when header cell is focused
        this.htmlElement.addEventListener(
            'focusin',
            (): void => {
                this.showIcons();
            }
        );

        this.htmlElement.addEventListener(
            'focusout',
            (event: FocusEvent): void => {
                // Only hide icons if focus is leaving the entire
                // header cell area
                if (!this.htmlElement.contains(
                    event.relatedTarget as Node
                )) {
                    this.hideIcons();
                }
            }
        );
    }

    /**
     * Updates the sort icon state based on current sorting.
     */
    public updateSortIconState(): void {
        if (!this.iconManager || !this.column) {
            return;
        }

        const { currentSorting } = this.column.viewport.grid.querying.sorting;
        let sortState = 'none';
        let isActive = false;

        if (currentSorting?.columnId === this.column.id) {
            sortState = currentSorting.order || 'none';
            isActive = sortState !== 'none';
        }

        // Update both state and active status
        this.iconManager.updateIconState('sort', sortState);
        this.iconManager.setIconActive('sort', isActive);
    }

    /**
     * Updates the filter icon active state.
     * Call this when a filter is applied or removed for this column.
     *
     * @param isActive
     * Whether a filter is currently applied to this column.
     */
    public setFilterActive(isActive: boolean): void {
        if (!this.iconManager) {
            return;
        }

        this.iconManager.setIconActive('filter', isActive);
    }

    /**
     * Shows icons and enables keyboard navigation.
     */
    private showIcons(): void {
        if (!this.iconManager) {
            return;
        }

        this.iconManager.setIconsVisible(true);
        this.iconManager.setKeyboardNavigationEnabled(true);
    }

    /**
     * Hides icons and disables keyboard navigation.
     */
    private hideIcons(): void {
        if (!this.iconManager) {
            return;
        }

        this.iconManager.setIconsVisible(false);
        this.iconManager.setKeyboardNavigationEnabled(false);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace HeaderCell {

}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderCell;
