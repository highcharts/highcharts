/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/* *
 *
 *  Imports
 *
 * */
import U from '../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Static class to manage JSON-based conversion of registered classes. It
 * provides static methods to register classes, that can convert their instance
 * to JSON and can create instances from JSON.
 */
var DataJSON = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Private constructor to make the class static without instances.
     */
    function DataJSON() {
        // prevents instantiation, therefor static only
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Adds a class to the registry. The class has to provide two methods to
     * convert JSON to a class instance (`public static fromJSON`) and to
     * convert a class instance to JSON (`public toJSON`).
     *
     * @param {DataJSON.ClassType} classType
     * Class type (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a class registered with this name.
     */
    DataJSON.addClass = function (classType) {
        var className = DataJSON.getName(classType), registry = DataJSON.registry;
        if (!className || registry[className]) {
            return false;
        }
        registry[className] = classType;
        return true;
    };
    /**
     * Converts JSON to the matching class and returns an instance.
     *
     * @param {DataJSON.ClassJSON} json
     * Class JSON to convert to a class instance.
     *
     * @return {DataJSON.Class|undefined}
     * Returns a class instance of the JSON, if the matching class was found in
     * the registry, otherwise `undefined`.
     */
    DataJSON.fromJSON = function (json) {
        var classType = DataJSON.registry[json.$class];
        if (!classType) {
            return;
        }
        return classType.fromJSON(json);
    };
    /**
     * Returns all registered class names.
     *
     * @return {Array<string>}
     * All registered class names.
     */
    DataJSON.getAllClassNames = function () {
        return Object.keys(DataJSON.registry);
    };
    /**
     * Returns a copy of the class registry as record object with class names
     * and their class type.
     *
     * @return {DataJSON.ClassRegistry}
     * Copy of the class registry.
     */
    DataJSON.getAllClassTypes = function () {
        return merge(DataJSON.registry);
    };
    /**
     * Returns a class type (aka class constructor) of the given class name.
     *
     * @param {string} name
     * Registered class name of the class.
     *
     * @return {DataJSON.ClassType|undefined}
     * Class type, if the class name was found, otherwise `undefined`.
     */
    DataJSON.getClass = function (name) {
        return DataJSON.registry[name];
    };
    /**
     * Extracts the class name from a given class type.
     *
     * @param {DataJSON.ClassType} classType
     * Class type to extract the name from.
     *
     * @return {string}
     * Class name, if the extraction was successful, otherwise an empty string.
     */
    DataJSON.getName = function (classType) {
        return (classType.toString().match(DataJSON.nameRegExp) ||
            ['', ''])[1];
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Regular expression to extract the class name (group 1) from the
     * stringified class type.
     */
    DataJSON.nameRegExp = /^function\s+(\w*?)\s*\(/;
    /**
     * Registry as a record object with class names and their class.
     */
    DataJSON.registry = {};
    return DataJSON;
}());
export default DataJSON;
