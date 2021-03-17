import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type DataJSON from '../../Data/DataJSON';
import type Component from './../Component/Component.js';
import Row from './Row.js';
import GUIElement from './GUIElement.js';
import Bindings from '../Actions/Bindings.js';
import U from '../../Core/Utilities.js';
import Dashboard from '../Dashboard.js';
import Layout from './Layout.js';
import Resizer from '../Actions/Resizer';
const {
    merge
} = U;
class Column extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static fromJSON(
        json: Column.ClassJSON,
        row: Row
    ): Column|undefined {
        if (row && row instanceof Row) {
            const options = json.options,
                column = new Column(
                    row,
                    {
                        id: options.containerId,
                        parentContainerId: options.parentContainerId,
                        mountedComponentJSON: options.mountedComponentJSON
                    }
                );

            return column;
        }

        return void 0;
    }

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs an instance of the Column class.
     *
     * @param {Row} row
     * Reference to the row instance.
     *
     * @param {Column.Options} options
     * Options for the column.
     *
     * @param {HTMLElement} columnElement
     * The container of the column HTML element.
     */
    public constructor(
        row: Row,
        options: Column.Options,
        columnElement?: HTMLElement
    ) {
        super();

        this.id = options.id;
        this.options = options;
        this.row = row;

        const column = this;

        // Get parent container
        const parentContainer =
            document.getElementById(options.parentContainerId || '') ||
            row.container;

        if (parentContainer) {
            const layoutOptions = row.layout.options || {},
                rowOptions = row.options || {},
                columnClassName = layoutOptions.columnClassName || '';

            this.setElementContainer({
                render: row.layout.dashboard.guiEnabled,
                parentContainer: parentContainer,
                attribs: {
                    id: options.id,
                    className: columnClassName ?
                        columnClassName + ' ' + Dashboard.prefix + 'column' :
                        Dashboard.prefix + 'column'
                },
                element: columnElement,
                elementId: options.id,
                style: merge(
                    layoutOptions.style,
                    rowOptions.style,
                    options.style
                )
            });

            // Mount component from JSON.
            if (this.options.mountedComponentJSON) {
                this.mountedComponent = Bindings.componentFromJSON(
                    this.options.mountedComponentJSON
                );
            }
        } else {
            // Error
        }

        // nested layout
        if (this.options.layout) {
            const dashboard = this.row.layout.dashboard;

            this.layout = new Layout(
                dashboard,
                merge(
                    {},
                    dashboard.options.gui?.layoutOptions,
                    this.options.layout,
                    {
                        parentContainerId: options.id
                    }
                )
            );
        }
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Column id.
     */
    public id: string;

    /**
     * Reference to the row instance.
     */
    public row: Row;

    /**
     * The column options.
     */
    public options: Column.Options;

    /**
     * Component mounted in the column.
     */
    public mountedComponent?: Component;

    /**
     * Destroy the element, its container, event hooks
     * and mounted component.
     */
    public destroy(): void {
        const column = this;

        // Destroy mounted component.
        if (column.mountedComponent) {
            column.mountedComponent.destroy();
        }

        super.destroy();
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Column.ClassJSON}
     * Class JSON of this Column instance.
     */
    public toJSON(): Column.ClassJSON {
        const column = this,
            rowContainerId = (column.row.container || {}).id || '';

        return {
            $class: 'Column',
            options: {
                containerId: (column.container as HTMLElement).id,
                parentContainerId: rowContainerId,
                mountedComponentJSON: column.mountedComponent?.toJSON()
            }
        };
    }
}

interface Column {
    layout: Layout;
}

namespace Column {
    export interface Options {
        id: string;
        width?: number;
        style?: CSSObject;
        parentContainerId?: string;
        mountedComponentJSON?: Component.ClassJSON;
        layout?: Layout;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        containerId: string;
        parentContainerId: string;
        mountedComponentJSON: Component.ClassJSON|undefined;
    }
}

export default Column;
