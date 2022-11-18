/* *
 *
 *  (c) 2020-2022 Highsoft AS
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

import type JSON from '../Core/JSON.js';
import type {
    StoreType,
    StoreTypeRegistry
} from './Stores/StoreType.js';

/* *
 *
 *  Declarations
 *
 * */

export interface DataOnDemandOptions extends JSON.Object {
    sources: Array<DataOnDemandSourceOptions>;
}

export interface DataOnDemandSourceOptions extends JSON.Object {
    name: string;
    storeOptions: StoreType['prototype']['options'];
    storeType: keyof StoreTypeRegistry;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataOnDemandOptions;
