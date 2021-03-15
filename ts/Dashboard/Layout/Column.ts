import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type DataJSON from '../../Data/DataJSON';
import type Row from './Row.js';
import type Component from './../Component/Component.js';
import GUIElement from './GUIElement.js';
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
        row: Row|null,
        options: Column.Options,
        columnElement?: HTMLElement
    ) {
        super();

        this.id = options.id;
        this.options = options;
        this.row = row;

        const column = this;

        // Get parent container
        const parentContainer = row?.container ||
            document.getElementById(options.parentContainerId || '');

        if (parentContainer) {
            const layoutOptions = ((row || {}).layout || {}).options || {},
                rowOptions = (row || {}).options || {},
                columnClassName = layoutOptions.columnClassName || '';

            this.setElementContainer({
                render: (((row || {}).layout || {}).dashboard || {}).guiEnabled,
                parentContainer: parentContainer,
                attribs: {
                    id: options.id,
                    className: columnClassName ?
                        columnClassName + ' ' + GUIElement.prefix + 'column' : GUIElement.prefix + 'column'
                },
                element: columnElement,
                elementId: options.id,
                style: merge(
                    layoutOptions.style,
                    rowOptions.style,
                    options.style
                )
            });
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
    public row?: Row|null;

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
            $class: 'Row',
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
        parentContainerId?: string;
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
