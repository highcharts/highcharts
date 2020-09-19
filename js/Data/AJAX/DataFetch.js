/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import DataJSON from '../DataJSON.js';
import H from '../../Core/Globals.js';
var win = H.win;
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, merge = U.merge;
/* *
 *
 *  Class
 *
 * */
var DataFetch = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function DataFetch(options) {
        if (options === void 0) { options = {}; }
        this.options = merge(DataFetch.defaultOptions, options);
    }
    /* *
     *
     *  Static Functions
     *
     * */
    DataFetch.fromJSON = function (json) {
        return new DataFetch(json.options);
    };
    /* *
     *
     *  Functions
     *
     * */
    DataFetch.prototype.abort = function (xhr, eventDetail) {
        this.emit({ type: 'abortFetch', detail: eventDetail, xhr: xhr });
        xhr.abort();
        this.emit({ type: 'afterAbortFetch', detail: eventDetail, xhr: xhr });
    };
    DataFetch.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    DataFetch.prototype.error = function (xhr, eventDetail) {
        this.emit({ type: 'error', detail: eventDetail, xhr: xhr });
    };
    DataFetch.prototype.fetch = function (resource, options, eventDetail) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('abort', this.abort.bind(this, xhr, eventDetail));
        xhr.addEventListener('error', this.error.bind(this, xhr, eventDetail));
        xhr.addEventListener('load', this.loaded.bind(this, xhr, eventDetail));
        xhr.addEventListener('timeout', this.timeout.bind(this, xhr, eventDetail));
        var timeout;
        if (typeof resource === 'object') {
            options = merge(options, resource);
        }
        options = merge(this.options, options);
        this.emit({ type: 'fetch', detail: eventDetail, xhr: xhr });
        if (options.timeout &&
            options.timeout > 0) {
            timeout = win.setTimeout(this.timeout.bind(this), 1000, xhr, eventDetail);
        }
        xhr.send(options.body);
    };
    DataFetch.prototype.loaded = function (xhr, eventDetail) {
        this.emit({ type: 'afterFetch', detail: eventDetail, xhr: xhr });
    };
    DataFetch.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    DataFetch.prototype.timeout = function (xhr, eventDetail) {
        this.emit({ type: 'abortFetch', detail: eventDetail, xhr: xhr });
    };
    DataFetch.prototype.toJSON = function () {
        return {
            $class: 'DataFetch',
            options: this.options
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataFetch.defaultOptions = {
        method: 'GET',
        timeout: 60000
    };
    return DataFetch;
}());
/* *
 *
 *  Registry
 *
 * */
DataJSON.addClass(DataFetch);
/* *
 *
 *  Export
 *
 **/
export default DataFetch;
