/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { AnyRecord } from '../Shared/Types';

import {
    error as coreError,
    uniqueKey as coreUniqueKey
} from '../Core/Utilities.js'

/* *
 *
 *  Functions
 *
 * */


/**
 * Returns a deep copy of an argument. It differs from `merge` in that it copies
 * also arrays.
 *
 * @param value
 * The value to clone.
 *
 * @param excludedKeys
 * An array of keys to exclude from the clone.
 */
function deepClone(value: any, excludedKeys?: string[]): any {
    if (Array.isArray(value)) {
        return value.map((v): any => deepClone(v, excludedKeys));
    }

    if (value && typeof value === 'object') {
        const clone: Record<string, any> = {};
        const keys = Object.keys(value);

        for (const key of keys) {
            if (excludedKeys && excludedKeys.includes(key)) {
                clone[key] = value[key];
            } else {
                clone[key] = deepClone(value[key], excludedKeys);
            }
        }

        return clone;
    }

    return value;
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


export interface EventCallback<T> {
    (this: T, eventArguments: (AnyRecord|Event)): (boolean|void);
}
export interface EventWrapperObject<T> {
    fn: EventCallback<T>;
    order: number;
}
export interface EventOptions {
    order?: number;
    passive?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

const Utilities = {
    deepClone,
    error
};

export default Utilities;
