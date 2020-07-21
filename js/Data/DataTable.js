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
var fireEvent = U.fireEvent, uniqueKey = U.uniqueKey;
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
        this.rows = rows;
        this.absoluteLength = rows.length;
        this.relativeLength = rows.length;
        this.relativeStart = 0;
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
    DataTable.prototype.absolutePosition = function (relativeIndex) {
        if (relativeIndex < 0 &&
            this.relativeStart < Math.abs(relativeIndex)) {
            return this.absoluteLength + this.relativeStart + relativeIndex;
        }
        return this.relativeStart + relativeIndex;
    };
    DataTable.prototype.clear = function () {
        this.rows.length = 0;
    };
    DataTable.prototype.getAbsolute = function (index) {
        return this.rows[index];
    };
    DataTable.prototype.getRelative = function (index) {
        return this.rows[this.absolutePosition(index)];
    };
    DataTable.prototype.getVersion = function () {
        return this.version || (this.version = 0);
    };
    DataTable.prototype.setAbsolute = function (dataRow, index) {
        if (index === void 0) { index = this.absoluteLength; }
        var table = this;
        fireEvent(table, 'newDataRow', { dataRow: dataRow, index: index }, function (e) {
            table.rows[e.index] = e.dataRow;
            table.absoluteLength = table.rows.length;
        });
        return index;
    };
    DataTable.prototype.setRelative = function (dataRow, index) {
        if (index === void 0) { index = this.relativeLength; }
        var table = this;
        index = table.absolutePosition(index);
        fireEvent(table, 'newDataRow', { dataRow: dataRow, index: index }, function (e) {
            table.rows[e.index] = e.dataRow;
            table.absoluteLength = table.rows.length;
            ++table.relativeLength;
        });
        return index;
    };
    DataTable.prototype.toString = function () {
        return JSON.stringify(this.rows);
    };
    return DataTable;
}());
export default DataTable;
