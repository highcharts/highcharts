import Layout from './layout/Layout.js';
import type GUI from './layout/GUI.js';

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
        * 1. Loop over layouts + init
        * 2. Bindings elements
        *
        */
        this.initContainer(renderTo);
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
    /* *
     *
     *  Functions
     *
     * */

    /**
     * initContainer
     */
    public initContainer(
        renderTo: (string|globalThis.HTMLElement)
    ): void {
        let dashboard = this;

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
        const gui = this.options.gui;
        const layoutsOptions = gui.layouts;
        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            this.layouts.push(
                new Layout(
                    this.container,
                    gui.enabled,
                    layoutsOptions[i]
                )
            );
        }
    }
}

namespace Dashboard {
    export interface Options {
        gui: GUI.Options;
        // components: Array<>;
    }
}

export default Dashboard;
