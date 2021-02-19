import Layout from './layout/Layout.js';
import GUIRenderer from './layout/GUIRenderer.js';
// import type GUI from './layout/GUI.js';

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
            layouts: []
        }
        // components: []
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

        /*
        * TODO
        *
        * 2. Bindings elements
        *
        */

        this.initContainer(renderTo);

        // Only for generating GUI for now
        // @TODO - add rederer when edit mode enabled
        if (this.options.gui.enabled) {
            this.renderer = new GUIRenderer(
                this.container,
                this.options.gui
            );
        }

        this.setLayouts();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Dashboard.Options;
    public layouts: Array<Layout>;
    public container: globalThis.HTMLElement = void 0 as any;
    public renderer?: GUIRenderer;

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
        const options = this.options,
            layoutsOptions = options.gui.layouts;

        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            this.layouts.push(
                new Layout(
                    this.container,
                    layoutsOptions[i],
                    options.gui.enabled,
                    this.renderer
                )
            );
        }
    }
}

namespace Dashboard {
    export interface Options {
        gui: GUIOptions;
        // components: Array<>;
    }

    export interface GUIOptions {
        enabled: boolean;
        layouts: Array<Layout.Options>;
    }
}

export default Dashboard;
