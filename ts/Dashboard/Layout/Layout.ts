import Row from './Row.js';
import Dashboard from '../Dashboard.js';
import GUIElement from './GUIElement.js';
import type DataJSON from '../../Data/DataJSON';
import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';

import U from '../../Core/Utilities.js';

const {
    pick
} = U;

class Layout extends GUIElement {
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

        // GUI structure
        this.setElementContainer({
            render: dashboard.guiEnabled,
            parentContainer: dashboard.container,
            attribs: {
                id: options.id,
                className: GUIElement.prefix + 'layout'
            },
            elementId: options.id,
            style: this.options.style
        });
        this.setRows();
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
                    layout.options.rowClassName
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
    public exportLayout(): void {
        localStorage.setItem(
            GUIElement.prefix + this.options.id,
            JSON.stringify(this.toJSON())
        );
    }

    /**
     * Import layout's options from the local storage
     */
    public importLayout(): void {
        const layoutOptions = localStorage.getItem(
            GUIElement.prefix + this.options.id
        );

        this.fromJSON(layoutOptions);
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Layout.ClassJSON}
     * Class JSON of this Layout instance.
     */
    public toJSON(): Layout.ClassJSON {
        const layout = this,
            rows = [];

        // Get rows JSON.
        for (let i = 0, iEnd = layout.rows.length; i < iEnd; ++i) {
            rows.push(layout.rows[i].toJSON());
        }

        return {
            $class: 'Layout',
            options: {
                containerId: (layout.container as HTMLElement).id,
                rows: rows
            }
        };
    }

    public fromJSON(
        options: any
    ): void {
        console.log('init layout from local storage, options:', JSON.parse(options));
    }
}

interface Layout {
    options: Layout.Options;
}
namespace Layout {
    export interface Options {
        id?: string;
        rowClassName: string;
        columnClassName: string;
        rows: Array<Row.Options>;
        style?: CSSObject;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: LayoutJSONOptions;
    }

    export interface LayoutJSONOptions extends DataJSON.JSONObject {
        containerId: string;
        rows: Array<Row.ClassJSON>;
    }
}

export default Layout;
