/* *
 *
 *  Imports
 *
 * */

import type CoreJSON from '../Core/JSON';

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

    export interface Class {
        fromJSON(json: JSON): object;
    }

    export interface Helper extends Class, Object {
        $class: string;
    }

    export interface JSON extends CoreJSON.Object {
        $class: string;
    }

    export interface Object {
        toJSON(): JSON;
    }

    /* *
     *
     *  Constants
     *
     * */

    const classRegistry: Record<string, Class> = {};

    const helperRegistry: Record<string, Helper> = {};

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds a compatible class with a static fromJSON function to the registry.
     *
     * @function Serializer.addClass
     *
     * @param {Serializer.Class} Class
     * Class to register.
     */
    export function addClass(
        Class: Class
    ): void {
        const $class = (/function (\w+)/.exec(`${Class}`) || [])[1];

        if (classRegistry[$class]) {
            throw new Error(`A class '${$class}' is already registered.`);
        }

        classRegistry[$class] = Class;
    }

    /**
     * Creates a class instance from the given JSON, if the class is known.
     *
     * @function JSONRegistry.deserialize
     *
     * @param {JSONUtilities.ClassJSON} json
     * JSON to create a class instance from.
     *
     * @return {object}
     * Returns the class instance, or throws an exception.
     */
    export function fromJSON(
        json: JSON
    ): (object|undefined) {
        const $class = json.$class,
            Class = classRegistry[$class];

        if (Class) {
            return Class.fromJSON(json);
        }

        throw new Error(`Class '${$class}' unknown.`);
    }


    /**
     * Creates JSON from a class instance.
     *
     * @function JSONRegistry.serialize
     *
     * @param {AnyRecord} obj
     * Class instance (object) to serialize as JSON.
     *
     * @return {Serializer.JSON}
     * JSON of the class instance.
     */
    export function toJSON(
        obj: AnyRecord
    ): JSON {

        if (typeof obj.toJSON === 'function') {
            return obj.toJSON();
        }

        throw new Error('Object has no toJSON function.');
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Serializer;
