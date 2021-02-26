import Layout from './Layout.js';
import Column from './Column.js';
import GUIElement from './GUIElement.js';
import U from '../../Core/Utilities.js';
const {
    pick
} = U;
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

        this.setElementContainer(
            layout.dashboard.guiEnabled,
            layout.container,
            rowElement
        );
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
        const row = this;

        let columnsElements,
            columnElement,
            i, iEnd;

        columnsElements = pick(
            (row.options as Row.Options).columns || [],
            row?.container?.getElementsByClassName(
                row.layout.options.columnClassName
            )
        );

        for (i = 0, iEnd = columnsElements.length; i < iEnd; ++i) {
            columnElement = columnsElements[i];
            row.addColumn(
                row.layout.dashboard.guiEnabled ? columnElement : {},
                columnElement instanceof HTMLElement ? columnElement : void 0
            );
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
