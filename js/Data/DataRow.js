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
var addEvent = U.addEvent, fireEvent = U.fireEvent, merge = U.merge, uniqueKey = U.uniqueKey;
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
        this.columns = columns = merge(columns);
        this.converter = converter;
        if (typeof columns.id === 'string') {
            this.id = columns.id;
        }
        else {
            this.id = uniqueKey();
        }
        delete columns.id;
    }
    /* *
     *
     *  Functions
     *
     * */
    DataRow.prototype.clear = function () {
        var columnKeys = this.getColumnKeys();
    };
    DataRow.prototype.delete = function (columnKey) {
        var row = this;
        var columnValue = row.columns[columnKey];
        if (columnKey === 'id') {
            return;
        }
        fireEvent(row, 'deleteColumn', { columnKey: columnKey, columnValue: columnValue }, function (e) {
            delete row.columns[e.columnKey];
            fireEvent(row, 'afterDeleteColumn', { columnKey: columnKey, columnValue: columnValue });
        });
    };
    DataRow.prototype.get = function (columnKey) {
        return this.columns[columnKey];
    };
    DataRow.prototype.getAllColumns = function () {
        return merge(this.columns);
    };
    DataRow.prototype.getAsBoolean = function (columnKey) {
        return this.converter.toBoolean(this.get(columnKey));
    };
    DataRow.prototype.getAsDataTable = function (columnKey) {
        return this.converter.toDataTable(this.get(columnKey));
    };
    DataRow.prototype.getAsDate = function (columnKey) {
        return this.converter.toDate(this.get(columnKey));
    };
    DataRow.prototype.getAsNumber = function (columnKey) {
        return this.converter.toNumber(this.get(columnKey));
    };
    DataRow.prototype.getAsString = function (columnKey) {
        return this.converter.toString(this.get(columnKey));
    };
    DataRow.prototype.getColumnKeys = function (unfiltered) {
        if (unfiltered === void 0) { unfiltered = false; }
        return Object.keys(this.columns).reverse();
    };
    DataRow.prototype.insert = function (columnKey, columnValue) {
        var row = this;
        if (columnKey === 'id' ||
            row.getColumnKeys().indexOf(columnKey) !== -1) {
            return false;
        }
        fireEvent(row, 'insertColumn', { columnKey: columnKey, columnValue: columnValue }, function () {
            row.columns[columnKey] = columnValue;
            fireEvent(row, 'afterInsertColumn', { columnKey: columnKey, columnValue: columnValue });
        });
        return true;
    };
    DataRow.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    DataRow.prototype.update = function (columnKey, columnValue) {
        var row = this;
        if (columnKey === 'id') {
            return;
        }
        fireEvent(row, 'updateColumn', { columnKey: columnKey, columnValue: columnValue }, function () {
            row.columns[columnKey] = columnValue;
            fireEvent(row, 'afterUpdateColumn', { columnKey: columnKey, columnValue: columnValue });
        });
    };
    return DataRow;
}());
export default DataRow;
