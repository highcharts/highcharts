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

var Utilities = {

    /**
     * Used for aria-label attributes, painting on a canvas will fail if the
     * text contains tags.
     * @private
     * @param {string} str
     * @return {string}
     */
    stripHTMLTagsFromString: function (str) {
        return typeof str === 'string' ?
            str.replace(/<\/?[^>]+(>|$)/g, '') : str;
    },


    /**
     * @private
     * @param {string} tag
     * @param {string} text
     * @return {string}
     */
    makeHTMLTagFromText: function (tag, text) {
        return '<' + tag + '>' + escapeStringForHTML(text) + '</' + tag + '>';
    },


    escapeStringForHTML: escapeStringForHTML

};

export default Utilities;
