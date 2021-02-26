import Layout from './Layout.js';
import Column from './Column.js';
import GUIElement from './GUIElement.js';

class Row extends GUIElement {
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
        super(options);

        this.layout = layout;
        this.columns = [];

        this.setElementContainer(layout.dashboard.guiEnabled, layout.container, rowElement);
        this.setColumns();
    }

    /* *
    *
    *  Properties
    *
    * */
    public layout: Layout;
    public columns: Array<Column>;

    /* *
    *
    *  Functions
    *
    * */

    public setColumns(): void {
        const row = this,
            layout = row.layout,
            columnsOptions = (row.options as any).columns || [];

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
