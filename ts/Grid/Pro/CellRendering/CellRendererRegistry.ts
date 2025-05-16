/* *
 *
 *  Cell Renderer Registry
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import type Column from '../../Core/Table/Column';


/* *
 *
 *  Namespace
 *
 * */

namespace CellRendererRegistry {

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Record of cell renderer classes
     */
    export const types = {} as CellRendererTypeRegistry;

    /**
     * Map of cell renderer types to their corresponding data types.
     */
    export const dataTypeDefaults: Record<
    Column.DataType,
    keyof typeof types
    > = {
        // TODO: Move it out of the cell renderer registry or make it more
        // generic by adding a registry function.
        string: 'text',
        number: 'text',
        boolean: 'checkbox',
        date: 'text'
    };

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

}

/* *
 *
 *  Default Export
 *
 * */

export default CellRendererRegistry;
