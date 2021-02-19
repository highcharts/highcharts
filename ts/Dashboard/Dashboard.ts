import Layout from './layout/Layout.js';
import type GUI from './layout/GUI.js';

import U from '../Core/Utilities.js';

const {
    merge
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
        this.setLayouts();
    }

    /* *
    *
    *  Properties
    *
    * */
    public readonly options: Dashboard.Options;
    public layouts: Array<Layout>;
    /* *
     *
     *  Functions
     *
     * */
    public setLayouts(): void {
        const gui = this.options.gui;
        const layoutsOptions = gui.layouts;
        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            this.layouts.push(
                new Layout(
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
