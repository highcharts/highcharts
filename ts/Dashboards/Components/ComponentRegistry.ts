/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */


import type { ComponentTypeRegistry } from './ComponentType';

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
     *
     * @param {string} key
     * Registry key of the component class.
     *
     * @param {ComponentType} DataConnectorClass
     * Component class (aka class constructor) to register.
     */
    export function registerComponent<T extends keyof ComponentTypeRegistry>(
        key: T,
        ComponentClass: ComponentTypeRegistry[T]
    ): boolean {
        return (
            !!key &&
            !types[key] &&
            !!(types[key] = ComponentClass)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ComponentRegistry;
