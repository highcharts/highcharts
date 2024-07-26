/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import U from '../Core/Utilities.js';
const {
    error: coreError,
    isClass,
    isDOMElement,
    isObject,
    objectEach,
    uniqueKey: coreUniqueKey
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Utility function to deep merge two or more objects and return a third object.
 * If the first argument is true, the contents of the second object is copied
 * into the first object. The merge function can also be used with a single
 * object argument to create a deep copy of an object.
 *
 * @function Highcharts.merge<T>
 *
 * @param {boolean} extend
 *        Whether to extend the left-side object (a) or return a whole new
 *        object.
 *
 * @param {T|undefined} a
 *        The first object to extend. When only this is given, the function
 *        returns a deep copy.
 *
 * @param {...Array<object|undefined>} [n]
 *        An object to merge into the previous one.
 *
 * @return {T}
 *         The merged object. If the first argument is true, the return is the
 *         same as the second argument.
 *//**
 * Utility function to deep merge two or more objects and return a third object.
 * The merge function can also be used with a single object argument to create a
 * deep copy of an object.
 *
 * @function Highcharts.merge<T>
 *
 * @param {T|undefined} a
 *        The first object to extend. When only this is given, the function
 *        returns a deep copy.
 *
 * @param {...Array<object|undefined>} [n]
 *        An object to merge into the previous one.
 *
 * @return {T}
 *         The merged object. If the first argument is true, the return is the
 *         same as the second argument.
 */
function merge<T extends Object>(
    a: (true|T|undefined),
    ...n: Array<unknown>
) : T {
    let copyDepth = 0,
        obj = {} as T;

    // Descriptive error stack:
    const copyDepthError = new Error('Recursive copy depth > 100'),
        doCopy = (copy: any, original: any): any => {
            // An object is replacing a primitive
            if (typeof copy !== 'object') {
                copy = {};
            }

            if (++copyDepth > 100) {
                throw copyDepthError;
            }

            objectEach(original, (value, key): void => {

                // Prototype pollution (#14883)
                if (key === '__proto__' || key === 'constructor') {
                    return;
                }

                // Copy the contents of objects, but not arrays or DOM nodes
                if (
                    isObject(value, true) &&
                    !isClass(value) &&
                    !isDOMElement(value)
                ) {
                    copy[key] = doCopy(copy[key] || {}, value);

                // Primitives and arrays are copied over directly
                } else {
                    copy[key] = original[key];
                }
            });

            --copyDepth;

            return copy;
        };

    // If first argument is true, copy into the existing object. Used in
    // setOptions.
    if (a === true) {
        obj = n.shift() as T;
    } else {
        n.unshift(a);
    }

    // For each argument, extend the return
    for (let i = 0, iEnd = n.length; i < iEnd; ++i) {
        obj = doCopy(obj, n[i]);
    }

    return obj;
}

/**
 * Creates a session-dependent unique key string for reference purposes.
 *
 * @function Dashboards.uniqueKey
 *
 * @return {string}
 * Unique key string
 */
function uniqueKey(): string {
    return `dashboard-${coreUniqueKey().replace('highcharts-', '')}`;
}

/**
 * Provide error messages for debugging, with links to online explanation. This
 * function can be overridden to provide custom error handling.
 *
 * @sample highcharts/chart/highcharts-error/
 *         Custom error handler
 *
 * @function Dashboards.error
 *
 * @param {number|string} code
 *        The error code. See
 *        [errors.xml](https://github.com/highcharts/highcharts/blob/master/errors/errors.xml)
 *        for available codes. If it is a string, the error message is printed
 *        directly in the console.
 *
 * @param {boolean} [stop=false]
 *        Whether to throw an error or just log a warning in the console.
 *
 * @return {void}
 */
function error(code: number|string, stop?: boolean): void {
    // TODO- replace with proper error handling
    if (code === 16) {
        console.warn( // eslint-disable-line no-console
            'Dashboard error: Dashboards library loaded more than once.' +
            'This may cause undefined behavior.'
        );
        return;
    }
    coreError(code, stop);
}

/* *
 *
 *  Default Export
 *
 * */

const Utilities = {
    error,
    merge,
    uniqueKey
};

export default Utilities;
