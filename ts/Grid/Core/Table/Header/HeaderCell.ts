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
     */
    public override render(): void {
        const { column } = this;
        const options = merge(column?.options || {}, this.options);
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

        // Render content of th element
        this.row.htmlElement.appendChild(this.htmlElement);

        // Create flex container for header content and icons
        const headerCellContainer = makeHTMLElement('div', {
            className: Globals.getClassName('headerCell')
        }, this.htmlElement);

        this.headerContent = makeHTMLElement('span', {
            className: Globals.getClassName('headerCellContent')
        }, headerCellContainer);

        // Render the header cell element content.
        setHTMLContent(this.headerContent, this.value);

        // Initialize icon manager
        this.iconManager = new HeaderIconManager(this);
        this.setupHeaderIcons();
        headerCellContainer.appendChild(this.iconManager.getContainer());
        this.htmlElement.setAttribute('scope', 'col');

        if (this.options.className) {
            this.htmlElement.classList.add(
                ...this.options.className.split(/\s+/g)
            );
        }

        if (column) {
            this.htmlElement.setAttribute('data-column-id', column.id);

            if (isSortableData) {
                column.viewport.grid.accessibility?.addSortableColumnHint(
                    this.headerContent
                );
            }

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

            // Add sorting
            this.initColumnSorting();
        }

        this.setCustomClassName(options.header?.className);

        fireEvent(this, 'afterRender', { column });
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
        if (!this.column || e.target !== this.htmlElement) {
            return;
        }

        if (e.key === 'Enter') {
            if (this.column.options.sorting?.sortable) {
                this.column.sorting?.toggle();
            }
            return;
        }

        super.onKeyDown(e);
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

        // Register filter icon (enabled by default unless explicitly disabled)
        this.iconManager.registerIcon('filter', {
            icon: 'filter',
            enabled: iconOptions?.filter !== false,
            onClick: (): void => {
                // Filter click handler - can be expanded later
            }
        });

        // Register sort icon if column is sortable and enabled
        if (column?.options.sorting?.sortable && iconOptions?.sort !== false) {
            this.iconManager.registerIcon('sort', {
                icon: 'chevronDown',
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
                    // Update sort icon based on current sorting state
                    const iconWrapper = iconElement;
                    iconWrapper.classList.remove(
                        'sort-asc',
                        'sort-desc',
                        'sort-none'
                    );

                    if (state === 'asc') {
                        iconWrapper.classList.add('sort-asc');
                    } else if (state === 'desc') {
                        iconWrapper.classList.add('sort-desc');
                    } else {
                        iconWrapper.classList.add('sort-none');
                    }
                }
            });

            // Set initial sort state
            this.updateSortIconState();
        }

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

        // Add hover event handlers to show/hide icons
        this.htmlElement.addEventListener('mouseenter', (): void => {
            this.iconManager?.setIconsVisible(true);
        });

        this.htmlElement.addEventListener('mouseleave', (): void => {
            this.iconManager?.setIconsVisible(false);
        });
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
