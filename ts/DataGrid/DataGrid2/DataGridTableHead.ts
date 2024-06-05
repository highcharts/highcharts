/* *
 *
 *  Data Grid class
 *
 *  (c) 2020-2024 Highsoft AS
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

import Utils from './Utils.js';
import DataGridColumn from './DataGridColumn.js';
import DataGridTable from './DataGridTable.js';

const { makeHTMLElement } = Utils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table header row containing the column names.
 */
class DataGridTableHead {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The visible columns of the table.
     */
    public columns: DataGridColumn[] = [];

    /**
     * The container of the table head.
     */
    public container: HTMLElement;

    /**
     * The element when dragging.
     * @internal
     */
    public draggedResizeHandle?: HTMLElement;

    /**
     * The start position of dragging.
     * @internal
     */
    private dragStartX?: number;

    /**
     * The column when dragging.
     * @internal
     */
    private draggedColumn?: DataGridColumn;

    /**
     * The viewport (table) the table head belongs to.
     */
    public viewport: DataGridTable;

    private initColumnWidths?: [number, number];


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new table head.
     *
     * @param viewport
     * The viewport (table) the table head belongs to.
     */
    constructor(viewport: DataGridTable) {
        this.viewport = viewport;
        this.columns = viewport.columns;
        this.container = makeHTMLElement('tr', {}, viewport.theadElement);
        this.container.setAttribute('aria-rowindex', 1);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the table head.
     */
    public render(): void {

        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            const element = makeHTMLElement('th', {
                innerText: this.columns[i].id
            }, this.container);

            element.setAttribute('scope', 'col');

            this.columns[i].headElement = element;
            this.draggedResizeHandle = this.renderColumnDragHandles(
                this.columns[i],
                element
            );
        }

        document.addEventListener('mousemove', (e: MouseEvent): void => {
            if (!this.draggedResizeHandle || !this.draggedColumn) {
                return;
            }

            const diff = e.pageX - (this.dragStartX || 0);
            const column = this.draggedColumn;
            const nextColumn = this.columns[column.index + 1];

            if (!nextColumn) {
                return;
            }

            if (this.initColumnWidths === void 0) {
                this.initColumnWidths = [
                    column.getWidth(),
                    nextColumn.getWidth()
                ];
            }

            column.widthRatio = this.viewport.getRatioFromWidth(
                this.initColumnWidths[0] + diff
            );

            nextColumn.widthRatio = this.viewport.getRatioFromWidth(
                this.initColumnWidths[1] - diff
            );

            this.viewport.reflow();
        });

        document.addEventListener('mouseup', (): void => {
            if (this.draggedResizeHandle) {
                this.draggedColumn = void 0;
                this.initColumnWidths = void 0;
            }
        });
    }

    /**
     * Reflows the table head's content dimensions.
     */
    public reflow(): void {
        let width = 0;

        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            const column = this.columns[i];
            if (!column.headElement) {
                continue;
            }

            const columnWidth = column.getWidth();
            column.headElement.style.width = columnWidth + 'px';
            width += columnWidth;
        }

        this.container.style.paddingRight =
            this.container.offsetWidth - width + 'px';
    }

    /**
     * Render the drag handle for resizing columns.
     * @internal
     */
    private renderColumnDragHandles(
        column: DataGridColumn, headElement: HTMLElement
    ): HTMLElement {
        const handle = makeHTMLElement('div', {
            className: 'highcharts-dg-col-resizer'
        }, headElement);

        handle.addEventListener(
            'mousedown',
            (e: MouseEvent): void => {
                this.dragStartX = e.pageX;
                this.draggedColumn = column;
            }
        );

        return handle;
    }


    /* *
    *
    *  Static Methods
    *
    * */

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridTableHead {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridTableHead;
