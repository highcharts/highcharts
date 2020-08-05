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
import U from '../Core/Utilities.js';
var merge = U.merge;
var DataJSON = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function DataJSON() {
        // prevents instantiation, therefor static only
    }
    /* *
     *
     *  Static Functions
     *
     * */
    DataJSON.addClass = function (dataClassType) {
        var dataClassName = dataClassType.$class, registry = DataJSON.registry;
        if (!dataClassName ||
            registry[dataClassName]) {
            return false;
        }
        registry[dataClassName] = dataClassType;
        return true;
    };
    DataJSON.fromJSON = function (json) {
        var dataClassType = DataJSON.registry[json.$class];
        if (!dataClassType) {
            return;
        }
        return dataClassType.fromJSON(json);
    };
    DataJSON.getAllClassNames = function () {
        return Object.keys(DataJSON.registry);
    };
    DataJSON.getAllClassTypes = function () {
        return merge(DataJSON.registry);
    };
    DataJSON.getClass = function (dataClassType) {
        return DataJSON.registry[dataClassType];
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataJSON.registry = {};
    return DataJSON;
}());
export default DataJSON;
