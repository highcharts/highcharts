/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Christer Vasseng, Torstein Honsi
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

import type JSON from './JSON';

import G from '../Core/Globals.js';
const { win } = G;
import U from '../Core/Utilities.js';
const {
    discardElement,
    objectEach
} = U;

/* *
 *
 *  Declarations
 *
 * */

/**
 * Callback function for Ajax errors.
 *
 * @callback Highcharts.AjaxErrorCallbackFunction
 *
 * @param {XMLHttpRequest} request
 * The XHR object.
 *
 * @param {string|Error} error
 * The error message.
 */
export interface AjaxErrorCallbackFunction {
    (request: XMLHttpRequest, error: (string | Error)): void;
}

export interface AjaxSettingsObject {
    /**
     * The payload to send.
     */
    data?: (string | JSON.Type | JSON.Builder | JSON);
    /**
     * The data type expected.
     */
    dataType?: string; // @todo ('json' | 'text' | 'xml' | 'octet' | string);
    /**
     * Function to call on error.
     */
    error?: AjaxErrorCallbackFunction;
    /**
     * The headers; keyed on header name.
     */
    headers?: Record<string, string>;
    /**
     * The response type.
     */
    responseType?: ('arraybuffer' | 'blob' | 'document' | 'json' | 'text');
    /**
     * Function to call on success.
     */
    success?: AjaxSuccessCallbackFunction;
    /**
     * The HTTP method to use. For example GET or POST.
     */
    type?: ('get' | 'post' | 'update' | 'delete');
    /**
     * The URL to call.
     */
    url: string;
}

/**
 * Callback function for Ajax success.
 *
 * @callback Highcharts.AjaxSuccessCallbackFunction
 *
 * @param {string|Highcharts.JSONType} response
 * The response from the Ajax call.
 *
 * @param {XMLHttpRequest} xhr
 * The XHR object.
 */
export interface AjaxSuccessCallbackFunction {
    (response: (string | JSON.Type), xhr: XMLHttpRequest): void;
}

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
 * @param {Highcharts.AjaxSettingsObject} settings
 * The Ajax settings to use.
 *
 * @return {false | undefined}
 * Returns false, if error occurred.
 */
function ajax(
    settings: AjaxSettingsObject
): (false | undefined) {
    const headers: Record<string, string> = {
            json: 'application/json',
            xml: 'application/xml',
            text: 'text/plain',
            octet: 'application/octet-stream'
        },
        r = new XMLHttpRequest();

    /**
     * Private error handler.
     * @internal
     * @param {XMLHttpRequest} xhr
     * Internal request object.
     * @param {string | Error} err
     * Occurred error.
     */
    function handleError(xhr: XMLHttpRequest, err: (string | Error)): void {
        if (settings.error) {
            settings.error(xhr, err);
        } else {
            // @todo Maybe emit a highcharts error event here
        }
    }

    if (!settings.url) {
        return false;
    }

    r.open((settings.type || 'get').toUpperCase(), settings.url, true);
    if (!settings.headers?.['Content-Type']) {
        r.setRequestHeader(
            'Content-Type',
            headers[settings.dataType || 'json'] || headers.text
        );
    }

    objectEach(settings.headers, function (val: string, key: string): void {
        r.setRequestHeader(key, val);
    });

    if (settings.responseType) {
        r.responseType = settings.responseType;
    }

    // @todo lacking timeout handling
    r.onreadystatechange = function (): void {
        let res;

        if (r.readyState === 4) {
            if (r.status === 200) {
                if (settings.responseType !== 'blob') {
                    res = r.responseText;
                    if (settings.dataType === 'json') {
                        try {
                            res = JSON.parse(res);
                        } catch (e) {
                            if (e instanceof Error) {
                                return handleError(r, e);
                            }
                        }
                    }
                }
                return settings.success?.(res, r);
            }

            handleError(r, r.responseText);
        }
    };

    if (settings.data && typeof settings.data !== 'string') {
        settings.data = JSON.stringify(settings.data);
    }

    r.send(settings.data);
}

/**
 * Get a JSON resource over XHR, also supporting CORS without preflight.
 *
 * @function Highcharts.getJSON
 *
 * @param {string} url
 * The URL to load.
 * @param {Function} success
 * The success callback. For error handling, use the `Highcharts.ajax` function
 * instead.
 */
function getJSON(
    url: string,
    success: AjaxSuccessCallbackFunction
): void {
    HttpUtilities.ajax({
        url: url,
        success: success,
        dataType: 'json',
        headers: {
            // Override the Content-Type to avoid preflight problems with CORS
            // in the Highcharts demos
            'Content-Type': 'text/plain'
        }
    });
}

/**
 * The post utility.
 *
 * @internal
 * @function Highcharts.post
 *
 * @param {string} url
 * Post URL.
 *
 * @param {Object} data
 * Post data.
 *
 * @param {RequestInit} [fetchOptions]
 * Additional attributes for the post request.
 */
async function post(
    url: string,
    data: Record<string, any>,
    fetchOptions?: RequestInit
): Promise<void> {
    // Prepare a form to send the data
    const formData = new win.FormData();

    // Add the data to the form
    objectEach(data, function (value: string, name: string): void {
        formData.append(name, value);
    });
    formData.append('b64', 'true');

    // Send the POST
    const response: Response = await win.fetch(url, {
        method: 'POST',
        body: formData,
        ...fetchOptions
    });

    // Check the response
    if (response.ok) {
        // Get the text from the response
        const text: string = await response.text();

        // Prepare self-click link with the Base64 representation
        const link = document.createElement('a');
        link.href = `data:${data.type as string};base64,${text}`;
        link.download = data.filename;
        link.click();

        // Remove the link
        discardElement(link);
    }
}

/* *
 *
 *  Default Export
 *
 * */

interface HttpUtilities {
    ajax: typeof ajax,
    getJSON: typeof getJSON,
    /** @internal */
    post: typeof post
}

/**
 * Utility functions for Ajax.
 * @class
 * @name Highcharts.HttpUtilities
 */
const HttpUtilities = {
    ajax,
    getJSON
} as HttpUtilities;

HttpUtilities.post = post;

export default HttpUtilities;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @interface Highcharts.AjaxSettingsObject
 *//**
 * The payload to send.
 *
 * @name Highcharts.AjaxSettingsObject#data
 * @type {string | Highcharts.Dictionary<any> | undefined}
 *//**
 * The data type expected.
 *
 * @name Highcharts.AjaxSettingsObject#dataType
 * @type {"json" | "xml" | "text" | "octet" | undefined}
 *//**
 * Function to call on error.
 *
 * @name Highcharts.AjaxSettingsObject#error
 * @type {Function | undefined}
 *//**
 * The headers; keyed on header name.
 *
 * @name Highcharts.AjaxSettingsObject#headers
 * @type {Highcharts.Dictionary<string> | undefined}
 *//**
 * Function to call on success.
 *
 * @name Highcharts.AjaxSettingsObject#success
 * @type {Function | undefined}
 *//**
 * The HTTP method to use. For example GET or POST.
 *
 * @name Highcharts.AjaxSettingsObject#type
 * @type {string | undefined}
 *//**
 * The URL to call.
 *
 * @name Highcharts.AjaxSettingsObject#url
 * @type {string}
 */

(''); // Keeps doclets above in JS file
