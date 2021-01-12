/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Class that can keep track of elements added to DOM and clean them up on
 *  destroy.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import H from '../../Core/Globals.js';
const {
    doc
} = H;
import HTMLUtilities from './HTMLUtilities.js';
const {
    removeElement
} = HTMLUtilities;
import U from '../../Core/Utilities.js';
const {
    extend
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class DOMElementProvider {
            public constructor ();
            public elements: Array<HTMLDOMElement>;
            public createElement: Document['createElement'];
            public destroyCreatedElements(): void;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 * @class
 */
var DOMElementProvider: typeof Highcharts.DOMElementProvider = function (
    this: Highcharts.DOMElementProvider
): void {
    this.elements = [];
} as any;
extend(DOMElementProvider.prototype, {

    /**
     * Create an element and keep track of it for later removal.
     * Same args as document.createElement
     * @private
     */
    createElement: function (this: Highcharts.DOMElementProvider): HTMLDOMElement {
        var el = doc.createElement.apply(doc, arguments);
        this.elements.push(el);
        return el;
    },


    /**
     * Destroy all created elements, removing them from the DOM.
     * @private
     */
    destroyCreatedElements: function (
        this: Highcharts.DOMElementProvider
    ): void {
        this.elements.forEach(function (element: HTMLDOMElement): void {
            removeElement(element);
        });
        this.elements = [];
    }

});

export default DOMElementProvider;
