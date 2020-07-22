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
var GoogleDataStore = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function GoogleDataStore(dataSet) {
        this.rows = dataSet;
        this.metadata = [];
        this.length = this.rows.getRowCount();
    }
    /* *
    *
    *  Functions
    *
    * */
    GoogleDataStore.prototype.describeColumn = function (name, metadata) {
        this.metadata.push({
            name: name,
            metadata: metadata
        });
    };
    GoogleDataStore.prototype.describe = function (metadata) {
        this.metadata = metadata;
    };
    GoogleDataStore.prototype.whatIs = function (name) {
        var metadata = this.metadata;
        var i;
        for (i = 0; i < metadata.length; i++) {
            if (metadata[i].name === name) {
                return metadata[i];
            }
        }
    };
    GoogleDataStore.prototype.on = function (event, callback) {
    };
    return GoogleDataStore;
}());
export default GoogleDataStore;
