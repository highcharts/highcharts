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
    DataJSON.addClass = function (classType) {
        var className = DataJSON.getName(classType), registry = DataJSON.registry;
        if (!className || registry[className]) {
            return false;
        }
        registry[className] = classType;
        return true;
    };
    DataJSON.fromJSON = function (json) {
        var classType = DataJSON.registry[json.$class];
        if (!classType) {
            return;
        }
        return classType.fromJSON(json);
    };
    DataJSON.getAllClassNames = function () {
        return Object.keys(DataJSON.registry);
    };
    DataJSON.getAllClassTypes = function () {
        return merge(DataJSON.registry);
    };
    DataJSON.getClass = function (className) {
        return DataJSON.registry[className];
    };
    DataJSON.getName = function (classType) {
        return (classType.toString().match(DataJSON.nameRegExp) ||
            ['', ''])[1];
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataJSON.nameRegExp = /^function\s+(\w*?)\s*\(/;
    DataJSON.registry = {};
    return DataJSON;
}());
export default DataJSON;
