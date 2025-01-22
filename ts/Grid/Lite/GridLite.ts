/* *
 *
 *  Highcharts GridLite class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Options from '../Core/Options.js';

import Grid from '../Core/Grid.js';
import GridLiteGlobals from './GridLiteGlobals.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Creates a grid structure (table).
 */
class GridLite extends Grid {

    /* *
    *
    *  Static Methods
    *
    * */

    /**
     * Creates a new GridLite instance.
     *
     * @param renderTo
     * The render target (html element or id) of the grid.
     *
     * @param options
     * The options of the grid.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When true, the
     * function returns a promise that resolves with the dashboard instance.
     *
     * @return
     * The new grid.
     */
    public static grid(
        renderTo: string|HTMLElement,
        options: Options,
        async?: boolean
    ): GridLite;

    /**
     * Creates a new GridLite instance.
     *
     * @param renderTo
     * The render target (html element or id) of the grid.
     *
     * @param options
     * The options of the grid.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When true, the
     * function returns a promise that resolves with the dashboard instance.
     *
     * @return
     * Promise that resolves with the new grid.
     */
    public static grid(
        renderTo: string|HTMLElement,
        options: Options,
        async: true
    ): Promise<GridLite>;

    // Implementation
    public static grid(
        renderTo: string|HTMLElement,
        options: Options,
        async?: boolean
    ): (GridLite | Promise<GridLite>) {

        if (async) {
            return new Promise<GridLite>((resolve): void => {
                void new GridLite(renderTo, options, (grid): void => {
                    resolve(grid);
                });
            });
        }

        return new GridLite(renderTo, options);
    }


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a new Grid.
     *
     * @param renderTo
     * The render target (container) of the Grid.
     *
     * @param options
     * The options of the Grid.
     *
     * @param afterLoadCallback
     * The callback that is called after the Grid is loaded.
     */
    constructor(
        renderTo: string | HTMLElement,
        options: Options,
        afterLoadCallback?: Grid.AfterLoadCallback
    ) {
        super(renderTo, options, GridLiteGlobals, afterLoadCallback);
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default GridLite;
