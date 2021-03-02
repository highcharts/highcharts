import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import Layout from './Layout.js';
import Column from './Column.js';
import GUIElement from './GUIElement.js';
import U from '../../Core/Utilities.js';
const {
    pick,
    merge
} = U;
class Row extends GUIElement {
    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs an instance of the Row class.
     *
     * @param {Layout} layout
     * Reference to the layout instance.
     *
     * @param {Row.Options} options
     * Options for the row.
     *
     * @param {HTMLElement} rowElement
     * The container of the row HTML element.
     */
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
                    rowClassName + ' ' + GUIElement.prefix + 'row' : GUIElement.prefix + 'row'
            },
            rowElement || options.id,
            merge(layout.options.style, options.style)
        );
        this.setColumns();
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Reference to the layout instance.
     */
    public layout: Layout;

    /**
     * Array of the row columns.
     */
    public columns: Array<Column>;

    /**
     * The row options.
     */
    public options: Row.Options;

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Set the row columns using column options or columnClassName.
     */
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
     * Add a new Column instance to the row columns array.
     *
     * @param {Column.Options} [options]
     * Options for the row column.
     *
     * @param {HTMLElement} [columnElement]
     * The container for a new column HTML element.
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
        style?: CSSObject;
    }
}

export default Row;
