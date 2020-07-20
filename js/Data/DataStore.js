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
/** eslint-disable valid-jsdoc */
/**
 * @private
 */
var DataStore = /** @class */ (function () {
    function DataStore() {
    }
    /* *
     *
     *  Constructors
     *
     * */
    /*public constructor(dataSet: DataTable.Set<T>) {
        this.dataSet = dataSet;
        this.absoluteLength = dataSet.length;
        this.relativeLength = dataSet.length;
        this.relativeStart = 0;
    }*/
    /* *
     *
     *  Properties
     *
     * */
    /*private dataSet: DataTable.Set<T>;

    public absoluteLength: number;

    public relativeLength: number;

    public relativeStart: number;*/
    /* *
     *
     *  Functions
     *
     * */
    DataStore.prototype.rows = function () {
    };
    DataStore.prototype.describeColumn = function (name) {
    };
    DataStore.prototype.describe = function (name) {
    };
    DataStore.prototype.whatIs = function (name) {
        return name;
    };
    DataStore.prototype.insert = function (rowData) {
    };
    DataStore.prototype.update = function (RowID) {
    };
    DataStore.prototype.getRowByIndex = function (rowIndex) {
    };
    DataStore.prototype.getRowByID = function (rowID) {
    };
    DataStore.prototype.removeRow = function (rowID) {
    };
    DataStore.prototype.clear = function () {
    };
    DataStore.prototype.sort = function () {
    };
    DataStore.prototype.modify = function (dataModifierChain) {
    };
    DataStore.prototype.on = function (eventName, callback) {
    };
    return DataStore;
}());
export default DataStore;
