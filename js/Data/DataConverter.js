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
import DataTable from './DataTable.js';
/** eslint-disable valid-jsdoc */
var DataConverter = /** @class */ (function () {
    function DataConverter() {
    }
    /* *
     *
     *  Functions
     *
     * */
    DataConverter.prototype.toBoolean = function (value) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value !== '' && value !== '0' && value !== 'false';
        }
        value = this.toNumber(value);
        return value !== 0 && !isNaN(value);
    };
    DataConverter.prototype.toDataTable = function (value) {
        if (value instanceof DataTable) {
            return value;
        }
        if (typeof value === 'string') {
            try {
                return DataTable.parse(JSON.parse(value));
            }
            catch (error) {
                return new DataTable();
            }
        }
        return new DataTable();
    };
    DataConverter.prototype.toDate = function (value) {
        return new Date(this.toNumber(value));
    };
    DataConverter.prototype.toNumber = function (value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        if (value instanceof DataTable) {
            return value.absoluteLength;
        }
        if (value instanceof Date) {
            return value.getDate();
        }
        return NaN;
    };
    DataConverter.prototype.toString = function (value) {
        return "" + value;
    };
    return DataConverter;
}());
export default DataConverter;
