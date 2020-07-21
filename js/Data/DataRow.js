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
import DataConverter from './DataConverter.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent;
/** eslint-disable valid-jsdoc */
var DataRow = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function DataRow(columns, converter) {
        if (columns === void 0) { columns = {}; }
        if (converter === void 0) { converter = new DataConverter(); }
        this.columns = columns;
        this.converter = converter;
    }
    /* *
     *
     *  Functions
     *
     * */
    DataRow.prototype.add = function (columnKey, columnValue) {
        var row = this;
        if (row.getColumnKeys().indexOf(columnKey) !== -1) {
            return false;
        }
        fireEvent(row, 'newColumn', { columnKey: columnKey, columnValue: columnValue }, function (e) {
            row.columns[e.columnKey] = e.columnValue;
        });
        return true;
    };
    DataRow.prototype.get = function (columnKey) {
        return this.columns[columnKey];
    };
    DataRow.prototype.getBoolean = function (columnKey) {
        return this.converter.toBoolean(this.get(columnKey));
    };
    DataRow.prototype.getDataTable = function (columnKey) {
        return this.converter.toDataTable(this.get(columnKey));
    };
    DataRow.prototype.getDate = function (columnKey) {
        return this.converter.toDate(this.get(columnKey));
    };
    DataRow.prototype.getNumber = function (columnKey) {
        return this.converter.toNumber(this.get(columnKey));
    };
    DataRow.prototype.getString = function (columnKey) {
        return this.converter.toString(this.get(columnKey));
    };
    DataRow.prototype.getColumnKeys = function (unfiltered) {
        if (unfiltered === void 0) { unfiltered = false; }
        return Object.keys(this.columns).reverse();
    };
    DataRow.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    DataRow.prototype.remove = function (columnKey) {
        var row = this;
        fireEvent(row, 'deleteColumn', { columnKey: columnKey, columnValue: row.columns[columnKey] }, function (e) {
            delete row.columns[e.columnKey];
        });
    };
    DataRow.prototype.set = function (columnKey, columnValue) {
        var row = this;
        fireEvent(row, 'changeColumn', { columnKey: columnKey, columnValue: columnValue }, function (e) {
            row.columns[e.columnKey] = e.columnValue;
        });
    };
    return DataRow;
}());
export default DataRow;
