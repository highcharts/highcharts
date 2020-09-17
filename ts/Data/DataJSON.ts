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
const {
    merge
} = U;

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
class DataJSON {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Regular expression to extract the class name (group 1) from the
     * stringified class type.
     */
    private static readonly nameRegExp = /^function\s+(\w*?)\s*\(/;

    /**
     * Registry as a record object with class names and their class.
     */
    private static readonly registry: DataJSON.ClassRegistry = {};

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
    public static addClass(classType: DataJSON.ClassType): boolean {
        const className = DataJSON.getName(classType),
            registry = DataJSON.registry;

        if (!className || registry[className]) {
            return false;
        }

        registry[className] = classType;

        return true;
    }

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
    public static fromJSON(json: DataJSON.ClassJSON): (DataJSON.Class|undefined) {

        const classType = DataJSON.registry[json.$class];

        if (!classType) {
            return;
        }

        return classType.fromJSON(json);
    }

    /**
     * Returns all registered class names.
     *
     * @return {Array<string>}
     * All registered class names.
     */
    public static getAllClassNames(): Array<string> {
        return Object.keys(DataJSON.registry);
    }

    /**
     * Returns a copy of the class registry as record object with class names
     * and their class type.
     *
     * @return {DataJSON.ClassRegistry}
     * Copy of the class registry.
     */
    public static getAllClassTypes(): DataJSON.ClassRegistry {
        return merge(DataJSON.registry);
    }

    /**
     * Returns a class type (aka class constructor) of the given class name.
     *
     * @param {string} name
     * Registered class name of the class.
     *
     * @return {DataJSON.ClassType|undefined}
     * Class type, if the class name was found, otherwise `undefined`.
     */
    public static getClass(name: string): (DataJSON.ClassType|undefined) {
        return DataJSON.registry[name];
    }

    /**
     * Extracts the class name from a given class type.
     *
     * @param {DataJSON.ClassType} classType
     * Class type to extract the name from.
     *
     * @return {string}
     * Class name, if the extraction was successful, otherwise an empty string.
     */
    public static getName(classType: DataJSON.ClassType): string {
        return (
            classType.toString().match(DataJSON.nameRegExp) ||
            ['', '']
        )[1];
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Private constructor to make the class static without instances.
     */
    private constructor() {
        // prevents instantiation, therefor static only
    }

}

/**
 * Additionally provided types for JSON-compatible types, and
 * registry-compatible classes.
 */
namespace DataJSON {

    /**
     * Describes the instance of a class type, that is compatible to the class
     * registry.
     */
    export interface Class {
        /**
         * Converts the class instance to a class JSON.
         *
         * @return {DataJSON.ClassJSON}
         * Class JSON of this class instance.
         */
        toJSON(): DataJSON.ClassJSON;
    }

    /**
     * Interface of the class JSON to convert to class instances.
     */
    export interface ClassJSON extends JSONObject {
        /**
         * Regsitered name of the class.
         */
        $class: string;
    }

    /**
     * Describes the class registry as a record object with class name and their
     * class types (aka class constructor).
     */
    export interface ClassRegistry extends Record<string, ClassType> {
        // nothing here yet
    }

    /**
     * Describes structure of a class type, that is compatible to the class
     * registry.
     */
    export interface ClassType {
        /**
         * Constructor function.
         */
        constructor: Function;
        /**
         * Structure of the constructor instance.
         */
        prototype: Class;
        /**
         * Converts a supported class JSON to a class instance.
         *
         * @param {DataJSON.ClassJSON} json
         * Class JSON to convert to a class instance.
         *
         * @return {DataJSON.Class}
         * Class JSON from the class JSON.
         */
        fromJSON(json: DataJSON.ClassJSON): (Class|undefined);
    }

    /**
     * Type structor of arrays as it is supported in JSON.
     */
    export interface JSONArray extends globalThis.Array<(JSONPrimitive|JSONType)> {
        [index: number]: (JSONPrimitive|JSONType);
    }

    /**
     * Type structure of a record object as it is supported in JSON.
     */
    export interface JSONObject {
        [key: string]: (JSONPrimitive|JSONType);
    }

    /**
     * All primitive types, that are supported in JSON.
     */
    export type JSONPrimitive = (boolean|number|string|null|undefined);

    /**
     * All object types, that are supported in JSON.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export type JSONType = (JSONArray|JSONObject|JSONPrimitive);

}

export default DataJSON;
