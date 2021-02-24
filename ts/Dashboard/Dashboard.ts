import Layout from './Layout/Layout.js';
import Bindings from './Actions/Bindings.js';
import GUIRenderer from './Layout/GUIRenderer.js';

import U from '../Core/Utilities.js';
import H from '../Core/Globals.js';

const {
    doc
} = H;

const {
    merge,
    error,
    isString
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
            layoutOptions: {},
            layouts: []
        },
        components: []
    };

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
        this.guiEnabled = this.options.gui.enabled;
        this.components = [];

        /*
        * TODO
        *
        * 2. Bindings elements
        *
        */

        this.initContainer(renderTo);

        // Only for generating GUI for now
        // @TODO - add rederer when edit mode enabled
        if (this.guiEnabled) {
            this.renderer = new GUIRenderer({});
        }

        // Init layouts
        this.setLayouts();

        // Init Bindings
        this.bindings = new Bindings();
        this.setComponents();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Dashboard.Options;
    public layouts: Array<Layout>;
    public components: Array<Bindings.ComponentOptions>;
    public container: globalThis.HTMLElement = void 0 as any;
    public renderer?: GUIRenderer;
    public guiEnabled: (boolean|undefined);
    public bindings: Bindings;
    /* *
     *
     *  Functions
     *
     * */

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
    /**
     * setLayouts
     */
    public setLayouts(): void {
        const dashboard = this,
            options = dashboard.options,
            layoutsOptions = options.gui.layouts;

        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            dashboard.layouts.push(
                new Layout(
                    dashboard,
                    merge({}, options.gui.layoutOptions, layoutsOptions[i])
                )
            );
        }
    }

    public setComponents(): void {
        const dashboard = this,
            components = dashboard.options.components;

        let component,
        compontentCard;

        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            component = this.bindings.addComponent(
                components[i]
            );

            dashboard.components.push({
                options: components[i],
                component: component
            });
        }
    }
}

namespace Dashboard {
    export interface Options {
        gui: GUIOptions;
        components: Array<Bindings.ComponentType>;
    }

    export interface GUIOptions {
        enabled: boolean;
        layoutOptions: Partial<Layout.Options>;
        layouts: Array<Layout.Options>;
    }
}

export default Dashboard;
