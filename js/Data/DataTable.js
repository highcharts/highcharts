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
        var rowsIdMap = {};
        var row;
        rows = rows.slice();
        this.id = uniqueKey();
        this.rows = rows;
        this.rowsIdMap = rowsIdMap;
        this.watchsIdMap = {};
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            rowsIdMap[row.id] = row;
            this.watchRow(row);
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
        var columns = {};
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
        var table = this;
        var row = table.getRow(0);
        var index = 0;
        fireEvent(table, 'clearTable', { index: index, row: row }, function () {
            var rowIds = table.getRowIds();
            for (var i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
                table.unwatchRow(rowIds[i], true);
            }
            table.rows.length = 0;
            table.rowsIdMap = {};
            table.watchsIdMap = {};
            fireEvent(table, 'afterClearTable', { index: index, row: row });
        });
    };
    DataTable.prototype.deleteRow = function (id) {
        var table = this;
        var row = table.rowsIdMap[id];
        var index = table.rows.indexOf(row);
        var result;
        fireEvent(table, 'deleteRow', { index: index, row: row }, function () {
            var rowId = row.id;
            table.rows[index] = row;
            delete table.rowsIdMap[rowId];
            table.unwatchRow(rowId);
            result = row;
            fireEvent(table, 'afterDeleteRow', { index: index, row: row });
        });
        return result;
    };
    DataTable.prototype.getAllRows = function () {
        return this.rows.slice();
    };
    DataTable.prototype.getRow = function (indexOrID) {
        if (typeof indexOrID === 'string') {
            return this.rowsIdMap[indexOrID];
        }
        return this.rows[indexOrID];
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
    DataTable.prototype.insertRow = function (row) {
        var table = this;
        var rowId = row.id;
        var index = table.rows.length;
        var succeeded = false;
        if (typeof table.rowsIdMap[rowId] !== 'undefined') {
            return succeeded;
        }
        fireEvent(table, 'insertRow', { index: index, row: row }, function () {
            table.rows.push(row);
            table.rowsIdMap[rowId] = row;
            table.watchRow(row);
            succeeded = true;
            fireEvent(table, 'afterInsertRow', { index: index, row: row });
        });
        return succeeded;
    };
    DataTable.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    DataTable.prototype.watchRow = function (row) {
        /** @private */
        function callback() {
            table.versionId = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { index: index, row: row });
        }
        var table = this;
        var index = table.rows.indexOf(row);
        var watchsIdMap = table.watchsIdMap;
        var watchs = [];
        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteColumn', callback));
        watchs.push(row.on('afterInsertColumn', callback));
        watchs.push(row.on('afterUpdateColumn', callback));
        watchsIdMap[row.id] = watchs;
    };
    DataTable.prototype.toString = function () {
        return JSON.stringify(this.rows);
    };
    DataTable.prototype.unwatchRow = function (rowId, skipDelete) {
        var watchsIdMap = this.watchsIdMap;
        var watchs = watchsIdMap[rowId] || [];
        for (var i = 0, iEnd = watchs.length; i < iEnd; ++i) {
            watchs[i]();
        }
        if (!skipDelete) {
            delete watchsIdMap[rowId];
        }
    };
    return DataTable;
}());
export default DataTable;
