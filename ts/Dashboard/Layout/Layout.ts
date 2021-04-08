import Row from './Row.js';
import Dashboard from '../Dashboard.js';
import GUIElement from './GUIElement.js';
import type DataJSON from '../../Data/DataJSON';
import type { CSSJSONObject } from './../../Data/DataCSSObject';
import DashboardGlobals from './../DashboardGlobals.js';

import U from '../../Core/Utilities.js';
import Resizer from '../Actions/Resizer.js';

const {
    pick
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
        if (dashboard instanceof Dashboard) {
            const options = json.options,
                // Check if layout container exists.
                container = document.getElementById(json.options.containerId),
                layout = new Layout(
                    dashboard,
                    {
                        id: options.containerId,
                        copyId: container ? Dashboard.getCopyId() : '',
                        parentContainerId: dashboard.container.id ||
                            options.parentContainerId,
                        rowsJSON: options.rows,
                        resizerJSON: options.resizer,
                        style: options.style
                    }
                );

            // Save layout in the dashboard.
            if (layout) {
                dashboard.layouts.push(layout);
            }

            return layout;
        }

        // Error - dashboard not found

        return void 0;
    }

    public static importLocal(
        id: string,
        dashboard: Dashboard
    ): Layout|undefined {
        const layoutOptions = localStorage.getItem(
            DashboardGlobals.prefix + id
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
            if (options.copyId) {
                this.copyId = options.copyId;
            }

            const layoutOptions = (this.options || {}),
                layoutClassName = layoutOptions.rowClassName || '';

            this.setElementContainer({
                render: dashboard.guiEnabled,
                parentContainer: parentContainer,
                attribs: {
                    id: options.id + (options.copyId ? '_' + options.copyId : ''),
                    className: DashboardGlobals.classNames.layout + ' ' +
                        layoutClassName
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

    public copyId?: string;

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
            DashboardGlobals.prefix + this.options.id,
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
                rows: rows,
                resizer: layout.resizer?.toJSON(),
                style: layout.options.style
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
        copyId?: string;
        layoutClassName?: string;
        rowClassName?: string;
        cellClassName?: string;
        rows?: Array<Row.Options>;
        style?: CSSJSONObject;
        rowsJSON?: Array<Row.ClassJSON>;
        resize?: Resizer.Options;
        resizerJSON?: Resizer.ClassJSON;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: LayoutJSONOptions;
    }

    export interface LayoutJSONOptions extends DataJSON.JSONObject {
        containerId: string;
        parentContainerId: string;
        rows: Array<Row.ClassJSON>;
        resizer?: Resizer.ClassJSON;
        style?: CSSJSONObject;
    }
}

export default Layout;
