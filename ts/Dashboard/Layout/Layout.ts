import Row from './Row.js';
import Dashboard from '../Dashboard.js';
import GUIElement from './GUIElement.js';
import type DataJSON from '../../Data/DataJSON';
import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';

import U from '../../Core/Utilities.js';
import Resizer from '../Actions/Resizer.js';

const {
    pick,
    error,
    fireEvent
} = U;

class Layout extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static fromJSON(
        json: Layout.ClassJSON,
        dashboard: Dashboard
    ): Layout|undefined {
        // Check if layout exists.
        const container = document.getElementById(json.options.containerId);

        let existingLayout;

        if (container) {
            fireEvent(container, 'bindedGUIElement', {}, function (
                e: GUIElement.BindedGUIElementEvent
            ): void {
                existingLayout = e.guiElement;
            });
        }

        if (
            dashboard &&
            dashboard instanceof Dashboard &&
            !existingLayout
        ) {
            const options = json.options,
                layout = new Layout(
                    dashboard,
                    {
                        id: options.containerId,
                        parentContainerId: options.parentContainerId,
                        rowsJSON: options.rows
                    }
                );

            // Save layout in the dashboard.
            if (layout) {
                dashboard.layouts.push(layout);
            }

            return layout;
        }

        // Error

        return void 0;
    }

    public static importLocal(
        id: string,
        dashboard: Dashboard
    ): Layout|undefined {
        const layoutOptions = localStorage.getItem(
            Dashboard.prefix + id
        );

        let layout;

        if (layoutOptions) {
            layout = Layout.fromJSON(JSON.parse(layoutOptions), dashboard);
        }

        return layout;
    }

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs an instance of the Layout class.
     *
     * @param {Dashboard} dashboard
     * Reference to the dashboard instance.
     *
     * @param {Layout.Options} options
     * Options for the layout.
     */
    public constructor(
        dashboard: Dashboard,
        options: Layout.Options
    ) {
        super();

        this.dashboard = dashboard;
        this.rows = [];
        this.options = options;

        // Get parent container
        const parentContainer = document.getElementById(
            options.parentContainerId || ''
        ) || dashboard.container;

        // GUI structure
        if (parentContainer) {
            this.setElementContainer({
                render: dashboard.guiEnabled,
                parentContainer: parentContainer,
                attribs: {
                    id: options.id,
                    className: Dashboard.prefix + 'layout'
                },
                elementId: options.id,
                style: this.options.style
            });

            // Init rows from options.
            if (this.options.rows) {
                this.setRows();
            }

            // Init rows from JSON.
            if (options.rowsJSON && !this.rows.length) {
                this.setRowsFromJSON(options.rowsJSON);
            }
        } else {
            // Error
        }

        if (options.resize) {
            this.resizer = new Resizer(this);
        }
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Reference to the dashboard instance.
     */
    public dashboard: Dashboard;

    /**
     * Array of the layout rows.
     */
    public rows: Array<Row>;

    /**
     * The layout options.
     */
    public options: Layout.Options;

    public resizer?: Resizer;

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Set the layout rows using rows options or rowClassName.
     */
    public setRows(): void {
        const layout = this,
            rowsElements = pick(
                layout.options.rows,
                layout.container?.getElementsByClassName(
                    layout.options.rowClassName || ''
                )
            ) || [];

        let rowElement,
            i, iEnd;

        for (i = 0, iEnd = rowsElements.length; i < iEnd; ++i) {
            rowElement = rowsElements[i];
            layout.addRow(
                layout.dashboard.guiEnabled ? rowElement : {},
                rowElement instanceof HTMLElement ? rowElement : void 0
            );
        }
    }

    public setRowsFromJSON(
        json: Array<Row.ClassJSON>
    ): void {
        const layout = this;

        let row;

        for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
            row = Row.fromJSON(json[i], layout);

            if (row) {
                layout.rows.push(row);
            }
        }
    }

    /**
     * Add a new Row instance to the layout rows array.
     *
     * @param {Row.Options} options
     * Options of a row.
     *
     * @param {HTMLElement} rowElement
     * The container for a new row HTML element.
     *
     * @return {Row}
     */
    public addRow(
        options: Row.Options,
        rowElement?: HTMLElement
    ): Row {
        const layout = this,
            row = new Row(layout, options, rowElement);

        layout.rows.push(row);
        return row;
    }

    /**
     * Destroy the element, its container, event hooks
     * and inner rows.
     */
    public destroy(): void {
        const layout = this;

        // Destroy rows.
        for (let i = 0, iEnd = layout.rows.length; i < iEnd; ++i) {
            layout.rows[i].destroy();
        }

        super.destroy();
    }

    /**
     * Export layout's options and save in the local storage
     */
    public exportLocal(): void {
        localStorage.setItem(
            Dashboard.prefix + this.options.id,
            JSON.stringify(this.toJSON())
        );
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Layout.ClassJSON}
     * Class JSON of this Layout instance.
     */
    public toJSON(): Layout.ClassJSON {
        const layout = this,
            dashboardContainerId = (layout.dashboard.container || {}).id || '',
            rows = [];

        // Get rows JSON.
        for (let i = 0, iEnd = layout.rows.length; i < iEnd; ++i) {
            rows.push(layout.rows[i].toJSON());
        }

        return {
            $class: 'Layout',
            options: {
                containerId: (layout.container as HTMLElement).id,
                parentContainerId: dashboardContainerId,
                rows: rows
            }
        };
    }
}

interface Layout {
    options: Layout.Options;
}
namespace Layout {
    export interface Options {
        id?: string;
        parentContainerId?: string;
        rowClassName?: string;
        columnClassName?: string;
        rows?: Array<Row.Options>;
        style?: CSSObject;
        rowsJSON?: Array<Row.ClassJSON>;
        resize?: Resizer.Options;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: LayoutJSONOptions;
    }

    export interface LayoutJSONOptions extends DataJSON.JSONObject {
        containerId: string;
        parentContainerId: string;
        rows: Array<Row.ClassJSON>;
    }
}

export default Layout;
