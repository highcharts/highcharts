import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import Layout from './Layout.js';
import Column from './Column.js';
import U from '../../Core/Utilities.js';

const {
    error
} = U;

class Row {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        layout: Layout,
        options: Row.Options,
        rowElement?: HTMLElement
    ) {
        this.options = options;
        this.layout = layout;
        this.columns = [];

        this.setRowContainer(rowElement);
        this.setColumns();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Row.Options;
    public layout: Layout;
    public columns: Array<Column>;
    public container?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */
    public setRowContainer(rowElement?: HTMLElement): void {
        const row = this,
            layout = row.layout,
            renderer = layout.dashboard.renderer;

        // @ToDo use try catch block
        if (layout.dashboard.guiEnabled && !rowElement) {
            if (renderer && layout.container) {
                // Generate row HTML structure.
                row.container = renderer.renderRow(
                    row,
                    layout.container
                );
            } else {
                // Error
            }
        } else if (rowElement instanceof HTMLElement) { // @ToDo check if this is enough
            row.container = rowElement;
        } else {
            // Error
        }
    }
    /**
     * setColumns
     */
    public setColumns(): void {
        const row = this,
            layout = row.layout,
            columnsOptions = row.options.columns || [];

        let columnOptions,
            columnsElements,
            columnElement,
            i, iEnd;

        if (layout.dashboard.guiEnabled) {
            for (i = 0, iEnd = columnsOptions.length; i < iEnd; ++i) {
                columnOptions = columnsOptions[i];
                row.addColumn(columnOptions);
            }
        } else if (row.container) {
            columnsElements = row.container.getElementsByClassName(layout.options.columnClassName);

            for (i = 0, iEnd = columnsElements.length; i < iEnd; ++i) {
                columnElement = columnsElements[i];

                if (columnElement instanceof HTMLElement) { // @ToDo check if this is enough
                    row.addColumn({}, columnElement);
                }
            }
        }

    }

    /**
     * addColumn
     *
     * @param {Column.Options} [options]
     * Options for the row column.
     *
     * @param {HTMLElement} [columnElement]
     * HTML element of the column.
     *
     * @return {Column}
     */
    public addColumn(
        options: Column.Options,
        columnElement?: HTMLElement
    ): Column {
        const row = this,
            column = new Column(row, options, columnElement);

        row.columns.push(column);
        return column;
    }
}

namespace Row {
    export interface Options {
        id?: string;
        columns?: Array<Column.Options>;
    }
}

export default Row;
