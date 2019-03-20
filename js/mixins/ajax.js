/* *
 * (c) 2010-2017 Christer Vasseng, Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';

/**
 * @interface Highcharts.AjaxSettings
 *//**
 * The URL to call.
 *
 * @name Highcharts.AjaxSettings#url
 * @type {string}
 *//**
 * The verb to use.
 *
 * @name Highcharts.AjaxSettings#type
 * @type {"get"|"post"|"update"|"delete"}
 *//**
 * The data type expected.
 *
 * @name Highcharts.AjaxSettings#dataType
 * @type {"json"|"xml"|"text"|"octet"}
 *//**
 * Function to call on success.
 *
 * @name Highcharts.AjaxSettings#success
 * @type {Function}
 *//**
 * Function to call on error.
 *
 * @name Highcharts.AjaxSettings#error
 * @type {Function}
 *//**
 * The payload to send.
 *
 * @name Highcharts.AjaxSettings#data
 * @type {object}
 *//**
 * The headers; keyed on header name.
 *
 * @name Highcharts.AjaxSettings#headers
 * @type {object}
 */

/**
 * Perform an Ajax call.
 *
 * @function Highcharts.ajax
 *
 * @param {Highcharts.AjaxSettings} attr
 *        The Ajax settings to use.
 */
H.ajax = function (attr) {
    var options = H.merge(true, {
            url: false,
            type: 'GET',
            dataType: 'json',
            success: false,
            error: false,
            data: false,
            headers: {}
        }, attr),
        headers = {
            json: 'application/json',
            xml: 'application/xml',
            text: 'text/plain',
            octet: 'application/octet-stream'
        },
        r = new XMLHttpRequest();

    function handleError(xhr, err) {
        if (options.error) {
            options.error(xhr, err);
        } else {
            // Maybe emit a highcharts error event here
        }
    }

    if (!options.url) {
        return false;
    }

    r.open(options.type.toUpperCase(), options.url, true);
    r.setRequestHeader(
        'Content-Type',
        headers[options.dataType] || headers.text
    );

    H.objectEach(options.headers, function (val, key) {
        r.setRequestHeader(key, val);
    });

    r.onreadystatechange = function () {
        var res;

        if (r.readyState === 4) {
            if (r.status === 200) {
                res = r.responseText;
                if (options.dataType === 'json') {
                    try {
                        res = JSON.parse(res);
                    } catch (e) {
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
    } catch (e) {}

    r.send(options.data || true);
};
