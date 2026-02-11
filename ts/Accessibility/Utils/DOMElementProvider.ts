/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Class that can keep track of elements added to DOM and clean them up on
 *  destroy.
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';

import H from '../../Core/Globals.js';
const { doc } = H;
import HU from './HTMLUtilities.js';
const { removeElement } = HU;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 */
class DOMElementProvider {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor() {
        this.elements = [];
    }

    /* *
     *
     *  Properties
     *
     * */

    public elements: Array<HTMLDOMElement>;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public createElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
    /**
     * Create an element and keep track of it for later removal.
     * Same args as document.createElement
     * @private
     */
    public createElement(): HTMLDOMElement {
        const el = doc.createElement.apply(doc, arguments);
        this.elements.push(el);
        return el;
    }

    /**
     * Destroy created element, removing it from the DOM.
     * @private
     */
    public removeElement(element: HTMLDOMElement): void {
        removeElement(element);
        this.elements.splice(this.elements.indexOf(element), 1);
    }

    /**
     * Destroy all created elements, removing them from the DOM.
     * @private
     */
    public destroyCreatedElements(): void {
        this.elements.forEach(function (element: HTMLDOMElement): void {
            removeElement(element);
        });
        this.elements = [];
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DOMElementProvider;
