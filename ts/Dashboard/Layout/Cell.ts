import type { CSSJSONObject } from './../../Data/DataCSSObject';
import type DataJSON from '../../Data/DataJSON';
import type Component from './../Component/Component.js';
import DashboardGlobals from './../DashboardGlobals.js';
import Row from './Row.js';
import GUIElement from './GUIElement.js';
import Bindings from '../Actions/Bindings.js';
import U from '../../Core/Utilities.js';
import Layout from './Layout.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';

const {
    merge,
    isNumber
} = U;
class Cell extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static fromJSON(
        json: Cell.ClassJSON,
        row: Row
    ): Cell|undefined {
        if (row instanceof Row) {
            const options = json.options;

            let id = options.containerId;

            if (row.layout.copyId) {
                id = id + '_' + row.layout.copyId;
            }

            return new Cell(
                row,
                {
                    id: id,
                    parentContainerId: row.container?.id ||
                        options.parentContainerId,
                    mountedComponentJSON: options.mountedComponentJSON,
                    style: options.style
                }
            );
        }

        return void 0;
    }

    public static setSize(
        dimensions: { width?: number | string; height?: number | string },
        cellContainer: HTMLDOMElement
    ): void {
        const width = dimensions.width;
        const height = dimensions.width;

        if (width) {
            cellContainer.style.width = isNumber(width) ?
                dimensions.width + 'px' : width;

            cellContainer.style.flex = 'none';
        }

        if (height) {
            cellContainer.style.height = isNumber(height) ?
                dimensions.height + 'px' : height;
        }
    }

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs an instance of the Cell class.
     *
     * @param {Row} row
     * Reference to the row instance.
     *
     * @param {Cell.Options} options
     * Options for the cell.
     *
     * @param {HTMLElement} cellElement
     * The container of the cell HTML element.
     */
    public constructor(
        row: Row,
        options: Cell.Options,
        cellElement?: HTMLElement
    ) {
        super();

        this.id = options.id;
        this.options = options;
        this.row = row;

        // Get parent container
        const parentContainer =
            document.getElementById(options.parentContainerId || '') ||
            row.container;

        if (parentContainer) {
            const layoutOptions = row.layout.options || {},
                rowOptions = row.options || {},
                cellClassName = layoutOptions.cellClassName || '';

            this.setElementContainer({
                render: row.layout.dashboard.guiEnabled,
                parentContainer: parentContainer,
                attribs: {
                    id: options.id,
                    className: DashboardGlobals.classNames.cell + ' ' +
                        cellClassName
                },
                element: cellElement,
                elementId: options.id,
                style: merge(
                    layoutOptions.style,
                    rowOptions.style,
                    options.style
                )
            });

            // Mount component from JSON.
            if (this.options.mountedComponentJSON) {
                this.mountComponentFromJSON(
                    this.options.mountedComponentJSON,
                    this.container
                );
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
     * Cell id.
     */
    public id: string;

    /**
     * Reference to the row instance.
     */
    public row: Row;

    /**
     * The cell options.
     */
    public options: Cell.Options;

    /**
     * Component mounted in the cell.
     */
    public mountedComponent?: Component;

    /**
     * Mount component from JSON.
     *
     * @param {Component.ClassJSON} [json]
     * Component JSON.
     *
     * @param {HTMLDOMElement} cellContainer
     * Cell container
     *
     * @return {boolean}
     */
    public mountComponentFromJSON(
        json: Component.ClassJSON,
        cellContainer: HTMLDOMElement|undefined
    ): boolean {
        const cell = this;

        if (cell.id !== json.options.parentElement) {
            json.options.parentElement = cell.id;
        }

        const component = Bindings.componentFromJSON(json, cellContainer);

        if (component) {
            cell.mountedComponent = component;
            return true;
        }

        return false;
    }

    /**
     * Destroy the element, its container, event hooks
     * and mounted component.
     */
    public destroy(): void {
        const cell = this;

        // Destroy mounted component.
        if (cell.mountedComponent) {
            cell.mountedComponent.destroy();
        }

        super.destroy();
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Cell.ClassJSON}
     * Class JSON of this Cell instance.
     */
    public toJSON(): Cell.ClassJSON {
        const cell = this,
            rowContainerId = (cell.row.container || {}).id || '';

        return {
            $class: 'Cell',
            options: {
                containerId: (cell.container as HTMLElement).id,
                parentContainerId: rowContainerId,
                mountedComponentJSON: cell.mountedComponent?.toJSON(),
                style: cell.options.style
            }
        };
    }
}

interface Cell {
    layout: Layout;
}

namespace Cell {
    export interface Options {
        id: string;
        width?: number;
        style?: CSSJSONObject;
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
        style?: CSSJSONObject;
    }
}

export default Cell;
