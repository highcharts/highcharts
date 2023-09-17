/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
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

import U from '../Shared/Utilities.js';
import Globals from './Globals.js';
const {
    addEvent,
    createElement,
    css,
    defined,
    diffObjects,
    error,
    extend,
    fireEvent,
    find,
    getStyle,
    isArray,
    isClass,
    isDOMElement,
    isFunction,
    isNumber,
    isObject,
    isString,
    merge,
    objectEach,
    pick,
    pInt,
    relativeLength,
    removeEvent,
    splat,
    useSerialIds,
    uniqueKey: coreUniqueKey
} = U(Globals);

/* *
 *
 *  Functions
 *
 * */

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

/* *
 *
 *  Default Export
 *
 * */

const Utilities = {
    addEvent,
    createElement,
    css,
    defined,
    diffObjects,
    error,
    extend,
    fireEvent,
    find,
    getStyle,
    isArray,
    isClass,
    isDOMElement,
    isFunction,
    isNumber,
    isObject,
    isString,
    merge,
    objectEach,
    pick,
    pInt,
    relativeLength,
    removeEvent,
    splat,
    useSerialIds,
    uniqueKey
};

export default Utilities;
