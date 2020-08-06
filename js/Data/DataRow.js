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
import DataJSON from './DataJSON.js';
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
        columns = merge(columns);
        this.autoId = false;
        this.columnKeys = Object.keys(columns);
        this.columns = columns;
        this.converter = converter;
        if (typeof columns.id === 'string') {
            this.id = columns.id;
        }
        else {
            this.autoId = true;
            this.id = uniqueKey();
        }
        delete columns.id;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    DataRow.fromJSON = function (json) {
        var keys = Object.keys(json).reverse(), columns = {};
        var key, value;
        while (typeof (key = keys.pop()) !== 'undefined') {
            if (key === '$class') {
                continue;
            }
            value = json[key];
            if (typeof value === 'object' &&
                value !== null) {
                if (value instanceof Array) {
                    columns[key] = DataJSON.fromJSON({
                        $class: 'DataTable',
                        rows: value
                    });
                }
                else {
                    columns[key] = DataJSON.fromJSON(value);
                }
            }
            else {
                columns[key] = value;
            }
        }
        return new DataRow(columns);
    };
    /* *
     *
     *  Functions
     *
     * */
    DataRow.prototype.clear = function () {
        this.emit('clearRow', {});
        this.columnKeys.length = 0;
        this.columns.length = 0;
        this.emit('afterClearRow', {});
        return true;
    };
    DataRow.prototype.deleteColumn = function (columnKey) {
        var row = this, columnValue = row.columns[columnKey];
        if (columnKey === 'id') {
            return false;
        }
        this.emit('deleteColumn', { columnKey: columnKey, columnValue: columnValue });
        row.columnKeys.splice(row.columnKeys.indexOf(columnKey), 1);
        delete row.columns[columnKey];
        this.emit('afterDeleteColumn', { columnKey: columnKey, columnValue: columnValue });
        return true;
    };
    DataRow.prototype.emit = function (type, e) {
        fireEvent(this, type, e);
    };
    DataRow.prototype.getAllColumns = function () {
        return merge(this.columns);
    };
    DataRow.prototype.getColumn = function (column) {
        if (typeof column === 'number') {
            return this.columns[this.columnKeys[column]];
        }
        return this.columns[column];
    };
    DataRow.prototype.getColumnAsBoolean = function (column) {
        return this.converter.asBoolean(this.getColumn(column));
    };
    DataRow.prototype.getColumnAsDataTable = function (column) {
        return this.converter.asDataTable(this.getColumn(column));
    };
    DataRow.prototype.getColumnAsDate = function (column) {
        return this.converter.asDate(this.getColumn(column));
    };
    DataRow.prototype.getColumnAsNumber = function (column) {
        return this.converter.asNumber(this.getColumn(column));
    };
    DataRow.prototype.getColumnAsString = function (column) {
        return this.converter.asString(this.getColumn(column));
    };
    DataRow.prototype.getColumnCount = function () {
        return this.getColumnKeys().length;
    };
    DataRow.prototype.getColumnKeys = function () {
        return this.columnKeys.slice();
    };
    DataRow.prototype.insertColumn = function (columnKey, columnValue) {
        if (columnKey === 'id' ||
            this.columnKeys.indexOf(columnKey) !== -1) {
            return false;
        }
        this.emit('insertColumn', { columnKey: columnKey, columnValue: columnValue });
        this.columnKeys.push(columnKey);
        this.columns[columnKey] = columnValue;
        this.emit('afterInsertColumn', { columnKey: columnKey, columnValue: columnValue });
        return true;
    };
    DataRow.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    DataRow.prototype.toJSON = function () {
        var columns = this.getAllColumns(), columnKeys = Object.keys(columns), json = {
            $class: 'DataRow'
        };
        var key, value;
        if (!this.autoId) {
            json.id = this.id;
        }
        for (var i = 0, iEnd = columnKeys.length; i < iEnd; ++i) {
            key = columnKeys[i];
            value = columns[key];
            /* eslint-disable @typescript-eslint/indent */
            switch (typeof value) {
                default:
                    if (value === null) {
                        json[key] = value;
                    }
                    else if (value instanceof Date) {
                        json[key] = value.getTime();
                    }
                    else { // DataTable
                        json[key] = value.toJSON();
                    }
                    continue;
                case 'undefined':
                    continue;
                case 'boolean':
                case 'number':
                case 'string':
                    json[key] = value;
                    continue;
            }
        }
        return json;
    };
    DataRow.prototype.updateColumn = function (columnKey, columnValue) {
        var row = this;
        if (columnKey === 'id') {
            return false;
        }
        fireEvent(row, 'updateColumn', { columnKey: columnKey, columnValue: columnValue });
        row.columns[columnKey] = columnValue;
        fireEvent(row, 'afterUpdateColumn', { columnKey: columnKey, columnValue: columnValue });
        return true;
    };
    return DataRow;
}());
DataJSON.addClass(DataRow);
export default DataRow;
