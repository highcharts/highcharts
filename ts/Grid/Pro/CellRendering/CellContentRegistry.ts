/* *
 *
 *  Cell Content Registry
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

import type { CellContentTypeRegistry } from './CellContentType';

import TextContent from '../../Core/Table/CellContent/TextContent';

/* *
 *
 *  Namespace
 *
 * */

namespace CellContentRegistry {

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Record of cell content classes
     */
    export const types: CellContentTypeRegistry = {
        text: TextContent
    };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Method used to register new cell content classes.
     *
     * @param {string} key
     * Registry key of the cell content class.
     *
     * @param {ComponentType} CellContentClass
     * Cell content class (aka class constructor) to register.
     */
    export function registerType<T extends keyof CellContentTypeRegistry>(
        key: T,
        CellContentClass: CellContentTypeRegistry[T]
    ): boolean {
        return (
            !!key &&
            !types[key] &&
            !!(types[key] = CellContentClass)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default CellContentRegistry;
