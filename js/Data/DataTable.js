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
var DataTable = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function DataTable(dataSet) {
        this.dataSet = dataSet;
        this.absoluteLength = dataSet.length;
        this.relativeLength = dataSet.length;
        this.relativeStart = 0;
    }
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
    DataTable.prototype.getAbsolute = function (index) {
        return this.dataSet[index];
    };
    DataTable.prototype.getRelative = function (index) {
        return this.dataSet[this.absolutePosition(index)];
    };
    DataTable.prototype.setAbsolute = function (dataRow, index) {
        if (index === void 0) { index = this.absoluteLength; }
        this.dataSet[index] = dataRow;
        ++this.absoluteLength;
        return this;
    };
    DataTable.prototype.setRelative = function (dataRow, index) {
        if (index === void 0) { index = this.relativeLength; }
        this.dataSet[this.absolutePosition(index)] = dataRow;
        ++this.absoluteLength;
        ++this.relativeLength;
        return this;
    };
    return DataTable;
}());
export default DataTable;
