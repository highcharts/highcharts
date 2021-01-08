/* *
 *
 *  (c) 2010-2021 Christer Vasseng, Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../Core/Globals.js';

import U from '../Core/Utilities.js';
const {
    merge,
    objectEach
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type JSONType = ReturnType<JSON['parse']>;
        interface AjaxErrorCallbackFunction {
            (request: XMLHttpRequest, error: (string|Error)): void;
        }
        interface AjaxSuccessCallbackFunction {
            (response: (string|JSONType)): void;
        }
        interface AjaxSettingsObject {
            data: (string|Record<string, any>);
            dataType: string;
            error: AjaxErrorCallbackFunction;
            headers: Record<string, string>;
            success: AjaxSuccessCallbackFunction;
            type: ('get'|'post'|'update'|'delete');
            url: string;
        }
        function ajax(attr: Partial<AjaxSettingsObject>): (boolean|undefined);
        function getJSON(
            url: string,
            success: AjaxSuccessCallbackFunction
        ): void;
    }
}

/**
 * @interface Highcharts.AjaxSettingsObject
 *//**
 * The payload to send.
 *
 * @name Highcharts.AjaxSettingsObject#data
 * @type {string|Highcharts.Dictionary<any>}
 *//**
 * The data type expected.
 * @name Highcharts.AjaxSettingsObject#dataType
 * @type {"json"|"xml"|"text"|"octet"}
 *//**
 * Function to call on error.
 * @name Highcharts.AjaxSettingsObject#error
 * @type {Function}
 *//**
 * The headers; keyed on header name.
 * @name Highcharts.AjaxSettingsObject#headers
 * @type {Highcharts.Dictionary<string>}
 *//**
 * Function to call on success.
 * @name Highcharts.AjaxSettingsObject#success
 * @type {Function}
 *//**
 * The HTTP method to use. For example GET or POST.
 * @name Highcharts.AjaxSettingsObject#type
 * @type {string}
 *//**
 * The URL to call.
 * @name Highcharts.AjaxSettingsObject#url
 * @type {string}
 */

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
H.ajax = function (
    attr: Partial<Highcharts.AjaxSettingsObject>
): (false|undefined) {
    var options = merge(true, {
            url: false as any,
            type: 'get',
            dataType: 'json',
            success: false as any,
            error: false as any,
            data: false as any,
            headers: {}
        } as Highcharts.AjaxSettingsObject, attr),
        headers: Record<string, string> = {
            json: 'application/json',
            xml: 'application/xml',
            text: 'text/plain',
            octet: 'application/octet-stream'
        },
        r = new XMLHttpRequest();

    /**
     * @private
     * @param {XMLHttpRequest} xhr - Internal request object.
     * @param {string|Error} err - Occured error.
     * @return {void}
     */
    function handleError(xhr: XMLHttpRequest, err: (string|Error)): void {
        if (options.error) {
            options.error(xhr, err);
        } else {
            // @todo Maybe emit a highcharts error event here
        }
    }

    if (!options.url) {
        return false;
    }

    r.open((options.type as any).toUpperCase(), options.url, true);
    if (!options.headers['Content-Type']) {
        r.setRequestHeader(
            'Content-Type',
            headers[options.dataType] || headers.text
        );
    }

    objectEach(options.headers, function (val: string, key: string): void {
        r.setRequestHeader(key, val);
    });

    // @todo lacking timeout handling
    r.onreadystatechange = function (): void {
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
    } catch (e) {
        // empty
    }

    r.send(options.data || (true as any));
};

/**
 * Get a JSON resource over XHR, also supporting CORS without preflight.
 *
 * @function Highcharts.getJSON
 * @param {string} url
 *        The URL to load.
 * @param {Function} success
 *        The success callback. For error handling, use the `Highcharts.ajax`
 *        function instead.
 * @return {void}
 */
H.getJSON = function (
    url: string,
    success: Highcharts.AjaxSuccessCallbackFunction
): void {
    H.ajax({
        url: url,
        success: success,
        dataType: 'json',
        headers: {
            // Override the Content-Type to avoid preflight problems with CORS
            // in the Highcharts demos
            'Content-Type': 'text/plain'
        }
    });
};

const exports = {
    ajax: H.ajax,
    getJSON: H.getJSON
};

export default exports;
