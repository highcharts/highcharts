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
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent;
/* *
 *
 *  Class
 *
 * */
/**
 * Abstract class providing an interface and basic methods for a DataParser
 */
var DataParser = /** @class */ (function () {
    function DataParser() {
    }
    /**
     * Emits an event on the DataParser instance.
     *
     * @param {DataParser.EventObject} [e]
     * Event object containing additional event data
     */
    DataParser.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    /**
     * Registers a callback for a specific parser event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    DataParser.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    /**
     * Default options
     */
    DataParser.defaultOptions = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true,
        switchRowsAndColumns: false
    };
    return DataParser;
}());
export default DataParser;
