/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type {
    SymbolFunction,
    SymbolTypeRegistry
} from './SymbolTypeRegistry';

/* *
 *
 *  Namespace
 *
 * */

namespace SymbolRegistry {

    /* *
     *
     *  Constants
     *
     * */

    export const symbols: SymbolTypeRegistry = {} as SymbolTypeRegistry;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Registers a factory function for a named symbol.
     *
     * @param {string} name
     * Name of the symbol.
     *
     * @param {Function} fn
     * Factory function of the symbol.
     */
    export function register(name: keyof SymbolTypeRegistry, fn: SymbolFunction): void {
        symbols[name] = fn;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default SymbolRegistry;
