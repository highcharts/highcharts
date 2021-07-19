/* *
 *
 *  (c) 2020 - 2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type CoreJSON from '../Core/JSON';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Interface to convert objects from and to JSON.
 *
 * @interface Serializable
 */
interface Serializable<T, TJSON extends Serializable.JSON<string>> {

    /**
     * Converts the given JSON to a class instance.
     *
     * @function Serializable.fromJSON
     *
     * @param {Serializable.JSON} json
     * JSON to deserialize as a class instance or object.
     *
     * @return {AnyRecord}
     * Returns the class instance or object, or throws an exception.
     */
    fromJSON(json: TJSON): T;

    /**
     * Validates the given class instance for JSON support.
     *
     * @function Serializable.jsonSupportFor
     *
     * @param {AnyRecord} obj
     * Class instance or object to validate.
     *
     * @return {boolean}
     * Returns true, if the function set can convert the given object, otherwise
     * false.
     */
    jsonSupportFor?(obj: AnyRecord): obj is T;

    /**
     * Converts the given class instance to JSON.
     *
     * @function Serializable.toJSON
     *
     * @param {AnyRecord} obj
     * Class instance or object to serialize as JSON.
     *
     * @return {Serializable.JSON}
     * Returns the JSON of the class instance or object.
     */
    toJSON(obj?: T): TJSON;

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Contains the toolset to serialize classes to JSON and deserialize classes
 * from JSON.
 * @private
 */
namespace Serializable {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON<T extends string> extends CoreJSON.Object {
        $class: T;
    }

    /* *
     *
     *  Constants
     *
     * */

    /**
     * The registry of serializable classes and function sets.
     */
    const registry: Record<string, Serializable<AnyRecord, JSON<string>>> = {};

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates a class instance from the given JSON, if a suitable serializer
     * has been found.
     *
     * @function Serializer.fromJSON
     *
     * @param {AnyRecord} json
     * JSON to create a class instance or object from.
     *
     * @return {AnyRecord}
     * Returns the class instance or object, or throws an exception.
     */
    export function fromJSON(
        json: AnyRecord
    ): AnyRecord {
        const $class: string = json.$class;

        if (typeof $class !== 'string') {
            throw new Error('JSON has no $class property.');
        }

        const serializer = registry[$class];

        if (serializer) {
            return serializer.fromJSON(json as JSON<string>);
        }

        throw new Error(`Serializer for '${$class}' not found.`);
    }

    /**
     * Registers a class prototype or function set for the given JSON $class.
     *
     * @function Serializable.register
     *
     * @param {string} $class
     * JSON $class to register for.
     *
     * @param {Serializable<AnyRecord>} classPrototypeOrFunctionSet
     * Class or function set to register.
     */
    export function register<T, TJSON extends JSON<string>>(
        $class: TJSON['$class'],
        classPrototypeOrFunctionSet: Serializable<T, TJSON>
    ): void {

        if (registry[$class]) {
            throw new Error(`A serializer for '${$class}' is already registered.`);
        }

        registry[$class] = classPrototypeOrFunctionSet;
    }

    export function toJSON<T, TJSON extends JSON<string>>(
        obj: Serializable<T, TJSON>
    ): TJSON;
    export function toJSON(
        obj: AnyRecord
    ): JSON<string>;
    /**
     * Creates JSON from a class instance.
     *
     * @function Serializable.serialize
     *
     * @param {AnyRecord} obj
     * Class instance or object to serialize as JSON.
     *
     * @return {Serializable.JSON}
     * JSON of the class instance.
     */
    export function toJSON(
        obj: AnyRecord
    ): JSON<string> {

        if (
            typeof obj.fromJSON === 'function' &&
            typeof obj.toJSON === 'function'
        ) {
            return obj.toJSON();
        }

        const classes = Object.keys(registry),
            numberOfClasses = classes.length;

        let $class: string,
            serializer: Serializable<AnyRecord, JSON<string>>;

        for (let i = 0; i < numberOfClasses; ++i) {
            $class = classes[i];
            serializer = registry[$class];
            if (
                (serializer.jsonSupportFor) &&
                serializer.jsonSupportFor(obj)
            ) {
                return serializer.toJSON(obj);
            }
        }

        throw new Error('Object is not supported.');
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Serializable;
