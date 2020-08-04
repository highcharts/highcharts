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
    DataConverter.prototype.asBoolean = function (value) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value !== '' && value !== '0' && value !== 'false';
        }
        return this.asNumber(value) !== 0;
    };
    DataConverter.prototype.asDataTable = function (value) {
        if (value instanceof DataTable) {
            return value;
        }
        if (typeof value === 'string') {
            try {
                return DataTable.fromJSON(JSON.parse(value));
            }
            catch (error) {
                return new DataTable();
            }
        }
        return new DataTable();
    };
    DataConverter.prototype.asDate = function (value) {
        if (typeof value === 'string') {
            return new Date(value);
        }
        return new Date(this.asNumber(value));
    };
    DataConverter.prototype.asNumber = function (value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (typeof value === 'string') {
            return parseFloat("0" + value);
        }
        if (value instanceof DataTable) {
            return value.getRowCount();
        }
        if (value instanceof Date) {
            return value.getDate();
        }
        return 0;
    };
    DataConverter.prototype.asString = function (value) {
        return "" + value;
    };
    return DataConverter;
}());
export default DataConverter;
