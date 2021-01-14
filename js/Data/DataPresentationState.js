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
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent;
/* *
 *
 *  Class
 *
 * */
var DataPresentationState = /** @class */ (function () {
    function DataPresentationState() {
    }
    /**
     * Converts a supported class JSON to a DataPresentationState instance.
     *
     * @param {DataPresentationState.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataPresentationState}
     * DataPresentationState instance from the class JSON.
     */
    DataPresentationState.fromJSON = function (json) {
        var presentationState = new DataPresentationState();
        if (json.columnOrder) {
            presentationState.setColumnOrder(json.columnOrder);
        }
        return presentationState;
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Emits an event on this table to all registered callbacks of the given
     * event.
     *
     * @param {DataPresentationState.EventObject} e
     * Event object with event information.
     */
    DataPresentationState.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    DataPresentationState.prototype.getColumnOrder = function () {
        return (this.columnOrder || []).slice();
    };
    DataPresentationState.prototype.getColumnSorter = function () {
        var columnOrder = (this.columnOrder || []).slice();
        if (!columnOrder.length) {
            return function () { return 0; };
        }
        return function (a, b) {
            var aIndex = columnOrder.indexOf(a), bIndex = columnOrder.indexOf(b);
            if (aIndex > -1 && bIndex > -1) {
                return aIndex - bIndex;
            }
            if (bIndex > -1) {
                return 1;
            }
            if (aIndex > -1) {
                return -1;
            }
            return 0;
        };
    };
    DataPresentationState.prototype.isSet = function () {
        return this.isModified === true;
    };
    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    DataPresentationState.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    DataPresentationState.prototype.setColumnOrder = function (columnOrder, eventDetail) {
        var presentationState = this, oldColumnOrder = (presentationState.columnOrder || []).slice(), newColumnOrder = columnOrder.slice();
        presentationState.emit({
            type: 'columnOrderChange',
            detail: eventDetail,
            newColumnOrder: newColumnOrder,
            oldColumnOrder: oldColumnOrder
        });
        presentationState.columnOrder = newColumnOrder;
        presentationState.isModified = true;
        presentationState.emit({
            type: 'afterColumnOrderChange',
            detail: eventDetail,
            newColumnOrder: newColumnOrder,
            oldColumnOrder: oldColumnOrder
        });
    };
    /**
     * Converts the table to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this table.
     */
    DataPresentationState.prototype.toJSON = function () {
        var json = {
            $class: 'DataPresentationState'
        };
        if (this.columnOrder) {
            json.columnOrder = this.columnOrder.slice();
        }
        return json;
    };
    return DataPresentationState;
}());
/* *
 *
 *  Default Export
 *
 * */
export default DataPresentationState;
