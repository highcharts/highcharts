/* *
 *
 *  (c) 2015-2019 Oystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Mixin for downloading content in the browser
 *
 * */
'use strict';
import Highcharts from '../parts/Globals.js';
var win = Highcharts.win, nav = win.navigator, doc = win.document, domurl = win.URL || win.webkitURL || win, isEdgeBrowser = /Edge\/\d+/.test(nav.userAgent);
/**
 * Convert base64 dataURL to Blob if supported, otherwise returns undefined.
 * @private
 * @function Highcharts.dataURLtoBlob
 * @param {string} dataURL
 *        URL to convert
 * @return {string|undefined}
 *         Blob
 */
Highcharts.dataURLtoBlob = function (dataURL) {
    var parts = dataURL.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/);
    if (parts &&
        parts.length > 3 &&
        win.atob &&
        win.ArrayBuffer &&
        win.Uint8Array &&
        win.Blob &&
        domurl.createObjectURL) {
        // Try to convert data URL to Blob
        var binStr = win.atob(parts[3]), buf = new win.ArrayBuffer(binStr.length), binary = new win.Uint8Array(buf), blob;
        for (var i = 0; i < binary.length; ++i) {
            binary[i] = binStr.charCodeAt(i);
        }
        blob = new win.Blob([binary], { 'type': parts[1] });
        return domurl.createObjectURL(blob);
    }
};
/**
 * Download a data URL in the browser. Can also take a blob as first param.
 *
 * @private
 * @function Highcharts.downloadURL
 * @param {string|global.URL} dataURL
 *        The dataURL/Blob to download
 * @param {string} filename
 *        The name of the resulting file (w/extension)
 * @return {void}
 */
Highcharts.downloadURL = function (dataURL, filename) {
    var a = doc.createElement('a'), windowRef;
    // IE specific blob implementation
    // Don't use for normal dataURLs
    if (typeof dataURL !== 'string' &&
        !(dataURL instanceof String) &&
        nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(dataURL, filename);
        return;
    }
    // Some browsers have limitations for data URL lengths. Try to convert to
    // Blob or fall back. Edge always needs that blob.
    if (isEdgeBrowser || dataURL.length > 2000000) {
        dataURL = Highcharts.dataURLtoBlob(dataURL);
        if (!dataURL) {
            throw new Error('Failed to convert to blob');
        }
    }
    // Try HTML5 download attr if supported
    if (a.download !== undefined) {
        a.href = dataURL;
        a.download = filename; // HTML5 download attribute
        doc.body.appendChild(a);
        a.click();
        doc.body.removeChild(a);
    }
    else {
        // No download attr, just opening data URI
        try {
            windowRef = win.open(dataURL, 'chart');
            if (windowRef === undefined || windowRef === null) {
                throw new Error('Failed to open window');
            }
        }
        catch (e) {
            // window.open failed, trying location.href
            win.location.href = dataURL;
        }
    }
};
