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

    /*
    * The start position of dragging.
    * @internal
    */
    private dragStartX?: number;
    /*
    * The column when dragging.
    * @internal
    */
    private draggedColumn?: DataGridColumn;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new table head.
     *
     * @param container The container of the table head.
     * @param columns The columns of the table.
     */
    constructor(container: HTMLElement, columns: DataGridColumn[]) {
        this.container = container;
        this.columns = columns;
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

            this.columns[i].headElement = element;
            this.draggedResizeHandle = this.renderColumnDragHandles(
                this.columns[i],
                element
            );
        }

        document.addEventListener('mousemove', (): void => {
            /* TODO(DD)
            if (this.draggedResizeHandle && this.draggedColumn) {
                const diff = e.pageX - (this.dragStartX || 0);
                const column = this.draggedColumn;
                const initWidth = (column?.getWidth() || 0);
                const columnsDOM = column.viewport.container.querySelectorAll(
                    'th:nth-child(' + (column.index + 1) + '),' +
                    'td:nth-child(' + (column.index + 1) + ')'
                );

                if (column?.headElement) {
                    columnsDOM.forEach((el): void => {
                        const element = (el as HTMLElement);
                        element.style.width = element.style.maxWidth =
                            (initWidth + diff) + 'px';
                    });
                }
            }
            */
        });

        document.addEventListener('mouseup', (): void => {
            if (this.draggedResizeHandle) {
                this.draggedColumn = void 0;
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
