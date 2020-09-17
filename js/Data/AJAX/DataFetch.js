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
    DataFetch.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    DataFetch.prototype.fetch = function (uri, options) {
        options = merge(this.options, options);
    };
    DataFetch.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
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
        method: 'GET'
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
