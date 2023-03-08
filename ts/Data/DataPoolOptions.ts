/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    StoreType,
    StoreTypeRegistry
} from './Stores/StoreType.js';

/* *
 *
 *  Declarations
 *
 * */

export interface DataPoolOptions {
    stores: Array<DataPoolStoreOptions>;
}

export interface DataPoolStoreOptions {
    name: string;
    storeOptions: StoreType['prototype']['options'];
    storeType: keyof StoreTypeRegistry;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;
