import type DataJSON from '../Data/DataJSON';

import Layout from './Layout/Layout.js';
import Bindings from './Actions/Bindings.js';
import DashboardGlobals from './DashboardGlobals.js';

import U from '../Core/Utilities.js';
import H from '../Core/Globals.js';
import EditMode from './EditMode/EditMode.js';

const {
    doc
} = H;

const {
    merge,
    addEvent,
    fireEvent,
    error,
    isString,
    objectEach,
    uniqueKey,
    createElement
} = U;

class Dashboard {

    /* *
    *
    *  Static Properties
    *
    * */

    protected static readonly defaultOptions: Dashboard.Options = {
        gui: {
            enabled: true,
            layoutOptions: {
                rowClassName: void 0,
                cellClassName: void 0
            },
            layouts: []
        },
        componentOptions: {
            isResizable: true
        },
        components: [],
        respoBreakpoints: {
            small: 576,
            medium: 992,
            large: 1200
        }
    };

    public static fromJSON(json: Dashboard.ClassJSON): Dashboard {
        const options = json.options,
            dashboard = new Dashboard(
                options.containerId,
                {
                    layoutsJSON: options.layouts,
                    componentOptions: options.componentOptions,
                    respoBreakpoints: options.respoBreakpoints
                }
            );

        return dashboard;
    }

    /**
     * Import layouts from the local storage
     *
     * @return {Dashboard|undefined}
     */
    public static importLocal(): Dashboard|undefined {
        const dashboardJSON = localStorage.getItem(
            // Dashboard.prefix + this.id,
            DashboardGlobals.prefix + '1' // temporary for demo test
        );

        let dashboard;

        if (dashboardJSON) {
            dashboard = Dashboard.fromJSON(
                JSON.parse(dashboardJSON)
            );
        }

        return dashboard;
    }

