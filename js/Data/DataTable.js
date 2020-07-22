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
import DataRow from './DataRow.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, uniqueKey = U.uniqueKey;
/** eslint-disable valid-jsdoc */
/**
 * @private
 */
var DataTable = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function DataTable(rows) {
        if (rows === void 0) { rows = []; }
        this.id = uniqueKey();
        this.rows = rows.slice();
        this.rowsIdMap = {};
        this.watchsIdMap = {};
        var rowsIdMap = this.rowsIdMap = {};
        var row;
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            rowsIdMap[row.id] = row;
            this.insert(row);
        }
    }
    /* *
     *
     *  Static Functions
     *
     * */
    DataTable.parse = function (json) {
        try {
            var rows = [];
            for (var i = 0, iEnd = json.length; i < iEnd; ++i) {
                rows[i] = DataTable.parseRow(json[i]);
            }
            return new DataTable(rows);
        }
        catch (error) {
            return new DataTable();
        }
    };
    DataTable.parseRow = function (json) {
        var columns = { id: uniqueKey() };
        var keys = Object.keys(json);
        var key;
        var value;
        while (typeof (key = keys.pop()) !== 'undefined') {
            value = json[key];
            if (value instanceof Array) {
                columns[key] = DataTable.parse(value);
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
    DataTable.prototype.clear = function () {
        var rowIds = this.getRowIds();
        for (var i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.delete(rowIds[i]);
        }
    };
    DataTable.prototype.delete = function (id) {
        var table = this;
        var row = table.rowsIdMap[id];
        var rowId = row.id;
        var index = table.rows.indexOf(row);
        fireEvent(table, 'deleteRow', { index: index, row: row }, function () {
            table.rows[index] = row;
            delete table.rowsIdMap[rowId];
            table.unwatch(rowId);
            fireEvent(table, 'afterDeleteRow', { index: index, row: row });
        });
        return row;
    };
    DataTable.prototype.getAllRows = function () {
        return this.rows.slice();
    };
    DataTable.prototype.getById = function (id) {
        return this.rowsIdMap[id];
    };
    DataTable.prototype.getByIndex = function (index) {
        return this.rows[index];
    };
    /**
     * @todo Consider implementation via property getter `.length` depending on
     *       browser support.
     * @return {number}
     * Number of rows in this table.
     */
    DataTable.prototype.getRowCount = function () {
        return this.rows.length;
    };
    DataTable.prototype.getRowIds = function () {
        return Object.keys(this.rowsIdMap);
    };
    DataTable.prototype.getVersionId = function () {
        return this.versionId || (this.versionId = uniqueKey());
    };
    DataTable.prototype.insert = function (row) {
        var table = this;
        var index = table.rows.length;
        if (typeof table.rowsIdMap[row.id] !== 'undefined') {
            return false;
        }
        fireEvent(table, 'insertRow', { index: index, row: row }, function () {
            table.rows.push(row);
            table.rowsIdMap[row.id] = row;
            table.watch(row);
            fireEvent(table, 'afterInsertRow', { index: index, row: row });
        });
        return true;
    };
    DataTable.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    DataTable.prototype.watch = function (row) {
        var table = this;
        var index = table.rows.indexOf(row);
        var watchsIdMap = table.watchsIdMap;
        watchsIdMap[row.id] = row.on('afterUpdateColumn', function () {
            table.versionId = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { index: index, row: row });
        });
    };
    DataTable.prototype.toString = function () {
        return JSON.stringify(this.rows);
    };
    DataTable.prototype.unwatch = function (rowId) {
        var watchsIdMap = this.watchsIdMap;
        if (watchsIdMap[rowId]) {
            watchsIdMap[rowId]();
            delete watchsIdMap[rowId];
        }
    };
    return DataTable;
}());
export default DataTable;
