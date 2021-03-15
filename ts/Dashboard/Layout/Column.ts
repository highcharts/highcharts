import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type DataJSON from '../../Data/DataJSON';
import type Row from './Row.js';
import type Component from './../Component/Component.js';
import GUIElement from './GUIElement.js';
import Bindings from '../Actions/Bindings.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;
class Column extends GUIElement {
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

        const columnClassName = row.layout.options.columnClassName;

        this.id = options.id;
        this.options = options;

        const column = this;

        this.row = row;
        this.setElementContainer({
            render: row.layout.dashboard.guiEnabled,
            parentContainer: row.container,
            attribs: {
                id: options.id,
                className: columnClassName ?
                    columnClassName + ' ' + GUIElement.prefix + 'column' : GUIElement.prefix + 'column'
            },
            element: columnElement,
            elementId: options.id,
            style: merge(
                row.layout.options.style,
                row.options.style,
                options.style
            )
        });

        // bind component
        if (
            this.mountedComponent || 
            this.id === 'dashboard-col-add-component' // only for temporary test
        ) {
            // temporary component options
            const jsonFromLocalStorage = {
                $class: 'Chart',
                options: {
                    chartOptions: '{"title": {"text": "from JSON"}, "series":[{"name":"Series from options","data":[1,2,3,4]}],"type":"pie","chart":{"animation":false, "type": "pie"}}',
                    dimensions: {
                        width: 0,
                        height: 0
                    },
                    id: "dashboard-component-highcharts-wq32s1w-1",
                    parentElement: "dashboard-col-add-component",
                    type: "chart"
                }
            };

            // bind component
            Bindings.componentFromJSON(jsonFromLocalStorage);
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
        const column = this;

        return {
            $class: 'Column',
            options: {
                containerId: (column.container as HTMLElement).id,
                mountedComponentJSON: column.mountedComponent?.toJSON()
            }
        };
    }
}

namespace Column {
    export interface Options {
        id: string;
        width?: number;
        style?: CSSObject;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        containerId: string;
        mountedComponentJSON: Component.ClassJSON|undefined;
    }
}

export default Column;
