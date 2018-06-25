/**
 * (c) 2010-2017 Christer Vasseng, Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
/**
 * @typedef {Object} AjaxSettings
 * @property {String} url - The URL to call
 * @property {('get'|'post'|'update'|'delete')} type - The verb to use
 * @property {('json'|'xml'|'text'|'octet')} dataType - The data type expected
 * @property {Function} success - Function to call on success
 * @property {Function} error - Function to call on error
 * @property {Object} data - The payload to send
 * @property {Object} headers - The headers; keyed on header name
 */

/**
 * Perform an Ajax call.
 *
 * @memberof Highcharts
 * @param {AjaxSettings} - The Ajax settings to use
 *
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
