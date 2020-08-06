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
import DataJSON from './DataJSON.js';
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
    DataTable.fromJSON = function (json) {
        var rows = json.rows, dataRows = [];
        try {
            for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
                dataRows[i] = DataRow.fromJSON(rows[i]);
            }
            return new DataTable(dataRows);
        }
        catch (error) {
            return new DataTable();
        }
    };
    /* *
     *
     *  Functions
     *
     * */
    DataTable.prototype.clear = function () {
        this.emit('clearTable', {});
        var rowIds = this.getRowIds();
        for (var i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.unwatchRow(rowIds[i], true);
        }
        this.rows.length = 0;
        this.rowsIdMap = {};
        this.watchsIdMap = {};
        this.emit('afterClearTable', {});
    };
    DataTable.prototype.deleteRow = function (id) {
        var row = this.rowsIdMap[id], rowId = row.id, index = this.rows.indexOf(row);
        this.emit('deleteRow', { index: index, row: row });
        this.rows[index] = row;
        delete this.rowsIdMap[rowId];
        this.unwatchRow(rowId);
        this.emit('afterDeleteRow', { index: index, row: row });
        return row;
    };
    DataTable.prototype.emit = function (type, e) {
        fireEvent(this, type, e);
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
        var rowId = row.id;
        var index = this.rows.length;
        if (typeof this.rowsIdMap[rowId] !== 'undefined') {
            return false;
        }
        this.emit('insertRow', { index: index, row: row });
        this.rows.push(row);
        this.rowsIdMap[rowId] = row;
        this.watchRow(row);
        this.emit('afterInsertRow', { index: index, row: row });
        return true;
    };
    DataTable.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    DataTable.prototype.watchRow = function (row) {
        var table = this, index = table.rows.indexOf(row), watchsIdMap = table.watchsIdMap, watchs = [];
        /** @private */
        function callback() {
            table.versionId = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { index: index, row: row });
        }
        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteColumn', callback));
        watchs.push(row.on('afterInsertColumn', callback));
        watchs.push(row.on('afterUpdateColumn', callback));
        watchsIdMap[row.id] = watchs;
    };
    DataTable.prototype.toJSON = function () {
        var json = {
            $class: 'DataTable',
            rows: []
        };
        var rows = this.rows;
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            json.rows.push(rows[i].toJSON());
        }
        return json;
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
DataJSON.addClass(DataTable);
export default DataTable;
