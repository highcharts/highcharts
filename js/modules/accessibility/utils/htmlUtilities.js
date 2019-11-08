/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Utility functions for accessibility module.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
var merge = H.merge,
    doc = H.win.document;


/**
 * @private
 * @param {Highcharts.HTMLDOMElement} el
 * @param {string} str
 */
function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else if (el.className.indexOf(className) < 0) {
        // Note: Dumb check for class name exists, should be fine for practical
        // use cases, but will return false positives if the element has a class
        // that contains the className.
        el.className += className;
    }
}


/**
 * @private
 * @param {string} str
 * @return {string}
 */
function escapeStringForHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}


/**
 * Get an element by ID
 * @param {string} id
 * @private
 * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement}
 */
function getElement(id) {
    return doc.getElementById(id);
}


/**
 * Remove an element from the DOM.
 * @private
 * @param {Highcharts.HTMLDOMElement} element
 */
function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}


/**
 * Utility function. Reverses child nodes of a DOM element.
 * @private
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} node
 */
function reverseChildNodes(node) {
    var i = node.childNodes.length;
    while (i--) {
        node.appendChild(node.childNodes[i]);
    }
}


/**
 * Set attributes on element. Set to null to remove attribute.
 * @private
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} el
 * @param {object} attrs
 */
function setElAttrs(el, attrs) {
    Object.keys(attrs).forEach(function (attr) {
        var val = attrs[attr];
        if (val === null) {
            el.removeAttribute(attr);
        } else {
            var cleanedVal = escapeStringForHTML('' + val);
            el.setAttribute(attr, cleanedVal);
        }
    });
}


/**
 * Used for aria-label attributes, painting on a canvas will fail if the
 * text contains tags.
 * @private
 * @param {string} str
 * @return {string}
 */
function stripHTMLTagsFromString(str) {
    return typeof str === 'string' ?
        str.replace(/<\/?[^>]+(>|$)/g, '') : str;
}


/**
 * Utility function for hiding an element visually, but still keeping it
 * available to screen reader users.
 * @private
 * @param {Highcharts.HTMLDOMElement} element
 */
function visuallyHideElement(element) {
    var hiddenStyle = {
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=1)',
        filter: 'alpha(opacity=1)',
        opacity: '0.01'
    };
    merge(true, element.style, hiddenStyle);
}


var HTMLUtilities = {
    addClass: addClass,
    escapeStringForHTML: escapeStringForHTML,
    getElement: getElement,
    removeElement: removeElement,
    reverseChildNodes: reverseChildNodes,
    setElAttrs: setElAttrs,
    stripHTMLTagsFromString: stripHTMLTagsFromString,
    visuallyHideElement: visuallyHideElement
};

export default HTMLUtilities;
