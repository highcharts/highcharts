/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent;
var DataParser = /** @class */ (function () {
    function DataParser() {
    }
    DataParser.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    DataParser.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    return DataParser;
}());
export default DataParser;
