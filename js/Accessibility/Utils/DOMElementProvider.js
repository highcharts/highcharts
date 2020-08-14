/* *
 *
 *  (c) 2009-2020 Øystein Moseng
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
import H from '../../Core/Globals.js';
var doc = H.win.document;
import U from '../../Core/Utilities.js';
var extend = U.extend;
import HTMLUtilities from './HTMLUtilities.js';
var removeElement = HTMLUtilities.removeElement;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 * @class
 */
var DOMElementProvider = function () {
    this.elements = [];
};
extend(DOMElementProvider.prototype, {
    /**
     * Create an element and keep track of it for later removal.
     * Same args as document.createElement
     * @private
     */
    createElement: function () {
        var el = doc.createElement.apply(doc, arguments);
        this.elements.push(el);
        return el;
    },
    /**
     * Destroy all created elements, removing them from the DOM.
     * @private
     */
    destroyCreatedElements: function () {
        this.elements.forEach(function (element) {
            removeElement(element);
        });
        this.elements = [];
    }
});
export default DOMElementProvider;
