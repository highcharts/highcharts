import Layout from './Layout.js';
import Column from './Column.js';
import { GUIElement, PREFIX } from './GUIElement.js';
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
        const rowClassName = layout.options.rowClassName;

        super();

        this.layout = layout;
        this.columns = [];
        this.options = options;

        this.setElementContainer(
            layout.dashboard.guiEnabled,
            layout.container,
            {
                id: options.id,
                className: rowClassName ?
                    rowClassName + ' ' + PREFIX + 'row' : PREFIX + 'row'
            },
            rowElement || options.id
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
    public options: Row.Options;

    /* *
    *
    *  Functions
    *
    * */

    public setColumns(): void {
        const row = this,
            columnsElements = pick(
                row.options.columns,
                row.container?.getElementsByClassName(
                    row.layout.options.columnClassName
                )
            ) || [];

        let columnElement,
            i, iEnd;

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
