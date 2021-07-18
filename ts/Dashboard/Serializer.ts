/* *
 *
 *  Highsoft Dashboards
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

import DataTableSerializer from './DataTableSerializer.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Interface to convert objects from and to JSON.
 */
interface Serializer<T> {

    /**
     * Converts the given JSON to a class instance.
     *
     * @param {Serializer.JSON} json
     * JSON to deserialize as a class instance or object.
     *
     * @return {AnyRecord}
     * Returns the class instance or object, or throws an exception.
     */
    fromJSON(json: Serializer.JSON): T;

    /**
     * Validates the given class instance for JSON support.
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
     * @param {AnyRecord} obj
     * Class instance or object to serialize as JSON.
     *
     * @return {Serializer.JSON}
     * Returns the JSON of the class instance or object.
     */
    toJSON(obj?: T): Serializer.JSON;

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Contains the toolset to serialize classes to JSON and deserialize classes
 * from JSON.
 */
namespace Serializer {

    /* *
     *
     *  Declarations
     *
     * */

    export interface JSON extends CoreJSON.Object {
        $class: string;
    }

    /* *
     *
     *  Constants
     *
     * */

    const registry: Record<string, Serializer<AnyRecord>> = {};

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
            return serializer.fromJSON(json as JSON);
        }

        throw new Error(`Serializer for '${$class}' not found.`);
    }

    /**
     * Registers a class prototype or function set for the given JSON $class.
     *
     * @function Serializer.register
     *
     * @param {string} $class
     * JSON $class to register for.
     *
     * @param {Serializer<AnyRecord>} serializer
     * Class or function set to register.
     */
    export function register(
        $class: string,
        serializer: Serializer<AnyRecord>
    ): void {

        if (registry[$class]) {
            throw new Error(`A serializer for '${$class}' is already registered.`);
        }

        registry[$class] = serializer;
    }

    /**
     * Creates JSON from a class instance.
     *
     * @function JSONRegistry.serialize
     *
     * @param {AnyRecord} obj
     * Class instance or object to serialize as JSON.
     *
     * @return {Serializer.JSON}
     * JSON of the class instance.
     */
    export function toJSON(
        obj: AnyRecord
    ): JSON {

        if (
            typeof obj.fromJSON === 'function' &&
            typeof obj.toJSON === 'function'
        ) {
            return obj.toJSON();
        }

        const classes = Object.keys(registry),
            numberOfClasses = classes.length;

        let $class: string,
            serializer: Serializer<AnyRecord>;

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
 *  Registry
 *
 * */

Serializer.register('DataTable', DataTableSerializer);

/* *
 *
 *  Default Export
 *
 * */

export default Serializer;
