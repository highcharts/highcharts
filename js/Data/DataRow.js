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
        var row = this;
        var succeeded = false;
        fireEvent(row, 'clearRow', {}, function () {
            row.columns.length = 0;
            succeeded = true;
            fireEvent(row, 'afterClearRow', {});
        });
        return succeeded;
    };
    DataRow.prototype.deleteColumn = function (columnKey) {
        var row = this;
        var columnValue = row.columns[columnKey];
        var succeeded = false;
        if (columnKey === 'id') {
            return succeeded;
        }
        fireEvent(row, 'deleteColumn', { columnKey: columnKey, columnValue: columnValue }, function (e) {
            delete row.columns[e.columnKey];
            succeeded = true;
            fireEvent(row, 'afterDeleteColumn', { columnKey: columnKey, columnValue: columnValue });
        });
        return succeeded;
    };
    DataRow.prototype.getAllColumns = function () {
        return merge(this.columns);
    };
    DataRow.prototype.getColumn = function (columnKey) {
        return this.columns[columnKey];
    };
    DataRow.prototype.getColumnAsBoolean = function (columnKey) {
        return this.converter.asBoolean(this.getColumn(columnKey));
    };
    DataRow.prototype.getColumnAsDataTable = function (columnKey) {
        return this.converter.asDataTable(this.getColumn(columnKey));
    };
    DataRow.prototype.getColumnAsDate = function (columnKey) {
        return this.converter.asDate(this.getColumn(columnKey));
    };
    DataRow.prototype.getColumnAsNumber = function (columnKey) {
        return this.converter.asNumber(this.getColumn(columnKey));
    };
    DataRow.prototype.getColumnAsString = function (columnKey) {
        return this.converter.asString(this.getColumn(columnKey));
    };
    DataRow.prototype.getColumnCount = function () {
        return this.getColumnKeys().length;
    };
    DataRow.prototype.getColumnKeys = function () {
        return Object.keys(this.columns);
    };
    DataRow.prototype.insertColumn = function (columnKey, columnValue) {
        var row = this;
        var succeeded = false;
        if (columnKey === 'id' ||
            row.getColumnKeys().indexOf(columnKey) !== -1) {
            return succeeded;
        }
        fireEvent(row, 'insertColumn', { columnKey: columnKey, columnValue: columnValue }, function () {
            row.columns[columnKey] = columnValue;
            succeeded = true;
            fireEvent(row, 'afterInsertColumn', { columnKey: columnKey, columnValue: columnValue });
        });
        return succeeded;
    };
    DataRow.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    DataRow.prototype.toJSON = function () {
        var columns = this.getAllColumns();
        var columnKeys = Object.keys(columns);
        var json = { id: this.id };
        var key;
        var value;
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
        var succeeded = false;
        if (columnKey === 'id') {
            return succeeded;
        }
        fireEvent(row, 'updateColumn', { columnKey: columnKey, columnValue: columnValue }, function () {
            row.columns[columnKey] = columnValue;
            succeeded = true;
            fireEvent(row, 'afterUpdateColumn', { columnKey: columnKey, columnValue: columnValue });
        });
        return succeeded;
    };
    return DataRow;
}());
export default DataRow;
