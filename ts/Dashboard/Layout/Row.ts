import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type DataJSON from '../../Data/DataJSON';
import Layout from './Layout.js';
import Column from './Column.js';
import GUIElement from './GUIElement.js';
import Dashboard from '../Dashboard.js';
import U from '../../Core/Utilities.js';
const {
    pick,
    merge
} = U;
class Row extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static fromJSON(
        json: Row.ClassJSON,
        layout: Layout
    ): Row|undefined {
        if (layout && layout instanceof Layout) {
            const options = json.options,
                row = new Row(
                    layout,
                    {
                        id: options.containerId,
                        parentContainerId: options.parentContainerId,
                        columnsJSON: options.columns
                    }
                );

            return row;
        }

        return void 0;
    }
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
        super();

        this.layout = layout;
        this.columns = [];
        this.options = options;

        // Get parent container
        const parentContainer =
            document.getElementById(options.parentContainerId || '') ||
            layout.container;

        if (parentContainer) {
            const layoutOptions = (layout.options || {}),
                rowClassName = layoutOptions.rowClassName || '';

            this.setElementContainer({
                render: layout.dashboard.guiEnabled,
                parentContainer: parentContainer,
                attribs: {
                    id: options.id,
                    className: rowClassName ?
                        rowClassName + ' ' + Dashboard.prefix + 'row' : Dashboard.prefix + 'row'
                },
                element: rowElement,
                elementId: options.id,
                style: merge(layoutOptions.style, options.style)
            });

            // Init rows from options.
            if (this.options.columns) {
                this.setColumns();
            }

            // Init rows from JSON.
            if (options.columnsJSON && !this.columns.length) {
                this.setColumnsFromJSON(options.columnsJSON);
            }
        } else {
            // Error
        }
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
            columnClassName = (row.layout.options || {}).columnClassName || '',
            columnsElements = pick(
                row.options.columns,
                row.container?.getElementsByClassName(columnClassName)
            ) || [];

        let columnElement,
            i, iEnd;

        for (i = 0, iEnd = columnsElements.length; i < iEnd; ++i) {
            columnElement = columnsElements[i];
            row.addColumn(
                row.layout.dashboard.guiEnabled ? columnElement : { id: '' },
                columnElement instanceof HTMLElement ? columnElement : void 0
            );
        }
    }

    public setColumnsFromJSON(
        json: Array<Column.ClassJSON>
    ): void {
        const row = this;

        let column;

        for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
            column = Column.fromJSON(json[i], row);

            if (column) {
                row.columns.push(column);
            }
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

    /**
     * Destroy the element, its container, event hooks
     * and inner columns.
     */
    public destroy(): void {
        const row = this;

        // Destroy columns.
        for (let i = 0, iEnd = row.columns.length; i < iEnd; ++i) {
            row.columns[i].destroy();
        }

        super.destroy();
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Row.ClassJSON}
     * Class JSON of this Row instance.
     */
    public toJSON(): Row.ClassJSON {
        const row = this,
            layoutContainerId = (row.layout.container || {}).id || '',
            columns = [];

        // Get columns JSON.
        for (let i = 0, iEnd = row.columns.length; i < iEnd; ++i) {
            columns.push(row.columns[i].toJSON());
        }

        return {
            $class: 'Row',
            options: {
                containerId: (row.container as HTMLElement).id,
                parentContainerId: layoutContainerId,
                columns: columns
            }
        };
    }
}

namespace Row {
    export interface Options {
        id?: string;
        parentContainerId?: string;
        columns?: Array<Column.Options>;
        style?: CSSObject;
        columnsJSON?: Array<Column.ClassJSON>;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        containerId: string;
        parentContainerId: string;
        columns: Array<Column.ClassJSON>;
    }
}

export default Row;
