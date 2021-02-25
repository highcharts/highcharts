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
        this.setInnerElements(layout.dashboard.guiEnabled);
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
