/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */


import type { ComponentType, ComponentTypeRegistry } from './ComponentType';

import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Namespace
 *
 * */

namespace ComponentRegistry {

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Regular expression to extract the  name (group 1) from the
     * stringified class type.
     */
    const nameRegExp = /^(?:class|function)\s(\w*?)(?:Component)?\W/;

    /**
     *
     * Record of component classes
     * @todo
     *
     */
    export const types = {} as ComponentTypeRegistry;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Method used to register new component classes.
     */
    export function registerComponent<T extends keyof ComponentTypeRegistry>(
        ComponentClass: ComponentTypeRegistry[T]
    ): boolean {
        const name = getName(ComponentClass) as T;

        if (
            typeof name === 'undefined' ||
            types[name]
        ) {
            return false;
        }

        types[name] = ComponentClass;

        return true;
    }

    /**
     *
     */
    export function getAllComponentNames(): Array<string> {
        return Object.keys(types);
    }

    /**
     *
     */
    export function getAllComponents(): ComponentTypeRegistry {
        return merge(types);
    }

    /**
     * Extracts the name from a given component class.
     *
     * @param {DataStore} component
     * Component class to extract the name from.
     *
     * @return {string}
     * Component name, if the extraction was successful, otherwise an empty
     * string.
     */
    export function getName(
        component: (NewableFunction | ComponentType)
    ): string {
        return (
            component.toString().match(nameRegExp) ||
            ['', '']
        )[1];
    }

    export function getComponent<T extends keyof ComponentTypeRegistry>(
        key:T
    ): (ComponentTypeRegistry[T]|undefined) {
        return types[key];
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ComponentRegistry;
