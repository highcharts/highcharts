/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

/* eslint-disable */
import type CSSJSONObject from '../CSSJSONObject';
import type Dashboard from '../Dashboard.js';
import type JSON from '../../Core/JSON';
import type Serializable from '../Serializable';

import DU from '../Utilities.js';
const { uniqueKey } = DU;
import U from '../../Core/Utilities.js';
const {
    pick,
    defined
} = U;

import Cell from './Cell.js';
import Row from './Row.js';
import GUIElement from './GUIElement.js';
import Globals from '../Globals.js';

class Layout extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static fromJSON(
        json: Layout.JSON,
        dashboard: Dashboard
    ): Layout|undefined {
        const options = json.options,
            // Check if layout container exists.
            container = document.getElementById(json.options.containerId),
            layout = new Layout(
                dashboard,
                {
                    id: options.containerId,
                    copyId: container ? uniqueKey() : '',
                    parentContainerId: dashboard.container.id ||
                        options.parentContainerId,
                    rowsJSON: options.rows,
                    style: options.style
                }
            );

        // Save layout in the dashboard.
        if (layout) {
            dashboard.layouts.push(layout);
        }

        return layout;
    }

    public static importLocal(
        id: string,
        dashboard: Dashboard
    ): Layout|undefined {
        const layoutOptions = localStorage.getItem(
            Globals.classNamePrefix + id
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
        options: Layout.Options,
        parentCell?: Cell
    ) {
        super();

        this.type = Globals.guiElementType.layout;
        this.dashboard = dashboard;
        this.rows = [];
        this.options = options;
        this.isVisible = true;

        // Get parent container
        const parentContainer = document.getElementById(
            options.parentContainerId || ''
        ) || dashboard.layoutsWrapper;

        // Set layout level.
        if (parentCell) {
            this.parentCell = parentCell;
            this.level = parentCell.row.layout.level + 1;
        } else {
            this.level = 0;
        }

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
                    className: Globals.classNames.layout + ' ' +
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

    public copyId?: string;

    public level: number;

    public parentCell?: Cell;

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
        json: Array<Row.JSON>
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
        rowElement?: HTMLElement,
        index?: number
    ): Row {
        const layout = this,
            row = new Row(layout, options, rowElement);

        if (!defined(index)) {
            layout.rows.push(row);
        } else {
            layout.mountRow(row, index);
        }

        // Set editMode events.
        if (layout.dashboard.editMode) {
            layout.dashboard.editMode.setRowEvents(row);
        }

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

        if (layout.parentCell) {
            layout.parentCell.destroy();
        }

        super.destroy();
    }

    /**
     * Export layout's options and save in the local storage
     */
    public exportLocal(): void {
        localStorage.setItem(
            Globals.classNamePrefix + this.options.id,
            JSON.stringify(this.toJSON())
        );
    }

    // Get row index from the layout.rows array.
    public getRowIndex(
        row: Row
    ): number | undefined {
        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            if (this.rows[i] === row) {
                return i;
            }
        }
    }

    // Add cell to the layout.rows array and move row container.
    public mountRow(
        row: Row,
        index: number
    ): void {
        const nextRow = this.rows[index],
            prevRow = this.rows[index - 1];

        if (row.container) {
            if (nextRow && nextRow.container) {
                nextRow.container.parentNode.insertBefore(row.container, nextRow.container);
            } else if (prevRow && prevRow.container) {
                prevRow.container.parentNode.insertBefore(row.container, prevRow.container.nextSibling);
            }

            this.rows.splice(index, 0, row);
            row.layout = this;
        }
    }

    // Remove row from the layout.rows array.
    public unmountRow(
        row: Row
    ): void {
        const rowIndex = this.getRowIndex(row);

        if (defined(rowIndex)) {
            this.rows.splice(rowIndex, 1);
        }
    }

    public getVisibleRows(): Array<Row> {
        const rows = [];

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            if (this.rows[i].isVisible) {
                rows.push(this.rows[i]);
            }
        }

        return rows;
    }

    protected changeVisibility(
        setVisible: boolean = true
    ): void {
        const layout = this;

        super.changeVisibility(setVisible);

        // Change parentCell visibility.
        if (layout.parentCell) {
            if (layout.isVisible && !layout.parentCell.isVisible) {
                layout.parentCell.show();
            } else if (!layout.isVisible && layout.parentCell.isVisible) {
                layout.parentCell.hide();
            }
        }
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Layout.JSON}
     * Class JSON of this Layout instance.
     */
    public toJSON(): Layout.JSON {
        const layout = this,
            dashboardContainerId = (layout.dashboard.container || {}).id || '',
            rows = [];

        // Get rows JSON.
        for (let i = 0, iEnd = layout.rows.length; i < iEnd; ++i) {
            rows.push(layout.rows[i].toJSON());
        }

        return {
            $class: 'Dashboard.Layout',
            options: {
                containerId: (layout.container as HTMLElement).id,
                parentContainerId: dashboardContainerId,
                rows: rows,
                style: layout.options.style
            }
        };
    }
}

interface Layout {
    options: Layout.Options;
}
namespace Layout {

    export interface JSON extends Serializable.JSON<'Dashboard.Layout'> {
        options: OptionsJSON;
    }

    export interface Options {
        id?: string;
        parentContainerId?: string;
        copyId?: string;
        layoutClassName?: string;
        rowClassName?: string;
        cellClassName?: string;
        rows?: Array<Row.Options>;
        style?: CSSJSONObject;
        rowsJSON?: Array<Row.JSON>;
    }

    export interface OptionsJSON extends JSON.Object {
        containerId: string;
        parentContainerId: string;
        rows: Array<Row.JSON>;
        style?: CSSJSONObject;
    }
}

export default Layout;
