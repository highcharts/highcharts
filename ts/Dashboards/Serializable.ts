/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
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
interface Serializable<T extends AnyRecord, TJSON extends Serializable.JSON<string>> {

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
     * Converts the given class instance to JSON.
     *
     * @function Serializable.toJSON
     *
     * @return {Serializable.JSON}
     * Returns the JSON of the class instance or object.
     */
    toJSON(): TJSON;

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Contains the toolset to serialize class instance to JSON and deserialize JSON
 * to class instances.
 * @private
 */
namespace Serializable {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * @private
     */
    export interface Helper<T extends AnyRecord, TJSON extends Serializable.JSON<string>> {

        /**
         * @name Serializer.$class
         * @type {string}
         */
        $class: TJSON['$class'];

        /**
         * Converts the given JSON to an object.
         *
         * @function Serializer.fromJSON
         *
         * @param {Serializable.JSON} json
         * JSON to deserialize as an object.
         *
         * @return {AnyRecord}
         * Returns the object, or throws an exception.
         */
        fromJSON(json: TJSON): T;

        /**
         * Validates the given object for JSON support.
         *
         * @function Serializer.jsonSupportFor
         *
         * @param {AnyRecord} obj
         * Object to validate.
         *
         * @return {boolean}
         * Returns true, if the helper functions can convert the given object,
         * otherwise false.
         */
        jsonSupportFor(obj: AnyRecord): obj is T;

        /**
         * Converts the given object to JSON.
         *
         * @function Serializer.toJSON
         *
         * @param {AnyRecord} obj
         * Object to serialize as JSON.
         *
         * @return {Serializable.JSON}
         * Returns the JSON of the object.
         */
        toJSON(obj: T): TJSON;

    }

    /**
     * JSON of a serializable class.
     */
    export interface JSON<T extends string> extends CoreJSON.Object {
        $class: T;
    }

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Registry of serializable classes.
     */
    const classRegistry: Record<string, Serializable<AnyRecord, JSON<string>>> = {};

    /**
     * Registry of function sets.
     */
    const helperRegistry: Record<string, Helper<AnyRecord, JSON<string>>> = {};

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates a class instance from the given JSON, if a suitable serializer
     * has been found.
     *
     * @function Serializable.fromJSON
     *
     * @param {Serializable.JSON} json
     * JSON to create a class instance or object from.
     *
     * @return {AnyRecord}
     * Returns the class instance or object, or throws an exception.
     */
    export function fromJSON(
        json: JSON<string>
    ): AnyRecord {
        const $class: string = json.$class;

        if (typeof $class !== 'string') {
            throw new Error('JSON has no $class property.');
        }

        const classs = classRegistry[$class];

        if (classs) {
            return classs.fromJSON(json);
        }

        const helper = helperRegistry[$class];

        if (helper) {
            return helper.fromJSON(json);
        }

        throw new Error(`'${$class}' unknown.`);
    }

    /**
     * Registers a class prototype for the given JSON $class.
     *
     * @function Serializable.registerClassPrototype
     *
     * @param {string} $class
     * JSON $class to register for.
     *
     * @param {Serializable} classPrototype
     * Class to register.
     */
    export function registerClassPrototype<
        T extends AnyRecord, TJSON extends JSON<string>>(
        $class: TJSON['$class'],
        classPrototype: Serializable<T, TJSON>
    ): void {

        if (classRegistry[$class]) {
            throw new Error(
                'A serializer for \'' + $class + '\' is already registered.'
            );
        }

        classRegistry[$class] = classPrototype;
    }

    /**
     * Registers helper functions for the given JSON $class.
     *
     * @function Serializable.registerHelper
     *
     * @param {Helper} helperFunctions
     * Helper functions to register.
     */
    export function registerHelper<
        T extends AnyRecord, TJSON extends JSON<string>>(
        helperFunctions: Helper<T, TJSON>
    ): void {

        if (helperRegistry[helperFunctions.$class]) {
            throw new Error(
                'A serializer for \'' + helperFunctions.$class +
                '\' is already registered.'
            );
        }

        helperRegistry[helperFunctions.$class] = helperFunctions;
    }

    export function toJSON<T extends AnyRecord, TJSON extends JSON<string>>(
        obj: Serializable<T, TJSON>
    ): TJSON;
    export function toJSON(
        obj: AnyRecord
    ): JSON<string>;
    /**
     * Creates JSON from a class instance.
     *
     * @function Serializable.toJSON
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

        const classes = Object.keys(helperRegistry),
            numberOfHelpers = classes.length;

        let $class: string,
            serializer: Helper<AnyRecord, JSON<string>>;

        for (let i = 0; i < numberOfHelpers; ++i) {
            $class = classes[i];
            serializer = helperRegistry[$class];
            if (serializer.jsonSupportFor(obj)) {
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
