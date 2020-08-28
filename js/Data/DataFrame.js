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
import DataConverter from './DataConverter.js';
import DataJSON from './DataJSON.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, uniqueKey = U.uniqueKey;
var DataFrame = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the DataTable class.
     *
     * @param {Array<DataFrame.ColumnValues>} [columns]
     * Array of columns with row values.
     *
     * @param {Array<string>} [columnNames]
     * Array of column names.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in column rows.
     */
    function DataFrame(columns, columnNames, converter) {
        if (columns === void 0) { columns = []; }
        if (columnNames === void 0) { columnNames = []; }
        if (converter === void 0) { converter = new DataConverter(); }
        columnNames = columnNames.slice();
        columns = columns.slice();
        for (var i = columnNames.length, iEnd = columns.length - 1; i < iEnd; ++i) {
            columnNames.push(uniqueKey());
        }
        this.converter = converter;
        this.id = uniqueKey();
        this.columnNames = columnNames;
        this.columns = columns;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a supported class JSON to a DataFrame instance.
     *
     * @param {DataFrame.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataFrame}
     * DataFrame instance from the class JSON.
     */
    DataFrame.fromJSON = function (json) {
        var frame = new DataFrame(json.columns, json.columnNames);
        frame.id = json.id;
        return frame;
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Emits an event on this frame to all registered callbacks of the given
     * event.
     *
     * @param {DataFrame.EventObject} e
     * Event object with event information.
     */
    DataFrame.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    /**
     * Adds a row to this table.
     *
     * @param {string} columnName
     * Column to add to this frame.
     *
     * @param {ColumnValues} columnValues
     * Column to add to this frame.
     *
     * @param {DataEventEmitter.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the column has been added to the frame. Returns false,
     * if a column with the same name already exists in the frame.
     *
     * @emits DataFrame#insertRow
     * @emits DataFrame#afterInsertRow
     */
    DataFrame.prototype.insertColumn = function (columnName, columnValues, eventDetail) {
        if (columnValues === void 0) { columnValues = []; }
        var frame = this, columnNames = frame.columnNames, columns = frame.columns;
        frame.emit({ type: 'insertColumn' });
        if (columnNames.indexOf(columnName) >= 0) {
            return false;
        }
        columnNames.push(columnName);
        columns.push(columnValues);
        frame.emit({ type: 'afterInsertColumn' });
        return true;
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
    DataFrame.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    DataFrame.prototype.toJSON = function () {
        var frame = this;
        return {
            $class: DataJSON.getName(DataFrame),
            columnNames: frame.columnNames.slice(),
            columns: frame.columns.slice(),
            id: frame.id
        };
    };
    return DataFrame;
}());
/* *
 *
 *  Export
 *
 * */
export default DataFrame;
