/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import H from '../../Globals.js';
const { composed } = H;
import HTMLElement from './HTMLElement.js';
import SVGRenderer from '../SVG/SVGRenderer.js';
import U from '../../Utilities.js';
const {
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../SVG/SVGRendererLike' {
    interface SVGRendererLike {
        /** @requires Core/Renderer/HTML/HTMLRenderer */
        html(str: string, x: number, y: number): HTMLElement;
    }
}

/* *
 *
 *  Class
 *
 * */

// Extend SvgRenderer for useHTML option.
class HTMLRenderer extends SVGRenderer {

    /* *
     *
     *  Static Functions
     *
     * */

    /** @private */
    public static compose<T extends typeof SVGRenderer>(
        SVGRendererClass: T
    ): (T&typeof HTMLRenderer) {

        if (pushUnique(composed, this.compose)) {
            const htmlRendererProto = HTMLRenderer.prototype,
                svgRendererProto = SVGRendererClass.prototype;

            svgRendererProto.html = htmlRendererProto.html;
        }

        return SVGRendererClass as (T&typeof HTMLRenderer);
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create HTML text node. This is used by the SVG renderer through the
     * useHTML option.
     *
     * @private
     * @function Highcharts.SVGRenderer#html
     *
     * @param {string} str
     * The text of (subset) HTML to draw.
     *
     * @param {number} x
     * The x position of the text's lower left corner.
     *
     * @param {number} y
     * The y position of the text's lower left corner.
     *
     * @return {Highcharts.HTMLDOMElement}
     * HTML element.
     */
    public html(
        str: string,
        x: number,
        y: number
    ): HTMLElement {
        return new HTMLElement(this, 'span')
            // Set the default attributes
            .attr({
                text: str,
                x: Math.round(x),
                y: Math.round(y)
            });
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default HTMLRenderer;
