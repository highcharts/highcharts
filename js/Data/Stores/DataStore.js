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
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
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
     *  Static Functions
     *
     * */
    DataStore.getMetadataFromJSON = function (metadataJSON) {
        var metadata = [];
        var elem;
        for (var i = 0, iEnd = metadataJSON.length; i < iEnd; i++) {
            elem = metadataJSON[i];
            if (elem instanceof Array && typeof elem[0] === 'string') {
                metadata.push({
                    name: elem[0],
                    metadata: elem[1]
                });
            }
        }
        return metadata;
    };
    /* *
    *
    *  Functions
    *
    * */
    DataStore.prototype.getMetadataJSON = function () {
        var json = [];
        var elem;
        for (var i = 0, iEnd = this.metadata.length; i < iEnd; i++) {
            elem = this.metadata[i];
            json.push([
                elem.name,
                elem.metadata
            ]);
        }
        return json;
    };
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
