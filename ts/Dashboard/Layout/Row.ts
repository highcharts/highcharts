import type { CSSJSONObject } from './../../Data/DataCSSObject';
import type DataJSON from '../../Data/DataJSON';
import DashboardGlobals from './../DashboardGlobals.js';
import Layout from './Layout.js';
import Cell from './Cell.js';
import GUIElement from './GUIElement.js';
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
        if (layout instanceof Layout) {
            const options = json.options;

            let id = options.containerId || '';

            if (id && layout.copyId) {
                id = id + '_' + layout.copyId;
            }

            return new Row(
                layout,
                {
                    id: id,
                    parentContainerId: layout.container?.id ||
                        options.parentContainerId,
                    cellsJSON: options.cells,
                    style: options.style
                }
            );
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
        this.cells = [];
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
                    className: DashboardGlobals.classNames.row + ' ' +
                        rowClassName
                },
                element: rowElement,
                elementId: options.id,
                style: merge(layoutOptions.style, options.style)
            });

            // Init rows from options.
            if (this.options.cells) {
                this.setCells();
            }

            // Init rows from JSON.
            if (options.cellsJSON && !this.cells.length) {
                this.setCellsFromJSON(options.cellsJSON);
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
     * Array of the row cells.
     */
    public cells: Array<Cell>;

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
     * Set the row cells using cell options or cellClassName.
     */
    public setCells(): void {
        const row = this,
            cellClassName = (row.layout.options || {}).cellClassName || '',
            cellsElements = pick(
                row.options.cells,
                row.container?.getElementsByClassName(cellClassName)
            ) || [];

        let cellElement,
            i, iEnd;

        for (i = 0, iEnd = cellsElements.length; i < iEnd; ++i) {
            cellElement = cellsElements[i];
            row.addCell(
                row.layout.dashboard.guiEnabled ? cellElement : { id: '' },
                cellElement instanceof HTMLElement ? cellElement : void 0
            );
        }
    }

    public setCellsFromJSON(
        json: Array<Cell.ClassJSON>
    ): void {
        const row = this,
            componentsToMount = [];

        let cell,
            cellJSON;

        // Set cells.
        for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
            cellJSON = json[i];
            cell = Cell.fromJSON({
                $class: cellJSON.$class,
                options: {
                    containerId: cellJSON.options.containerId,
                    parentContainerId: cellJSON.options.parentContainerId,
                    style: cellJSON.options.style,
                    mountedComponentJSON: void 0 // Will be mounted later.
                }
            }, row);

            if (cell) {
                row.cells.push(cell);

                if (cellJSON.options.mountedComponentJSON) {
                    componentsToMount.push({
                        cell: cell,
                        mountedComponentJSON: cellJSON.options.mountedComponentJSON
                    });
                }
            }
        }

        // Mount components.
        for (let i = 0, iEnd = componentsToMount.length; i < iEnd; ++i) {
            componentsToMount[i].cell.mountComponentFromJSON(
                componentsToMount[i].mountedComponentJSON,
                (cell || {}).container
            );
        }
    }

    /**
     * Add a new Cell instance to the row cells array.
     *
     * @param {Cell.Options} [options]
     * Options for the row cell.
     *
     * @param {HTMLElement} [cellElement]
     * The container for a new cell HTML element.
     *
     * @return {Cell}
     */
    public addCell(
        options: Cell.Options,
        cellElement?: HTMLElement
    ): Cell {
        const row = this,
            cell = new Cell(row, options, cellElement);

        row.cells.push(cell);
        return cell;
    }

    /**
     * Destroy the element, its container, event hooks
     * and inner cells.
     */
    public destroy(): void {
        const row = this;

        // Destroy cells.
        for (let i = 0, iEnd = row.cells.length; i < iEnd; ++i) {
            row.cells[i].destroy();
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
            cells = [];

        // Get cells JSON.
        for (let i = 0, iEnd = row.cells.length; i < iEnd; ++i) {
            cells.push(row.cells[i].toJSON());
        }

        return {
            $class: 'Row',
            options: {
                containerId: (row.container as HTMLElement).id,
                parentContainerId: layoutContainerId,
                cells: cells,
                style: row.options.style
            }
        };
    }
}

namespace Row {
    export interface Options {
        id?: string;
        parentContainerId?: string;
        cells?: Array<Cell.Options>;
        style?: CSSJSONObject;
        cellsJSON?: Array<Cell.ClassJSON>;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        containerId: string;
        parentContainerId: string;
        cells: Array<Cell.ClassJSON>;
        style?: CSSJSONObject;
    }
}

export default Row;
