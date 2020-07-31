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
import U from '../Core/Utilities.js';
var addEvent = U.addEvent;
var DataStore = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function DataStore(dataSet) {
        this.rows = dataSet;
        this.metadata = [];
        this.length = this.rows.getRowCount();
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
