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
import DataTable from './DataTable.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent;
var DataStore = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function DataStore(table) {
        if (table === void 0) { table = new DataTable(); }
        this.table = table;
        this.metadata = [];
    }
    /* *
    *
    *  Functions
    *
    * */
    DataStore.prototype.describeColumn = function (name, metadata) {
        this.metadata.push({
            name: name,
            metadata: metadata
        });
    };
    DataStore.prototype.describe = function (metadata) {
        this.metadata = metadata;
    };
    DataStore.prototype.load = function () {
        fireEvent(this, 'afterLoad', { table: this.table });
    };
    DataStore.prototype.whatIs = function (name) {
        var metadata = this.metadata;
        var i;
        for (i = 0; i < metadata.length; i++) {
            if (metadata[i].name === name) {
                return metadata[i];
            }
        }
    };
    DataStore.prototype.on = function (event, callback) {
        return addEvent(this, event, callback);
    };
    return DataStore;
}());
export default DataStore;