    public static getCopyId(): string {
        // Remove highcharts- prefix - temporary solution.
        return uniqueKey().substring(11);
    }

    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        renderTo: (string|globalThis.HTMLElement),
        options: Dashboard.Options
    ) {
        this.options = merge(Dashboard.defaultOptions, options);
        this.layouts = [];
        this.guiEnabled = (this.options.gui || {}).enabled;
        this.mountedComponents = [];
        this.id = uniqueKey();

        this.initContainer(renderTo);

        // Init edit mode.
        if (
            EditMode && !(
                this.options.editMode &&
                !this.options.editMode.enabled
            )
        ) {
            this.editMode = new EditMode(this, this.options.editMode);
        }

        // Create layouts wrapper.
        this.layoutsWrapper = createElement(
            'div', {
                className: DashboardGlobals.classNames.layoutsWrapper
            }, {},
            this.container
        );

        // Init layouts from options.
        if (options.gui && this.options.gui) {
            this.setLayouts(this.options.gui);
        }

        // Init layouts from JSON.
        if (options.layoutsJSON && !this.layouts.length) {
            this.setLayoutsFromJSON(options.layoutsJSON);
        }

        // Init components from options.
        if (options.components) {
            this.setComponents(options.components);
        }

        // Init events.
        this.initEvents();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Dashboard.Options;
    public layouts: Array<Layout>;
    public mountedComponents: Array<Bindings.MountedComponentsOptions>;
    public container: globalThis.HTMLElement = void 0 as any;
    public guiEnabled: (boolean|undefined);
    public id: string;
    public editMode?: EditMode;
    public layoutsWrapper: globalThis.HTMLElement;
    /* *
     *
     *  Functions
     *
     * */

    private initEvents(): void {
        const dashboard = this;

        addEvent(window, 'resize', function (): void {
            dashboard.reflow();
        });
    }

    /**
     * initContainer
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     * The DOM element to render to, or its id.
     *
     */
    public initContainer(
        renderTo: (string|globalThis.HTMLElement)
    ): void {
        const dashboard = this;

        if (isString(renderTo)) {
            dashboard.container = renderTo =
                doc.getElementById(renderTo as any) as any;
        }

        // Display an error if the renderTo is wrong
        if (!renderTo) {
            error(13, true);
        }
    }

    public setLayouts(guiOptions: Dashboard.GUIOptions): void {
        const dashboard = this,
            layoutsOptions = guiOptions.layouts;

        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            dashboard.layouts.push(
                new Layout(
                    dashboard,
                    merge({}, guiOptions.layoutOptions, layoutsOptions[i])
                )
            );
        }
    }

    public setLayoutsFromJSON(json: Array<Layout.ClassJSON>): void {
        const dashboard = this;

        let layout;

        for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
            layout = Layout.fromJSON(json[i], dashboard);

            if (layout) {
                dashboard.layouts.push(layout);
            }
        }
    }

    public addLayoutFromJSON(json: Layout.ClassJSON): Layout|undefined {
        return Layout.fromJSON(json, this);
    }

    public setComponents(
        components: Array<Bindings.ComponentOptions>
    ): void {
        const dashboard = this;

        let component,
            cell;

        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            component = Bindings.addComponent(components[i]);
            cell = Bindings.getCell(components[i].cell);

            if (cell && component) {
                component.setCell(cell); // should probably be done by Bindings
                cell.mountedComponent = component; // @ToDo cell.addComponent() perhaps? - checks if cell is free

                dashboard.mountedComponents.push({
                    options: components[i],
                    component: component,
                    cell: cell
                });
            } else {
                // Error
            }
        }
    }

    /**
     * Destroy the element and its layouts.
     */
    public destroy(): undefined {
        const dashboard = this;

        // Destroy layouts.
        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            dashboard.layouts[i].destroy();
        }

        // @ToDo Destroy bindings.

        // Delete all properties.
        objectEach(dashboard, function (val: unknown, key: string): void {
            delete (dashboard as Record<string, any>)[key];
        });

        return;
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Dashboard.ClassJSON}
     * Class JSON of this Dashboard instance.
     */
    public toJSON(): Dashboard.ClassJSON {
        const dashboard = this,
            layouts = [];

        // Get layouts JSON.
        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            layouts.push(dashboard.layouts[i].toJSON());
        }

        return {
            $class: 'Dashboard',
            options: {
                containerId: dashboard.container.id,
                guiEnabled: dashboard.guiEnabled,
                layouts: layouts,
                componentOptions: dashboard.options.componentOptions,
                respoBreakpoints: dashboard.options.respoBreakpoints
            }
        };
    }

    /**
     * Export layouts from the local storage
     */
    public exportLocal(): void {
        localStorage.setItem(
            // Dashboard.prefix + this.id,
            DashboardGlobals.prefix + '1', // temporary for demo test
            JSON.stringify(this.toJSON())
        );
    }

    public importLayoutLocal(id: string): Layout|undefined {
        return Layout.importLocal(id, this);
    }

    public getLayoutContainerSize(): string {
        const dashboard = this,
            respoOptions = dashboard.options.respoBreakpoints,
            cntWidth = (dashboard.layoutsWrapper || {}).clientWidth;

        let size = DashboardGlobals.respoBreakpoints.large;

        if (respoOptions) {
            if (cntWidth <= respoOptions.small) {
                size = DashboardGlobals.respoBreakpoints.small;
            } else if (cntWidth > respoOptions.small && cntWidth <= respoOptions.medium) {
                size = DashboardGlobals.respoBreakpoints.medium;
            }
        }

        return size;
    }

    public reflow(): void {
        const dashboard = this,
            cntSize = dashboard.getLayoutContainerSize();

        let layout, row, cell;

        if (dashboard.editMode) {
            dashboard.editMode.hideToolbars(['cell', 'row']);
            dashboard.editMode.hideContextPointer();
        }

        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            layout = dashboard.layouts[i];

            for (let j = 0, jEnd = layout.rows.length; j < jEnd; ++j) {
                row = layout.rows[j];

                for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
                    cell = row.cells[k];
                    cell.reflow(cntSize);
                }
            }
        }
    }
}

namespace Dashboard {
    export interface Options {
        gui?: GUIOptions;
        editMode?: EditMode.Options;
        components?: Array<Bindings.ComponentOptions>;
        componentOptions?: Partial<Bindings.ComponentOptions>;
        layoutsJSON?: Array<Layout.ClassJSON>;
        respoBreakpoints?: RespoBreakpoints;
    }

    export interface RespoBreakpoints extends DataJSON.JSONObject {
        small: number;
        medium: number;
        large: number;
    }

    export interface GUIOptions {
        enabled: boolean;
        layoutOptions: Partial<Layout.Options>;
        layouts: Array<Layout.Options>;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: DashboardJSONOptions;
    }

    export interface DashboardJSONOptions extends DataJSON.JSONObject {
        containerId: string;
        layouts: Array<Layout.ClassJSON>;
        guiEnabled?: boolean;
        componentOptions?: Partial<Bindings.ComponentOptions>;
        respoBreakpoints?: RespoBreakpoints;
    }
}

export default Dashboard;
