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


var Utilities = {
    stripHTMLTagsFromString: stripHTMLTagsFromString,
    escapeStringForHTML: escapeStringForHTML,
    setElAttrs: setElAttrs
};

export default Utilities;
