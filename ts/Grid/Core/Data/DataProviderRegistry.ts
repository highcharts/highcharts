/* *
 *
 *  Data Provider Registry
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

import type { DataProviderTypeRegistry } from './DataProviderType';


/* *
 *
 *  Constants
 *
 * */

/**
 * Record of data provider classes
 */
export const types = {} as DataProviderTypeRegistry;


/* *
 *
 *  Functions
 *
 * */

/**
 * Method used to register new data provider classes.
 *
 * @param key
 * Registry key of the data provider class.
 *
 * @param DataProviderClass
 * Data provider class (aka class constructor) to register.
 */
export function registerDataProvider<T extends keyof DataProviderTypeRegistry>(
    key: T,
    DataProviderClass: DataProviderTypeRegistry[T]
): boolean {
    return (
        !!key &&
        !types[key] &&
        !!(types[key] = DataProviderClass)
    );
}


/* *
 *
 * Default Export
 *
 * */

export default {
    registerDataProvider,
    types
} as const;
