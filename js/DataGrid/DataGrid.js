/* *
 *
 *  Data Grid
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../Core/Globals.js';
var doc = H.doc;
import U from '../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
var DataGrid = /** @class */ (function () {
    function DataGrid(container, options) {
        if (typeof container === 'string') {
            container = doc.getElementById(container) || doc.createElement('div');
        }
        this.container = container;
        this.options = merge(DataGrid.defaultOptions, options);
    }
    /* *
     *
     *  Static Properties
     *
     * */
    DataGrid.defaultOptions = {
    // nothing here yet
    };
    return DataGrid;
}());
export default DataGrid;
