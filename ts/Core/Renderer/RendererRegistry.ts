/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SVGRenderer from './SVG/SVGRenderer';

import H from '../Globals.js';

/* *
 *
 *  Namespace
 *
 * */

namespace RendererRegistry {

    /* *
     *
     *  Constants
     *
     * */

    export const rendererTypes: Record<string, typeof SVGRenderer> = {};

    /* *
     *
     *  Variables
     *
     * */

    let defaultRenderer: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Gets a registered renderer class. If no renderer type is provided or the
     * requested renderer was not founded, the default renderer is returned.
     *
     * @param {string} [rendererType]
     * Renderer type or the default renderer.
     *
     * @return {Highcharts.Class<Highcharts.SVGRenderer>}
     * Returns the requested renderer class or the default renderer class.
     */
    export function getRendererType(
        rendererType: string = defaultRenderer
    ): typeof SVGRenderer {
        return (rendererTypes[rendererType] || rendererTypes[defaultRenderer]);
    }

    /**
     * Register a renderer class.
     *
     * @param {string} rendererType
     * Renderer type to register.
     *
     * @param {Highcharts.Class<Highcharts.SVGRenderer>} rendererClass
     * Returns the requested renderer class or the default renderer class.
     *
     * @param {boolean} setAsDefault
     * Sets the renderer class as the default renderer.
     */
    export function registerRendererType(
        rendererType: string,
        rendererClass: typeof SVGRenderer,
        setAsDefault?: boolean
    ): void {
        rendererTypes[rendererType] = rendererClass;

        if (!defaultRenderer || setAsDefault) {
            defaultRenderer = rendererType;
            (H as AnyRecord).Renderer = rendererClass; // compatibility
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default RendererRegistry;
