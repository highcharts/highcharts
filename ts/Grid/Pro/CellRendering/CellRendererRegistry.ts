/* *
 *
 *  Cell Renderer Registry
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { CellRendererTypeRegistry } from './CellRendererType';


/* *
 *
 *  Constants
 *
 * */

/**
 * Record of cell renderer classes
 */
export const types = {} as CellRendererTypeRegistry;


/* *
 *
 *  Functions
 *
 * */

/**
 * Method used to register new cell renderer classes.
 *
 * @param key
 * Registry key of the cell renderer class.
 *
 * @param CellRendererClass
 * Cell renderer class (aka class constructor) to register.
 */
export function registerRenderer<T extends keyof CellRendererTypeRegistry>(
    key: T,
    CellRendererClass: CellRendererTypeRegistry[T]
): boolean {
    return (
        !!key &&
        !types[key] &&
        !!(types[key] = CellRendererClass)
    );
}

/* *
 *
 *  Default Export
 *
 * */

export default {
    types,
    registerRenderer
} as const;
