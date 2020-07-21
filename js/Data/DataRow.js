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
    DataRow.prototype.addColumn = function (key, value) {
        var row = this;
        if (row.getColumnKeys().indexOf(key) !== -1) {
            return false;
        }
        fireEvent(row, 'newColumn', { key: key, value: value }, function (e) {
            row.columns[e.key] = e.value;
        });
        return true;
    };
    DataRow.prototype.getColumn = function (key) {
        return this.columns[key];
    };
    DataRow.prototype.getColumnAsBoolean = function (key) {
        return this.converter.toBoolean(this.getColumn(key));
    };
    DataRow.prototype.getColumnAsDataTable = function (key) {
        return this.converter.toDataTable(this.getColumn(key));
    };
    DataRow.prototype.getColumnAsDate = function (key) {
        return this.converter.toDate(this.getColumn(key));
    };
    DataRow.prototype.getColumnAsNumber = function (key) {
        return this.converter.toNumber(this.getColumn(key));
    };
    DataRow.prototype.getColumnAsString = function (key) {
        return this.converter.toString(this.getColumn(key));
    };
    DataRow.prototype.getColumnKeys = function (unfiltered) {
        if (unfiltered === void 0) { unfiltered = false; }
        return Object.keys(this.columns).reverse();
    };
    DataRow.prototype.on = function (event, listener) {
        return addEvent(this, event, listener);
    };
    DataRow.prototype.removeColumn = function (key) {
        delete this.columns[key];
    };
    DataRow.prototype.setColumn = function (key, value) {
        var row = this;
        fireEvent(row, 'changeColumn', { key: key, value: value }, function (e) {
            row.columns[e.key] = e.value;
        });
    };
    return DataRow;
}());
export default DataRow;
