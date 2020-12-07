/* *
 *
 *  (c) 2010-2017 Christer Vasseng, Torstein Honsi
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
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
var merge = U.merge, objectEach = U.objectEach;
/* *
 *
 *  Namespace
 *
 * */
var Ajax;
(function (Ajax) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Perform an Ajax call.
     *
     * @function Highcharts.ajax
     *
     * @param {Partial<Highcharts.AjaxSettingsObject>} attr
     *        The Ajax settings to use.
     *
     * @return {false|undefined}
     *         Returns false, if error occured.
     */
    function ajax(attr) {
        var options = merge(true, {
            url: false,
            type: 'get',
            dataType: 'json',
            success: false,
            error: false,
            data: false,
            headers: {}
        }, attr), headers = {
            json: 'application/json',
            xml: 'application/xml',
            text: 'text/plain',
            octet: 'application/octet-stream'
        }, r = new XMLHttpRequest();
        // eslint-disable-next-line require-jsdoc
        function handleError(xhr, err) {
            if (options.error) {
                options.error(xhr, err);
            }
            else {
                // @todo Maybe emit a highcharts error event here
            }
        }
        if (!options.url) {
            return false;
        }
        r.open(options.type.toUpperCase(), options.url, true);
        if (!options.headers['Content-Type']) {
            r.setRequestHeader('Content-Type', headers[options.dataType] || headers.text);
        }
        objectEach(options.headers, function (val, key) {
            r.setRequestHeader(key, val);
        });
        // @todo lacking timeout handling
        r.onreadystatechange = function () {
            var res;
            if (r.readyState === 4) {
                if (r.status === 200) {
                    res = r.responseText;
                    if (options.dataType === 'json') {
                        try {
                            res = JSON.parse(res);
                        }
                        catch (e) {
                            return handleError(r, e);
                        }
                    }
                    return options.success && options.success(res);
                }
                handleError(r, r.responseText);
            }
        };
        try {
            options.data = JSON.stringify(options.data);
        }
        catch (e) {
            // empty
        }
        r.send(options.data || true);
    }
    Ajax.ajax = ajax;
    /**
     * Get a JSON resource over XHR, also supporting CORS without preflight.
     *
     * @function Highcharts.getJSON
     *
     * @param {string} url
     * The URL to load.
     *
     * @param {Function} success
     * The success callback. For error handling, use the `Highcharts.ajax`
     * function instead.
     */
    function getJSON(url, success) {
        ajax({
            url: url,
            success: success,
            dataType: 'json',
            headers: {
                // Override the Content-Type to avoid preflight problems with
                // CORS in the Highcharts demos
                'Content-Type': 'text/plain'
            }
        });
    }
    Ajax.getJSON = getJSON;
})(Ajax || (Ajax = {}));
/* *
 *
 *  Compatibility
 *
 * */
H.ajax = Ajax.ajax;
H.getJSON = Ajax.getJSON;
/* *
 *
 *  Default Export
 *
 * */
export default H;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * @interface Highcharts.AjaxSettingsObject
 */ /**
* The payload to send.
*
* @name Highcharts.AjaxSettingsObject#data
* @type {string|Highcharts.Dictionary<any>}
*/ /**
* The data type expected.
* @name Highcharts.AjaxSettingsObject#dataType
* @type {"json"|"xml"|"text"|"octet"}
*/ /**
* Function to call on error.
* @name Highcharts.AjaxSettingsObject#error
* @type {Function}
*/ /**
* The headers; keyed on header name.
* @name Highcharts.AjaxSettingsObject#headers
* @type {Highcharts.Dictionary<string>}
*/ /**
* Function to call on success.
* @name Highcharts.AjaxSettingsObject#success
* @type {Function}
*/ /**
* The HTTP method to use. For example GET or POST.
* @name Highcharts.AjaxSettingsObject#type
* @type {string}
*/ /**
* The URL to call.
* @name Highcharts.AjaxSettingsObject#url
* @type {string}
*/
''; // detach doclets above
